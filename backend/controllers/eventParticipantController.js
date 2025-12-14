const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const EventParticipant = require('../models/eventParticipantModel');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.joinEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const { seats } = req.body;

  if (!Array.isArray(seats) || seats.length === 0) {
    return next(
      new AppError('You must provide an array of seat numbers.', 400)
    );
  }

  // Start MongoDB Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1) Load event inside the transaction session
    const event = await Event.findById(eventId).session(session);

    if (!event) throw new AppError('Event not found.', 404);

    if (seats.length > event.maxSeatsPerPerson) {
      throw new AppError(
        `You cannot book more than ${event.maxSeatsPerPerson} seats.`,
        400
      );
    }

    if (seats.length > event.availableSeats) {
      throw new AppError('Not enough seats available.', 400);
    }

    // 2) Ensure seats exist and are available
    const updatedLayout = [...event.layout];

    const seatsToBook = [];

    for (const seatNumber of seats) {
      const seat = updatedLayout.find((s) => s.seatNumber === seatNumber);

      if (!seat) {
        throw new AppError(`Seat ${seatNumber} does not exist.`, 400);
      }

      if (seat.status === 'booked') {
        throw new AppError(`Seat ${seatNumber} is already booked.`, 400);
      }

      seat.status = 'booked';
      seat.bookedBy = req.user._id;
      seatsToBook.push(seat);
    }

    // 3) Decrease available seats
    event.availableSeats -= seats.length;
    event.layout = updatedLayout;

    await event.save({ session });

    // 4) Create or update participant record
    let participant = await EventParticipant.findOne({
      eventId,
      userId: req.user._id,
    }).session(session);

    if (!participant) {
      participant = await EventParticipant.create(
        [
          {
            eventId,
            userId: req.user._id,
            role: 'participant',
            seatsBooked: seats.length,
            seatNumbers: seats,
          },
        ],
        { session }
      );
    } else {
      participant.seatsBooked += seats.length;
      participant.seatNumbers.push(...seats);
      await participant.save({ session });
    }

    // 5) Commit transaction
    await session.commitTransaction();
    session.endSession();

    const populatedParticipant = await EventParticipant.findOne({
      eventId,
      userId: req.user._id,
    }).populate({
      path: 'eventId',
      select: 'title date',
    });

    res.status(200).json({
      status: 'success',
      message: 'Seats booked successfully!',
      data: {
        participant: populatedParticipant,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
});

exports.leaveEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  // 1) Fetch participant
  const participant = await EventParticipant.findOne({
    eventId,
    userId: req.user._id,
  });

  if (!participant) {
    return next(new AppError('You are not a participant of this event.', 400));
  }

  // Creator cannot leave their own event
  if (participant.role === 'creator') {
    return next(
      new AppError('The event creator cannot leave their event.', 400)
    );
  }

  // 2) Start a MongoDB session for a safe transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = await Event.findById(eventId).session(session);
    if (!event) throw new AppError('Event not found.', 404);

    // 3) Reset booked seats in layout
    let freedSeats = 0;

    const updatedLayout = event.layout.map((seat) => {
      if (
        seat.bookedBy &&
        seat.bookedBy.toString() === req.user._id.toString()
      ) {
        seat.status = 'available';
        seat.bookedBy = null;
        freedSeats++;
      }
      return seat;
    });

    if (freedSeats === 0) {
      throw new AppError('No seats found to free for this user.', 400);
    }

    // 4) Update event seat counts
    event.availableSeats += freedSeats;
    if (event.availableSeats > event.totalSeats) {
      event.availableSeats = event.totalSeats;
    }

    event.layout = updatedLayout;

    await event.save({ session });

    // 5) Remove participant record
    await participant.deleteOne({ session });

    // 6) Commit
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 'success',
      message: `You have left the event. Freed ${freedSeats} seats.`,
      data: {
        remainingSeats: event.availableSeats,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

// GET PARTICIPANTS OF AN EVENT (CREATOR ONLY)

exports.getParticipants = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  const participants = await EventParticipant.findByEvent(eventId);

  res.status(200).json({
    status: 'success',
    results: participants.length,
    data: { participants },
  });
});

// GET EVENTS THE USER JOINED

exports.getMyJoinedEvents = asyncHandler(async (req, res) => {
  const joined = await EventParticipant.findByUser(req.user._id).populate({
    path: 'eventId',
    select: 'title date',
  });

  res.status(200).json({
    status: 'success',
    results: joined.length,
    data: { joined },
  });
});
