import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Ticket, AlertCircle, Eye, EyeOff, UserPlus, ArrowRight } from 'lucide-react';
import { register, saveAuthData, login } from '../services/api';

const getPasswordStrength = (pw: string) => {
  if (pw.length === 0) return { score: 0, text: '', color: 'bg-slate-700' };
  if (pw.length < 6) return { score: 1, text: 'Weak', color: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' };
  if (pw.length < 8) return { score: 2, text: 'Fair', color: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' };
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) return { score: 4, text: 'Strong', color: 'bg-brand-400 shadow-[0_0_10px_rgba(20,184,166,0.5)]' };
  return { score: 3, text: 'Good', color: 'bg-brand-600 shadow-[0_0_10px_rgba(13,148,136,0.5)]' };
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      const loginRes = await login(email, password);
      saveAuthData(loginRes.data);
      navigate('/');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        'Registration failed. Email may already be in use.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface-bgDark px-4 py-12 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-bgDark via-surface-bgDark/80 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="glass-panel rounded-3xl shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
          
          <div className="p-8 md:p-10">
            <div className="flex justify-center mb-6">
              <div className="bg-brand-500/10 p-4 rounded-full text-brand-400 border border-brand-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                <UserPlus className="h-8 w-8" />
              </div>
            </div>
            
            <h2 className="text-3xl font-display font-bold text-white text-center mb-2">Create an Account</h2>
            <p className="text-slate-400 text-center text-sm mb-8 font-medium">Join Cineverse for the best booking experience</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm mb-6 flex items-start gap-3 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="input-field py-3 text-white"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="input-field py-3 text-white"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="input-field py-3 pr-10 text-white"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-brand-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-3">
                    <div className="flex gap-1 h-1.5 mb-2">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level} 
                          className={`flex-1 rounded-full transition-all duration-300 ${level <= strength.score ? strength.color : 'bg-slate-800'}`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${strength.score < 3 ? 'text-slate-500' : 'text-brand-400'}`}>
                      {strength.text}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3.5 text-base font-bold tracking-wide shadow-brand-500/20 group"
                >
                  {loading ? 'Creating Account...' : (
                    <>Sign Up <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-xs text-slate-500 font-medium">
              By signing up, you agree to our <span className="text-brand-400">Terms of Service</span> and <span className="text-brand-400">Privacy Policy</span>.
            </div>
          </div>
          
          <div className="bg-slate-900/50 px-8 py-5 border-t border-slate-800 text-center backdrop-blur-sm">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-brand-400 hover:text-brand-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
