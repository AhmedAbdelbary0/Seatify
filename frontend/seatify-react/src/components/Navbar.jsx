import React, { useState } from "react";
import "../styles/style.css";
import Ellipse3 from "../styles/Ellipse3.png";
import Person from "../styles/person.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar seatify-navbar">
      <div className="nav-left">
        <div className="logo">Seatify</div>
        <div className="nav-links-left">
          <a href="#">FAQ</a>
          <a href="#">Help</a>
        </div>
      </div>

      <div className="nav-right">
        <a href="#" className="create-btn">
          Create
        </a>

        <div className="user-menu-container">
          <div className="user-icon" onClick={() => setMenuOpen(!menuOpen)}>
            <img src={Ellipse3} alt="user background" className="user-bg" />
            <img src={Person} alt="user icon" className="user-img" />
          </div>

          {menuOpen && (
            <div className="dropdown-menu">
              <a href="#">My Bookings</a>
              <a href="#">Help</a>
              <a href="#" className="signout">
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;