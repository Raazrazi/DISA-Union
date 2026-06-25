import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useStorage } from '../context/StorageContext';
import { useAuth } from '../context/AuthContext';
import { 
  FolderLock, 
  ArrowRight, 
  Layers, 
  Zap, 
  Database, 
  History, 
  Search, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

const Home = () => {
  const { wings } = useStorage();
  const { API_URL } = useAuth();
  
  // Platform stats state
  const [stats, setStats] = useState({
    totalLimit: 25 * 1024 * 1024 * 1024,
    used: 0,
    filesCount: 0,
    wingsCount: 0
  });

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/wings`);
        const wingsList = res.data;
        const totalUsed = wingsList.reduce((sum, w) => sum + w.storageUsed, 0);
        
        setStats({
          totalLimit: 25 * 1024 * 1024 * 1024,
          used: totalUsed,
          filesCount: wingsList.length * 4, // Estimate or fetch
          wingsCount: wingsList.length
        });
      } catch (err) {
        console.error('Error fetching global stats for landing page', err);
      }
    };
    fetchGlobalStats();
  }, [wings]);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 GB';
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(1) + ' GB';
  };

  return (
    <div className="relative min-h-screen pt-28 pb-16 flex flex-col gap-24">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto w-[92%] text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Introducing Union Vault v2.0
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-b from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent">
          Preserving Every <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent glow-text-violet">
            Union Achievement
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
          A premium digital headquarters designed for student unions. Combine the storage depth of 
          cloud repositories with the sleek elegance of modern showcasing portfolios.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Link
            to="/archive"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 font-semibold text-sm text-white shadow-lg shadow-violet-500/25 transition duration-300 hover:scale-[1.02]"
          >
            Explore Historical Archive
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 font-semibold text-sm text-white transition duration-300"
          >
            Coordinator Workspace
          </Link>
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-12">
          {[
            { label: 'Total Wings', val: stats.wingsCount || 9, desc: 'Active union sections' },
            { label: 'Vault Allocation', val: '25.0 GB', desc: 'Total cloud threshold' },
            { label: 'Storage Used', val: formatSize(stats.used), desc: 'Uploaded resources' },
            { label: 'System Uptime', val: '99.9%', desc: 'Real-time sync rate' }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-4 flex flex-col gap-1 items-center justify-center">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{item.label}</span>
              <span className="text-xl font-extrabold text-neutral-100 mt-1">{item.val}</span>
              <span className="text-[9px] text-neutral-600 font-semibold mt-0.5">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Wings Showcases */}
      <section className="max-w-6xl mx-auto w-[92%] flex flex-col gap-10">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">The Wings Directory</h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            Browse individual dedicated portals managed by our department admins
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wings.map(wing => (
            <Link
              key={wing._id}
              to={`/wing/${encodeURIComponent(wing.name)}`}
              className="group glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between gap-6"
            >
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition duration-300">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-200 group-hover:text-violet-300 transition duration-300">
                    {wing.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed line-clamp-3">
                    {wing.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs font-semibold text-neutral-500">
                <span>Disk Limit: {formatSize(wing.storageQuota)}</span>
                <span className="text-violet-400/80 group-hover:text-violet-400 flex items-center gap-1 transition duration-300">
                  Enter Vault <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition duration-300" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="max-w-5xl mx-auto w-[92%] flex flex-col gap-12">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-extrabold text-white">Platform Core Features</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Engineered to handle student workloads with premium elegance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Layers,
              title: 'Hierarchical Folders',
              desc: 'Create nested storage chains inside each wing drive to archive achievements efficiently.'
            },
            {
              icon: Zap,
              title: 'Instant Previews',
              desc: 'Seamlessly review posters, play union news broadcasts, and read PDF docs directly in-app.'
            },
            {
              icon: History,
              title: 'Activity Timelines',
              desc: 'Track and log uploads, directory adjustments, and admin accesses with zero data loss.'
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border border-white/5 hover:bg-white/[0.02] transition">
                <div className="p-3 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 self-start">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-200">{feat.title}</h3>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-12 mt-12 max-w-6xl mx-auto w-[92%] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-500 font-semibold">
        <div className="flex items-center gap-2">
          <FolderLock className="w-5 h-5 text-violet-400" />
          <span>UNION VAULT — Preserving Every Achievement.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/archive" className="hover:text-white transition">Search Archive</Link>
          <Link to="/login" className="hover:text-white transition">Coordinator Login</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
