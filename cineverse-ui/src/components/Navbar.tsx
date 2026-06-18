import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, User, Menu, ChevronDown, Ticket, Settings, LogOut, X } from 'lucide-react';
import { isAuthenticated, getAuthName, clearAuthData } from '../services/api';

const CITIES = ['Mumbai', 'Delhi-NCR', 'Bengaluru', 'Hyderabad', 'Chandigarh', 'Chennai', 'Pune', 'Kolkata', 'Kochi'];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authed, setAuthed] = useState(isAuthenticated());
  const [userName, setUserName] = useState(getAuthName());
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('userCity') || 'Mumbai');
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAuthed(isAuthenticated());
    setUserName(getAuthName());
    setMobileOpen(false);
    setProfileDropdownOpen(false);
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setAuthed(false);
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem('userCity', city);
    setLocationModalOpen(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo & Search */}
            <div className="flex items-center flex-1">
              <Link to="/" className="flex items-center gap-2 mr-8">
                <Ticket className="h-6 w-6 text-brand-600" />
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Cineverse
                </span>
              </Link>

              <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-lg items-center relative">
                <Search className="h-5 w-5 text-slate-400 absolute left-3" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Movies, Events, Plays, Sports and Activities" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </form>
            </div>

            {/* Right Actions */}
            <div className="hidden sm:flex items-center gap-6">
              <button 
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
              >
                <MapPin className="h-4 w-4" />
                {selectedCity}
                <ChevronDown className="h-4 w-4" />
              </button>

              {authed ? (
                <div className="relative border-l border-slate-200 pl-6" ref={dropdownRef}>
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 py-1 px-2 rounded-md transition"
                  >
                    <div className="bg-brand-100 text-brand-700 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {userName?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{userName}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-500 transition ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                      <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <p className="text-sm font-medium text-slate-900 truncate">Hi, {userName}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition">
                          <User className="h-4 w-4" /> My Profile
                        </Link>
                        <Link to="/history" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition">
                          <Ticket className="h-4 w-4" /> Your Bookings
                        </Link>
                        <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition">
                          <Settings className="h-4 w-4" /> Settings
                        </Link>
                      </div>
                      <div className="p-2 border-t border-slate-100">
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary text-sm"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden gap-4">
              <button onClick={() => setLocationModalOpen(true)} className="text-slate-600 text-sm font-medium flex items-center gap-1">
                {selectedCity} <ChevronDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 -mr-2"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Nav for Categories (Desktop) */}
        <div className="hidden sm:block border-t border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-10 gap-6 text-sm text-slate-600">
              <Link to="/movies" className="hover:text-brand-600 font-medium">Movies</Link>
              <Link to="#" className="hover:text-brand-600">Events</Link>
              <Link to="#" className="hover:text-brand-600">Plays</Link>
              <Link to="#" className="hover:text-brand-600">Sports</Link>
              <Link to="#" className="hover:text-brand-600">Activities</Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="sm:hidden bg-white border-t border-slate-200">
            <div className="p-4 border-b border-slate-100">
              <form onSubmit={handleSearch} className="relative">
                <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Movies..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-10 pr-4 text-sm"
                />
              </form>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/movies" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-brand-50">Movies</Link>
              
              {authed ? (
                <>
                  <Link to="/history" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-brand-50">Your Bookings</Link>
                  <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-brand-50">My Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="block px-3 py-2 mt-4 rounded-md text-base font-medium text-white bg-brand-600 text-center mx-2">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Location Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setLocationModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full relative z-10 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-600" /> Select your Location
              </h2>
              <button onClick={() => setLocationModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CITIES.map(city => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition ${
                      selectedCity === city 
                        ? 'border-brand-600 bg-brand-50 text-brand-700' 
                        : 'border-slate-200 text-slate-600 hover:border-brand-200 hover:bg-slate-50'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
