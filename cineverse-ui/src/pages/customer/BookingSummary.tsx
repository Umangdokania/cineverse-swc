import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, AlertCircle, Ticket, ArrowLeft, ShieldCheck } from 'lucide-react';
import { createBooking } from '../../services/api';

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { movie: any, ticketCount: number, selectedSeats: string[], showDate?: string } | null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!state || !state.movie || !state.selectedSeats) {
    return <Navigate to="/movies" replace />;
  }

  const { movie, ticketCount, selectedSeats, showDate } = state;
  const ticketPrice = 250;
  const convenienceFee = 30;
  const totalAmount = (ticketCount * ticketPrice) + convenienceFee;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await createBooking(movie.id, selectedSeats, showDate);
      // Navigate to confirmation with booking ID
      navigate('/confirmation', { state: { booking: response.data, movie } });
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response?.data : 'Failed to complete booking. Seats might already be taken.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-medium transition">
          <ArrowLeft className="h-5 w-5" /> Back to Seat Selection
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Payment Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-brand-600" /> Payment Details
                </h2>
                <div className="flex items-center gap-1 text-sm text-green-700 font-medium bg-green-100 px-3 py-1 rounded-full">
                  <ShieldCheck className="h-4 w-4" /> Secure Checkout
                </div>
              </div>

              <div className="p-6 md:p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 border border-red-100">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="flex gap-4 mb-8">
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium flex items-center justify-center gap-2 transition ${
                      paymentMethod === 'card' ? 'border-brand-600 text-brand-700 bg-brand-50' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium flex items-center justify-center gap-2 transition ${
                      paymentMethod === 'upi' ? 'border-brand-600 text-brand-700 bg-brand-50' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    UPI
                  </button>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                  {paymentMethod === 'card' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                        <input type="text" required placeholder="0000 0000 0000 0000" className="input-field font-mono" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Expiry (MM/YY)</label>
                          <input type="text" required placeholder="12/25" className="input-field font-mono" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                          <input type="password" required placeholder="123" className="input-field font-mono" maxLength={4} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Name on Card</label>
                        <input type="text" required placeholder="John Doe" className="input-field" />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">UPI ID</label>
                      <input type="text" required placeholder="username@upi" className="input-field" />
                      <p className="text-sm text-slate-500 mt-2">You will receive a payment request on your UPI app.</p>
                    </div>
                  )}

                  <div className="pt-4 mt-6 border-t border-slate-100">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full btn-primary py-4 text-lg shadow-md flex justify-center items-center gap-2"
                    >
                      {submitting ? (
                        <>Processing...</>
                      ) : (
                        <>Pay Rs. {totalAmount} <CheckCircle2 className="h-5 w-5" /></>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
              <div className="bg-slate-900 p-6 text-white text-center">
                <Ticket className="h-10 w-10 text-brand-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold mb-1">Booking Summary</h2>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{movie.title}</h3>
                <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-dashed border-slate-200">
                  Cineverse Premium • English (2D)<br/>
                  Today, 7:30 PM
                </p>

                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Tickets ({ticketCount})</span>
                    <span className="font-medium text-slate-900">Rs. {ticketCount * ticketPrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Selected Seats</span>
                    <span className="font-medium text-slate-900 text-right">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Convenience Fee</span>
                    <span className="font-medium text-slate-900">Rs. {convenienceFee}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200 mb-2">
                  <span className="text-slate-500 font-medium">Amount Payable</span>
                  <span className="font-bold text-brand-600 text-2xl">Rs. {totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingSummary;
