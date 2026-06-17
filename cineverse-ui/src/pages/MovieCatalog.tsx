import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMovies, type Movie } from '../services/api';

/* ─── Genre accent colours ─── */
const genreMeta: Record<string, { bg: string; text: string; border: string }> = {
  'Sci-Fi':  { bg: 'rgba(99,102,241,0.15)',  text: '#818cf8', border: 'rgba(99,102,241,0.3)' },
  Action:    { bg: 'rgba(249,115,22,0.15)',  text: '#fb923c', border: 'rgba(249,115,22,0.3)' },
  Thriller:  { bg: 'rgba(220,38,38,0.15)',   text: '#f87171', border: 'rgba(220,38,38,0.3)' },
  Drama:     { bg: 'rgba(168,85,247,0.15)',  text: '#c084fc', border: 'rgba(168,85,247,0.3)' },
  Comedy:    { bg: 'rgba(234,179,8,0.15)',   text: '#fbbf24', border: 'rgba(234,179,8,0.3)' },
  Horror:    { bg: 'rgba(127,29,29,0.2)',    text: '#fca5a5', border: 'rgba(127,29,29,0.4)' },
  Romance:   { bg: 'rgba(236,72,153,0.15)', text: '#f472b6', border: 'rgba(236,72,153,0.3)' },
};
const defaultGenre = { bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.12)' };

/* ─── Skeleton Card ─── */
const SkeletonCard = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
    className="rounded-2xl overflow-hidden"
    style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
  >
    <div className="skeleton h-3 w-3/4 m-6 mb-3" />
    <div className="skeleton h-2 w-1/2 mx-6 mb-4" />
    <div className="flex gap-2 px-6 mb-4">
      <div className="skeleton h-5 w-14 rounded-full" />
      <div className="skeleton h-5 w-10 rounded-full" />
    </div>
    <div className="skeleton h-2 w-full mx-6 mb-2" style={{ width: 'calc(100% - 48px)' }} />
    <div className="skeleton h-2 w-5/6 mx-6 mb-2" style={{ width: 'calc(83% - 48px)' }} />
    <div className="skeleton h-2 w-2/3 mx-6 mb-6" style={{ width: 'calc(66% - 48px)' }} />
    <div className="skeleton h-10 mx-6 mb-6 rounded-xl" style={{ margin: '0 24px 24px' }} />
  </motion.div>
);

/* ─── Movie Card ─── */
const MovieCard = ({ movie, idx }: { movie: Movie; idx: number }) => {
  const genre = genreMeta[movie.genre] ?? defaultGenre;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'var(--c-surface)',
        border: '1px solid var(--c-border)',
        transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,197,24,0.15)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,197,24,0.2)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-border)';
      }}
    >
      {/* Top accent bar based on genre */}
      <div
        className="h-0.5 w-full"
        style={{ background: genre.text, opacity: 0.6 }}
      />

      <div className="p-6 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3
            className="text-lg font-bold leading-tight flex-1"
            style={{ color: 'var(--c-text)', fontFamily: "'Inter', sans-serif" }}
          >
            {movie.title}
          </h3>
          {/* Rating badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg shrink-0"
            style={{
              background: 'rgba(245,197,24,0.12)',
              border: '1px solid rgba(245,197,24,0.25)',
            }}
          >
            <span style={{ color: 'var(--c-gold)', fontSize: '0.7rem' }}>★</span>
            <span className="text-xs font-bold" style={{ color: 'var(--c-gold)' }}>
              {movie.rating?.toFixed(1) ?? 'N/A'}
            </span>
          </div>
        </div>

        {/* Tags row */}
        <div className="flex gap-2 flex-wrap mb-4">
          <span
            className="badge text-xs"
            style={{ background: genre.bg, color: genre.text, border: `1px solid ${genre.border}` }}
          >
            {movie.genre}
          </span>
          {movie.releaseYear && (
            <span
              className="badge text-xs"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}
            >
              {movie.releaseYear}
            </span>
          )}
          {movie.durationMinutes && (
            <span
              className="badge text-xs"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}
            >
              {movie.durationMinutes} min
            </span>
          )}
        </div>

        {/* Description */}
        {movie.description && (
          <p
            className="text-sm leading-relaxed mb-5 flex-1"
            style={{
              color: 'var(--c-muted)',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {movie.description}
          </p>
        )}

        {/* Book Now Button */}
        <Link
          to={`/book/${movie.id}`}
          className="mt-auto block text-center font-bold text-sm py-3 rounded-xl transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #f5c518, #e6b000)',
            color: '#080810',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(245,197,24,0.35)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLElement).style.transform = 'none';
          }}
        >
          Book Now →
        </Link>
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─── */
const MovieCatalog = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMovies()
      .then((res) => setMovies(res.data))
      .catch(() => setError('Could not load movies. Is the backend running on port 8080?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="skeleton h-8 w-44 mb-2 rounded-lg" />
        <div className="skeleton h-4 w-32 mb-10 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} delay={i * 0.08} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card text-center p-10 max-w-md w-full"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
            style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)' }}
          >
            ⚠
          </div>
          <p className="font-bold text-lg mb-2" style={{ color: '#f87171' }}>Failed to Load Movies</p>
          <p className="text-sm mb-6" style={{ color: 'var(--c-muted)' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-danger"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-4xl mb-4">🎬</p>
          <p className="font-semibold text-lg mb-2" style={{ color: 'var(--c-text)' }}>No Movies Found</p>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>Check back soon for new titles.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="movie-catalog" className="max-w-7xl mx-auto px-6 py-12">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 tracking-wider uppercase"
          style={{
            background: 'rgba(245,197,24,0.08)',
            border: '1px solid rgba(245,197,24,0.2)',
            color: 'var(--c-gold)',
          }}
        >
          🎬 Now Showing
        </div>
        <h1
          className="font-display text-4xl sm:text-5xl font-black mb-2"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--c-text)', lineHeight: 1.1 }}
        >
          Current Releases
        </h1>
        <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
          {movies.length} {movies.length === 1 ? 'film' : 'films'} available for booking
        </p>
      </motion.div>

      {/* Divider */}
      <div className="divider mb-10" />

      {/* Movie Grid */}
      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie, idx) => (
            <MovieCard key={movie.id} movie={movie} idx={idx} />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default MovieCatalog;
