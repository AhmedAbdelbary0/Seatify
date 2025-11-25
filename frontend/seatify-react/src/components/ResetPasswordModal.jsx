import React from "react";
import "../styles/style.css";

function ResetPasswordModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Reset Your Password</h2>
        <p>You will receive an email to reset your password</p>

        <form className="reset-password-form">
          <label htmlFor="resetEmail">Email</label>
          <input
            type="email"
            id="resetEmail"
            placeholder="Enter your email"
            required
          />

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="continue-btn">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordModal;
