import React from "react";
import "../styles/style.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";


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
            {onButtonClick ? (
          <button className="cta-button" onClick={onButtonClick}>
            {buttonText}
          </button>
        ) : (
          <Link to="/create" className="cta-button">
            {buttonText}
          </Link>
        )}

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
