import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Users, Ticket, TrendingUp, AlertTriangle, Shield } from 'lucide-react';
import { getMovies, type Movie } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies().then((res) => {
      setMovies(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { title: 'Total Revenue', value: '$45,231', icon: <TrendingUp className="h-6 w-6 text-emerald-400" />, trend: '+12.5%' },
    { title: 'Active Movies', value: movies.length, icon: <Film className="h-6 w-6 text-brand-400" />, trend: 'Stable' },
    { title: 'Total Bookings', value: '1,248', icon: <Ticket className="h-6 w-6 text-blue-400" />, trend: '+5.2%' },
    { title: 'Registered Users', value: '8,432', icon: <Users className="h-6 w-6 text-purple-400" />, trend: '+18.1%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">System overview and management console</p>
        </div>
        <button onClick={() => navigate('/admin/movies')} className="btn-primary">
          Manage Movies
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-surface-dark rounded-lg border border-white/5">
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-400 font-medium text-sm mb-1">{stat.title}</h3>
            <p className="text-3xl font-display font-bold text-white">{loading ? '-' : stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl"
        >
          <h2 className="text-xl font-display font-bold text-white mb-6">Recent Bookings</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface-dark/50 rounded-xl border border-white/5 hover:border-brand-500/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold">
                    U
                  </div>
                  <div>
                    <p className="text-white font-medium">User {i + 1} booked tickets</p>
                    <p className="text-xs text-slate-400">For Kalki 2898 AD • Today at 7:30 PM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-brand-400 font-bold">₹{1200 - i * 150}</p>
                  <p className="text-xs text-slate-500">2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 rounded-2xl"
        >
          <h2 className="text-xl font-display font-bold text-white mb-6">System Alerts</h2>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-500 mb-1">High Traffic Warning</p>
                <p className="text-xs text-yellow-500/70">Database load is currently at 85% capacity due to high booking volume.</p>
              </div>
            </div>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
              <Shield className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-500 mb-1">System Secure</p>
                <p className="text-xs text-emerald-500/70">All automated backups completed successfully.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
