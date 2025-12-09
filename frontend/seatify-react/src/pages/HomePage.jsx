import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import WhySeatify from "../components/WhySeatify";
import FindEventModal from "../components/FindEventModal";
import ChooseSeatModal from "../components/ChooseSeatModal";
import ConfirmBookingModal from "../components/ConfirmBookingModal";
import FaqSection from "../components/FaqSection";
import api from "../api/axios";
import SignInModal from "../components/SignInModal"; // <-- add import

import "../styles/style.css";

function HomePage() {
  const [showFindEventModal, setShowFindEventModal] = useState(false);
  const [showChooseSeatModal, setShowChooseSeatModal] = useState(false);
  const [showConfirmBookingModal, setShowConfirmBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [findEventError, setFindEventError] = useState(null);

  // 🔹 auth state for gating create/booking flow
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      try {
        const res = await api.get("/api/v1/auth/status");
        if (!mounted) return;
        if (res.data?.authenticated && res.data.user) {
          setIsSignedIn(true);
          setAuthUser(res.data.user);
        } else {
          setIsSignedIn(false);
          setAuthUser(null);
        }
      } catch {
        if (!mounted) return;
        setIsSignedIn(false);
        setAuthUser(null);
      }
    };

    // initial check on mount
    checkStatus();

    // 🔹 listen for global auth changes (login/logout from Navbar)
    const handleAuthChanged = () => {
      checkStatus();
    };
    window.addEventListener("auth:changed", handleAuthChanged);

    return () => {
      mounted = false;
      window.removeEventListener("auth:changed", handleAuthChanged);
    };
  }, []);

  const handleChooseContinue = (details) => {
    // details contains { seats, eventId, eventTitle, eventDate, event }
    setBookingDetails((prev) => ({
      ...prev,
      ...details,
    }));
    setShowChooseSeatModal(false);
    setShowConfirmBookingModal(true);
  };

  const handleFindEventContinue = async (eventId) => {
    try {
      setFindEventError(null);
      const res = await api.get(`/api/v1/events/${eventId}`);
      const foundEvent = res.data.data.event;

      setBookingDetails({
        eventId: foundEvent._id,
        eventTitle: foundEvent.title,
        eventDate: foundEvent.date,
        event: foundEvent,
        seats: [],
      });

      setShowFindEventModal(false);
      setShowChooseSeatModal(true);
    } catch (err) {
      console.error("Failed to find event:", err);
      setFindEventError(
        err?.response?.status === 404
          ? "Event not found. Please check the ID."
          : "Failed to load event. Please try again."
      );
    }
  };

  // 🔹 gated handler for main CTA
  const handleHeroButtonClick = () => {
    setFindEventError(null);
    if (!isSignedIn) {
      // 🔹 only show SignIn when not signed in
      setShowSignInModal(true);
      return;
    }
    // 🔹 already signed in → open find-event flow
    setShowFindEventModal(true);
  };

  return (
    <div className="home-page">
      <HeroSection
        title="Manage Your Seats"
        highlight=" Smartly!"
        subtitle="Build layouts, share QR code, and manage bookings. Seatify makes seats booking faster and smarter."
        buttonText="See It in Action"
        tagText="Totally Free Experience"
        onButtonClick={handleHeroButtonClick} // <-- use gated handler
      />

      <WhySeatify />
      <FaqSection />
      <Footer />

      {/* 🔹 Sign-In Modal used specifically for gating create/booking flow */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={() => {
          // no-op; HomePage uses onSignInSuccess
        }}
        onSignInSuccess={(loggedInUser) => {
          setIsSignedIn(true);
          setAuthUser(loggedInUser || null);
          setShowSignInModal(false);
          // 🔹 after successful login, immediately open FindEventModal
          setShowFindEventModal(true);
        }}
        onSwitchToSignUp={() => {
          // optional: you can add a dedicated SignUpModal for HomePage if desired
        }}
        onForgotPassword={() => {
          // optional for HomePage; can be a no-op or navigate
        }}
      />

      <FindEventModal
        isOpen={showFindEventModal}
        onClose={() => setShowFindEventModal(false)}
        onContinue={handleFindEventContinue}
        error={findEventError}
      />

      <ChooseSeatModal
        isOpen={showChooseSeatModal}
        onClose={() => setShowChooseSeatModal(false)}
        onContinue={handleChooseContinue}
        event={bookingDetails?.event}
      />

      <ConfirmBookingModal
        isOpen={showConfirmBookingModal}
        onClose={() => {
          setShowConfirmBookingModal(false);
        }}
        seats={bookingDetails?.seats}
        event={bookingDetails?.event}
        onConfirm={async ({ user, event, seats }) => {
          // 🔹 call backend join route with exactly the seats user selected
          try {
            await api.post(`/api/v1/events/${event._id}/join`, {
              seats: seats || bookingDetails?.seats || [],
            });
            // optionally show toast / redirect to MyBookingsPage
          } catch (err) {
            console.error("Booking failed:", err);
            // optionally surface error in ConfirmBookingModal
          } finally {
            setShowConfirmBookingModal(false);
            setBookingDetails(null);
          }
        }}
      />
    </div>
  );
}

export default HomePage;
