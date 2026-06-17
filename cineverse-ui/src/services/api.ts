import axios from 'axios';

// ── Types ─────────────────────────────────────────────────
export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  rating: number;
  imageUrl?: string;
  releaseYear?: number;
  durationMinutes?: number;
}

export interface Theatre {
  id: number;
  name: string;
  location: string;
  totalSeats?: number;
}

export interface Booking {
  id: number;
  movieId: number;
  userEmail: string;
  seats: string;
  totalSeats: number;
  bookedAt: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  name: string;
  role: string;
}

// ── Axios instance ────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────
export const login = async (email: string, password: string) =>
  api.post<LoginResponse>('/auth/login', { email, password });

export const register = async (
  name: string,
  email: string,
  password: string,
  role: string = 'USER'
) => api.post('/auth/register', { name, email, password, role });

// ── Movies ────────────────────────────────────────────────
export const getMovies = async () => api.get<Movie[]>('/movies');
export const getMovieById = async (id: number) => api.get<Movie>(`/movies/${id}`);

// ── Theatres ──────────────────────────────────────────────
export const getTheatres = async () => api.get<Theatre[]>('/theatres');

// ── Bookings ──────────────────────────────────────────────
export const createBooking = async (movieId: number, seats: string[]) =>
  api.post<Booking>('/bookings', { movieId, seats });

export const getMyBookings = async () => api.get<Booking[]>('/bookings/my');

export const getBookingsForMovie = async (movieId: number) =>
  api.get<Booking[]>(`/bookings/movie/${movieId}`);

// ── Auth helpers ──────────────────────────────────────────
export const saveAuthData = (data: LoginResponse) => {
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('authEmail', data.email);
  localStorage.setItem('authName', data.name);
  localStorage.setItem('authRole', data.role);
};

export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authEmail');
  localStorage.removeItem('authName');
  localStorage.removeItem('authRole');
};

export const isAuthenticated = (): boolean =>
  !!localStorage.getItem('authToken');

export const getAuthName = (): string =>
  localStorage.getItem('authName') ?? '';

export default api;
