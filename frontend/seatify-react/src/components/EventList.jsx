import React from "react";
import EventCard from "./EventCard";
import FilterIcon from "../styles/Filter.png";

function EventList() {
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
        {[1, 2, 3, 4].map((n) => (
          <EventCard key={n} />
        ))}
      </div>
    </section>
  );
}

export default EventList;
