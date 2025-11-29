import React, { useState } from "react";
import "../styles/style.css";
import Ellipse3 from "../assets/Ellipse3.png";
import Person from "../assets/person.png";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import ResetPasswordModal from "./ResetPasswordModal";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const handleOpenResetPassword = () => {
    setShowSignInModal(false);
    setShowResetPasswordModal(true);
  };

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
          {isSignedIn ? (
            <>
              <a href="/create" className="create-btn">Create</a>
              <div className="user-menu-container">
                <div
                  className="user-icon"
                  onClick={() => setMenuOpen((prev) => !prev)}                >
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
                    onClick={() => setIsSignedIn(false)}
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
          } else {
            setIsSignedIn(true);
            setShowSignUpModal(false);
          }
        }}
      />
    </>
  );
}

export default Navbar;
