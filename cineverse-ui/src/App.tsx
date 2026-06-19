import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MovieCatalog from './pages/MovieCatalog';
import BookingFlow from './components/booking/BookingFlow';

// Customer Pages
import MovieDetails from './pages/customer/MovieDetails';
import LocationSelection from './pages/customer/LocationSelection';
import TheatreSelection from './pages/customer/TheatreSelection';
import ShowtimeSelection from './pages/customer/ShowtimeSelection';
import BookingSummary from './pages/customer/BookingSummary';
import BookingConfirmation from './pages/customer/BookingConfirmation';
import UserProfile from './pages/customer/UserProfile';
import UserSettings from './pages/customer/UserSettings';
import BookingHistory from './pages/customer/BookingHistory';

// Theatre Pages
import OwnerDashboard from './pages/theatre/OwnerDashboard';
import ManageMovies from './pages/theatre/ManageMovies';
import ManageShows from './pages/theatre/ManageShows';
import ViewBookings from './pages/theatre/ViewBookings';
import ScreenManagement from './pages/theatre/ScreenManagement';
import SeatLayoutConfig from './pages/theatre/SeatLayoutConfig';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageTheatres from './pages/admin/ManageTheatres';
import TheatreRequests from './pages/admin/TheatreRequests';
import SystemReports from './pages/admin/SystemReports';

// Layout wrapper for pages that need Navbar
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Main layout with Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/movies" element={<MovieCatalog />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Customer Booking Flow */}
          <Route path="/location" element={<LocationSelection />} />
          <Route path="/theatres/:movieId" element={<TheatreSelection />} />
          <Route path="/shows/:theatreId" element={<ShowtimeSelection />} />
          <Route path="/book/:movieId" element={<BookingFlow />} />
          <Route path="/summary" element={<BookingSummary />} />
          <Route path="/confirmation" element={<BookingConfirmation />} />
          
          {/* Customer Profile */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/history" element={<BookingHistory />} />
          
          {/* Theatre Owner Module */}
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/movies" element={<ManageMovies />} />
          <Route path="/owner/shows" element={<ManageShows />} />
          <Route path="/owner/bookings" element={<ViewBookings />} />
          <Route path="/owner/screens" element={<ScreenManagement />} />
          <Route path="/owner/seats" element={<SeatLayoutConfig />} />

          {/* Admin Module */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/theatres" element={<ManageTheatres />} />
          <Route path="/admin/requests" element={<TheatreRequests />} />
          <Route path="/admin/reports" element={<SystemReports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
