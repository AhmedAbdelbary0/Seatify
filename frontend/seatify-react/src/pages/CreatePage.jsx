import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import EventList from "../components/EventList";
import "../styles/style.css";

function CreatePage() {
  return (
    <div className="create-page">
      <HeroSection
        title="Create an"
        highlight="Event"
        subtitle="Create an event, add details, and roll out your seats for booking. It’s that simple."
        buttonText="Create Now"
        tagText="Takes Only One Minute"
        />


      <EventList />

      <Footer />
    </div>
  );
}

export default CreatePage;
