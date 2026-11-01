const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
    },
    genre: {
      type: [String],
      required: true,
      default: [],
    },
    language: {
      type: [String],
      required: true,
      default: ['English'],
    },
    duration: {
      type: Number, // duration in minutes
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0,
    },
    certificate: {
      type: String, // U, UA, A, R, PG-13
      default: 'UA',
    },
    posterUrl: {
      type: String,
      required: true,
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    director: {
      type: String,
      default: '',
    },
    cast: [
      {
        name: String,
        role: String,
        photo: String,
      },
    ],
    status: {
      type: String,
      enum: ['now_showing', 'upcoming'],
      default: 'now_showing',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);

