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

  // build grid as rows -> seats, to reuse same view layout CSS
  const seatGrid = [];
  for (let r = 0; r < rows; r++) {
    const rowSeats = [];
    for (let c = 0; c < cols; c++) {
      const seatId = `${String.fromCharCode(65 + r)}${c + 1}`;
      const isBooked = bookedSeats.includes(seatId);
      const isSelected = selectedSeats.includes(seatId);

      rowSeats.push(
        <div
          key={seatId}
          className={`seat view-seat ${
            isBooked
              ? "seat-booked"
              : isSelected
              ? "seat-selected"
              : "seat-available"
          }`}
          onClick={() => handleSeatClick(seatId)}
        />
      );
    }
    seatGrid.push(
      <div key={r} className="seat-row view-seat-row">
        {rowSeats}
      </div>
    );
  }

  return (
    <div className="modal">
      {/* use same width/padding style as SeatsLayoutModal */}
      <div className="modal-content seats-layout">
        <h2>Choose Seat</h2>
        <p>Choose your seat to continue</p>

        {/* match layout wrapper used by SeatsLayoutModal */}
        <div
          className="seat-grid view-seat-grid"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {seatGrid}
        </div>

        <div className="legend">
          <div>
            <span className="seat seat-booked" />
            Booked
          </div>
          <div>
            <span className="seat seat-selected" />
            Selected
          </div>
          <div>
            <span className="seat seat-available" />
            Available
          </div>
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
