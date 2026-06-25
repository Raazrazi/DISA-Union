import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStorage } from '../context/StorageContext';
import { Shield, LogOut, ChevronDown, Menu, X, FolderLock } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { wings } = useStorage();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 glass-panel rounded-2xl py-3 px-6 shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 group-hover:border-violet-500/60 transition duration-300">
            <FolderLock className="w-6 h-6 text-violet-400 group-hover:scale-110 transition duration-300" />
            <div className="absolute inset-0 bg-violet-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition duration-300" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            UNION <span className="text-violet-400">VAULT</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-neutral-300 hover:text-white transition">Home</Link>
          
          {/* Wings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
              className="flex items-center gap-1 text-sm font-medium text-neutral-300 hover:text-white transition focus:outline-none"
            >
              Wings <ChevronDown className={`w-4 h-4 transition duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <div 
                className="absolute top-[120%] left-1/2 -translate-x-1/2 w-56 p-2 rounded-xl glass-panel shadow-2xl flex flex-col gap-1 border border-white/5 animate-fade-in"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                {wings.map(wing => (
                  <Link
                    key={wing._id}
                    to={`/wing/${encodeURIComponent(wing.name)}`}
                    onClick={() => setDropdownOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-white/5 transition"
                  >
                    {wing.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/archive" className="text-sm font-medium text-neutral-300 hover:text-white transition">Archive</Link>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 font-medium text-sm text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-[1.02]"
              >
                <Shield className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 text-neutral-400 hover:text-red-400 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 font-medium text-sm text-white transition-all duration-300"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/5 flex flex-col gap-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-sm font-medium text-neutral-300 hover:text-white transition px-2 py-1">Home</Link>
          <div className="flex flex-col gap-1.5 pl-4 border-l border-white/5">
            <span className="text-xs font-bold text-neutral-500 tracking-wider uppercase mb-1">Union Wings</span>
            {wings.map(wing => (
              <Link
                key={wing._id}
                to={`/wing/${encodeURIComponent(wing.name)}`}
                onClick={() => setIsOpen(false)}
                className="text-sm text-neutral-400 hover:text-white transition py-1"
              >
                {wing.name}
              </Link>
            ))}
          </div>
          <Link to="/archive" onClick={() => setIsOpen(false)} className="text-sm font-medium text-neutral-300 hover:text-white transition px-2 py-1">Archive</Link>
          
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-3 w-full justify-between">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white font-medium text-sm w-full text-center justify-center shadow-lg"
                >
                  <Shield className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl border border-white/5 text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-center text-sm font-medium text-white w-full border border-white/10"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
