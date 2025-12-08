const mongoose = require('mongoose');
const seatSchema = require('./seatModel');

const eventSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event must have a creator (user ID).'],
    },

    title: {
      type: String,
      required: [true, 'Event title is required.'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters.'],
    },

    date: {
      type: Date,
      required: [true, 'Event date is required.'],
      validate: {
        validator: (val) => val > Date.now(),
        message: 'Event date must be in the future.',
      },
    },

    maxSeatsPerPerson: {
      type: Number,
      required: [true, 'You must specify a seat limit per person'],
      min: [1, 'Seat-per-person limit must be at least 1'],
      max: [10, 'Seat-per-person limit cannot exceed 10'],
      validate: {
        validator: function (val) {
          return val <= this.totalSeats;
        },
        message: 'Seat-per-person limit cannot exceed total seats',
      },
    },

    totalSeats: {
      type: Number,
      required: [true, 'Total number of seats is required.'],
      min: [1, 'There must be at least one seat.'],
    },

    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Available seats cannot be negative.'],
    },

    layout: {
      type: [seatSchema],
      default: [],
      validate: [
        {
          validator: function (v) {
            return Array.isArray(v);
          },
          message: 'Layout must be an array of seats.',
        },
      ],
    },

    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { timestamps: true }
);

// INDEXES
eventSchema.index({ date: 1 });
eventSchema.index({ creatorId: 1 });

// VIRTUALS

// Compute booked seats dynamically
eventSchema.virtual('bookedSeats').get(function () {
  return this.totalSeats - this.availableSeats;
});

// STATIC METHODS

// Find all events created by a specific user
eventSchema.statics.findByCreator = function (userId) {
  return this.find({ creatorId: userId }).sort({ createdAt: -1 });
};

// MIDDLEWARES

// Before saving, ensure availableSeats ≤ totalSeats
eventSchema.pre('save', function (next) {
  if (this.availableSeats > this.totalSeats) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

// Before saving, automatically cancel past events
eventSchema.pre('save', function (next) {
  if (this.date < new Date() && this.status === 'upcoming') {
    this.status = 'completed';
  }
  next();
});

// Populate creator info automatically when finding
eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'creatorId',
    select: 'firstName lastName email role',
  });
  next();
});

// MODEL EXPORT

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
