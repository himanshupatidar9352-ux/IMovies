const Booking = require('../models/Booking');
const Show = require('../models/Show');

// Generate unique booking reference
const generateBookingRef = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'IM-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
};

// @desc    Create new booking with atomic seat reservation
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { showId, seats, paymentDetails } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid show ID and seat selection',
      });
    }

    const show = await Show.findById(showId).populate('movie').populate('theater');
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const requestedSeatNumbers = seats.map((s) => s.seatNumber);

    // Concurrency check: verify none of the selected seats are already booked
    const alreadyBooked = show.bookedSeats.filter((seat) =>
      requestedSeatNumbers.includes(seat)
    );

    if (alreadyBooked.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats already booked by another user: ${alreadyBooked.join(', ')}. Please choose different seats.`,
      });
    }

    // Calculate subtotal
    const subtotal = seats.reduce((acc, seat) => acc + (seat.price || 0), 0);
    // 18% GST / convenience fee
    const taxAndFees = Math.round(subtotal * 0.18);
    const totalAmount = subtotal + taxAndFees;

    // Atomically push seats to show.bookedSeats
    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: showId,
        bookedSeats: { $nin: requestedSeatNumbers },
      },
      {
        $push: { bookedSeats: { $each: requestedSeatNumbers } },
      },
      { new: true }
    );

    if (!updatedShow) {
      return res.status(409).json({
        success: false,
        message: 'One or more of the selected seats were just taken. Please try again.',
      });
    }

    // Create booking
    const booking = await Booking.create({
      bookingReference: generateBookingRef(),
      user: req.user._id,
      show: show._id,
      movie: show.movie._id,
      theater: show.theater._id,
      seats,
      subtotal,
      taxAndFees,
      totalAmount,
      paymentStatus: 'completed',
      bookingStatus: 'confirmed',
      paymentDetails: {
        method: paymentDetails?.method || 'Card',
        transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      },
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie')
      .populate('theater')
      .populate('show')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie')
      .populate('theater')
      .populate('show')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking by ID or reference
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie')
      .populate('theater')
      .populate('show')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership or admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this booking' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking and release seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    // Release seats from show
    const seatNumbers = booking.seats.map((s) => s.seatNumber);
    await Show.findByIdAndUpdate(booking.show, {
      $pull: { bookedSeats: { $in: seatNumbers } },
    });

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled and seats successfully released',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('movie', 'title posterUrl')
      .populate('theater', 'name city')
      .populate('user', 'name email')
      .populate('show', 'startTime date')
      .sort({ createdAt: -1 });

    const totalRevenue = bookings
      .filter((b) => b.bookingStatus === 'confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({
      success: true,
      count: bookings.length,
      totalRevenue,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

