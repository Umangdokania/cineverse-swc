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
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6 shadow-sm">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600">Your tickets have been successfully booked and sent to your email.</p>
        </div>

        {/* Digital Ticket */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden relative">
          {/* Ticket styling notches */}
          <div className="absolute left-0 top-[60%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full border-r border-slate-200" />
          <div className="absolute right-0 top-[60%] translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full border-l border-slate-200" />
          
          <div className="p-8 pb-10 border-b-2 border-dashed border-slate-200">
            <div className="flex gap-6 mb-8">
              <div className="w-24 h-36 shrink-0 rounded-lg overflow-hidden bg-slate-200 shadow-sm">
                {movie.imageUrl ? (
                  <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="h-8 w-8 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold text-brand-600 mb-1 uppercase tracking-wider">Cineverse Premium</span>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{movie.title}</h2>
                <div className="text-slate-500 text-sm flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4" /> Bandra, Mumbai
                </div>
                <div className="text-slate-500 text-sm flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4" /> Today, 7:30 PM
                </div>
                <div className="text-slate-500 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" /> English (2D)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Booking ID</p>
                <p className="font-bold text-slate-900 text-lg">#{booking.id.toString().padStart(6, '0')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Tickets</p>
                <p className="font-bold text-slate-900 text-lg">{booking.totalSeats}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Seats</p>
                <p className="font-bold text-brand-600 text-xl">{booking.seats}</p>
              </div>
            </div>
          </div>

          <div className="p-8 pt-10 flex flex-col items-center bg-white">
             <QrCode className="w-32 h-32 text-slate-800 mb-4" strokeWidth={1} />
             <p className="text-sm text-slate-500 text-center">Show this QR code at the cinema entrance</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-secondary py-3 px-6 flex items-center justify-center gap-2 bg-white">
            <Download className="h-5 w-5" /> Download PDF
          </button>
          <Link to="/history" className="btn-primary py-3 px-6 flex items-center justify-center gap-2">
            <Ticket className="h-5 w-5" /> View My Bookings
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;
