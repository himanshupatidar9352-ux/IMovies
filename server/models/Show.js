const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true,
    },
    screenNumber: {
      type: Number,
      default: 1,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    startTime: {
      type: String, // e.g. "10:30 AM", "01:45 PM", "06:30 PM", "09:45 PM"
      required: true,
    },
    format: {
      type: String, // "2D", "3D", "IMAX 2D", "IMAX 3D", "4DX"
      default: '2D',
    },
    language: {
      type: String,
      default: 'English',
    },
    pricing: {
      silver: { type: Number, default: 180 },
      gold: { type: Number, default: 250 },
      vip: { type: Number, default: 400 },
    },
    // Row definition: A, B, C (Silver), D, E, F (Gold), G, H (VIP)
    bookedSeats: {
      type: [String], // Array of seat codes e.g. ['A1', 'A2', 'C5']
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Show', showSchema);

