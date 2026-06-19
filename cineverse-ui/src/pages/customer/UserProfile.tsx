import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Edit3, Settings } from 'lucide-react';
import { getAuthName, clearAuthData } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    setUserName(getAuthName() || 'Guest User');
    setUserEmail(localStorage.getItem('authEmail') || 'Not provided');
  }, []);

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-3xl"
      >
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-brand-500/20 border-4 border-brand-500/30 flex items-center justify-center text-4xl font-display font-bold text-brand-400 shadow-[0_0_30px_rgba(20,184,166,0.2)]">
              {userName.charAt(0).toUpperCase()}
            </div>
            <button className="mt-4 flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors">
              <Edit3 className="h-4 w-4" /> Edit Avatar
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-6 w-full">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-1">{userName}</h1>
              <p className="text-slate-400 flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-500" /> Premium Member
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-dark/50 p-4 rounded-xl border border-white/5">
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Mail className="h-4 w-4" /> Email Address</p>
                <p className="text-white font-medium">{userEmail}</p>
              </div>
              <div className="bg-surface-dark/50 p-4 rounded-xl border border-white/5">
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Calendar className="h-4 w-4" /> Member Since</p>
                <p className="text-white font-medium">May 2026</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-wrap gap-4">
              <button onClick={() => navigate('/history')} className="btn-primary">
                View My Bookings
              </button>
              <button onClick={() => navigate('/settings')} className="btn-secondary">
                <Settings className="h-4 w-4 mr-2" /> Account Settings
              </button>
              <button onClick={handleLogout} className="btn-danger ml-auto">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
