import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  Lock, 
  User, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  ArrowLeft,
  Info
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { adminLogin, language, t, navigateTo, setLanguage } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = adminLogin(username, password);
    if (!success) {
      setError(
        language === 'bn' 
          ? 'ভুল ইউজারনেম বা পাসওয়ার্ড। ডেমো তথ্য: admin / password123' 
          : 'Invalid credentials. Demo login: admin / password123'
      );
    }
  };

  const handleQuickLogin = () => {
    setUsername('admin');
    setPassword('password123');
    adminLogin('admin', 'password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Language and Back to Store */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 z-10">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.adminViewStore}</span>
        </button>

        {/* Language Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-0.5 text-xs font-bold rounded-lg transition-all ${
              language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('bn')}
            className={`px-2.5 py-0.5 text-xs font-bold rounded-lg transition-all ${
              language === 'bn' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            বাং
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25 ring-4 ring-blue-500/20">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {t.adminLoginTitle}
          </h1>
          <p className="text-xs text-slate-400">
            {t.adminLoginSubtitle}
          </p>
        </div>

        {/* Frontend Prototype Security Disclaimer Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <p className="leading-relaxed">
            {t.adminDemoNotice}
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Demo Credentials</span>
            </span>
            <button
              type="button"
              onClick={handleQuickLogin}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-bold underline"
            >
              {t.adminQuickLogin}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-300">
            <div className="bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 truncate">
              User: <strong className="text-white">admin</strong>
            </div>
            <div className="bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 truncate">
              Pass: <strong className="text-white">password123</strong>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.adminUsername}
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.adminPassword}
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-99"
          >
            <span>{t.adminLoginButton}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
          <Info className="w-3 h-3" />
          <span>{t.adminStorageNotice}</span>
        </p>
      </div>
    </div>
  );
};
