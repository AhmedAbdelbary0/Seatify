import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/style.css";

function EventViewModal({ isOpen, event, loading, error, onClose, onOpenAttendeesReport }) {
  const [activeTab, setActiveTab] = useState("details");

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-content">
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal">
        <div className="modal-content">
          <p>{error}</p>
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const layout = Array.isArray(event?.layout) ? event.layout : [];
  console.log("Layout inside EventViewModal:", layout); // 🔍 must be non-empty

  let maxRow = -1;
  let maxColIndex = -1;

  layout.forEach((seat) => {
    const r = Number(seat.row);
    if (Number.isNaN(r)) return;

    const match = typeof seat.seatNumber === "string"
      ? seat.seatNumber.match(/([A-Z]+)(\d+)/i)
      : null;

    if (!match) return;
    const colIndex = Number(match[2]) - 1;

    if (!Number.isNaN(colIndex)) {
      if (r > maxRow) maxRow = r;
      if (colIndex > maxColIndex) maxColIndex = colIndex;
    }
  });

  const numRows = maxRow + 1;
  const numCols = maxColIndex + 1;

  const seatGrid = [];
  if (numRows > 0 && numCols > 0) {
    for (let r = 0; r < numRows; r++) {
      const rowSeats = [];
      for (let c = 0; c < numCols; c++) {
        const seat = layout.find((s) => {
          const row = Number(s.row);
          if (row !== r) return false;

          const m = typeof s.seatNumber === "string"
            ? s.seatNumber.match(/([A-Z]+)(\d+)/i)
            : null;
          if (!m) return false;

          const colIndex = Number(m[2]) - 1;
          return colIndex === c;
        });

        rowSeats.push(
          <div key={`${r}-${c}`} className="seat view-seat">
            {seat ? seat.seatNumber : ""}
          </div>
        );
      }
      seatGrid.push(
        <div key={r} className="seat-row view-seat-row">
          {rowSeats}
        </div>
      );
    }
  }

  return (
    <div className="modal">
      <div className="modal-content event-view">
        <h2>{event.title}</h2>

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
            <p className="event-text">{event.title}</p>

            
            <label>Event ID</label>
            <p className="event-text">{event._id}</p>

            <label>Date & Time</label>
            <p className="event-text">{formattedDate}</p>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={onClose}>
                Close
              </button>
              <button
                className="continue-btn"
                onClick={() => {
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
            <h3>Seat Layout</h3>
            {seatGrid.length === 0 ? (
              <p>No seat layout defined.</p>
            ) : (
              <div
                className="seat-grid view-seat-grid"
                style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }}
              >
                {seatGrid}
              </div>
            )}
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
