import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import UserPreferences from "./components/UserPreferences";
import TutorialSearch from "./components/TutorialSearch";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/preferences" element={<UserPreferences />} />
        <Route path="/search" element={<TutorialSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
