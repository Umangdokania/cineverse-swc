import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Film, Search } from 'lucide-react';
import { getMovies, type Movie } from '../../services/api';

const ManageMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getMovies().then((res) => {
      setMovies(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Manage Movies</h1>
          <p className="text-slate-400">Add, edit, or remove movies from the database.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Movie
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-slate-900/50">
          <div className="relative max-w-md">
            <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search movies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-dark border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Movie</th>
                <th className="px-6 py-4 font-medium">Genre</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    <div className="animate-pulse flex flex-col items-center">
                      <Film className="h-8 w-8 mb-2 opacity-50" />
                      Loading movies...
                    </div>
                  </td>
                </tr>
              ) : filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No movies found matching your search.
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={movie.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      <div className="w-10 h-14 bg-slate-800 rounded flex-shrink-0 overflow-hidden">
                        {movie.imageUrl ? (
                          <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover" />
                        ) : (
                          <Film className="h-full w-full p-2 text-slate-600" />
                        )}
                      </div>
                      {movie.title}
                    </td>
                    <td className="px-6 py-4">{movie.genre}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs font-bold">
                        {movie.rating}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-brand-400 transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageMovies;
