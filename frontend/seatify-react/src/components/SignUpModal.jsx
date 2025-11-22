import React from "react";
import "../styles/style.css";

function SignUpModal({ isOpen, onClose, onSignUp }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Sign Up</h2>
        <p>Create an account to get started with Seatify</p>

        <form
          className="signin-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSignUp();
            onClose();
          }}
        >
          <label>Full Name</label>
          <input type="text" placeholder="Enter your name" required />

          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

          <label>Confirm Password</label>
          <input type="password" placeholder="Re-enter your password" required />

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="continue-btn">
              Sign Up
            </button>
          </div>

          <p className="signin-footer">
            Already have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onSignUp("signin"); }}>
              Sign in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpModal;
