import React, { useState } from "react";
import "../styles/style.css";

function FindEventModal({ isOpen, onClose, onContinue, error }) {
  const [eventId, setEventId] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Find Event</h2>
        <p>Enter event ID to continue</p>

        {error && <p className="error-text">{error}</p>}

        <form
          className="find-event-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!eventId.trim()) return;
            onContinue(eventId.trim());
          }}
        >
          <label htmlFor="eventID">Event ID</label>
          <input
            type="text"
            id="eventID"
            placeholder="Enter event ID"
            required
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          />

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="continue-btn"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FindEventModal;
