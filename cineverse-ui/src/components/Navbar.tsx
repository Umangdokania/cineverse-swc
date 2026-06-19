import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, User, Menu, ChevronDown, Ticket, Settings, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <nav className="glass-panel sticky top-0 z-50 border-b-0 border-x-0 border-t-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo & Search */}
            <div className="flex items-center flex-1">
              <Link to="/" className="flex items-center gap-2 mr-8 group">
                <Ticket className="h-7 w-7 text-brand-500 group-hover:text-brand-400 transition-colors" />
                <span className="text-2xl font-display font-bold tracking-tight text-white group-hover:text-brand-100 transition-colors">
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
                  className="w-full bg-surface-dark/50 border border-slate-700/50 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 focus:bg-surface-dark transition-all shadow-inner placeholder-slate-500"
                />
              </form>
            </div>

            {/* Right Actions */}
            <div className="hidden sm:flex items-center gap-6">
              <button 
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                <MapPin className="h-4 w-4 text-brand-500" />
                {selectedCity}
                <ChevronDown className="h-4 w-4" />
              </button>

              {authed ? (
                <div className="relative border-l border-slate-700 pl-6" ref={dropdownRef}>
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/50 py-1.5 px-3 rounded-full transition-all border border-transparent hover:border-slate-700"
                  >
                    <div className="bg-brand-500/20 text-brand-400 border border-brand-500/30 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {userName?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-medium text-slate-200">{userName}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface-dark rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-fade-in">
                      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                        <p className="text-sm font-medium text-white truncate">Hi, {userName}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                          <User className="h-4 w-4 text-brand-500" /> My Profile
                        </Link>
                        <Link to="/history" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                          <Ticket className="h-4 w-4 text-brand-500" /> Your Bookings
                        </Link>
                        <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                          <Settings className="h-4 w-4 text-brand-500" /> Settings
                        </Link>
                      </div>
                      <div className="p-2 border-t border-slate-800">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary text-sm shadow-brand-500/30"
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
        <div className="hidden sm:block border-t border-white/5 bg-cinema-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-12 gap-8 text-sm text-slate-300">
              <Link to="/movies" className="hover:text-brand-400 font-medium transition-colors">Movies</Link>
              <Link to="#" className="hover:text-brand-400 transition-colors">Events</Link>
              <Link to="#" className="hover:text-brand-400 transition-colors">Plays</Link>
              <Link to="#" className="hover:text-brand-400 transition-colors">Sports</Link>
              <Link to="#" className="hover:text-brand-400 transition-colors">Activities</Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden bg-surface-dark border-t border-slate-800 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-800">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for Movies..." 
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md py-2 pl-10 pr-4 text-sm text-white focus:outline-none"
                  />
                </form>
              </div>
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link to="/movies" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Movies</Link>
                
                {authed ? (
                  <>
                    <Link to="/history" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Your Bookings</Link>
                    <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">My Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="block px-3 py-2 mt-4 rounded-md text-base font-medium text-white bg-brand-600 text-center mx-2">
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Location Modal */}
      <AnimatePresence>
        {locationModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setLocationModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-dark rounded-2xl shadow-2xl max-w-2xl w-full relative z-10 overflow-hidden flex flex-col max-h-[80vh] border border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-800">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-brand-500" /> Select your Location
                </h2>
                <button onClick={() => setLocationModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        selectedCity === city 
                          ? 'border-brand-500 bg-brand-500/10 text-brand-400 shadow-[0_0_15px_rgba(20,184,166,0.15)] scale-105' 
                          : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
