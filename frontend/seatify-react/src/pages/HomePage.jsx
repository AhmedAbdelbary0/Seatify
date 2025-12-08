import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import WhySeatify from "../components/WhySeatify";
import FindEventModal from "../components/FindEventModal";
import ChooseSeatModal from "../components/ChooseSeatModal";
import ConfirmBookingModal from "../components/ConfirmBookingModal";
import FaqSection from "../components/FaqSection";
import api from "../api/axios"; // <-- add

import "../styles/style.css";

function HomePage() {
  const [showFindEventModal, setShowFindEventModal] = useState(false);
  const [showChooseSeatModal, setShowChooseSeatModal] = useState(false);
  const [showConfirmBookingModal, setShowConfirmBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [findEventError, setFindEventError] = useState(null); // optional: error to pass to modal

  const handleChooseContinue = (details) => {
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

      // preload bookingDetails with event info
      setBookingDetails({
        eventId: foundEvent._id,
        eventTitle: foundEvent.title,
        eventDate: foundEvent.date,
        event: foundEvent,
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
        // 🔹 pass handler and optional error
        onContinue={handleFindEventContinue}
        error={findEventError}
      />

      <ChooseSeatModal
        isOpen={showChooseSeatModal}
        onClose={() => setShowChooseSeatModal(false)}
        onContinue={handleChooseContinue}
        // optionally pass found event down:
        event={bookingDetails?.event}
      />

      <ConfirmBookingModal
        isOpen={showConfirmBookingModal}
        onClose={() => setShowConfirmBookingModal(false)}
        bookingDetails={bookingDetails}
        onConfirm={() => {
          setShowConfirmBookingModal(false);
          setBookingDetails(null);
        }}
      />
    </div>
  );
}

export default HomePage;
