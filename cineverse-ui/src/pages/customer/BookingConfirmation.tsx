import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, Clock, Film, Ticket, Download, QrCode } from 'lucide-react';

const BookingConfirmation = () => {
  const location = useLocation();
  const state = location.state as { booking: any, movie: any } | null;

  if (!state || !state.booking) {
    return <Navigate to="/movies" replace />;
  }

  const { booking, movie } = state;

  return (
    <div className="bg-surface-bgDark min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Cinematic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Success Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-500/10 text-brand-400 mb-6 border border-brand-500/20 shadow-[0_0_30px_rgba(20,184,166,0.2)] animate-pulse-glow">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-3">Booking Confirmed!</h1>
          <p className="text-slate-400 font-medium">Your tickets have been successfully booked and sent to your email.</p>
        </div>

        {/* Digital Ticket */}
        <div className="bg-cinema-card rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative animate-slide-up" style={{animationDelay: '0.1s'}}>
          {/* Ticket styling notches */}
          <div className="absolute left-0 top-[60%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-surface-bgDark rounded-full border-r border-slate-800 shadow-inner" />
          <div className="absolute right-0 top-[60%] translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-surface-bgDark rounded-full border-l border-slate-800 shadow-inner" />
          
          {/* Movie Backdrop Header */}
          <div className="relative h-32 overflow-hidden">
             {movie.imageUrl ? (
               <>
                <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover opacity-40 blur-sm scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-card to-transparent" />
               </>
             ) : (
               <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 to-slate-900" />
             )}
          </div>

          <div className="p-8 pb-10 border-b-2 border-dashed border-slate-800 -mt-20 relative z-10">
            <div className="flex gap-6 mb-8">
              <div className="w-28 h-40 shrink-0 rounded-xl overflow-hidden bg-slate-900 shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-slate-800">
                {movie.imageUrl ? (
                  <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="h-10 w-10 text-slate-600" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-end pb-2">
                <span className="text-xs font-bold text-brand-400 mb-2 uppercase tracking-widest bg-brand-500/10 w-fit px-3 py-1 rounded-full border border-brand-500/20">Cineverse Premium</span>
                <h2 className="text-3xl font-display font-bold text-white mb-4 leading-tight">{movie.title}</h2>
                <div className="grid grid-cols-1 gap-2">
                  <div className="text-slate-400 text-sm flex items-center gap-3 font-medium">
                    <MapPin className="h-4 w-4 text-brand-500" /> Bandra, Mumbai
                  </div>
                  <div className="text-slate-400 text-sm flex items-center gap-3 font-medium">
                    <Calendar className="h-4 w-4 text-brand-500" /> {booking.showDate ? new Date(booking.showDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Today'}, {booking.showTime || '7:30 PM'}
                  </div>
                  <div className="text-slate-400 text-sm flex items-center gap-3 font-medium">
                    <Clock className="h-4 w-4 text-brand-500" /> English (2D)
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">Booking ID</p>
                <p className="font-mono font-bold text-white text-lg tracking-widest">#{booking.id?.toString().padStart(6, '0')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">Transaction ID</p>
                <p className="font-mono font-bold text-white text-sm tracking-widest">{booking.transactionId || 'PENDING'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">Tickets</p>
                <p className="font-display font-bold text-white text-lg">{booking.totalSeats}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">Seats</p>
                <p className="font-display font-bold text-brand-400 text-2xl drop-shadow-[0_0_10px_rgba(20,184,166,0.3)]">{booking.seats}</p>
              </div>
            </div>
          </div>

          <div className="p-8 pt-10 flex flex-col items-center bg-cinema-card relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
             <div className="bg-white p-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-4">
               {/* Real QR Code would be generated on the backend and sent via email. For UI display we show a placeholder or we could use a library. Given the instructions, the REAL QR code is in the PDF. Here we just display an icon to represent it or use a QR library if we had one. Since we don't have a frontend QR lib, we use the icon. */}
               <QrCode className="w-32 h-32 text-slate-900" strokeWidth={1.5} />
             </div>
             <p className="text-sm text-slate-400 text-center font-medium uppercase tracking-wider">Show this QR code at the cinema</p>
             <p className="text-xs text-slate-500 text-center mt-2">A real QR code is embedded in the ticket PDF sent to your email.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center print:hidden animate-slide-up" style={{animationDelay: '0.2s'}}>
          <button 
            onClick={() => window.print()}
            className="btn-secondary py-3.5 px-8 flex items-center justify-center gap-3 bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
          >
            <Download className="h-5 w-5" /> Download PDF
          </button>
          <Link to="/history" className="btn-primary py-3.5 px-8 flex items-center justify-center gap-3 text-base font-bold shadow-brand-500/20">
            <Ticket className="h-5 w-5" /> View My Bookings
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;
