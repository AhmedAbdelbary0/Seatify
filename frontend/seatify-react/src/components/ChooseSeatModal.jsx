import React, { useState, useMemo } from "react";
import "../styles/style.css";

function ChooseSeatModal({ isOpen, onClose, onContinue, event }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // 🔹 derive values even if modal isn't open yet (safe, just cheap calculations)
  const maxSeatsPerPerson = event?.maxSeatsPerPerson || 1;
  const layout = Array.isArray(event?.layout) ? event.layout : [];

  // 🔹 derive booked seats from event.layout (and fallback to event.bookedSeats if provided)
  const bookedSeatNumbers = useMemo(() => {
    if (!event) return [];

    // Prefer layout.status if present
    const fromLayout = Array.isArray(event.layout)
      ? event.layout
          .filter((s) => s.status === "booked")
          .map((s) => s.seatNumber)
      : [];

    // Optional: merge with backend helper field from getEventById
    const fromEventField = Array.isArray(event.bookedSeats)
      ? event.bookedSeats
      : [];

    return Array.from(new Set([...fromLayout, ...fromEventField]));
  }, [event]);

  // compute grid dimensions from layout (same logic style as EventViewModal)
  let maxRow = -1;
  let maxColIndex = -1;
  layout.forEach((seat) => {
    const r = Number(seat.row);
    if (Number.isNaN(r)) return;

    const match =
      typeof seat.seatNumber === "string"
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

  const handleSeatClick = (seatNumber) => {
    if (bookedSeatNumbers.includes(seatNumber)) return;

    setSelectedSeats((prev) => {
      const already = prev.includes(seatNumber);
      if (already) {
        return prev.filter((s) => s !== seatNumber);
      }
      if (prev.length >= maxSeatsPerPerson) {
        return prev;
      }
      return [...prev, seatNumber];
    });
  };

  const seatGrid = [];
  if (numRows > 0 && numCols > 0) {
    for (let r = 0; r < numRows; r++) {
      const rowSeats = [];
      for (let c = 0; c < numCols; c++) {
        const seat = layout.find((s) => {
          const row = Number(s.row);
          if (row !== r) return false;

          const m =
            typeof s.seatNumber === "string"
              ? s.seatNumber.match(/([A-Z]+)(\d+)/i)
              : null;
          if (!m) return false;

          const colIndex = Number(m[2]) - 1;
          return colIndex === c;
        });

        if (!seat) {
          rowSeats.push(
            <div key={`${r}-${c}`} className="seat view-seat seat-empty" />
          );
          continue;
        }

        const seatId = seat.seatNumber;
        const isBooked = bookedSeatNumbers.includes(seatId);
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
          >
            {seatId}
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

  if (!isOpen || !event) return null;

  return (
    <div className="modal">
      <div className="modal-content seats-layout">
        <h2>Choose Seat</h2>
        <p>
          Choose up to{" "}
          <strong>{maxSeatsPerPerson}</strong> seat
          {maxSeatsPerPerson > 1 ? "s" : ""} for{" "}
          <strong>{event.title}</strong>
        </p>

        <div
          className="seat-grid view-seat-grid"
          style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }}
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
                  eventId: event._id,
                  eventTitle: event.title,
                  eventDate: event.date,
                  event, // full event for ConfirmBookingModal
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
