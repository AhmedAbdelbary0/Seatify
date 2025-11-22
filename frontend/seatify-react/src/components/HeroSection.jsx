import React from "react";
import "../styles/style.css";
import Navbar from "./Navbar";

function HeroSection({ title, highlight, subtitle, buttonText, tagText, onButtonClick, children }) {
  return (
    <section className="hero-section">
      <Navbar />
      <div className="hero-content">
        {title && (
          <h1>
            {title} <span>{highlight}</span>
          </h1>
        )}
        {subtitle && <p>{subtitle}</p>}

        {buttonText && (
          <div className="hero-buttons">
            <button className="cta-button" onClick={onButtonClick}>
              {buttonText}
            </button>
            {tagText && <span className="free-tag">{tagText}</span>}
          </div>
        )}

        {/* Optional custom children */}
        {children}
      </div>
    </section>
  );
}

export default HeroSection;
