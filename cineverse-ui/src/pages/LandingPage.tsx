import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

const stats = [
  { value: '500+', label: 'Movies' },
  { value: '50K+', label: 'Bookings' },
  { value: '4.9★', label: 'Avg Rating' },
  { value: '120+', label: 'Screens' },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
};

const LandingPage = () => {
  return (
    <div
      id="landing-page"
      className="relative min-h-[calc(100vh-72px)] flex flex-col overflow-hidden"
      style={{ background: 'var(--c-bg)' }}
    >
      {/* Background decoration */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radial glow — top right */}
        <div
          className="absolute -top-32 right-0 w-[700px] h-[700px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(245,197,24,0.18) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Radial glow — bottom left */}
        <div
          className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(46,196,182,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Film reel circles (decorative) */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${280 + i * 120}px`,
              height: `${280 + i * 120}px`,
              border: '1px solid rgba(255,255,255,0.03)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        {/* Diagonal grid lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                -45deg,
                rgba(255,255,255,0.05) 0px,
                rgba(255,255,255,0.05) 1px,
                transparent 1px,
                transparent 60px
              )
            `,
          }}
        />
      </div>

      {/* Hero Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20"
      >
        {/* Pill badge */}
        <motion.div variants={fadeUp}>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 tracking-widest uppercase"
            style={{
              background: 'rgba(245,197,24,0.1)',
              border: '1px solid rgba(245,197,24,0.25)',
              color: 'var(--c-gold)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-DEFAULT animate-pulse" style={{ background: 'var(--c-gold)' }} />
            Premium Cinema Booking
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-6 max-w-4xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Experience{' '}
          <br className="hidden sm:block" />
          Cinema,{' '}
          <span className="text-gold-shimmer italic">Refined.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-12"
          style={{ color: 'var(--c-muted)', fontWeight: 400 }}
        >
          Cineverse delivers a frictionless, premium ticket booking experience designed for true movie enthusiasts.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            to="/movies"
            id="hero-browse-btn"
            className="btn-primary text-base"
            style={{ padding: '15px 36px', borderRadius: '14px', fontSize: '0.95rem' }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            Browse Movies
          </Link>
          <Link
            to="/login"
            id="hero-signin-btn"
            className="btn-ghost text-base"
            style={{ padding: '15px 36px', borderRadius: '14px', fontSize: '0.95rem' }}
          >
            Sign In
          </Link>
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          variants={fadeUp}
          className="glass-card w-full max-w-2xl mx-auto px-6 py-5"
          style={{ borderRadius: '20px' }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x divide-white/5">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-1 px-4 first:pl-0 last:pr-0"
              >
                <span
                  className="text-2xl sm:text-3xl font-black"
                  style={{
                    background: 'linear-gradient(135deg, var(--c-gold), #fff8dc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.value}
                </span>
                <span className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--c-muted)' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 flex justify-center pb-8 animate-float"
        aria-hidden="true"
      >
        <div
          className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
          style={{ border: '2px solid rgba(255,255,255,0.12)' }}
        >
          <div
            className="w-1 h-2.5 rounded-full"
            style={{ background: 'var(--c-gold)', animation: 'glow-pulse 2s ease-in-out infinite' }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
