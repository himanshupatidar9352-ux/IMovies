const Show = require('../models/Show');
const Theater = require('../models/Theater');

// @desc    Get shows by Movie ID and Date
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res) => {
  try {
    const { movieId, date, theaterId } = req.query;
    let filter = {};

    if (movieId) filter.movie = movieId;
    if (theaterId) filter.theater = theaterId;
    if (date) filter.date = date;

    const shows = await Show.find(filter)
      .populate('movie', 'title duration rating posterUrl certificate language')
      .populate('theater', 'name city address')
      .sort({ startTime: 1 });

    res.json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single show details with real-time seat status
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theater');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Generate full seat layout matrix:
    // Rows A, B (Silver)
    // Rows C, D, E (Gold)
    // Rows F, G (VIP)
    const rows = [
      { row: 'A', tier: 'Silver', price: show.pricing.silver, cols: 10 },
      { row: 'B', tier: 'Silver', price: show.pricing.silver, cols: 10 },
      { row: 'C', tier: 'Gold', price: show.pricing.gold, cols: 10 },
      { row: 'D', tier: 'Gold', price: show.pricing.gold, cols: 10 },
      { row: 'E', tier: 'Gold', price: show.pricing.gold, cols: 10 },
      { row: 'F', tier: 'VIP', price: show.pricing.vip, cols: 8 },
      { row: 'G', tier: 'VIP', price: show.pricing.vip, cols: 8 },
    ];

    const bookedSet = new Set(show.bookedSeats || []);

    const seatMatrix = rows.map((r) => {
      const seats = [];
      for (let i = 1; i <= r.cols; i++) {
        const seatId = `${r.row}${i}`;
        seats.push({
          seatId,
          number: i,
          row: r.row,
          tier: r.tier,
          price: r.price,
          isBooked: bookedSet.has(seatId),
        });
      }
      return {
        row: r.row,
        tier: r.tier,
        price: r.price,
        seats,
      };
    });

    res.json({
      success: true,
      data: {
        show,
        seatMatrix,
        totalBooked: bookedSet.size,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new show schedule
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json({ success: true, data: show });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete show schedule
// @route   DELETE /api/shows/:id
// @access  Private/Admin
exports.deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    res.json({ success: true, message: 'Show schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

