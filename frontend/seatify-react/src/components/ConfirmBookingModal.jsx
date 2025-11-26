import React from "react";
import "../styles/style.css";

function ConfirmBookingModal({ isOpen, onClose, bookingDetails, onConfirm }) {
  if (!isOpen) return null;

  const { dateTime, name, seats } = bookingDetails || {};

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Booking</h2>
        <p>Review all details and confirm your booking</p>

        <div className="confirm-details">
          <div className="detail-item">
            <label>Date &amp; Time</label>
            <p>{dateTime || "N/A"}</p>
          </div>

          <div className="detail-item">
            <label>Name</label>
            <p>{name || "Guest"}</p>
          </div>

          <div className="detail-item">
            <label>Seats</label>
            <p>{seats && seats.length > 0 ? seats.join(", ") : "No seats selected"}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Back</button>
          <button className="continue-btn" onClick={onConfirm}>Book</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmBookingModal;
