import React, { useState } from "react";
import "../styles/style.css";
import EventViewModal from "./EventViewModal";

function EventCard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="event-card">
        <h3>Title</h3>
        <p>Group Gather</p>
        <p>
          <strong>Date & Time</strong>
          <br />
          01/01/2026 3 pm
        </p>
        <div className="card-actions">
          <button className="delete-btn">Delete</button>
          <button className="view-btn" onClick={() => setShowModal(true)}>
            View
          </button>
        </div>
      </div>

      <EventViewModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

export default EventCard;
