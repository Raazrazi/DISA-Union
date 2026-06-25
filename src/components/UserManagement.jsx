import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useStorage } from '../context/StorageContext';
import { UserPlus, Settings, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';

const UserManagement = () => {
  const { API_URL } = useAuth();
  const { wings, fetchWings } = useStorage();

  // Create User State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('wing_admin');
  const [selectedWing, setSelectedWing] = useState('');
  const [userMsg, setUserMsg] = useState({ success: true, text: '' });

  // Manage Quota State
  const [activeQuotas, setActiveQuotas] = useState({});
  const [quotaMsg, setQuotaMsg] = useState({ success: true, text: '' });

  const formatSize = (bytes) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserMsg({ success: true, text: '' });

    if (!username || !email || !password || (role === 'wing_admin' && !selectedWing)) {
      setUserMsg({ success: false, text: 'Please fill in all required fields.' });
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
        role,
        wing: role === 'wing_admin' ? selectedWing : null
      });

      setUserMsg({ success: true, text: `Successfully registered ${username} as a ${role}.` });
      setUsername('');
      setEmail('');
      setPassword('');
      setSelectedWing('');
    } catch (err) {
      setUserMsg({
        success: false,
        text: err.response?.data?.message || 'Failed to create user account.'
      });
    }
  };

  const handleQuotaChange = (wingName, newQuotaGB) => {
    setActiveQuotas(prev => ({
      ...prev,
      [wingName]: parseFloat(newQuotaGB)
    }));
  };

  const handleUpdateQuota = async (wingName) => {
    setQuotaMsg({ success: true, text: '' });
    const quotaGB = activeQuotas[wingName];
    if (!quotaGB || isNaN(quotaGB)) return;

    const quotaBytes = quotaGB * 1024 * 1024 * 1024;

    try {
      await axios.put(`${API_URL}/wings/${encodeURIComponent(wingName)}/quota`, {
        storageQuota: quotaBytes
      });
      setQuotaMsg({ success: true, text: `Updated ${wingName} quota limit to ${quotaGB} GB.` });
      fetchWings();
    } catch (err) {
      setQuotaMsg({
        success: false,
        text: err.response?.data?.message || 'Failed to update quota limit.'
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Create User Card */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-200">Register Coordinator</h3>
            <p className="text-xs text-neutral-500 font-medium">Create administrative portal users</p>
          </div>
        </div>

        {userMsg.text && (
          <div
            className={`p-3 text-xs font-semibold rounded-xl border flex items-center gap-2 ${
              userMsg.success
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {userMsg.success ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {userMsg.text}
          </div>
        )}

        <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. malayalam_admin"
                className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-neutral-200 focus:outline-none focus:border-violet-500/60 placeholder-neutral-700 transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@unionvault.org"
                className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-neutral-200 focus:outline-none focus:border-violet-500/60 placeholder-neutral-700 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-neutral-200 focus:outline-none focus:border-violet-500/60 placeholder-neutral-700 transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400">Access Role</label>
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

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs shadow-lg shadow-violet-500/25 transition duration-300"
          >
            Create User Account
          </button>
        </form>
      </div>

      {/* Quota Management Card */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-200">Storage Allocation</h3>
            <p className="text-xs text-neutral-500 font-medium">Reallocate disk limits between wings</p>
          </div>
        </div>

        {quotaMsg.text && (
          <div
            className={`p-3 text-xs font-semibold rounded-xl border flex items-center gap-2 ${
              quotaMsg.success
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {quotaMsg.success ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {quotaMsg.text}
          </div>
        )}

        <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
          {wings.map(wing => {
            const currentValGB = activeQuotas[wing.name] ?? (wing.storageQuota / (1024 * 1024 * 1024));
            return (
              <div key={wing._id} className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-300">{wing.name}</span>
                  <span className="text-neutral-500 font-bold">Used: {formatSize(wing.storageUsed)}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={currentValGB}
                    onChange={(e) => handleQuotaChange(wing.name, e.target.value)}
                    className="flex-1 accent-violet-500 h-1 bg-neutral-950 rounded-full"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-300 w-12 text-right">{currentValGB} GB</span>
                    <button
                      onClick={() => handleUpdateQuota(wing.name)}
                      disabled={currentValGB === (wing.storageQuota / (1024 * 1024 * 1024))}
                      className="p-1.5 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-violet-400"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
