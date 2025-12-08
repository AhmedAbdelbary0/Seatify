const mongoose = require('mongoose');

const eventParticipantSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Participant must belong to an event.'],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Participant must have a user ID.'],
    },
    seatNumbers: {
      type: [String], // e.g. ["A1", "A2"]
      default: [],
    },
    seatsBooked: {
      type: Number,
      default: function () {
        return this.role === 'creator' ? 0 : 1;
      },
      validate: {
        validator: function (value) {
          // Creator must always have 0 seats
          if (this.role === 'creator') {
            return value === 0;
          }

          // Participants must book between 1 and 10 seats
          return value >= 1 && value <= 10;
        },
        message: function () {
          if (this.role === 'creator') {
            return 'Creator seatsBooked must be 0.';
          }
          return 'Participants must book between 1 and 10 seats.';
        },
      },
    },

    role: {
      type: String,
      enum: ['creator', 'participant'],
      default: 'participant',
    },

    joinedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { timestamps: true }
);

// INDEXES

// Prevent duplicate participation in the same event
eventParticipantSchema.index({ eventId: 1, userId: 1 }, { unique: true });

// Optimize queries for event lookups
eventParticipantSchema.index({ userId: 1 });
eventParticipantSchema.index({ eventId: 1 });

// VIRTUALS

// Check if the participant is the event creator
eventParticipantSchema.virtual('isCreator').get(function () {
  return this.role === 'creator';
});

// INSTANCE METHODS

// STATIC METHODS

// Find participants of a specific event
eventParticipantSchema.statics.findByEvent = function (eventId) {
  return this.find({ eventId })
    .populate('userId', 'name email role')
    .sort({ joinedAt: 1 });
};

// Find events joined by a specific user
eventParticipantSchema.statics.findByUser = function (userId) {
  return this.find({ userId })
    .populate('eventId', 'title date status maxSeatsPerPerson')
    .sort({ joinedAt: -1 });
};

// MIDDLEWARES

// Auto populate user and event on find queries
eventParticipantSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: 'firstName lastName email role',
  }).populate({
    path: 'eventId',
    select: 'title date status maxSeatsPerPerson',
  });
  next();
});

const EventParticipant = mongoose.model(
  'EventParticipant',
  eventParticipantSchema
);
module.exports = EventParticipant;
