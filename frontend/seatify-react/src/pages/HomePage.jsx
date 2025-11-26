import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import WhySeatify from "../components/WhySeatify";
import FindEventModal from "../components/FindEventModal";
import ChooseSeatModal from "../components/ChooseSeatModal";
import ConfirmBookingModal from "../components/ConfirmBookingModal";
import FaqSection from "../components/FaqSection";

import "../styles/style.css";

function HomePage() {
  const [showFindEventModal, setShowFindEventModal] = useState(false);
  const [showChooseSeatModal, setShowChooseSeatModal] = useState(false);
  const [showConfirmBookingModal, setShowConfirmBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleChooseContinue = (details) => {
    setBookingDetails(details);
    setShowChooseSeatModal(false);
    setShowConfirmBookingModal(true);
  };

  return (
    <div className="home-page">
      <HeroSection
        title="Manage Your Seats"
        highlight=" Smartly!"
        subtitle="Build layouts, share QR code, and manage bookings. Seatify makes seats booking faster and smarter."
        buttonText="See It in Action"
        tagText="Totally Free Experience"
        onButtonClick={() => setShowFindEventModal(true)}
      />

      <WhySeatify />
      <FaqSection />
      <Footer />

      <FindEventModal
        isOpen={showFindEventModal}
        onClose={() => setShowFindEventModal(false)}
        onContinue={() => {
          setShowFindEventModal(false);
          setShowChooseSeatModal(true); 
        }}
      />

      <ChooseSeatModal
        isOpen={showChooseSeatModal}
        onClose={() => setShowChooseSeatModal(false)}
        onContinue={handleChooseContinue}
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
