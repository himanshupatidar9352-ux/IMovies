const express = require('express');
const router = express.Router();
const {
  getTheaters,
  getTheaterById,
  createTheater,
} = require('../controllers/theaterController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getTheaters)
  .post(protect, authorize('admin'), createTheater);

router.route('/:id')
  .get(getTheaterById);

module.exports = router;

