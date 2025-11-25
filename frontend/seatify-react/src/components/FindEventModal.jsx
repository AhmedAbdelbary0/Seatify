import React from "react";
import "../styles/style.css";

function FindEventModal({ isOpen, onClose, onContinue }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Find Event</h2>
        <p>Enter event ID to continue</p>

        <form className="find-event-form">
          <label htmlFor="eventID">Event ID</label>
          <input type="text" id="eventID" placeholder="Enter event ID" required />

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
            onClick={(e) => {
                e.preventDefault();
                onContinue(); 
            }}
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
