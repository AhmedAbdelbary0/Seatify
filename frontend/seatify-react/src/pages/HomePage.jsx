import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import WhySeatify from "../components/WhySeatify";
import FindEventModal from "../components/FindEventModal";
import ChooseSeatModal from "../components/ChooseSeatModal";
import ConfirmBookingModal from "../components/ConfirmBookingModal";
import FaqSection from "../components/FaqSection";
import api from "../api/axios";

import "../styles/style.css";

function HomePage() {
  const [showFindEventModal, setShowFindEventModal] = useState(false);
  const [showChooseSeatModal, setShowChooseSeatModal] = useState(false);
  const [showConfirmBookingModal, setShowConfirmBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [findEventError, setFindEventError] = useState(null);

  const handleChooseContinue = (details) => {
    // details comes from ChooseSeatModal: { seats, eventId, eventTitle, eventDate, event }
    setBookingDetails((prev) => ({
      ...prev,
      ...details,
    }));
    setShowChooseSeatModal(false);
    setShowConfirmBookingModal(true);
  };

  const handleFindEventContinue = async (eventId) => {
    try {
      setFindEventError(null);
      const res = await api.get(`/api/v1/events/${eventId}`);
      const foundEvent = res.data.data.event;

      setBookingDetails({
        eventId: foundEvent._id,
        eventTitle: foundEvent.title,
        eventDate: foundEvent.date,
        event: foundEvent, // important: full event object for ConfirmBookingModal
        seats: [],         // initialize seats so shape is consistent
      });

      setShowFindEventModal(false);
      setShowChooseSeatModal(true);
    } catch (err) {
      console.error("Failed to find event:", err);
      setFindEventError(
        err?.response?.status === 404
          ? "Event not found. Please check the ID."
          : "Failed to load event. Please try again."
      );
    }
  };

  return (
    <div className="home-page">
      {/* You may want Navbar here too, but keeping your existing structure */}
      <HeroSection
        title="Manage Your Seats"
        highlight=" Smartly!"
        subtitle="Build layouts, share QR code, and manage bookings. Seatify makes seats booking faster and smarter."
        buttonText="See It in Action"
        tagText="Totally Free Experience"
        onButtonClick={() => {
          setFindEventError(null);
          setShowFindEventModal(true);
        }}
      />

      <WhySeatify />
      <FaqSection />
      <Footer />

      <FindEventModal
        isOpen={showFindEventModal}
        onClose={() => setShowFindEventModal(false)}
        onContinue={handleFindEventContinue}
        error={findEventError}
      />

      <ChooseSeatModal
        isOpen={showChooseSeatModal}
        onClose={() => setShowChooseSeatModal(false)}
        onContinue={handleChooseContinue}
        event={bookingDetails?.event} // pass full event down
      />

      <ConfirmBookingModal
        isOpen={showConfirmBookingModal}
        onClose={() => {
          setShowConfirmBookingModal(false);
          // optionally clear after closing
          // setBookingDetails(null);
        }}
        // 🔹 pass the exact props ConfirmBookingModal expects
        seats={bookingDetails?.seats}
        event={bookingDetails?.event}
        onConfirm={({ user, event, seats }) => {
          // TODO: call backend to create booking
          // e.g. api.post(`/api/v1/events/${event._id}/bookings`, { seats })
          setShowConfirmBookingModal(false);
          setBookingDetails(null);
        }}
      />
    </div>
  );
}

export default HomePage;
