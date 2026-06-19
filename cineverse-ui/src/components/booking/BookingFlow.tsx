import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Ticket, CheckCircle2, Calendar, Clock } from 'lucide-react';
import { getMovieById, getBookedSeats, isAuthenticated } from '../../services/api';
import SeatSelection from './SeatSelection';

const BookingFlow = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<any>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // Added step 2 for Date/Time
  const [ticketCount, setTicketCount] = useState(2);
  const [showDate, setShowDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showTime, setShowTime] = useState<string>('7:30 PM');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  // Calculate some upcoming dates for selection
  const upcomingDates = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const availableTimes = ['10:00 AM', '1:15 PM', '4:30 PM', '7:30 PM', '10:45 PM'];

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (movieId) {
      setLoading(true);
      Promise.all([
        getMovieById(Number(movieId)),
        getBookedSeats(Number(movieId), showDate, showTime)
      ])
        .then(([movieRes, seatsRes]) => {
          setMovie(movieRes.data);
          setBookedSeats(seatsRes.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [movieId, navigate, showDate, showTime]);

  const handleSeatConfirm = (seats: string[]) => {
    setSelectedSeats(seats);
    navigate('/summary', { state: { movie, ticketCount, selectedSeats: seats, showDate, showTime } });
  };

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading && !movie) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-12">
      <div className="w-12 h-12 border-4 border-slate-700 border-t-brand-500 rounded-full animate-spin mb-4" />
      <div className="text-slate-400 font-medium">Preparing your cinematic experience...</div>
    </div>
  );
  if (!movie) return <div className="p-12 text-center text-slate-500 font-medium">Movie not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      {/* Background ambient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-10 border-b border-slate-800 pb-6 relative z-10">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-cinema-card hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors border border-slate-800 hover:border-slate-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">{movie.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded text-xs font-bold border border-brand-500/30">PREMIUM</span>
            <p className="text-sm text-slate-400">{formatDateLabel(showDate)}, {showTime} • {movie.genre}</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-12 relative z-10">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 -z-10 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" 
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />

        {[
          { num: 1, label: 'Tickets' },
          { num: 2, label: 'Schedule' },
          { num: 3, label: 'Seats' },
          { num: 4, label: 'Payment' }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center bg-surface-bgDark px-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all duration-300 ${
              step > s.num 
                ? 'bg-brand-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.5)]' 
                : step === s.num
                  ? 'bg-brand-600 border-2 border-brand-400 text-white shadow-[0_0_15px_rgba(20,184,166,0.5)]'
                  : 'bg-cinema-card border-2 border-slate-700 text-slate-500'
            }`}>
              {step > s.num ? <CheckCircle2 className="h-6 w-6" /> : s.num}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-brand-400' : 'text-slate-500'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Ticket Quantity */}
      {step === 1 && (
        <div className="glass-panel rounded-2xl shadow-2xl border border-slate-800 p-10 text-center max-w-md mx-auto relative z-10 animate-fade-in">
          <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-500/20">
            <Ticket className="h-8 w-8 text-brand-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-8">How many tickets?</h2>
          
          <div className="flex items-center justify-center gap-8 mb-10">
            <button 
              onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
              className="w-14 h-14 rounded-full border-2 border-slate-700 text-slate-400 flex items-center justify-center text-2xl hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all active:scale-95"
            >
              -
            </button>
            <div className="relative">
               <span className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 w-20 inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{ticketCount}</span>
            </div>
            <button 
              onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
              className="w-14 h-14 rounded-full border-2 border-slate-700 text-slate-400 flex items-center justify-center text-2xl hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all active:scale-95"
            >
              +
            </button>
          </div>

          <button onClick={() => setStep(2)} className="w-full btn-primary py-4 text-lg font-bold shadow-brand-500/30">
            Select Date & Time
          </button>
        </div>
      )}

      {/* Step 2: Date & Time Selection */}
      {step === 2 && (
        <div className="glass-panel rounded-2xl shadow-2xl border border-slate-800 p-8 max-w-2xl mx-auto relative z-10 animate-fade-in">
          <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-brand-400" /> Date
          </h2>
          <div className="flex flex-wrap gap-3 mb-10">
            {upcomingDates.map((date) => (
              <button
                key={date}
                onClick={() => setShowDate(date)}
                className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl border transition-all duration-300 ${
                  showDate === date 
                    ? 'bg-brand-500/20 border-brand-400 text-brand-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="text-xs uppercase tracking-wider mb-1 opacity-80">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="font-bold">{new Date(date).getDate()} {new Date(date).toLocaleDateString('en-US', { month: 'short' })}</div>
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="h-6 w-6 text-brand-400" /> Time
          </h2>
          <div className="flex flex-wrap gap-3 mb-10">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => setShowTime(time)}
                className={`py-3 px-6 rounded-xl border font-bold transition-all duration-300 ${
                  showTime === time 
                    ? 'bg-brand-500 text-white border-brand-400 shadow-[0_0_15px_rgba(20,184,166,0.3)]' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
             <button onClick={() => setStep(1)} className="flex-1 py-4 text-lg font-bold rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
              Back
            </button>
            <button onClick={() => setStep(3)} className="flex-[2] btn-primary py-4 text-lg font-bold shadow-brand-500/30">
              Select Seats
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Seat Selection */}
      {step === 3 && (
        <div className="animate-fade-in relative z-10">
           {loading ? (
             <div className="flex justify-center p-12"><div className="w-10 h-10 border-4 border-slate-700 border-t-brand-500 rounded-full animate-spin" /></div>
           ) : (
             <>
               <div className="flex justify-between mb-4">
                 <button onClick={() => setStep(2)} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors">
                   <ArrowLeft className="h-4 w-4" /> Back to Schedule
                 </button>
               </div>
               <SeatSelection
                 movieId={Number(movieId)}
                 showDate={showDate}
                 numRequired={ticketCount}
                 bookedSeats={bookedSeats}
                 onConfirm={handleSeatConfirm}
               />
             </>
           )}
        </div>
      )}

    </div>
  );
};

export default BookingFlow;
