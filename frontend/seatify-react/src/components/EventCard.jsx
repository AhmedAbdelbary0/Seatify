import React from "react";
import "../styles/style.css";

function EventCard({ event, onView, onDelete }) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }); // e.g. "13 Dec 2025, 22:05"

  return (
    <>
      <div className="event-card">
        <h3>{event.title}</h3>

        <p>
          <strong>Date & Time</strong>
          <br />
          {formattedDate}
        </p>

        <div className="card-actions">
          <button className="delete-btn" onClick={onDelete}>
            Delete
          </button>
          <button className="view-btn" onClick={onView}>
            View
          </button>
        </div>
      </div>
    </>
  );
}

export default EventCard;
