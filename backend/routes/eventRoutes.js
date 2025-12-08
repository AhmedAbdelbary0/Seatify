const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');
const participantController = require('../controllers/eventParticipantController');

const { authenticate } = require('../utils/auth');
// PUBLIC ROUTES

// Get a single event (QR included)
router.get('/:eventId', eventController.getEventById); // TESTED ✅
// PROTECTED ROUTES (NEED LOGIN)

// All routes below require the user to be authenticated
router.use(authenticate);

// Create a new event
router.post('/', eventController.createEvent); // ✅ ENABLED

// Events the current user created
router.get('/me/created/events', eventController.getMyCreatedEvents); // TESTED ✅

// Events the current user joined
router.get('/me/joined/events', participantController.getMyJoinedEvents); // TESTED ✅

// 🔹 Update event (layout / totalSeats etc.)
// router.patch(
//   '/:eventId',
//   eventController.verifyOwnership,
//   eventController.updateEvent
// );

// Delete event (creator only) TESTED ✅
router.delete(
  '/:eventId',
  eventController.verifyOwnership,
  eventController.deleteEvent
);
// PARTICIPATION ROUTES

// Join event and book seats
router.post('/:eventId/join', participantController.joinEvent); // TESTED ✅

// Leave event
router.delete('/:eventId/leave', participantController.leaveEvent); // TESTED ✅

// Get participants (creator only) // TESTED ✅
router.get(
  '/:eventId/participants',
  eventController.verifyOwnership,
  participantController.getParticipants
);

module.exports = router;
