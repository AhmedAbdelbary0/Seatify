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

  // helper: same as in Navbar
  const formatName = (str) =>
    typeof str === "string"
      ? str
          .trim()
          .split(/\s+/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      : "";

  const formatEventDateTime = (ev) => {
    if (!ev || !ev.date) return "N/A";

    const d = new Date(ev.date);
    if (Number.isNaN(d.getTime())) return "N/A";

    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const seatsList = Array.isArray(seats) ? seats : [];
  const formattedDateTime = formatEventDateTime(event);

  const firstName = user && typeof user === "object" ? user.firstName : undefined;
  const fullNameFromFields =
    user && (user.firstName || user.lastName)
      ? `${formatName(user.firstName || "")} ${formatName(
          user.lastName || ""
        )}`.trim()
      : null;
  const fullName = fullNameFromFields || formatName(firstName) || "Guest";

  const disableBook =
    loadingUser ||
    !!loadError ||
    !event ||
    seatsList.length === 0;

  return (
    <div className="modal">
      <div className="modal-content confirm-booking">
        <h2>Confirm Booking</h2>

        {loadingUser && <p>Loading your details...</p>}
        {loadError && <p className="error-message">{loadError}</p>}

        {!loadingUser && !loadError && (
          <div className="booking-details">
            <div className="detail-item">
              <label>Event</label>
              <p>{event?.title || "N/A"}</p>
            </div>

            <div className="detail-item">
              <label>Date &amp; Time</label>
              <p>{formattedDateTime}</p>
            </div>

            <div className="detail-item">
              <label>Name</label>
              <p>{fullName}</p>
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
