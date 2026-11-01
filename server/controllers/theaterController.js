const Theater = require('../models/Theater');

// @desc    Get all theaters
// @route   GET /api/theaters
// @access  Public
exports.getTheaters = async (req, res) => {
  try {
    const { city } = req.query;
    let query = {};
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    const theaters = await Theater.find(query);
    res.json({ success: true, count: theaters.length, data: theaters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get theater by ID
// @route   GET /api/theaters/:id
// @access  Public
exports.getTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (!theater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }
    res.json({ success: true, data: theater });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create theater (Admin)
// @route   POST /api/theaters
// @access  Private/Admin
exports.createTheater = async (req, res) => {
  try {
    const theater = await Theater.create(req.body);
    res.status(201).json({ success: true, data: theater });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

