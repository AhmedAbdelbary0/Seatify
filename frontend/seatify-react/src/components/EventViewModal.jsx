import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/style.css";

function EventViewModal({ isOpen, onClose, onOpenAttendeesReport }) {
  const [activeTab, setActiveTab] = useState("details");

  // Static seat layout configuration
  const rows = 5;
  const cols = 8;
  const bookedSeats = ["B2", "D4", "C3"]; // Example booked seats

  if (!isOpen) return null;

  // Generate seat layout dynamically
  const renderSeatGrid = () => {
    const seats = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const seatId = `${String.fromCharCode(65 + r)}${c + 1}`;
        const isBooked = bookedSeats.includes(seatId);
        seats.push(
          <div
            key={seatId}
            className={`seat ${
              isBooked ? "seat-booked" : "seat-available"
            }`}
          ></div>
        );
      }
    }

    return (
      <div
        className="seat-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {seats}
      </div>
    );
  };

  return (
    <div className="modal">
      <div className="modal-content event-view">
        <h2>Event View</h2>

        {/* Tabs */}
        <div className="event-tabs">
          <button
            className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`tab-btn ${activeTab === "seats" ? "active" : ""}`}
            onClick={() => setActiveTab("seats")}
          >
            Seats
          </button>
          <button
            className={`tab-btn ${activeTab === "qrcode" ? "active" : ""}`}
            onClick={() => setActiveTab("qrcode")}
          >
            QR Code
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="event-details">
            <label>Title</label>
            <p className="event-text">This is a Title</p>

            <label>Date & Time</label>
            <p className="event-text">01/01/2026 03:00 pm</p>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={onClose}>
                Close
              </button>
              <button
                className="continue-btn"
                onClick={() => {
                  // Notify parent to open attendees report.
                  if (typeof onOpenAttendeesReport === "function") {
                    onOpenAttendeesReport();
                  }
                }}
              >
                Attendees Report
              </button>
            </div>
          </div>
        )}

        {activeTab === "seats" && (
          <div className="event-seats">
            {renderSeatGrid()}
            <div className="legend">
              <div><span className="seat seat-booked"></span>Booked</div>
              <div><span className="seat seat-available"></span>Available</div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setActiveTab("details")}>
                Back
              </button>
              <button
                className="continue-btn"
                onClick={() => setActiveTab("qrcode")}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {activeTab === "qrcode" && (
          <div className="event-qrcode">
            <h3>QR Code</h3>
            <p className="event-qrcode-subtext">Share this QR with attendees to book seats</p>

            <div className="qr-container">
              <QRCodeCanvas
                value="https://localhost:3000/event/EVT12345"
                size={180}
                bgColor="#ffffff"
                fgColor="#5B21B6"
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="event-id-text">Event ID: <strong>EVT12345</strong></p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setActiveTab("details")}>
                Back
              </button>
              <button
                className="continue-btn"
                onClick={() => {
                  const canvas = document.querySelector("canvas");
                  const link = document.createElement("a");
                  link.href = canvas.toDataURL("image/png");
                  link.download = `Seatify_EVT12345.png`;
                  link.click();
                }}
              >
                Save
              </button>
            </div>
          </div>

          
        )}
      </div>
    </div>
  );
}

export default EventViewModal;
