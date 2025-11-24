import React, { useState } from "react";
import "../styles/style.css";
import Ellipse3 from "../styles/Ellipse3.png";
import Person from "../styles/person.png";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  return (
    <>
      <nav className="navbar seatify-navbar">
        <div className="nav-left">
          <div className="logo">Seatify</div>
          <div className="nav-links-left">
            <a href="#">Features</a>
            <a href="#">FAQ</a>
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
                  <a href="#">Help</a>
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
