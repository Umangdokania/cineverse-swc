import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, ArrowLeft, Ticket, Film, PlayCircle } from 'lucide-react';
import { getMovieById, type Movie } from '../../services/api';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getMovieById(Number(id))
        .then((res) => setMovie(res.data))
        .catch(() => setError('Failed to load movie details.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 aspect-[2/3] bg-slate-200 rounded-xl" />
        <div className="w-full md:w-2/3 space-y-4 pt-8">
          <div className="h-10 bg-slate-200 rounded w-3/4" />
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-8" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <Film className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Movie Not Found</h2>
        <p className="text-slate-500 mb-6">{error || 'The requested movie does not exist.'}</p>
        <Link to="/movies" className="btn-primary">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)]">
      {/* Hero Banner / Backdrop styling */}
      <div className="w-full h-[40vh] bg-slate-900 relative overflow-hidden">
        {movie.imageUrl && (
          <div 
            className="absolute inset-0 opacity-30 blur-xl scale-110"
            style={{ backgroundImage: `url(${movie.imageUrl})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[30vh] relative z-10 pb-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition">
          <ArrowLeft className="h-5 w-5" /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 -mt-16 md:-mt-20">
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-card border-4 border-white bg-slate-200">
              {movie.imageUrl ? (
                <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                  <Film className="h-16 w-16 text-slate-300" />
                </div>
              )}
            </div>
            
            <Link 
              to={`/book/${movie.id}`} 
              className="mt-6 w-full btn-primary py-3.5 text-base flex justify-center shadow-sm"
            >
              <Ticket className="mr-2 h-5 w-5" /> Book Tickets
            </Link>
          </div>

          {/* Details */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col pt-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8">
              {movie.rating && (
                <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-md font-semibold text-lg">
                  <Star className="h-5 w-5 fill-green-600 text-green-600" />
                  {movie.rating.toFixed(1)}/10
                </div>
              )}
              
              <div className="flex items-center gap-4 text-slate-600 font-medium">
                <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-md">
                  {movie.genre}
                </span>
                {movie.durationMinutes && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-400" /> {movie.durationMinutes} min
                  </span>
                )}
                {movie.releaseYear && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" /> {movie.releaseYear}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-3">About the Movie</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {movie.description}
              </p>
            </div>

            <div className="mt-auto border-t border-slate-100 pt-6 flex gap-4">
               <button className="btn-secondary py-2">
                 <PlayCircle className="mr-2 h-5 w-5" /> Watch Trailer
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
