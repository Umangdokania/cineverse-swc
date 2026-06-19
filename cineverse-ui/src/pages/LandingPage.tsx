import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Film, CalendarDays, Ticket, Play, Star, MapPin } from 'lucide-react';
import { getMovies, type Movie } from '../services/api';

const LandingPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getMovies()
      .then((res) => setMovies(res.data.slice(0, 5))) // Just get top 5 for hero
      .catch(console.error);
  }, []);

  return (
    <div className="bg-surface-bgDark min-h-screen pb-12 overflow-hidden">
      {/* Premium Hero Carousel Area */}
      <div className="relative pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-sm font-medium text-brand-400 mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Now Showing in Cinemas
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6 text-white animate-slide-up" style={{animationDelay: '0.1s'}}>
              Experience <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-300">
                True Cinema.
              </span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-lg animate-slide-up leading-relaxed" style={{animationDelay: '0.2s'}}>
              Book premium seats, discover IMAX experiences, and dive into a world of unparalleled entertainment.
            </p>
            <div className="flex gap-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <Link to="/movies" className="btn-primary group">
                Book Tickets <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-secondary group">
                <Play className="h-5 w-5 mr-2 text-brand-500 group-hover:text-brand-400 transition-colors" /> Watch Trailers
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-end relative animate-fade-in" style={{animationDelay: '0.4s'}}>
            {/* Cinematic Ticket Graphic */}
            <div className="relative w-full max-w-lg aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800 group cursor-pointer">
               <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/40 to-slate-900/80 z-10" />
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
               
               {/* Ticket Overlay */}
               <div className="absolute bottom-6 left-6 right-6 z-20 glass-panel p-6 rounded-xl flex items-center justify-between transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                 <div>
                   <div className="badge bg-brand-500/20 text-brand-400 mb-2 border border-brand-500/30">IMAX 3D</div>
                   <h3 className="text-white font-display font-bold text-xl">Dune: Part Two</h3>
                   <p className="text-slate-300 text-sm flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> PVR Director's Cut</p>
                 </div>
                 <div className="h-12 w-12 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/40">
                   <ChevronRight className="h-6 w-6" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Movies Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-white">Recommended Movies</h2>
            <p className="text-slate-400 mt-2">Catch the latest blockbusters</p>
          </div>
          <Link to="/movies" className="text-brand-400 font-medium flex items-center gap-1 hover:text-brand-300 transition-colors">
            Explore All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.length > 0 ? (
            movies.map((movie, idx) => (
              <Link to={`/book/${movie.id}`} key={movie.id} className="group cursor-pointer flex flex-col animate-slide-up" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="aspect-[2/3] bg-cinema-card rounded-xl mb-4 overflow-hidden border border-slate-800 transition-all duration-300 group-hover:shadow-[0_10px_30px_rgba(20,184,166,0.15)] group-hover:border-brand-500/50 relative">
                   <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                      <Film className="h-12 w-12 text-slate-600" />
                   </div>
                   
                   {/* Format Badges */}
                   <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                     <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase border border-white/10">3D</span>
                   </div>

                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                      <button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-lg shadow-brand-500/30">
                        Book Tickets
                      </button>
                   </div>
                </div>
                <h3 className="font-display font-semibold text-white text-lg truncate group-hover:text-brand-400 transition-colors">{movie.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-slate-400">{movie.genre}</p>
                  <div className="flex items-center gap-1 text-sm text-yellow-500 font-medium">
                    <Star className="h-3 w-3 fill-yellow-500" /> 8.5
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // Premium Skeletons
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-[2/3] bg-cinema-card rounded-xl mb-4 animate-pulse border border-slate-800" />
                <div className="h-5 bg-cinema-card rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-4 bg-cinema-card rounded w-1/2 animate-pulse" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 mb-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-brand-500/10 p-4 rounded-xl text-brand-400 w-16 h-16 flex items-center justify-center mb-6 border border-brand-500/20">
              <Ticket className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-3">M-Ticket</h3>
            <p className="text-slate-400 leading-relaxed">Scan your mobile ticket at the gate. No printout required. Your phone is your pass to the movies.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-purple-500/10 p-4 rounded-xl text-purple-400 w-16 h-16 flex items-center justify-center mb-6 border border-purple-500/20">
              <CalendarDays className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-3">Advance Booking</h3>
            <p className="text-slate-400 leading-relaxed">Book tickets up to 7 days in advance for your favorite shows and secure the best seats.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-blue-500/10 p-4 rounded-xl text-blue-400 w-16 h-16 flex items-center justify-center mb-6 border border-blue-500/20">
              <Film className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-3">Premium Experiences</h3>
            <p className="text-slate-400 leading-relaxed">Enjoy IMAX, 4DX, and premium recliner seating options for an unforgettable cinematic journey.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
