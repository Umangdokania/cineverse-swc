import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { register, saveAuthData, login } from '../services/api';

const getPasswordStrength = (pw: string): { level: number; label: string; color: string } => {
  if (pw.length === 0) return { level: 0, label: '', color: 'transparent' };
  if (pw.length < 6)  return { level: 1, label: 'Too short', color: '#e63946' };
  if (pw.length < 8)  return { level: 2, label: 'Weak', color: '#f97316' };
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) return { level: 4, label: 'Strong', color: '#2ec4b6' };
  return { level: 3, label: 'Fair', color: '#f5c518' };
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const pwStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      const loginRes = await login(email, password);
      saveAuthData(loginRes.data);
      navigate('/movies');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        'Registration failed. Email may already be in use.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="register-page"
      className="min-h-[calc(100vh-72px)] flex"
      style={{ background: 'var(--c-bg)' }}
    >
      {/* ── Left decorative panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-14 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0f0f1a 0%, #080810 60%)',
          borderRight: '1px solid var(--c-border)',
        }}
      >
        <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(46,196,182,0.12) 0%, transparent 70%)' }} />
        <div aria-hidden className="absolute bottom-10 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,197,24,0.09) 0%, transparent 70%)' }} />

        {/* Brand */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #f5c518, #b8960c)', color: '#080810' }}>
              C
            </div>
            <span className="text-xl font-black text-gold-shimmer" style={{ letterSpacing: '-0.03em' }}>
              CINEVERSE
            </span>
          </Link>
        </div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10"
        >
          <div className="text-5xl mb-8 animate-float">🎟</div>
          <h2
            className="text-3xl font-black mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--c-text)' }}
          >
            Join the{' '}
            <span className="text-gold-shimmer italic">Inner Circle</span>
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            Get access to early screenings, exclusive booking slots, and a personalized cinema experience tailored for you.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-3">
            {[
              '⚡ Instant seat confirmation',
              '🎬 Access to all current releases',
              '🔔 Priority booking alerts',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 text-sm"
                style={{ color: 'var(--c-muted)' }}
              >
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom indicator */}
        <div className="relative z-10 flex gap-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full"
              style={{
                background: i < 3 ? 'var(--c-gold)' : 'var(--c-border)',
                opacity: i < 3 ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #f5c518, #b8960c)', color: '#080810' }}>
              C
            </div>
            <span className="text-xl font-black text-gold-shimmer">CINEVERSE</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-3xl font-black mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--c-text)' }}
            >
              Create Account
            </h1>
            <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
              Start your premium cinema experience today
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="p-4 rounded-xl text-sm flex items-start gap-3"
                style={{
                  background: 'rgba(230,57,70,0.1)',
                  border: '1px solid rgba(230,57,70,0.25)',
                  color: '#fca5a5',
                }}
              >
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="input-group">
              <label htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                required
                className="input-field"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                required
                className="input-field"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ position: 'relative' }}>
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={password}
                required
                minLength={6}
                className="input-field"
                style={{ paddingRight: '44px' }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 transition-colors"
                style={{ bottom: '14px', color: 'var(--c-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>

              {/* Password strength bar */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2"
                >
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          background: level <= pwStrength.level ? pwStrength.color : 'var(--c-border)',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: pwStrength.color }}>
                    {pwStrength.label}
                  </p>
                </motion.div>
              )}
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              style={{ padding: '14px', borderRadius: '12px', fontSize: '0.95rem', marginTop: '4px' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                  </svg>
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="divider flex-1" />
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--c-muted-2)' }}>or</span>
            <div className="divider flex-1" />
          </div>

          {/* Footer */}
          <p className="text-center text-sm" style={{ color: 'var(--c-muted)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold transition-colors"
              style={{ color: 'var(--c-gold)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff8dc')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-gold)')}
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
