import React, { useEffect, useState } from "react";
import "../styles/style.css";
import api from "../api/axios";

function ConfirmBookingModal({
  isOpen,
  onClose,
  seats,
  event,
  onConfirm,
}) {
  const [user, setUser] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // reset state each open
    setLoadError(null);
    setUser(null);

    const loadUser = async () => {
      setLoadingUser(true);
      try {
        const statusRes = await api.get("/api/v1/auth/status");
        if (statusRes.data?.authenticated) {
          const u = statusRes.data.user || null;
          console.log("ConfirmBookingModal auth status user:", u);
          setUser(u);
        }
      } catch (err) {
        console.error("Failed to load user for confirm modal:", err);
        setLoadError("Failed to load user details. Please try again.");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [isOpen]);

  if (!isOpen) return null;

  // ensure we have event and seats
  const seatsList = Array.isArray(seats) ? seats : [];
  const hasEvent = !!event;

  const dateTime =
    event?.date ||
    event?.dateTime ||
    event?.startTime ||
    null;

  // same strategy as Navbar: derive fullName from user object
  const firstName =
    user && typeof user === "object" ? user.firstName : undefined;

  const fullNameFromFields =
    user && (user.firstName || user.lastName)
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : null;

  const fullName = (user && user.fullName) || fullNameFromFields;

  const disableBook =
    loadingUser || !!loadError || !hasEvent || seatsList.length === 0;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Booking</h2>
        <p>Review all details and confirm your booking</p>

        {loadingUser && <p>Loading user details...</p>}
        {loadError && <p className="error-message">{loadError}</p>}
        {!hasEvent && (
          <p className="error-message">Missing event details for booking.</p>
        )}

        {hasEvent && !loadError && (
          <div className="confirm-details">
            <div className="detail-item">
              <label>Date &amp; Time</label>
              <p>{dateTime || "N/A"}</p>
            </div>

            <div className="detail-item">
              <label>Name</label>
              {/* if for some reason fullName is falsy, fall back to firstName, then "Guest" */}
              <p>{fullName || firstName || "Guest"}</p>
            </div>

            <div className="detail-item">
              <label>Seats</label>
              <p>
                {seatsList.length > 0
                  ? seatsList.join(", ")
                  : "No seats selected"}
              </p>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Back
          </button>
          <button
            className="continue-btn"
            disabled={disableBook}
            onClick={() => {
              if (typeof onConfirm === "function") {
                onConfirm({
                  user,
                  event,
                  seats: seatsList,
                });
              }
            }}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmBookingModal;
