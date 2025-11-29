import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/style.css";
import FilterIcon from "../assets/Filter.png";

function MyBookingsPage() {
  return (
    <div className="my-bookings-page no-gradient">
      {/* Navbar */}
      <Navbar />

      {/* Bookings Section */}
      <section className="bookings-section">
        <h1 className="bookings-title">Your Bookings</h1>

        <div className="filters">
          <img src={FilterIcon} alt="Filter icon" className="filter-icon" />
          <span className="filter-label">Filters</span>
          <button className="filter-btn active">Active</button>
          <button className="filter-btn">Canceled</button>
        </div>

        <div className="booking-list">
          {[1, 2, 3, 4].map((index) => (
            <div className="booking-item" key={index}>
              <span>
                <strong>Title</strong> Group Gather
              </span>
              <span>
                <strong>Seats</strong> A1, A1, B3
              </span>
              <button className="cancel-booking">Cancel</button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default MyBookingsPage;
