import React from "react";
import "../styles/style.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h1>Seatify</h1>
          <p className="footer-note">
            THIS PROJECT WAS DEVELOPED AS A REQUIREMENT OF THE WEB PROGRAMMING
            COURSE AT KUWAIT UNIVERSITY. ©2025 SEATIFY. ALL RIGHTS RESERVED.
          </p>
        </div>

        <div className="footer-section">
          <h3>Discover</h3>
          <a href="/">Home</a>
          <a href="#">Features</a>
          <a href="/#faq">FAQ</a>
        </div>

        <div className="footer-section">
          <h3>Information</h3>
          <a href="#">Terms</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Github</a>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <a href="mailto:hi@seatify.io">hi@seatify.io</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
