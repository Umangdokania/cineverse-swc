import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Star, Clock, Calendar } from 'lucide-react';
import { getMovies, type Movie } from '../services/api';

const MovieCatalog = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    getMovies()
      .then((res) => setMovies(res.data))
      .catch(() => setError('Could not load movies. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  // Extract search query
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  // Filter movies
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery) || 
                          (movie.genre && movie.genre.toLowerCase().includes(searchQuery));
    const matchesFilter = activeFilter ? movie.genre?.includes(activeFilter) : true;
    
    return matchesSearch && matchesFilter;
  });

  const FILTERS = ['Action', 'Sci-Fi', 'Drama', 'Thriller', 'Animation', 'Crime'];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[2/3] bg-slate-200 rounded-xl mb-3 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <Film className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Movies in Cinemas"}
          </h1>
          <p className="text-slate-500 mt-1">{filteredMovies.length} movies showing near you</p>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {FILTERS.map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
              className={`px-4 py-1.5 border rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeFilter === filter 
                  ? 'bg-brand-600 border-brand-600 text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Film className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No movies found</h3>
          <p className="text-slate-500">Try adjusting your search criteria or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies.map(movie => (
            <div key={movie.id} className="group flex flex-col relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-slate-100">
              <Link to={`/movies/${movie.id}`} className="block relative aspect-[2/3] bg-slate-200 overflow-hidden">
                {movie.imageUrl ? (
                  <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <Film className="h-12 w-12 text-slate-300" />
                  </div>
                )}
                {movie.rating && (
                  <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 z-10">
                    <Star className="h-3 w-3 fill-brand-400 text-brand-400" />
                    {movie.rating.toFixed(1)}
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-20">
                  <span className="bg-brand-600 text-white font-medium px-4 py-2 rounded-md mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    View Details
                  </span>
                </div>
              </Link>
              
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 truncate mb-1" title={movie.title}>{movie.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{movie.genre}</p>
                
                <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                  {movie.durationMinutes && (
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {movie.durationMinutes}m</span>
                  )}
                  {movie.releaseYear && (
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {movie.releaseYear}</span>
                  )}
                </div>

                <Link to={`/book/${movie.id}`} className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium text-sm rounded-md text-center transition">
                  Book Tickets
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieCatalog;
