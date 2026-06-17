import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import SeatSelection from './SeatSelection';
import { getMovieById, createBooking, getBookingsForMovie, isAuthenticated, type Movie } from '../../services/api';

const steps = [
  { id: 1, label: 'Tickets', icon: '🎟' },
  { id: 2, label: 'Seats', icon: '💺' },
  { id: 3, label: 'Confirmed', icon: '✓' },
];

const BookingFlow = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [numPeople, setNumPeople] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<number | null>(null);

  // ✅ Protect route — redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
    if (!movieId) { navigate('/movies', { replace: true }); return; }

    const id = Number(movieId);
    Promise.all([
      getMovieById(id),
      getBookingsForMovie(id),
    ])
      .then(([movieRes, bookingsRes]) => {
        setMovie(movieRes.data);
        const alreadyBooked = bookingsRes.data.flatMap((b) =>
          b.seats.split(',').map((s) => s.trim())
        );
        setBookedSeats(alreadyBooked);
      })
      .catch(() => setError('Failed to load movie details. Please try again.'))
      .finally(() => setLoading(false));
  }, [movieId, navigate]);

  const handleSeatConfirm = async (seats: string[]) => {
    if (seats.length !== numPeople) {
      alert(`Please select exactly ${numPeople} seat${numPeople > 1 ? 's' : ''}.`);
      return;
    }
    setSelectedSeats(seats);
    setSubmitting(true);
    setError(null);
    try {
      const res = await createBooking(Number(movieId), seats);
      setConfirmedBookingId(res.data.id);
      setStep(3);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        'Booking failed. Some seats may already be taken.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4"
            style={{
              border: '3px solid rgba(245,197,24,0.2)',
              borderTopColor: 'var(--c-gold)',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>Loading booking details…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="booking-flow"
      className="min-h-[calc(100vh-72px)] py-10 px-6"
      style={{ background: 'var(--c-bg)' }}
    >
      <div className="max-w-2xl mx-auto">

        {/* Movie header card */}
        {movie && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-widest mb-1 font-semibold" style={{ color: 'var(--c-muted)' }}>
                  Now Booking
                </p>
                <h1
                  className="text-2xl font-black leading-tight truncate"
                  style={{ fontFamily: "'Playfair Display', serif", color: 'var(--c-text)' }}
                >
                  {movie.title}
                </h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className="badge text-xs"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      color: 'var(--c-muted)',
                      border: '1px solid var(--c-border)',
                    }}
                  >
                    {movie.genre}
                  </span>
                  {movie.releaseYear && (
                    <span className="text-xs" style={{ color: 'var(--c-muted-2)' }}>
                      {movie.releaseYear}
                    </span>
                  )}
                  {movie.durationMinutes && (
                    <span className="text-xs" style={{ color: 'var(--c-muted-2)' }}>
                      • {movie.durationMinutes} min
                    </span>
                  )}
                </div>
              </div>
              <div
                className="flex flex-col items-center justify-center w-16 h-16 rounded-xl shrink-0"
                style={{
                  background: 'rgba(245,197,24,0.1)',
                  border: '1px solid rgba(245,197,24,0.25)',
                }}
              >
                <span className="text-xs font-semibold mb-0.5" style={{ color: 'var(--c-gold)' }}>★</span>
                <span className="text-xl font-black" style={{ color: 'var(--c-gold)' }}>
                  {movie.rating?.toFixed(1) ?? 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center mb-10"
        >
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-400"
                  style={{
                    background: step > s.id
                      ? 'linear-gradient(135deg, #f5c518, #b8960c)'
                      : step === s.id
                      ? 'rgba(245,197,24,0.15)'
                      : 'var(--c-surface2)',
                    border: step >= s.id
                      ? '2px solid var(--c-gold)'
                      : '2px solid var(--c-border)',
                    color: step > s.id ? '#080810' : step === s.id ? 'var(--c-gold)' : 'var(--c-muted)',
                    boxShadow: step === s.id ? '0 0 16px rgba(245,197,24,0.25)' : 'none',
                  }}
                >
                  {step > s.id ? '✓' : s.icon}
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: step >= s.id ? 'var(--c-gold)' : 'var(--c-muted-2)' }}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="h-px flex-1 mx-3 mb-5 transition-all duration-500"
                  style={{
                    background: step > s.id
                      ? 'linear-gradient(90deg, var(--c-gold), rgba(245,197,24,0.3))'
                      : 'var(--c-border)',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="err"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl text-sm flex items-start gap-3 mb-6"
              style={{
                background: 'rgba(230,57,70,0.1)',
                border: '1px solid rgba(230,57,70,0.25)',
                color: '#fca5a5',
              }}
            >
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1 — Number of tickets */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-card p-8"
          >
            <h2
              className="text-2xl font-black mb-1"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--c-text)' }}
            >
              How many tickets?
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--c-muted)' }}>
              Select the number of seats to reserve
            </p>

            {/* Ticket counter */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <button
                onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
                className="w-14 h-14 rounded-full font-black text-2xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: 'var(--c-surface2)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-text)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,197,24,0.4)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--c-gold)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-border)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--c-text)';
                }}
              >
                −
              </button>

              <div className="text-center">
                <motion.span
                  key={numPeople}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl font-black block"
                  style={{
                    background: 'linear-gradient(135deg, var(--c-gold), #fff8dc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {numPeople}
                </motion.span>
                <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--c-muted)' }}>
                  {numPeople === 1 ? 'ticket' : 'tickets'}
                </span>
              </div>

              <button
                onClick={() => setNumPeople(Math.min(10, numPeople + 1))}
                className="w-14 h-14 rounded-full font-black text-2xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: 'var(--c-surface2)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-text)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,197,24,0.4)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--c-gold)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-border)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--c-text)';
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              className="btn-primary w-full"
              style={{ padding: '14px', borderRadius: '14px', fontSize: '0.95rem' }}
            >
              Next — Choose Seats →
            </button>
          </motion.div>
        )}

        {/* Step 2 — Seat Selection */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <SeatSelection
              numRequired={numPeople}
              bookedSeats={bookedSeats}
              onConfirm={handleSeatConfirm}
              submitting={submitting}
            />
            <button
              onClick={() => setStep(1)}
              className="mt-4 w-full py-3 text-sm font-medium transition-colors"
              style={{
                color: 'var(--c-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
            >
              ← Back to ticket count
            </button>
          </motion.div>
        )}

        {/* Step 3 — Confirmation */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="glass-card p-10 text-center"
          >
            {/* Success icon */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl"
              style={{
                background: 'rgba(46,196,182,0.12)',
                border: '2px solid rgba(46,196,182,0.4)',
                boxShadow: '0 0 30px rgba(46,196,182,0.2)',
              }}
            >
              🎉
            </div>

            <h2
              className="text-3xl font-black mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: '#2ec4b6' }}
            >
              Booking Confirmed!
            </h2>

            {confirmedBookingId && (
              <p
                className="text-xs font-mono mb-6 px-4 py-2 rounded-lg inline-block"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-muted)',
                  letterSpacing: '0.1em',
                }}
              >
                BOOKING #{String(confirmedBookingId).padStart(6, '0')}
              </p>
            )}

            <div
              className="rounded-xl p-5 mb-6 text-left space-y-3"
              style={{ background: 'var(--c-surface2)', border: '1px solid var(--c-border)' }}
            >
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--c-muted)' }}>Movie</span>
                <span className="font-semibold" style={{ color: 'var(--c-text)' }}>{movie?.title}</span>
              </div>
              <div className="divider" />
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--c-muted)' }}>Tickets</span>
                <span className="font-semibold" style={{ color: 'var(--c-text)' }}>
                  {numPeople} {numPeople === 1 ? 'ticket' : 'tickets'}
                </span>
              </div>
              <div className="divider" />
              <div className="flex items-start justify-between text-sm">
                <span style={{ color: 'var(--c-muted)' }}>Seats</span>
                <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="px-2 py-0.5 rounded font-mono text-xs font-bold"
                      style={{
                        background: 'rgba(46,196,182,0.15)',
                        border: '1px solid rgba(46,196,182,0.3)',
                        color: '#2ec4b6',
                      }}
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/movies')}
              className="btn-primary w-full"
              style={{ padding: '14px', borderRadius: '14px', fontSize: '0.95rem' }}
            >
              Browse More Movies
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
