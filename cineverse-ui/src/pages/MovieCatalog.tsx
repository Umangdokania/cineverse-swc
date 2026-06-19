import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Star, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
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
        <div className="h-10 w-64 bg-slate-800 shimmer rounded-lg mb-8 border border-white/5" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[2/3] bg-slate-800 shimmer rounded-2xl mb-4 border border-white/5" />
              <div className="h-4 bg-slate-800 shimmer rounded-md w-3/4 mb-3" />
              <div className="h-3 bg-slate-800 shimmer rounded-md w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 text-red-500 mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <Film className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-3">Oops! Something went wrong</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            {searchQuery ? `Results for "${searchQuery}"` : "Movies in Cinemas"}
          </h1>
          <p className="text-brand-400 font-medium">{filteredMovies.length} movies showing near you</p>
        </div>
        
        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {FILTERS.map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeFilter === filter 
                  ? 'bg-brand-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] border-brand-400' 
                  : 'bg-cinema-card border border-slate-700 text-slate-300 hover:border-brand-500/50 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-3xl">
          <Film className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-display font-bold text-white mb-2">No movies found</h3>
          <p className="text-slate-400">Try adjusting your search criteria or check back later.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {filteredMovies.map((movie) => (
            <motion.div 
              key={movie.id} 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group flex flex-col relative bg-cinema-card rounded-2xl overflow-hidden border border-slate-800 hover:border-brand-500/50 hover:shadow-[0_10px_30px_rgba(20,184,166,0.1)] transition-colors duration-300"
            >
              <Link to={`/movies/${movie.id}`} className="block relative aspect-[2/3] bg-slate-900 overflow-hidden">
                {movie.imageUrl ? (
                  <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <Film className="h-16 w-16 text-slate-700" />
                  </div>
                )}
                {movie.rating && (
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 z-10 border border-white/10">
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    {movie.rating.toFixed(1)}
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20">
                  <span className="bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-2.5 rounded-lg mb-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-brand-500/30">
                    View Details
                  </span>
                </div>
              </Link>
              
              <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-transparent to-black/20">
                <h3 className="font-display font-bold text-lg text-white truncate mb-1 group-hover:text-brand-400 transition-colors" title={movie.title}>{movie.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{movie.genre}</p>
                
                <div className="mt-auto flex items-center justify-between text-xs text-slate-500 font-medium">
                  {movie.durationMinutes && (
                    <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md"><Clock className="h-3 w-3 text-slate-400" /> {movie.durationMinutes}m</span>
                  )}
                  {movie.releaseYear && (
                    <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md"><Calendar className="h-3 w-3 text-slate-400" /> {movie.releaseYear}</span>
                  )}
                </div>

                <Link to={`/book/${movie.id}`} className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-brand-600 text-white font-medium text-sm rounded-lg text-center transition-all duration-300 border border-slate-700 hover:border-brand-500">
                  Book Tickets
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MovieCatalog;
