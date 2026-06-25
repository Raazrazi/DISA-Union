import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStorage } from '../context/StorageContext';
import { Lock, User, Mail, ShieldAlert, Sparkles, FolderLock } from 'lucide-react';

const Login = () => {
  const { login, registerUser } = useAuth();
  const { wings } = useStorage();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedWing, setSelectedWing] = useState('');
  const [role, setRole] = useState('wing_admin');
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (isLogin) {
      const res = await login(username, password);
      setLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setMessage(res.message);
      }
    } else {
      // Validate register fields
      if (role === 'wing_admin' && !selectedWing) {
        setMessage('Please select an associated union wing.');
        setLoading(false);
        return;
      }
      
      const res = await registerUser({
        username,
        email,
        password,
        role,
        wing: role === 'wing_admin' ? selectedWing : null
      });
      setLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setMessage(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-violet-600/10 blur-[120px] rounded-full -z-10" />
      
      {/* Auth Card */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-6 relative shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="p-3 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
            <FolderLock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 justify-center">
              {isLogin ? 'Sign In to Vault' : 'Create Coordinator Account'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {isLogin ? 'Enter administrative credentials' : 'Register a new wing admin'}
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {message && (
          <div className="p-3 text-xs font-semibold rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5" />
            {message}
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex rounded-xl bg-neutral-950 p-1 border border-white/5 w-full">
          <button
            onClick={() => {
              setIsLogin(true);
              setMessage('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition duration-300 ${
              isLogin ? 'bg-white/5 text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setMessage('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition duration-300 ${
              !isLogin ? 'bg-white/5 text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin_username"
              className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-neutral-200 focus:outline-none focus:border-violet-500/60 placeholder-neutral-700 transition"
            />
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@unionvault.org"
                className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-neutral-200 focus:outline-none focus:border-violet-500/60 placeholder-neutral-700 transition"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-neutral-200 focus:outline-none focus:border-violet-500/60 placeholder-neutral-700 transition"
            />
          </div>

          {!isLogin && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-400">Portal Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-neutral-200 focus:outline-none focus:border-violet-500/60 transition"
                >
                  <option value="wing_admin">Wing Coordinator</option>
                  <option value="super_admin">Super Administrator</option>
                  <option value="viewer">Guest Viewer</option>
                </select>
              </div>

              {role === 'wing_admin' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-400">Associated Union Wing</label>
                  <select
                    required
                    value={selectedWing}
                    onChange={(e) => setSelectedWing(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-neutral-200 focus:outline-none focus:border-violet-500/60 transition"
                  >
                    <option value="">-- Select Wing --</option>
                    {wings.map(wing => (
                      <option key={wing._id} value={wing.name}>
                        {wing.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs shadow-lg shadow-violet-500/25 transition disabled:opacity-50 mt-2 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {isLogin ? 'Sign In' : 'Register Account'}
              </>
            )}
          </button>
        </form>

        {isLogin && (
          <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl text-[10px] text-neutral-500 font-semibold leading-relaxed">
            <span className="text-violet-400 font-bold">Quick credentials for testing:</span><br />
            • Super Admin: <span className="text-neutral-300">admin / admin123</span><br />
            • Wing Admin: <span className="text-neutral-300">arabic_admin / admin123</span><br />
            • Guest: <span className="text-neutral-300">guest / admin123</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
