import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/style.css";
import FilterIcon from "../assets/Filter.png";
import api from "../api/axios";

function MyBookingsPage() {
  const [joinedBookings, setJoinedBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchJoined = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/api/v1/events/me/joined/events");
        if (!mounted) return;
        const list = res.data?.data?.joined || [];
        setJoinedBookings(list);
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to load joined events:", err);
        setError("Failed to load your bookings.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchJoined();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = activeFilter === "active" ? joinedBookings : [];

  const handleCancelBooking = async (participant) => {
    const eventId =
      typeof participant.eventId === "object"
        ? participant.eventId._id
        : participant.eventId;

    if (!eventId) return;

    try {
      setCancelingId(participant._id);
      await api.delete(`/api/v1/events/${eventId}/leave`);
      // remove from local state
      setJoinedBookings((prev) =>
        prev.filter((p) => p._id !== participant._id)
      );
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      // optional: setError("Failed to cancel booking.");
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="my-bookings-page no-gradient">
      {/* Navbar */}
      <Navbar />
      {/* Bookings Section */}
      <section className="bookings-section">
        <h1 className="bookings-title">Your Bookings</h1>

        <div className="filters">
          <img src={FilterIcon} alt="Filter icon" className="filter-icon" />
          <span className="filter-label">Filters</span>
          <button
            className={`filter-btn ${
              activeFilter === "active" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("active")}
          >
            Active
          </button>
          <button
            className={`filter-btn ${
              activeFilter === "canceled" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("canceled")}
          >
            Canceled
          </button>
        </div>

        {loading && <p>Loading bookings...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p>
            No{" "}
            {activeFilter === "active"
              ? "active bookings yet."
              : "canceled bookings."}
          </p>
        )}

        <div className="booking-list">
          {!loading &&
            !error &&
            filtered.map((p) => {
              const event = p.eventId; // populated in backend
              const title =
                event && typeof event === "object" ? event.title : "Joined Event";
              const dateStr =
                event && event.date
                  ? new Date(event.date).toLocaleString()
                  : "No date";
              const seats =
                Array.isArray(p.seatNumbers) && p.seatNumbers.length > 0
                  ? p.seatNumbers.join(", ")
                  : "No seats info";

              const isCanceling = cancelingId === p._id;

              return (
                <div
                  className="booking-item"
                  key={p._id?.toString?.() || `${p.eventId}-${p.userId}`}
                >
                  <span>
                    <strong>Title</strong> {title}
                  </span>
                  <span>
                    <strong>Date</strong> {dateStr}
                  </span>
                  <span>
                    <strong>Seats</strong> {seats}
                  </span>
                  <button
                    className="cancel-booking"
                    disabled={isCanceling}
                    onClick={() => handleCancelBooking(p)}
                  >
                    {isCanceling ? "Canceling..." : "Cancel"}
                  </button>
                </div>
              );
            })}
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default MyBookingsPage;
