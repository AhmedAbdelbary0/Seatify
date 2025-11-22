import React from "react";

function EventCard() {
  return (
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
        <button className="view-btn">View</button>
      </div>
    </div>
  );
}

export default EventCard;
