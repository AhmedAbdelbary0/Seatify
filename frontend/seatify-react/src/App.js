import React from "react";
import "./styles/style.css";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyBookingsPage from "./pages/MyBookingsPage";
import JoinEventPage from "./pages/JoinEventPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/join/:eventId" element={<JoinEventPage />} />

      </Routes>
    </Router>
  );
}

export default App;

