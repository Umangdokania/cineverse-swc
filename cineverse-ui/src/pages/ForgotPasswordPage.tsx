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
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-brand-100 text-brand-600 mb-6">
            <Mail className="h-8 w-8" />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Forgot Password?</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-card rounded-2xl border border-slate-100 sm:px-10">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Check your email</h3>
              <p className="text-sm text-slate-500 mb-6">
                We sent a password reset link to <br/>
                <span className="font-medium text-slate-900">{email}</span>
              </p>
              <Link to="/login" className="w-full btn-primary py-2.5 flex justify-center">
                Back to log in
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full btn-primary py-2.5 flex justify-center"
              >
                {loading ? 'Sending link...' : 'Reset password'}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-brand-600 transition">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
