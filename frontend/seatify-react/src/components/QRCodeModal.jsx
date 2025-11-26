import React from "react";
import { QRCodeCanvas } from "qrcode.react"; 
import "../styles/style.css";

function QRCodeModal({ isOpen, onClose, eventId }) {
  if (!isOpen) return null;

  const eventURL = `https://localhost:3000/event/${eventId || "123"}`; // Mock event URL


  return (
    <div className="modal">
      <div className="modal-content qr-modal">
        <h2>QR Code</h2>
        <p>Share this QR to let your attendee book</p>

        <div className="qr-container">
          <QRCodeCanvas
            value={eventURL}
            size={180}
            bgColor="#ffffff"
            fgColor="#5B21B6"
            level="H"
            includeMargin={false}
          />
        </div>
        <p className="event-id-text">Event ID: <strong>{eventId}</strong></p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Back
          </button>
          <button
            className="continue-btn"
            onClick={() => {
              const canvas = document.querySelector("canvas");
              const link = document.createElement("a");
              link.href = canvas.toDataURL("image/png");
              link.download = "Seatify_QR.png";
              link.click();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCodeModal;
