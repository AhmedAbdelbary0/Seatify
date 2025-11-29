import React from "react";
import "../styles/style.css";

function SignInModal({ isOpen, onClose, onSignIn, onSwitchToSignUp, onForgotPassword }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Sign In</h2>
        <p>Sign in to your account to continue</p>

        <form
          className="signin-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSignIn();
            onClose();
          }}
        >
          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

          <a
            href="#"
            className="forgot-password"
            onClick={(e) => {
              e.preventDefault();
              if (typeof onForgotPassword === "function") onForgotPassword();
            }}
          >
            Forgot your password?
          </a>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="continue-btn">
              Sign In
            </button>
          </div>

          <p className="signin-footer">
            Don’t have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                onSwitchToSignUp();
              }}
            >
              Sign up here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignInModal;
