import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Ticket, Settings, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { clearAuthData, isAuthenticated } from '../../services/api';

const UserProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    setName(localStorage.getItem('authName') || 'Guest User');
    setEmail(localStorage.getItem('authEmail') || 'guest@example.com');
    setRole(localStorage.getItem('authRole') || 'USER');
  }, [navigate]);

  const handleLogout = () => {
    clearAuthData();
    navigate('/');
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-24 bg-brand-600"></div>
              <div className="relative z-10">
                <div className="bg-white p-2 rounded-full inline-block mx-auto mb-4 mt-8 shadow-sm">
                  <div className="bg-brand-100 text-brand-700 h-24 w-24 rounded-full flex items-center justify-center font-bold text-4xl">
                    {name?.charAt(0).toUpperCase() || <User className="h-10 w-10" />}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{name}</h2>
                <div className="flex items-center justify-center gap-1 text-slate-500 text-sm mb-4">
                  <Mail className="h-4 w-4" /> {email}
                </div>
                <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Shield className="h-3 w-3" /> {role}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-red-600 rounded-xl transition group">
                <div className="flex items-center gap-3 font-medium">
                  <LogOut className="h-5 w-5" /> Sign Out
                </div>
              </button>
            </div>
          </div>

          {/* Right Column - Navigation */}
          <div className="lg:col-span-2 space-y-4">
            
            <Link to="/history" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between hover:border-brand-300 hover:shadow-md transition group">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 text-blue-600 p-4 rounded-xl group-hover:bg-blue-100 transition">
                  <Ticket className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">My Bookings</h3>
                  <p className="text-sm text-slate-500">View and manage all your past and upcoming movie tickets.</p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-brand-600 transition" />
            </Link>

            <button className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between hover:border-brand-300 hover:shadow-md transition group text-left">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl group-hover:bg-emerald-100 transition">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Payment Methods</h3>
                  <p className="text-sm text-slate-500">Save your cards for faster checkout experiences.</p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-brand-600 transition" />
            </button>

            <button className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between hover:border-brand-300 hover:shadow-md transition group text-left">
              <div className="flex items-center gap-4">
                <div className="bg-purple-50 text-purple-600 p-4 rounded-xl group-hover:bg-purple-100 transition">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Account Settings</h3>
                  <p className="text-sm text-slate-500">Update your personal information and security preferences.</p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-brand-600 transition" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
