import React from "react";
import "./styles/style.css";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
      </Routes>
    </Router>
  );
}

export default App;

