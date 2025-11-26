import React from "react";
import "../styles/style.css";

function WhySeatify() {
  return (
    <section id="features" className="why-seatify">
      <h2>Why Seatify?</h2>
      <p>Seamless Experience for Your Seats Booking</p>
      {/* Later we can make this dynamic too */}
      <div className="features-grid">
        <div className="feature-card">
          <h3>Easy to Use</h3>
          <p>Roll out your venue for booking in minutes.</p>
        </div>
        <div className="feature-card">
          <h3>Real-Time Insights</h3>
          <p>Track bookings as they happen.</p>
        </div>
        <div className="feature-card">
          <h3>QR-Based</h3>
          <p>Guests can scan and book instantly.</p>
        </div>
        <div className="feature-card">
          <h3>Custom Layouts</h3>
          <p>Design your venue layout and seat arrangement.</p>
        </div>
      </div>
    </section>
  );
}

export default WhySeatify;
