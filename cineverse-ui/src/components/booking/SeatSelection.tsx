import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Radio } from 'lucide-react';
import { getBookedSeats } from '../../services/api';

interface SeatSelectionProps {
  movieId: number;
  showDate: string;
  numRequired: number;
  bookedSeats: string[];
  onConfirm: (seats: string[]) => void;
  submitting?: boolean;
}

const POLL_INTERVAL = 5000; // 5 seconds

const SeatSelection = ({ movieId, showDate, numRequired, bookedSeats: initialBookedSeats, onConfirm, submitting = false }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>(initialBookedSeats);
  const [seatJustTaken, setSeatJustTaken] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);
  const prevBookedRef = useRef<Set<string>>(new Set(initialBookedSeats));

  // 5 rows × 8 columns = 40 seats: A1–E8
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  // Poll for real-time seat updates
  const fetchBookedSeats = useCallback(async () => {
    try {
      const res = await getBookedSeats(movieId, showDate);
      const newBooked = res.data;
      const newBookedSet = new Set(newBooked);

      // Check if any of the user's selected seats were taken by someone else
      setSelectedSeats(prev => {
        const conflicting = prev.filter(s => newBookedSet.has(s));
        if (conflicting.length > 0) {
          // Show notification for the first conflicting seat
          setSeatJustTaken(conflicting.join(', '));
          setTimeout(() => setSeatJustTaken(null), 4000);
          // Remove conflicting seats from selection
          return prev.filter(s => !newBookedSet.has(s));
        }
        return prev;
      });

      setBookedSeats(newBooked);
      prevBookedRef.current = newBookedSet;
      setIsLive(true);
    } catch {
      setIsLive(false);
    }
  }, [movieId, showDate]);

  // Set up polling interval
  useEffect(() => {
    const interval = setInterval(fetchBookedSeats, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchBookedSeats]);

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
    booked: 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed opacity-50',
    selected: 'bg-brand-500 border-brand-400 text-white cursor-pointer shadow-[0_0_15px_rgba(20,184,166,0.6)] transform scale-110 z-10',
    available: 'bg-cinema-card border-slate-700 text-slate-400 cursor-pointer hover:border-brand-500 hover:text-brand-400 hover:bg-brand-500/10',
  };

  return (
    <div className="glass-panel rounded-2xl shadow-2xl border border-slate-800 p-8 max-w-2xl mx-auto relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-brand-500/10 blur-[80px] pointer-events-none" />

      {/* Header Info */}
      <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-5 relative z-10">
        <div>
          <h3 className="text-2xl font-display font-bold text-white">Select Seats</h3>
          <p className="text-sm font-medium text-brand-400 mt-1">Choose {numRequired} seat{numRequired > 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Live indicator */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isLive 
              ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30 shadow-[0_0_10px_rgba(20,184,166,0.2)]' 
              : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
          }`}>
            <Radio className={`h-3 w-3 ${isLive ? 'text-brand-400 animate-pulse' : 'text-amber-500'}`} />
            {isLive ? 'LIVE' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Seat Taken Alert */}
      {seatJustTaken && (
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm font-medium flex items-center gap-3 animate-pulse backdrop-blur-md relative z-10">
          <span className="text-xl">⚠️</span> 
          <span>Seat{seatJustTaken.includes(',') ? 's' : ''} <strong className="text-amber-300">{seatJustTaken}</strong> {seatJustTaken.includes(',') ? 'were' : 'was'} just booked by another user!</span>
        </div>
      )}

      {/* Screen Indicator */}
      <div className="mb-16 text-center relative z-10">
        <div className="screen-curve" />
        <p className="text-xs font-bold tracking-[0.3em] text-slate-500 uppercase flex items-center justify-center gap-2 mt-[-20px]">
           Screen
        </p>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-5 mb-12 max-w-lg mx-auto relative z-10">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-4">
            <span className="w-8 text-center text-sm font-bold text-slate-500 shrink-0">{row}</span>
            <div className="flex gap-3 flex-1 justify-center">
              {cols.map((col, colIdx) => {
                const seat = `${row}${col}`;
                const state = getSeatState(seat);
                
                return (
                  <React.Fragment key={seat}>
                    {/* Aisle gap */}
                    {colIdx === 4 && <div className="w-8 shrink-0" />}
                    
                    <button
                      onClick={() => toggleSeat(seat)}
                      disabled={state === 'booked'}
                      className={`w-10 h-10 rounded-t-xl rounded-b-md border text-sm font-bold transition-all duration-300 flex items-center justify-center ${seatStyles[state]}`}
                    >
                      {state === 'selected' ? col : ''}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs font-medium mb-10 justify-center relative z-10 uppercase tracking-wider text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t border border-slate-700 bg-cinema-card"></div> Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t border border-brand-400 bg-brand-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]"></div> Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t border border-slate-700 bg-slate-800 opacity-50"></div> Taken
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-between items-center bg-slate-900/80 backdrop-blur-md p-5 rounded-xl border border-slate-800 relative z-10">
        <div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Selected Seats</p>
          <p className="font-display font-bold text-white text-xl">
            {selectedSeats.length > 0 ? (
              <span className="text-brand-400">{selectedSeats.join(', ')}</span>
            ) : (
              <span className="text-slate-600">-</span>
            )}
          </p>
        </div>
        <button
          onClick={() => onConfirm(selectedSeats)}
          disabled={selectedSeats.length !== numRequired || submitting}
          className="btn-primary py-3 px-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none font-bold tracking-wide"
        >
          {submitting ? 'Confirming...' : `Confirm Seats`}
        </button>
      </div>

    </div>
  );
};

export default SeatSelection;
