import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // <-- add useNavigate
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import ChooseSeatModal from "../components/ChooseSeatModal";
import ConfirmBookingModal from "../components/ConfirmBookingModal";
import SignInModal from "../components/SignInModal";
import api from "../api/axios";
import "../styles/style.css";

function JoinEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate(); // <-- for redirect

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventError, setEventError] = useState(null);

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true); // <-- new

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showChooseSeatModal, setShowChooseSeatModal] = useState(false);
  const [showConfirmBookingModal, setShowConfirmBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // 1) check auth status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get("/api/v1/auth/status");
        if (res.data?.authenticated && res.data.user) {
          setIsSignedIn(true);
          setAuthUser(res.data.user);
        } else {
          setIsSignedIn(false);
          setAuthUser(null);
        }
      } catch {
        setIsSignedIn(false);
        setAuthUser(null);
      } finally {
        setCheckingAuth(false); // <-- done checking
      }
    };
    checkStatus();
  }, []);

  // 2) load event join info
  useEffect(() => {
    if (!eventId) return;
    const fetchJoinInfo = async () => {
      setLoadingEvent(true);
      setEventError(null);
      try {
        const res = await api.get(`/api/v1/events/${eventId}/join-info`);
        const { event: ev, bookedSeats } = res.data.data || {};
        setEvent({ ...ev, bookedSeats });
      } catch (err) {
        console.error("Failed to load join info:", err);
        setEventError(
          err?.response?.status === 404
            ? "Event not found."
            : "Failed to load event. Please try again."
        );
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchJoinInfo();
  }, [eventId]);

  // 3) once event + auth state known, decide which modal to show
  useEffect(() => {
    // wait until both checks are finished
    if (loadingEvent || checkingAuth) return;
    if (!event) return;

    if (!isSignedIn) {
      // not authenticated -> SignIn first, no seat modal yet
      setShowSignInModal(true);
      setShowChooseSeatModal(false);
    } else {
      // authenticated -> skip SignIn, go straight to seat selection
      setShowSignInModal(false);
      setShowChooseSeatModal(true);
    }
  }, [loadingEvent, checkingAuth, event, isSignedIn]);

  const handleChooseContinue = (details) => {
    setBookingDetails((prev) => ({
      ...prev,
      ...details,
    }));
    setShowChooseSeatModal(false);
    setShowConfirmBookingModal(true);
  };

  if (loadingEvent) {
    // bare loading, no navbar/footer
    return (
      <div className="join-event-page">
        <p>Loading event...</p>
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="join-event-page">
        <p>{eventError}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="join-event-page">
        <p>Event not found.</p>
      </div>
    );
  }

  return (
    <div className="join-event-page">
      {/* No Navbar / Footer / extra content, only modals */}

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={() => {}}
        onSignInSuccess={(loggedInUser) => {
          setIsSignedIn(true);
          setAuthUser(loggedInUser || null);
          setShowSignInModal(false);
          setShowChooseSeatModal(true);
        }}
        onSwitchToSignUp={() => {}}
        onForgotPassword={() => {}}
      />

      <ChooseSeatModal
        isOpen={showChooseSeatModal}
        onClose={() => setShowChooseSeatModal(false)}
        onContinue={handleChooseContinue}
        event={event}
      />

      <ConfirmBookingModal
        isOpen={showConfirmBookingModal}
        onClose={() => setShowConfirmBookingModal(false)}
        seats={bookingDetails?.seats}
        event={bookingDetails?.event}
        onConfirm={async ({ user, event: ev, seats }) => {
          try {
            await api.post(`/api/v1/events/${ev._id}/join`, {
              seats: seats || bookingDetails?.seats || [],
            });
            alert("Booking successful!");              // <-- show success
            navigate("/bookings");                    // <-- redirect
          } catch (err) {
            console.error("Booking failed:", err);
          } finally {
            setShowConfirmBookingModal(false);
            setBookingDetails(null);
          }
        }}
      />
    </div>
  );
}

export default JoinEventPage;