import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, ChevronRight, Film } from 'lucide-react';
import { getMyBookings, getMovies, type Booking, type Movie } from '../../services/api';

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [movies, setMovies] = useState<Record<number, Movie>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, moviesRes] = await Promise.all([
          getMyBookings(),
          getMovies()
        ]);
        
        // Map movies by ID for easy lookup
        const movieMap: Record<number, Movie> = {};
        moviesRes.data.forEach(m => { movieMap[m.id] = m; });
        
        setMovies(movieMap);
        
        // Sort bookings by ID descending (newest first, assuming sequential IDs)
        const sortedBookings = bookingsRes.data.sort((a, b) => b.id - a.id);
        setBookings(sortedBookings);
      } catch (err) {
        setError('Failed to load your booking history.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-12 text-center text-slate-500 font-medium animate-pulse">Loading your bookings...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button onClick={() => window.location.reload()} className="btn-secondary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-brand-100 p-3 rounded-xl text-brand-600">
            <Ticket className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
            <p className="text-slate-500">View and manage your movie tickets</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <Ticket className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No bookings found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven't booked any tickets yet. Browse our catalog and book your next cinematic experience!</p>
            <Link to="/movies" className="btn-primary inline-flex items-center justify-center">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const movie = movies[booking.movieId];
              return (
                <div key={booking.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition">
                  <div className="w-full md:w-48 shrink-0 bg-slate-200 aspect-video md:aspect-[2/3] relative">
                    {movie?.imageUrl ? (
                      <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <span className="text-xs font-bold tracking-wider uppercase text-brand-600 mb-1 block">Booking #{booking.id}</span>
                          <h3 className="text-2xl font-bold text-slate-900">{movie?.title || 'Unknown Movie'}</h3>
                        </div>
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                          Confirmed
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-6 mb-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="h-4 w-4 text-slate-400" /> 
                          <span className="text-sm font-medium">Cineverse Premium</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="h-4 w-4 text-slate-400" /> 
                          <span className="text-sm font-medium">Today, 7:30 PM</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Ticket className="h-4 w-4 text-slate-400" /> 
                          <span className="text-sm font-medium">{booking.totalSeats} Tickets</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Seats</span> 
                          <span className="text-sm font-bold text-slate-800">{booking.seats}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                       <span className="text-slate-500 text-sm">Booked on {new Date(booking.bookedAt || Date.now()).toLocaleDateString()}</span>
                       <button className="text-brand-600 font-semibold text-sm flex items-center gap-1 hover:text-brand-700 transition">
                         View Ticket <ChevronRight className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
