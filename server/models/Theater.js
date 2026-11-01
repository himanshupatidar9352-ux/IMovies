const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    screens: [
      {
        screenNumber: Number,
        name: String,
        screenType: {
          type: String,
          default: 'IMAX 3D',
        },
        totalSeats: {
          type: Number,
          default: 60,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Theater', theaterSchema);

