import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SeatSelectionProps {
  numRequired: number;
  bookedSeats: string[];
  onConfirm: (seats: string[]) => void;
  submitting?: boolean;
}

const SeatSelection = ({ numRequired, bookedSeats, onConfirm, submitting = false }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // 5 rows × 8 columns = 40 seats: A1–E8
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : prev.length < numRequired
        ? [...prev, seat]
        : prev
    );
  };

  const getSeatState = (seat: string): 'booked' | 'selected' | 'available' => {
    if (bookedSeats.includes(seat)) return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  const seatStyles = {
    booked: {
      background: 'rgba(127,29,29,0.3)',
      border: '1px solid rgba(220,38,38,0.25)',
      color: 'rgba(220,38,38,0.35)',
      cursor: 'not-allowed',
    },
    selected: {
      background: 'linear-gradient(135deg, #f5c518, #b8960c)',
      border: '2px solid #f5c518',
      color: '#080810',
      cursor: 'pointer',
      boxShadow: '0 0 12px rgba(245,197,24,0.4)',
    },
    available: {
      background: 'var(--c-surface2)',
      border: '1px solid var(--c-border)',
      color: 'var(--c-muted)',
      cursor: 'pointer',
    },
  };

  const progressPercent = (selectedSeats.length / numRequired) * 100;

  return (
    <div
      className="glass-card p-7"
      id="seat-selection"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3
            className="text-xl font-black mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--c-text)' }}
          >
            Select Your Seats
          </h3>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
            Choose <span className="font-bold" style={{ color: 'var(--c-text)' }}>{numRequired}</span> seat{numRequired > 1 ? 's' : ''} from the grid below
          </p>
        </div>

        {/* Progress pill */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold shrink-0"
          style={{
            background: selectedSeats.length === numRequired
              ? 'rgba(46,196,182,0.12)'
              : 'rgba(245,197,24,0.1)',
            border: `1px solid ${selectedSeats.length === numRequired ? 'rgba(46,196,182,0.35)' : 'rgba(245,197,24,0.25)'}`,
            color: selectedSeats.length === numRequired ? '#2ec4b6' : 'var(--c-gold)',
          }}
        >
          {selectedSeats.length}/{numRequired}
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-1 rounded-full mb-7 overflow-hidden"
        style={{ background: 'var(--c-surface3)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: selectedSeats.length === numRequired
              ? 'linear-gradient(90deg, #2ec4b6, #1a9e94)'
              : 'linear-gradient(90deg, #f5c518, #b8960c)',
          }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      </div>

      {/* Screen indicator */}
      <div className="relative mb-8">
        <div
          className="w-4/5 mx-auto h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(245,197,24,0.5) 20%, rgba(245,197,24,0.7) 50%, rgba(245,197,24,0.5) 80%, transparent)',
          }}
        />
        <div
          className="w-4/5 mx-auto h-6 rounded-b-3xl opacity-30 -mt-px"
          style={{
            background: 'linear-gradient(to bottom, rgba(245,197,24,0.2), transparent)',
            filter: 'blur(8px)',
          }}
        />
        <p
          className="text-center text-xs font-semibold tracking-[0.25em] uppercase mt-1"
          style={{ color: 'var(--c-muted-2)' }}
        >
          SCREEN
        </p>
      </div>

      {/* Seat Grid */}
      <div className="space-y-3 mb-7">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span
              className="text-xs font-bold w-5 text-center shrink-0"
              style={{ color: 'var(--c-muted-2)', fontFamily: "'JetBrains Mono', monospace" }}
            >
              {row}
            </span>

            {/* Centre aisle gap at middle */}
            <div className="flex gap-1.5 flex-1">
              {cols.map((col, colIdx) => {
                const seat = `${row}${col}`;
                const state = getSeatState(seat);
                return (
                  <React.Fragment key={seat}>
                    {colIdx === 4 && <div className="w-3 shrink-0" />}
                    <motion.button
                      whileHover={state !== 'booked' ? { scale: 1.12, y: -2 } : {}}
                      whileTap={state !== 'booked' ? { scale: 0.92 } : {}}
                      onClick={() => toggleSeat(seat)}
                      className="w-9 h-9 rounded-lg text-xs font-bold flex-1 max-w-[36px] transition-all duration-200"
                      style={seatStyles[state] as React.CSSProperties}
                      title={state === 'booked' ? 'Already booked' : seat}
                      disabled={state === 'booked'}
                    >
                      {col}
                    </motion.button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-7 flex-wrap">
        {[
          { label: 'Available', style: { background: 'var(--c-surface2)', border: '1px solid var(--c-border)' } },
          { label: 'Selected', style: { background: 'linear-gradient(135deg, #f5c518, #b8960c)', border: '1px solid #f5c518' } },
          { label: 'Taken', style: { background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(220,38,38,0.25)' } },
        ].map(({ label, style }) => (
          <div key={label} className="flex items-center gap-2 text-xs" style={{ color: 'var(--c-muted)' }}>
            <div
              className="w-4 h-4 rounded"
              style={style as React.CSSProperties}
            />
            {label}
          </div>
        ))}
      </div>

      {/* Confirm Button */}
      <AnimatePresence>
        <motion.button
          layout
          onClick={() => onConfirm(selectedSeats)}
          disabled={selectedSeats.length !== numRequired || submitting}
          className="btn-success w-full"
          style={{ padding: '14px', borderRadius: '14px', fontSize: '0.95rem' }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
              </svg>
              Confirming Reservation…
            </span>
          ) : (
            `Confirm ${selectedSeats.length > 0 ? selectedSeats.length : numRequired} Seat${selectedSeats.length !== 1 ? 's' : ''} →`
          )}
        </motion.button>
      </AnimatePresence>
    </div>
  );
};

export default SeatSelection;
