import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { Shield, Sparkles, User, Lock, Mail } from 'lucide-react';

export const Auth = ({ isRegister = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [mode, setMode] = useState(isRegister ? 'register' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/passbook');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@schemesetu.gov.in');
    setPassword('admin123');
    setMode('login');
  };

  const handleQuickDemoCitizen = () => {
    setEmail('demo@schemesetu.gov.in');
    setPassword('demo123');
    setMode('login');
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-md mx-auto flex flex-col justify-center">
      <DisclaimerBanner />

      <div className="bg-card border border-navy/20 rounded-lg p-6 sm:p-8 shadow-xl my-6 space-y-6">
        <div className="text-center">
          <div className="font-serif font-bold text-2xl text-navy">
            {mode === 'login' ? 'Citizen & Admin Login' : 'Create Citizen Account'}
          </div>
          <p className="text-xs font-mono text-ink-soft mt-1">
            Access your saved eligibility passbook and application tracker
          </p>
        </div>

        {error && (
          <div className="bg-rust/10 border border-rust/30 text-rust text-xs font-mono p-3 rounded">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-mono font-bold text-navy mb-1">Full Name*</label>
              <div className="relative">
                <User className="w-4 h-4 text-navy/40 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded pl-9 pr-3 py-2.5 focus:outline-none focus:border-gold-deep"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-mono font-bold text-navy mb-1">Email Address*</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-navy/40 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="citizen@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-paper border border-navy/20 rounded pl-9 pr-3 py-2.5 focus:outline-none focus:border-gold-deep"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-navy mb-1">Password*</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-navy/40 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-paper border border-navy/20 rounded pl-9 pr-3 py-2.5 focus:outline-none focus:border-gold-deep"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm font-semibold">
            {loading ? 'Authenticating...' : mode === 'login' ? 'Login to Passbook →' : 'Register Account →'}
          </button>
        </form>

        {/* Quick Demo Fill Credentials */}
        <div className="border-t border-navy/15 pt-4 space-y-2 font-mono text-xs">
          <div className="text-ink-soft text-[11px] font-bold uppercase tracking-wider text-center">Demo Quick Login</div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleQuickDemoCitizen} 
              className="p-2 bg-paper hover:bg-teal/15 border border-navy/15 rounded text-[11px] font-bold text-teal-deep text-center"
            >
              Demo Citizen
            </button>
            <button 
              onClick={handleQuickDemoAdmin} 
              className="p-2 bg-paper hover:bg-rust/15 border border-navy/15 rounded text-[11px] font-bold text-rust text-center"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs font-mono text-ink-soft">
          {mode === 'login' ? (
            <span>Don't have an account? <button onClick={() => setMode('register')} className="text-navy font-bold underline">Register here</button></span>
          ) : (
            <span>Already have an account? <button onClick={() => setMode('login')} className="text-navy font-bold underline">Login here</button></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
