require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const mockDb = require('./config/mockDb');

// Real Route imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theaterRoutes = require('./routes/theaterRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Attempt Database connection
let isDbConnected = false;
connectDB().then((connected) => {
  isDbConnected = connected;
  if (!connected) {
    console.log('⚡ Serving in high-availability In-Memory mode for immediate preview!');
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// In-Memory Fallback Middleware for when MongoDB is offline
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next(); // Use standard MongoDB routes
  }

  // --- MOCK AUTHENTICATION ROUTING ---
  if (req.path === '/api/auth/login' && req.method === 'POST') {
    const { email, password } = req.body;
    const user = mockDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone } });
  }

  if (req.path === '/api/auth/register' && req.method === 'POST') {
    const { name, email, password, phone } = req.body;
    if (mockDb.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const newUser = {
      _id: `user_${Date.now()}`,
      name,
      email,
      password,
      phone: phone || '',
      role: 'user',
    };
    mockDb.users.push(newUser);
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    return res.status(201).json({ success: true, token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, phone: newUser.phone } });
  }

  if (req.path === '/api/auth/me' && req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: 'No token' });
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'secret');
      const user = mockDb.users.find((u) => u._id === decoded.id) || mockDb.users[1];
      return res.json({ success: true, user });
    } catch (e) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  }

  // --- MOCK MOVIES ROUTING ---
  if (req.path === '/api/movies' && req.method === 'GET') {
    const { status, genre, search } = req.query;
    let list = [...mockDb.movies];
    if (status) list = list.filter((m) => m.status === status);
    if (genre && genre !== 'All') list = list.filter((m) => m.genre.some((g) => g.toLowerCase() === genre.toLowerCase()));
    if (search) list = list.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));
    return res.json({ success: true, count: list.length, data: list });
  }

  if (req.path.startsWith('/api/movies/') && req.method === 'GET') {
    const id = req.path.split('/')[3];
    const movie = mockDb.movies.find((m) => m._id === id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    return res.json({ success: true, data: movie });
  }

  if (req.path === '/api/movies' && req.method === 'POST') {
    const newMovie = { _id: `movie_${Date.now()}`, ...req.body };
    mockDb.movies.unshift(newMovie);
    return res.status(201).json({ success: true, data: newMovie });
  }

  // --- MOCK THEATERS ROUTING ---
  if (req.path === '/api/theaters' && req.method === 'GET') {
    return res.json({ success: true, count: mockDb.theaters.length, data: mockDb.theaters });
  }

  // --- MOCK SHOWS ROUTING ---
  if (req.path === '/api/shows' && req.method === 'GET') {
    const { movieId, date } = req.query;
    let list = [...mockDb.shows];
    if (movieId) list = list.filter((s) => s.movie._id === movieId || s.movie === movieId);
    if (date) list = list.filter((s) => s.date === date);
    return res.json({ success: true, count: list.length, data: list });
  }

  if (req.path.startsWith('/api/shows/') && req.method === 'GET') {
    const id = req.path.split('/')[3];
    const show = mockDb.shows.find((s) => s._id === id);
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });

    const rows = [
      { row: 'A', tier: 'Silver', price: show.pricing?.silver || 180, cols: 10 },
      { row: 'B', tier: 'Silver', price: show.pricing?.silver || 180, cols: 10 },
      { row: 'C', tier: 'Gold', price: show.pricing?.gold || 260, cols: 10 },
      { row: 'D', tier: 'Gold', price: show.pricing?.gold || 260, cols: 10 },
      { row: 'E', tier: 'Gold', price: show.pricing?.gold || 260, cols: 10 },
      { row: 'F', tier: 'VIP', price: show.pricing?.vip || 420, cols: 8 },
      { row: 'G', tier: 'VIP', price: show.pricing?.vip || 420, cols: 8 },
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
      return { row: r.row, tier: r.tier, price: r.price, seats };
    });

    return res.json({ success: true, data: { show, seatMatrix, totalBooked: bookedSet.size } });
  }

  if (req.path === '/api/shows' && req.method === 'POST') {
    const movie = mockDb.movies.find((m) => m._id === req.body.movie);
    const theater = mockDb.theaters.find((t) => t._id === req.body.theater);
    const newShow = {
      _id: `show_${Date.now()}`,
      movie: movie || mockDb.movies[0],
      theater: theater || mockDb.theaters[0],
      screenNumber: req.body.screenNumber || 1,
      date: req.body.date,
      startTime: req.body.startTime,
      format: req.body.format || '2D',
      pricing: req.body.pricing || { silver: 180, gold: 260, vip: 420 },
      bookedSeats: [],
    };
    mockDb.shows.unshift(newShow);
    return res.status(201).json({ success: true, data: newShow });
  }

  // --- MOCK BOOKINGS ROUTING ---
  if (req.path === '/api/bookings' && req.method === 'POST') {
    const { showId, seats, paymentDetails } = req.body;
    const show = mockDb.shows.find((s) => s._id === showId);
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });

    const requestedSeats = seats.map((s) => s.seatNumber);
    const conflict = show.bookedSeats.filter((s) => requestedSeats.includes(s));
    if (conflict.length > 0) {
      return res.status(409).json({ success: false, message: `Seats ${conflict.join(', ')} already taken.` });
    }

    // Book seats
    show.bookedSeats.push(...requestedSeats);

    const subtotal = seats.reduce((sum, s) => sum + s.price, 0);
    const taxAndFees = Math.round(subtotal * 0.18);
    const totalAmount = subtotal + taxAndFees;

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let ref = 'IM-';
    for (let i = 0; i < 6; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));

    const newBooking = {
      _id: `booking_${Date.now()}`,
      bookingReference: ref,
      user: mockDb.users[1],
      show,
      movie: show.movie,
      theater: show.theater,
      seats,
      subtotal,
      taxAndFees,
      totalAmount,
      paymentStatus: 'completed',
      bookingStatus: 'confirmed',
      paymentDetails: {
        method: paymentDetails?.method || 'CARD',
        transactionId: `TXN_${Date.now()}`,
      },
      createdAt: new Date().toISOString(),
    };
    mockDb.bookings.unshift(newBooking);
    return res.status(201).json({ success: true, data: newBooking });
  }

  if (req.path === '/api/bookings/my-bookings' && req.method === 'GET') {
    return res.json({ success: true, count: mockDb.bookings.length, data: mockDb.bookings });
  }

  if (req.path === '/api/bookings/all' && req.method === 'GET') {
    const totalRevenue = mockDb.bookings
      .filter((b) => b.bookingStatus === 'confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    return res.json({ success: true, count: mockDb.bookings.length, totalRevenue, data: mockDb.bookings });
  }

  if (req.path.startsWith('/api/bookings/') && req.path.endsWith('/cancel') && req.method === 'PUT') {
    const id = req.path.split('/')[3];
    const booking = mockDb.bookings.find((b) => b._id === id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    // Free seats in show
    const show = mockDb.shows.find((s) => s._id === (booking.show._id || booking.show));
    if (show) {
      const seatNums = booking.seats.map((s) => s.seatNumber);
      show.bookedSeats = show.bookedSeats.filter((s) => !seatNums.includes(s));
    }
    return res.json({ success: true, message: 'Booking cancelled and seats released', data: booking });
  }

  if (req.path.startsWith('/api/bookings/') && req.method === 'GET') {
    const id = req.path.split('/')[3];
    const booking = mockDb.bookings.find((b) => b._id === id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    return res.json({ success: true, data: booking });
  }

  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'IMovies Cinema Platform API is running',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'In-Memory Mode Active',
    timestamp: new Date().toISOString(),
  });
});

// Regular API Routes (When MongoDB is connected)
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

// Serve Frontend in Production if built
const path = require('path');
const fs = require('fs');
const clientDistPath = path.join(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Route handler for API
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🍿 IMovies Backend Server running on port ${PORT}`);
});
