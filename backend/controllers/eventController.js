const Event = require('../models/eventModel');
const EventParticipant = require('../models/eventParticipantModel');
const QRCode = require('qrcode');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

// GENERATE QR CODE

// Each QR will contain a join URL like:
// https://seatify.com/join/<eventId>

const generateEventQRCode = async (eventId) => {
  const joinUrl = `${process.env.CLIENT_URL}/join/${eventId}`;

  const qrPng = await QRCode.toDataURL(joinUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    margin: 2,
    width: 400,
  });

  return {
    joinUrl,
    qrCode: qrPng,
  };
};

//  CREATE EVENT

exports.createEvent = asyncHandler(async (req, res, next) => {
  const { title, description, date, maxSeatsPerPerson, totalSeats, layout } =
    req.body;

  if (!title || !date || !maxSeatsPerPerson || !totalSeats) {
    return next(new AppError('Missing required fields', 400));
  }

  const event = await Event.create({
    title,
    description,
    date,
    creatorId: req.user._id,
    maxSeatsPerPerson,
    totalSeats,
    availableSeats: totalSeats,
    layout,
  });

  // Auto insert the creator into EventParticipants table
  await EventParticipant.create({
    eventId: event._id,
    userId: req.user._id,
    role: 'creator',
    seatsBooked: 0,
  });

  // Generate QR Code
  const qr = await generateEventQRCode(event._id);

  res.status(201).json({
    status: 'success',
    data: {
      event,
      qrCode: qr.qrCode,
      joinUrl: qr.joinUrl,
    },
  });
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const { layout, totalSeats } = req.body;

  if (!layout || !Array.isArray(layout) || !totalSeats) {
    return next(new AppError('Missing layout or totalSeats', 400));
  }

  const event = await Event.findByIdAndUpdate(
    req.params.eventId,
    {
      layout,
      totalSeats,
      availableSeats: totalSeats,
    },
    { new: true }
  );

  if (!event) return next(new AppError('Event not found', 404));

  res.status(200).json({
    status: 'success',
    data: { event },
  });
});

// GET EVENT BY ID

exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) return next(new AppError('Event not found', 404));

  // Generate QR ...
  const qr = await generateEventQRCode(event._id);

  const bookedSeats =
    Array.isArray(event.layout)
      ? event.layout
          .filter((s) => s.status === 'booked')
          .map((s) => s.seatNumber)
      : [];

  res.status(200).json({
    status: 'success',
    data: {
      event,
      qrCode: qr.qrCode,
      joinUrl: qr.joinUrl,
      bookedSeats,
    },
  });
});

// GET EVENTS CREATED BY CURRENT USER

exports.getMyCreatedEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ creatorId: req.user._id }).select(
    'title description date availableSeats' 
  );

  res.status(200).json({
    status: 'success',
    results: events.length,
    data: { events },
  });
});

// DELETE EVENT

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return next(new AppError('Event not found', 404));

  await EventParticipant.deleteMany({ eventId: event._id });
  await event.deleteOne();

  res.status(204).json({ status: 'success', data: null });
});

// VERIFY EVENT OWNERSHIP

exports.verifyOwnership = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) return next(new AppError('Event not found', 404));

  if (event.creatorId._id.toString() !== req.user._id.toString()) {
    return next(
      new AppError(
        `You do not have permission to modify this event. creator: ${event.creatorId._id.toString()} | Current User: ${req.user._id.toString()}`,
        403
      )
    );
  }

  req.event = event; // pass event through
  next();
});

exports.getJoinInfo = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) return next(new AppError('Event not found', 404));

  const bookedSeats = Array.isArray(event.layout)
    ? event.layout
        .filter((s) => s.status === 'booked')
        .map((s) => s.seatNumber)
    : [];

  const joinUrl = `${process.env.CLIENT_URL}/join/${event._id}`;

  res.status(200).json({
    status: 'success',
    data: {
      event,
      joinUrl,
      bookedSeats,
    },
  });
});

// LEAVE EVENT

exports.leaveEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  const event = await Event.findById(eventId);
  if (!event) return next(new AppError('Event not found', 404));

  if (event.creatorId.toString() === userId.toString()) {
    // this exact message is what the frontend looks for
    return next(
      new AppError('The event creator cannot leave their event.', 400)
    );
  }

  // ...existing leave logic (remove participant, update seats, etc.)...

  res.status(204).json({ status: 'success', data: null });
});
