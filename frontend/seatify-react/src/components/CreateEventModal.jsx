import React, { useState } from "react";
import "../styles/style.css";

function CreateEventModal({ isOpen, onClose, onContinue }) {
  const [seatValue, setSeatValue] = useState(4);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Event</h2>
        <p>Enter your event details</p>

        <form
          className="create-event-form"
          onSubmit={(e) => {
            e.preventDefault();
            const rawDate = e.target.eventDate.value; // "2025-12-13T22:05"
            const isoDate = rawDate ? new Date(rawDate).toISOString() : null;

            onContinue({
              title: e.target.eventTitle.value,
              date: isoDate,
              seatLimit: seatValue
            });
          }}
        >
          <label htmlFor="eventTitle">Title</label>
          <input
            type="text"
            id="eventTitle"
            name="eventTitle"
            placeholder="Enter event title"
          />

          <label htmlFor="eventDate">Date & Time</label>
          <input type="datetime-local" id="eventDate" name="eventDate" />

          <label htmlFor="seatLimit">Seats Limit per Person</label>
          <div className="slider-container">
            <input
              type="range"
              id="seatLimit"
              name="seatLimit"
              min="1"
              max="10"
              value={seatValue}
              onChange={(e) => setSeatValue(e.target.value)}
            />
            <span id="seatValue">{seatValue}</span>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="continue-btn">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEventModal;
