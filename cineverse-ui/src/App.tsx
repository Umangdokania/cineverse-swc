import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import MovieCatalog from './pages/MovieCatalog';
import BookingFlow from './components/booking/BookingFlow';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cinema">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/movies" element={<MovieCatalog />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* BookingFlow handles its own auth guard internally */}
          <Route path="/book/:movieId" element={<BookingFlow />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
