import React from "react";
import EventCard from "./EventCard";
import FilterIcon from "../assets/Filter.png";

function EventList({ events }) {
  return (
    <section className="events">
      <div className="events-header">
        <h2>Your Events</h2>
        <div className="filters">
          <img src={FilterIcon} alt="Filter Icon" className="filter-icon" />
          <span className="filter-label">Filters</span>
          <button className="filter-btn active">Active</button>
          <button className="filter-btn">Archived</button>
        </div>
      </div>

      <div className="event-cards">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-item">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Seats Available: {event.availableSeats}</p>
            </div>
          ))
        ) : (
          <p>No events created yet.</p>
        )}
      </div>
    </section>
  );
}

export default EventList;
