import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FileManager from '../components/FileManager';
import { Database, HardDrive, ArrowLeft, Loader2 } from 'lucide-react';

const WingProfile = () => {
  const { name } = useParams();
  const { API_URL } = useAuth();
  
  const [wing, setWing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWingDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/wings/${encodeURIComponent(name)}`);
      setWing(res.data);
    } catch (err) {
      console.error('Error loading wing details', err);
      setError('Wing profile not found or server is offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWingDetails();
  }, [name]);

  const formatSize = (bytes) => {
    if (!bytes) return '0 GB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        <span className="text-xs font-bold uppercase tracking-wider">Syncing Workspace Portal...</span>
      </div>
    );
  }

  if (error || !wing) {
    return (
      <div className="max-w-md mx-auto w-[92%] text-center min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="p-4 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          <Database className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Profile Loading Failed</h2>
        <p className="text-xs text-neutral-500 leading-relaxed">{error || 'Unable to retrieve wing data.'}</p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10"
        >
          Back to Directory
        </Link>
      </div>
    );
  }

  const quotaPercent = parseFloat(((wing.storageUsed / wing.storageQuota) * 100).toFixed(1));

  return (
    <div className="max-w-6xl mx-auto w-[92%] pt-28 pb-16 flex flex-col gap-8">
      {/* Back Button */}
      <Link
        to="/"
        className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white transition self-start group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
        Back to Wings Directory
      </Link>

      {/* Wing Portal Header Banner */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Abstract shape backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
            <Database className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1.5 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{wing.name}</h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              {wing.description}
            </p>
          </div>
        </div>

        {/* Quota overview widget */}
        <div className="flex flex-col gap-2 w-full md:w-60 flex-shrink-0 bg-neutral-950/40 p-4 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-400">Vault Utilization</span>
            <span className="font-bold text-neutral-200">{quotaPercent}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, quotaPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-500 font-bold">
            <span>Used: {formatSize(wing.storageUsed)}</span>
            <span>Quota: {formatSize(wing.storageQuota)}</span>
          </div>
        </div>
      </div>

      {/* Directory Browser (Reusable FileManager) */}
      <div className="glass-panel rounded-2xl p-6">
        <FileManager wingProp={wing.name} />
      </div>
    </div>
  );
};

export default WingProfile;
