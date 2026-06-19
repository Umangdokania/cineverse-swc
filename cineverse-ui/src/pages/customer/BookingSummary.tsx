import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, AlertCircle, Ticket, ArrowLeft, ShieldCheck, Film } from 'lucide-react';
import { createBooking } from '../../services/api';

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { movie: any, ticketCount: number, selectedSeats: string[], showDate?: string, showTime?: string } | null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  if (!state || !state.movie || !state.selectedSeats) {
    return <Navigate to="/movies" replace />;
  }

  const { movie, ticketCount, selectedSeats, showDate, showTime } = state;
  const ticketPrice = 250;
  const convenienceFee = 30;
  const totalAmount = (ticketCount * ticketPrice) + convenienceFee;

  // Luhn algorithm for card validation
  const luhnCheck = (val: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = val.length - 1; i >= 0; i--) {
      let digit = parseInt(val.charAt(i), 10);
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) == 0;
  };

  // Card type detection
  const getCardType = (number: string) => {
    const re = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/
    };
    if (re.visa.test(number)) return 'VISA';
    if (re.mastercard.test(number)) return 'MASTERCARD';
    if (re.amex.test(number)) return 'AMEX';
    return 'CARD';
  };

  // Format Card Number (adds spaces)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      const month = parseInt(value.slice(0, 2), 10);
      if (month > 12) value = '12' + value.slice(2);
      if (month === 0) value = '01' + value.slice(2);
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiry(value);
  };

  // Format CVV (numbers only)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    const isAmex = getCardType(cardNumber.replace(/\s/g, '')) === 'AMEX';
    if (value.length > (isAmex ? 4 : 3)) value = value.slice(0, isAmex ? 4 : 3);
    setCvv(value);
  };

  const validateCard = (): string | null => {
    const rawNumber = cardNumber.replace(/\s/g, '');
    if (rawNumber.length < 13 || rawNumber.length > 19) return "Invalid card number length.";
    if (!luhnCheck(rawNumber)) return "Invalid card number.";

    if (expiry.length !== 5) return "Invalid expiry date format.";
    const [monthStr, yearStr] = expiry.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(`20${yearStr}`, 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "Card has expired.";
    }

    const isAmex = getCardType(rawNumber) === 'AMEX';
    if (isAmex && cvv.length !== 4) return "AMEX requires a 4-digit CVV.";
    if (!isAmex && cvv.length !== 3) return "CVV must be 3 digits.";

    if (nameOnCard.trim().split(' ').length < 2) return "Please enter your full name as it appears on the card.";

    return null;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (paymentMethod === 'card') {
      const cardError = validateCard();
      if (cardError) {
        setError(cardError);
        return;
      }
    }

    setSubmitting(true);

    try {
      const finalShowDate = showDate || new Date().toISOString().split('T')[0];
      const response = await createBooking(movie.id, selectedSeats, finalShowDate, showTime);
      // Navigate to confirmation with booking ID
      navigate('/confirmation', { state: { booking: response.data, movie } });
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response?.data : 'Failed to complete booking. Seats might already be taken.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-bgDark min-h-[calc(100vh-64px)] py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 font-medium transition-colors group w-fit">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> Back to Seat Selection
        </button>

        <h1 className="text-4xl font-display font-bold text-white mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Payment Form */}
          <div className="w-full lg:w-2/3">
            <div className="glass-panel rounded-2xl shadow-2xl border border-slate-800 overflow-hidden animate-slide-up">
              <div className="bg-slate-900/50 border-b border-slate-800 p-6 flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-brand-500" /> Payment Details
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-brand-400 font-bold tracking-wide uppercase bg-brand-500/10 px-3 py-1.5 rounded-full border border-brand-500/20">
                  <ShieldCheck className="h-4 w-4" /> Secure Checkout
                </div>
              </div>

              <div className="p-6 md:p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-xl flex items-start gap-3 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="flex gap-4 mb-8">
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-4 px-4 rounded-xl border-2 font-display font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                      paymentMethod === 'card' 
                        ? 'border-brand-500 text-brand-400 bg-brand-500/10 shadow-[0_0_15px_rgba(20,184,166,0.15)]' 
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-4 px-4 rounded-xl border-2 font-display font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                      paymentMethod === 'upi' 
                        ? 'border-brand-500 text-brand-400 bg-brand-500/10 shadow-[0_0_15px_rgba(20,184,166,0.15)]' 
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    UPI
                  </button>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                  {paymentMethod === 'card' ? (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="block text-sm font-bold text-slate-400 uppercase tracking-wide">Card Number</label>
                          {cardNumber.length > 0 && (
                            <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                              {getCardType(cardNumber.replace(/\s/g, ''))}
                            </span>
                          )}
                        </div>
                        <input type="text" required value={cardNumber} onChange={handleCardNumberChange} placeholder="0000 0000 0000 0000" className="input-field font-mono tracking-widest text-lg py-3" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Expiry (MM/YY)</label>
                          <input type="text" required value={expiry} onChange={handleExpiryChange} placeholder="12/25" className="input-field font-mono tracking-widest text-lg py-3 text-center" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">CVV</label>
                          <input type="password" required value={cvv} onChange={handleCvvChange} placeholder="•••" className="input-field font-mono tracking-widest text-lg py-3 text-center" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Name on Card</label>
                        <input type="text" required value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value.toUpperCase())} placeholder="JANE DOE" className="input-field py-3 uppercase" />
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fade-in py-4">
                      <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">UPI ID</label>
                      <input type="text" required placeholder="username@upi" className="input-field py-4 text-lg" />
                      <p className="text-sm text-brand-400/80 mt-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> You will receive a payment request on your UPI app.
                      </p>
                    </div>
                  )}

                  <div className="pt-8 mt-8 border-t border-slate-800">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full btn-primary py-4 text-xl shadow-brand-500/20 flex justify-center items-center gap-3 font-display font-bold tracking-wide"
                    >
                      {submitting ? (
                        <>Processing Payment...</>
                      ) : (
                        <>Pay Rs. {totalAmount} <CheckCircle2 className="h-6 w-6" /></>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-cinema-card rounded-2xl shadow-2xl border border-slate-800 overflow-hidden sticky top-24 animate-slide-up" style={{animationDelay: '0.1s'}}>
              {/* Cinematic movie backdrop */}
              <div className="relative h-32 bg-slate-900 overflow-hidden">
                 {movie.imageUrl ? (
                   <>
                    <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover opacity-50 blur-sm scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-card to-transparent" />
                   </>
                 ) : (
                   <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 to-slate-900" />
                 )}
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white z-10">
                   <Ticket className="h-10 w-10 text-brand-400 mb-2 drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                   <h2 className="text-lg font-display font-bold uppercase tracking-widest text-slate-200">Booking Summary</h2>
                 </div>
              </div>
              
              <div className="p-6">
                <div className="flex gap-4 mb-6 pb-6 border-b border-slate-800">
                  {movie.imageUrl ? (
                    <img src={movie.imageUrl} alt={movie.title} className="w-16 h-24 object-cover rounded-md shadow-lg" />
                  ) : (
                    <div className="w-16 h-24 bg-slate-800 rounded-md flex items-center justify-center shrink-0">
                      <Film className="h-6 w-6 text-slate-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-display font-bold text-white leading-tight mb-1">{movie.title}</h3>
                    <p className="text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">Cineverse Premium</p>
                    <p className="text-slate-400 text-sm">{showDate ? new Date(showDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Today'}, {showTime || '7:30 PM'}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Tickets ({ticketCount})</span>
                    <span className="font-medium text-white">Rs. {ticketCount * ticketPrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Selected Seats</span>
                    <span className="font-bold text-brand-400 text-right">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Convenience Fee</span>
                    <span className="font-medium text-white">Rs. {convenienceFee}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-800 mb-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Amount Payable</span>
                  <span className="font-display font-bold text-brand-400 text-3xl drop-shadow-[0_0_10px_rgba(20,184,166,0.2)]">Rs. {totalAmount}</span>
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
