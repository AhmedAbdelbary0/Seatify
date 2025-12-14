import React, { useState } from "react";
import EventCard from "./EventCard";
import EventViewModal from "./EventViewModal";
import AttendeesReport from "./AttendeesReport";
import FilterIcon from "../assets/Filter.png";
import api from "../api/axios";

function EventList({ events, setEvents }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState(null);

  const handleView = async (event) => {
    try {
      setViewLoading(true);
      setViewError(null);
      setShowViewModal(true);

      const res = await api.get(`/api/v1/events/${event._id}`);
      const fullEvent = res.data.data.event;
      console.log("Full event in handleView:", fullEvent);

      setSelectedEvent(fullEvent);
    } catch (err) {
      console.error("Failed to load event details:", err);
      setViewError("Failed to load event details.");
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/v1/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Failed to delete event. Please try again.");
    }
  };

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
            <EventCard
              key={event._id}
              event={event}
              onView={() => handleView(event)}
              onDelete={() => handleDelete(event._id)}
            />
          ))
        ) : (
          <p>No events created yet.</p>
        )}
      </div>

      <EventViewModal
        isOpen={showViewModal}
        event={selectedEvent}
        loading={viewLoading}        
        error={viewError}            
        onClose={() => {
          setShowViewModal(false);
          setSelectedEvent(null);
          setViewError(null);
        }}
        onOpenAttendeesReport={() => {
          setShowViewModal(false);
          setShowReportModal(true);
        }}
      />

      {/* ATTENDEES REPORT MODAL */}
      <AttendeesReport
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        eventName={selectedEvent?.title}
      />
    </section>
  );
}

export default EventList;