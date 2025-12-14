import React, { useState } from "react";
import "../styles/style.css";
import api from "../api/axios";

function SignUpModal({ isOpen, onClose, onSignUp }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Sign Up</h2>
        <p>Create an account to get started with Seatify</p>

        {error && <p className="error-text">{error}</p>}

        <form
          className="signin-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setFieldErrors({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            });

            // simple client-side validation
            const newErrors = {};
            if (!name.trim()) newErrors.name = "Full name is required.";
            if (!email.trim()) {
              newErrors.email = "Email is required.";
            } else if (!/^\S+@\S+\.\S+$/.test(email)) {
              newErrors.email = "Please enter a valid email address.";
            }
            if (!password) newErrors.password = "Password is required.";
            if (!confirmPassword)
              newErrors.confirmPassword = "Please confirm your password.";
            if (password && confirmPassword && password !== confirmPassword)
              newErrors.confirmPassword = "Passwords do not match.";

            if (Object.keys(newErrors).length > 0) {
              setFieldErrors((prev) => ({ ...prev, ...newErrors }));
              return;
            }

            try {
              const [firstName, ...rest] = name.trim().split(" ");
              const lastName = rest.join(" ") || " ";

              const res = await api.post("/api/v1/auth/register", {
                firstName,
                lastName,
                email,
                password,
                role: "user",
              });

              if (typeof onSignUp === "function") onSignUp(res.data.data.user);
              onClose();
            } catch (err) {
              const data = err.response?.data;

              // map backend field errors (if any) to frontend fieldErrors
              if (data?.errors && typeof data.errors === "object") {
                const be = data.errors;
                const mapped = {};

                if (be.firstName || be.lastName) {
                  // you show one "Full Name" field, so combine messages
                  mapped.name = [be.firstName, be.lastName]
                    .filter(Boolean)
                    .join(" ");
                }
                if (be.email) mapped.email = be.email;
                if (be.password) mapped.password = be.password;

                setFieldErrors((prev) => ({
                  ...prev,
                  ...mapped,
                }));
              }

              // general message for non-field/server errors
              setError(
                data?.message || "Sign up failed. Please try again."
              );
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
          {fieldErrors.name && (
            <p className="error-text">{fieldErrors.name}</p>
          )}

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && (
            <p className="error-text">{fieldErrors.email}</p>
          )}

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && (
            <p className="error-text">{fieldErrors.password}</p>
          )}

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {fieldErrors.confirmPassword && (
            <p className="error-text">{fieldErrors.confirmPassword}</p>
          )}

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
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSignUp("signin");
              }}
            >
              Sign in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpModal;
