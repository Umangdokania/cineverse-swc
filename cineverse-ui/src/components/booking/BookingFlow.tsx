import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Ticket, CheckCircle2 } from 'lucide-react';
import { getMovieById, getBookedSeats, isAuthenticated } from '../../services/api';
import SeatSelection from './SeatSelection';

const BookingFlow = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<any>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [ticketCount, setTicketCount] = useState(2);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  // Today's date as the show date
  const showDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (movieId) {
      // Fetch movie details and booked seats in parallel
      Promise.all([
        getMovieById(Number(movieId)),
        getBookedSeats(Number(movieId), showDate)
      ])
        .then(([movieRes, seatsRes]) => {
          setMovie(movieRes.data);
          setBookedSeats(seatsRes.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [movieId, navigate, showDate]);

  const handleSeatConfirm = (seats: string[]) => {
    setSelectedSeats(seats);
    // Navigate to summary/checkout page with booking state
    navigate('/summary', { state: { movie, ticketCount, selectedSeats: seats, showDate } });
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-medium">Loading booking flow...</div>;
  if (!movie) return <div className="p-12 text-center text-slate-500 font-medium">Movie not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-slate-200 pb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{movie.title}</h1>
          <p className="text-sm text-slate-500">Cineverse Premium • Today, 7:30 PM</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-lg mx-auto mb-10 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 -z-10 rounded-full transition-all duration-500" 
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />

        {[
          { num: 1, label: 'Tickets' },
          { num: 2, label: 'Seats' },
          { num: 3, label: 'Payment' }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center bg-slate-50 px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors duration-300 ${
              step >= s.num ? 'bg-brand-600 text-white shadow-md' : 'bg-white border-2 border-slate-300 text-slate-400'
            }`}>
              {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
            </div>
            <span className={`text-xs font-medium ${step >= s.num ? 'text-brand-700' : 'text-slate-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Ticket Quantity */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-card border border-slate-200 p-8 text-center max-w-md mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-6">How many tickets?</h2>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            <button 
              onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
              className="w-12 h-12 rounded-full border-2 border-slate-200 text-slate-600 flex items-center justify-center text-xl hover:bg-slate-50 hover:border-slate-300 transition"
            >
              -
            </button>
            <span className="text-4xl font-bold text-brand-600 w-16">{ticketCount}</span>
            <button 
              onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
              className="w-12 h-12 rounded-full border-2 border-slate-200 text-slate-600 flex items-center justify-center text-xl hover:bg-slate-50 hover:border-slate-300 transition"
            >
              +
            </button>
          </div>

          <button onClick={() => setStep(2)} className="w-full btn-primary py-3">
            Select Seats
          </button>
        </div>
      )}

      {/* Step 2: Seat Selection — uses real booked seats from API */}
      {step === 2 && (
        <SeatSelection
          movieId={Number(movieId)}
          showDate={showDate}
          numRequired={ticketCount}
          bookedSeats={bookedSeats}
          onConfirm={handleSeatConfirm}
        />
      )}

    </div>
  );
};

export default BookingFlow;
