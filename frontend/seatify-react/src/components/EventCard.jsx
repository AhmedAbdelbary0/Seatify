import React from "react";
import "../styles/style.css";

function EventCard({ event, onView, onDelete }) {
  return (
    <>
      <div className="event-card">
        <h3>{event.title}</h3>
        <p>{event.description || "No description provided"}</p>

        <p>
          <strong>Date & Time</strong>
          <br />
          {new Date(event.date).toLocaleString()}
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
