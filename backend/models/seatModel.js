const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: [true, 'Seat must have a seat number, e.g., A1'],
  },
  row: {
    type: Number,
  },
  column: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['available', 'booked'],
    default: 'available',
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});

module.exports = seatSchema;
