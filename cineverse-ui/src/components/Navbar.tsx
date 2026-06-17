import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getAuthName, clearAuthData } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authed, setAuthed] = useState(isAuthenticated());
  const [userName, setUserName] = useState(getAuthName());
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
    setUserName(getAuthName());
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setAuthed(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link
      to={to}
      className="relative text-sm font-medium transition-colors duration-200 group"
      style={{ color: isActive(to) ? 'var(--c-gold)' : 'var(--c-muted)' }}
    >
      {label}
      <span
        className="absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300"
        style={{
          background: 'var(--c-gold)',
          width: isActive(to) ? '100%' : '0%',
        }}
      />
      <style>{`
        a:hover > span { width: 100%; }
      `}</style>
    </Link>
  );

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(8, 8, 16, 0.92)'
            : 'rgba(8, 8, 16, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: scrolled ? 'rgba(255,255,255,0.08)' : 'transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" id="nav-logo">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
              style={{
                background: 'linear-gradient(135deg, #f5c518, #b8960c)',
                color: '#080810',
              }}
            >
              C
            </div>
            <span
              className="text-xl font-black tracking-tight text-gold-shimmer"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}
            >
              CINEVERSE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-8">
            <NavLink to="/" label="Home" />
            <NavLink to="/movies" label="Movies" />
          </div>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-4">
            {authed ? (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                {userName && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(245,197,24,0.2), rgba(245,197,24,0.05))',
                        border: '1px solid rgba(245,197,24,0.3)',
                        color: 'var(--c-gold)',
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm" style={{ color: 'var(--c-muted)' }}>
                      Hi,{' '}
                      <span className="font-semibold" style={{ color: 'var(--c-text)' }}>
                        {userName}
                      </span>
                    </span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  id="nav-signout"
                  className="btn-ghost text-sm py-2 px-4"
                  style={{ padding: '8px 16px', borderRadius: '10px' }}
                >
                  Sign Out
                </button>
              </motion.div>
            ) : (
              <Link
                to="/login"
                id="nav-signin"
                className="btn-primary"
                style={{ padding: '9px 22px', borderRadius: '10px', fontSize: '0.85rem' }}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="sm:hidden flex flex-col gap-1.5 p-2 rounded-lg transition"
            style={{ background: mobileOpen ? 'rgba(255,255,255,0.07)' : 'transparent' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block h-0.5 w-5 rounded-full transition-all duration-300"
              style={{
                background: 'var(--c-text)',
                transform: mobileOpen ? 'rotate(45deg) translateY(6px)' : 'none',
              }}
            />
            <span
              className="block h-0.5 w-5 rounded-full transition-all duration-300"
              style={{
                background: 'var(--c-text)',
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-0.5 w-5 rounded-full transition-all duration-300"
              style={{
                background: 'var(--c-text)',
                transform: mobileOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
              }}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden overflow-hidden"
              style={{ borderTop: '1px solid var(--c-border)' }}
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                <Link to="/" className="text-sm font-medium" style={{ color: isActive('/') ? 'var(--c-gold)' : 'var(--c-muted)' }}>Home</Link>
                <Link to="/movies" className="text-sm font-medium" style={{ color: isActive('/movies') ? 'var(--c-gold)' : 'var(--c-muted)' }}>Movies</Link>
                <div className="divider" />
                {authed ? (
                  <button onClick={handleLogout} className="btn-ghost w-full" style={{ padding: '10px' }}>
                    Sign Out
                  </button>
                ) : (
                  <Link to="/login" className="btn-primary w-full text-center" style={{ padding: '10px', borderRadius: '10px' }}>
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div style={{ height: '72px' }} />
    </>
  );
};

export default Navbar;
