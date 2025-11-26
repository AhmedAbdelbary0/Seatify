import React, { useState } from "react";
import "../styles/style.css";

function ChooseSeatModal({ isOpen, onClose, onContinue }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const rows = 5;
  const cols = 8;

  if (!isOpen) return null;

  // Example booked seats
  const bookedSeats = ["B2", "D4", "C3"];

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const seats = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seatId = `${String.fromCharCode(65 + r)}${c + 1}`;
      const isBooked = bookedSeats.includes(seatId);
      const isSelected = selectedSeats.includes(seatId);
      seats.push(
        <div
          key={seatId}
          className={`seat ${
            isBooked
              ? "seat-booked"
              : isSelected
              ? "seat-selected"
              : "seat-available"
          }`}
          onClick={() => handleSeatClick(seatId)}
        ></div>
      );
    }
  }

  return (
    <div className="modal">
      <div className="modal-content seats-layout">
        <h2>Choose Seat</h2>
        <p>Choose your seat to continue</p>

        <div className="seat-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {seats}
        </div>

        <div className="legend">
          <div><span className="seat seat-booked"></span>Booked</div>
          <div><span className="seat seat-selected"></span>Selected</div>
          <div><span className="seat seat-available"></span>Available</div>
        </div>

        <p className="seat-count">
          {selectedSeats.length > 0
            ? `${selectedSeats.length} × Seats Selected`
            : "No Seats Selected"}
        </p>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Back
          </button>
          <button
            className="continue-btn"
            onClick={() => {
              // prevent continuing without selecting seats
              if (selectedSeats.length === 0) return;
              if (typeof onContinue === "function") {
                onContinue({
                  seats: selectedSeats,
                  name: null,
                  dateTime: null,
                });
              }
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChooseSeatModal;
