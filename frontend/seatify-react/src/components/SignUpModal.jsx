import React, { useState } from "react";
import "../styles/style.css";
import api from "../api/axios";

function SignUpModal({ isOpen, onClose, onSignUp }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  if (!isOpen) return null;


  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Sign Up</h2>
        <p>Create an account to get started with Seatify</p>

        <form
          className="signin-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
          
            try {
              const [firstName, ...rest] = name.trim().split(" ");
              const lastName = rest.join(" ") || " ";
          
              const res = await api.post("/api/v1/auth/register", {
                firstName,
                lastName,
                email,
                password,
                role: "user"
              });
          
              if (typeof onSignUp === "function") onSignUp(res.data.data.user);
              onClose();
          
            } catch (err) {
              setError(err.response?.data?.message || "Sign up failed. Please try again.");
            }
          }}
        >
          <label>Full Name</label>
          <input
              type="text"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
              type="password"
              placeholder="Re-enter your password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

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
