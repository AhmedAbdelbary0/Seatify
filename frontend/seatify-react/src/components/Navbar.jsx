import React, { useState, useEffect } from "react";
import "../styles/style.css";
import Ellipse3 from "../assets/Ellipse3.png";
import Person from "../assets/person.png";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import ResetPasswordModal from "./ResetPasswordModal";
import api from "../api/axios";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null); // store logged-in user
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await api.get("/api/v1/auth/status");
        const backendUser = res.data?.user || null;
        if (res.data?.authenticated && backendUser) {
          setIsSignedIn(true);
          setUser(backendUser);
        } else {
          setIsSignedIn(false);
          setUser(null);
        }
      } catch {
        setIsSignedIn(false);
        setUser(null);
      }
    };
    checkAuthStatus();
  }, []);

  const handleSignOut = async () => {
    try {
      await api.get("/api/v1/auth/logout");
      localStorage.removeItem("accessToken");
      setIsSignedIn(false);
      setUser(null);
    } catch (err) {
      console.error("Sign-out failed", err);
    }
  };

  const handleOpenResetPassword = () => {
    setShowSignInModal(false);
    setShowResetPasswordModal(true);
  };

  const firstName = user && typeof user === "object" ? user.firstName : undefined;
  const fullName =
    user && (user.firstName || user.lastName)
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : null;

  return (
    <>
      <nav className="navbar seatify-navbar">
        <div className="nav-left">
          <a href="/" className="logo">Seatify</a>
          <div className="nav-links-left">
            <a href="/#features">Features</a>
            <a
              href="/#faq"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              FAQ
            </a>
          </div>
        </div>

        <div className="nav-right">
          {isSignedIn && firstName !== undefined ? (
            <>
              {/* greeting */}
              <span className="nav-greeting">
                Hi{fullName ? `, ${fullName}` : ""}!
              </span>
              <a href="/create" className="create-btn">Create</a>
              <div className="user-menu-container">
                <div
                  className="user-icon"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  <img src={Ellipse3} alt="user background" className="user-bg" />
                  <img src={Person} alt="user icon" className="user-img" />
                </div>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <a href="/bookings">My Bookings</a>
                    <a href="mailto:hi@seatify.io">Help</a>
                    <a
                      href="#"
                      className="signout"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <a
                href="#"
                className="signin-link"
                onClick={() => setShowSignInModal(true)}
              >
                Sign in
              </a>
              <button className="primary-btn" onClick={() => setShowSignUpModal(true)}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={() => {
          setIsSignedIn(true);
          setShowSignInModal(false);
        }}
        onSignInSuccess={(loggedInUser) => {
          // store user from /login response
          if (loggedInUser && typeof loggedInUser === "object") setUser(loggedInUser);
        }}
        onSwitchToSignUp={() => {
          setShowSignInModal(false);
          setShowSignUpModal(true);
        }}
        onForgotPassword={handleOpenResetPassword}
      />

      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
      />

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSignUp={(mode) => {
          if (mode === "signin") {
            setShowSignUpModal(false);
            setShowSignInModal(true);
          } else if (mode && typeof mode === "object") {
            // mode contains res.data.user from signup
            setIsSignedIn(true);
            setUser(mode); // store user
            setShowSignUpModal(false);
          } else {
            // fallback
            setIsSignedIn(true);
            setShowSignUpModal(false);
          }
        }}
      />
    </>
  );
}

export default Navbar;
