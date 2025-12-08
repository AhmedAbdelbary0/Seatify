import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import EventList from "../components/EventList";
import CreateEventModal from "../components/CreateEventModal";
import SeatsLayoutModal from "../components/SeatsLayoutModal";
import QRCodeModal from "../components/QRCodeModal";

import "../styles/style.css";

function CreatePage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSeatsModal, setShowSeatsModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [createdEvents, setCreatedEvents] = useState([]);

  useEffect(() => {
    const fetchCreatedEvents = async () => {
      try {
        const response = await api.get("/api/v1/events/me/created/events");
        setCreatedEvents(response.data.data.events);
      } catch (err) {
        console.error("Failed to fetch created events", err);
      }
    };

    fetchCreatedEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    try {
      await api.delete(`/api/v1/events/${eventId}`);
  
      setCreatedEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete event. Try again.");
    }
  };

  return (
    <div className="create-page">
      <HeroSection
        title="Create an"
        highlight="Event"
        subtitle="Create an event, add details, and roll out your seats for booking. It’s that simple."
        buttonText="Create Now"
        tagText="Takes Only One Minute"
        onButtonClick={() => setShowCreateModal(true)}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onContinue={async (eventData) => {
          try {
            setShowCreateModal(false);
        
            const response = await api.post("/api/v1/events", {
              title: eventData.title,
              date: eventData.date,
              maxSeatsPerPerson: eventData.seatLimit,   // FIXED NAME
              totalSeats: 100,                          // TEMP — real value comes after layout
              layout: []                                // TEMP — will fill after seat layout modal
            });
        
            const createdEvent = response.data.data.event;
            const newEventId = createdEvent._id;

            setCreatedEvents((prev) => [...prev, createdEvent]);
            
            setEventId(newEventId);
            setShowSeatsModal(true);
        
          } catch (err) {
            console.error("Failed to create event:", err);
            alert("Failed to create event. Please try again.");
          }
        }}
      />

      {/* Seats Layout Modal */}
      <SeatsLayoutModal
        isOpen={showSeatsModal}
        onClose={() => setShowSeatsModal(false)}
        onSave={() => {
          setShowSeatsModal(false);
          setShowQRModal(true); 
        }}
      />

      {/*  QR CODE MODAL */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        eventId={eventId}
      />

      <EventList 
        events={createdEvents} 
        setEvents={setCreatedEvents} 
      />
      <Footer />
    </div>
  );
}

export default CreatePage;
