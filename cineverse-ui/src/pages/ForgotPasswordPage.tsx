import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { forgotPassword } from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-bgDark relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-bgDark via-surface-bgDark/80 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up">
        
        <div className="glass-panel rounded-3xl shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
          
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)] mb-6 transition-transform hover:scale-105">
                <Mail className="h-8 w-8" />
              </Link>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2">Forgot Password?</h2>
              <p className="text-sm text-slate-400 font-medium">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            {success ? (
              <div className="text-center animate-fade-in">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-500/10 border border-brand-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)] mb-6">
                  <CheckCircle2 className="h-8 w-8 text-brand-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">Check your email</h3>
                <p className="text-sm text-slate-400 mb-8 font-medium">
                  We sent a password reset link to <br/>
                  <span className="font-bold text-brand-400">{email}</span>
                </p>
                <Link to="/login" className="w-full btn-primary py-3.5 flex justify-center text-base font-bold tracking-wide shadow-brand-500/20">
                  Back to log in
                </Link>
              </div>
            ) : (
              <form className="space-y-6 animate-fade-in" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl flex items-center gap-3 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      className="input-field pl-12 py-3.5 text-white"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full btn-primary py-3.5 flex justify-center text-base font-bold tracking-wide shadow-brand-500/20"
                >
                  {loading ? 'Sending link...' : 'Reset password'}
                </button>
              </form>
            )}
          </div>
          
          {!success && (
            <div className="bg-slate-900/50 px-8 py-5 border-t border-slate-800 text-center backdrop-blur-sm">
              <Link to="/login" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-brand-400 transition-colors group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
