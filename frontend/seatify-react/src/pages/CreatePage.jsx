import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import EventList from "../components/EventList";
import CreateEventModal from "../components/CreateEventModal";
import SeatsLayoutModal from "../components/SeatsLayoutModal";


import "../styles/style.css";

function CreatePage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSeatsModal, setShowSeatsModal] = useState(false);

  return (
    <div className="create-page">
      <HeroSection
        title="Create an"
        highlight="Event"
        subtitle="Create an event, add details, and roll out your seats for booking. It’s that simple."
        buttonText="Create Now"
        tagText="Takes Only One Minute"
        onButtonClick={() => setShowCreateModal(true)} // ✅ open modal on button click
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onContinue={() => {
          setShowCreateModal(false);
          setShowSeatsModal(true);
          console.log("Continue to next step...");
        }}
      />

      {/* Seats Layout Modal */}
      <SeatsLayoutModal
        isOpen={showSeatsModal}
        onClose={() => setShowSeatsModal(false)}
        onSave={() => {
          setShowSeatsModal(false);
          console.log("Seats layout saved!");
        }} />

      

      <EventList />
      <Footer />
    </div>
  );
}

export default CreatePage;
