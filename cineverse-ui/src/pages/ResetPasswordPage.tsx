import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, EyeOff, Eye, CheckCircle2, KeyRound } from 'lucide-react';
import { resetPassword } from '../services/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to reset password. The link might be expired.');
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
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)] mb-6 transition-transform hover:scale-105">
                <KeyRound className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2">Set new password</h2>
              <p className="text-sm text-slate-400 font-medium">
                Your new password must be different to previously used passwords.
              </p>
            </div>

            {success ? (
              <div className="text-center animate-fade-in">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-500/10 border border-brand-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)] mb-6">
                  <CheckCircle2 className="h-8 w-8 text-brand-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">Password reset</h3>
                <p className="text-sm text-slate-400 mb-8 font-medium">
                  Your password has been successfully reset. Click below to log in magically.
                </p>
                <Link to="/login" className="w-full btn-primary py-3.5 flex justify-center text-base font-bold tracking-wide shadow-brand-500/20">
                  Continue to log in
                </Link>
              </div>
            ) : (
              <form className="space-y-6 animate-fade-in" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl flex items-center gap-3 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={!token}
                      minLength={8}
                      className="input-field pl-12 pr-12 py-3.5 text-white"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-brand-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={!token}
                      minLength={8}
                      className="input-field pl-12 pr-12 py-3.5 text-white"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !token || !password || !confirmPassword}
                  className="w-full btn-primary py-3.5 flex justify-center text-base font-bold tracking-wide shadow-brand-500/20"
                >
                  {loading ? 'Resetting password...' : 'Reset password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
