import React, { useState } from "react";
import "../styles/style.css";

function SeatsLayoutModal({ isOpen, onClose, onSave }) {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);

  // Generate seat grid dynamically (for display only)
  const generateGrid = () => {
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push(
          <div key={`${r}-${c}`} className="seat">
            {String.fromCharCode(65 + r)}
            {c + 1}
          </div>
        );
      }
      grid.push(
        <div key={r} className="seat-row">
          {row}
        </div>
      );
    }
    return grid;
  };

  if (!isOpen) return null;

  const handleContinue = () => {
    const layout = [];
    for (let r = 0; r < rows; r++) {
      const rowLabel = String.fromCharCode(65 + r); // A, B, C...
      for (let c = 0; c < cols; c++) {
        const seatNumber = `${rowLabel}${c + 1}`;
        // 🔹 match backend schema: seat objects with seatNumber
        layout.push({
          seatNumber,
          row: r,
          col: c,
          // status: 'available', // if your schema has other fields, add them here
        });
      }
    }

    const totalSeats = rows * cols;

    onSave({ layout, totalSeats });
  };

  return (
    <>
      {/* SEATS LAYOUT MODAL */}
      {isOpen && (
        <div className="modal">
          <div className="modal-content seats-layout">
            <h2>Seats Layout</h2>
            <p>Design how your seats are layouted</p>

            {/* Seat Grid */}
            <div
              id="seatGrid"
              className="seat-grid"
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {generateGrid()}
            </div>

            {/* Sliders */}
            <div className="layout-sliders">
              <div className="slider-item">
                <label htmlFor="rowsSlider">Rows</label>
                <div className="slider-container">
                  <input
                    type="range"
                    id="rowsSlider"
                    min="1"
                    max="10"
                    value={rows}
                    onChange={(e) => setRows(Number(e.target.value))}
                  />
                  <span id="rowsValue">{rows}</span>
                </div>
              </div>

              <div className="slider-item">
                <label htmlFor="colsSlider">Columns</label>
                <div className="slider-container">
                  <input
                    type="range"
                    id="colsSlider"
                    min="1"
                    max="10"
                    value={cols}
                    onChange={(e) => setCols(Number(e.target.value))}
                  />
                  <span id="colsValue">{cols}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Back
              </button>
              <button
                type="button"
                className="continue-btn"
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SeatsLayoutModal;
