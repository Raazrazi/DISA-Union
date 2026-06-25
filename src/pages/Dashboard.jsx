import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StorageOverview from '../components/StorageOverview';
import FileManager from '../components/FileManager';
import ActivityTimeline from '../components/ActivityTimeline';
import UserManagement from '../components/UserManagement';
import { 
  Loader2, 
  BarChart3, 
  Layers, 
  ShieldAlert, 
  FolderSync, 
  Network 
} from 'lucide-react';

const Dashboard = () => {
  const { user, token, API_URL } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Analytics data states
  const [systemStats, setSystemStats] = useState(null);
  const [wingStats, setWingStats] = useState(null);

  // Authenticate user check
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchAnalytics = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (user.role === 'super_admin') {
        const res = await axios.get(`${API_URL}/analytics/system`);
        setSystemStats(res.data);
      } else if (user.role === 'wing_admin' && user.wing) {
        const res = await axios.get(`${API_URL}/analytics/wing/${encodeURIComponent(user.wing)}`);
        setWingStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching analytics details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user, activeTab]);

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#08070b] pt-20">
      {/* Sidebar Panel */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Frame */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Syncing Admin Assets...</span>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            
            {/* 1. Overview Tab */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-8">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Dashboard Overview</h1>
                  <p className="text-xs text-neutral-500 font-semibold mt-0.5">
                    Logged in as {user.username} ({user.role?.replace('_', ' ')})
                  </p>
                </div>

                <StorageOverview stats={user.role === 'super_admin' ? systemStats?.storage : wingStats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Activity Timeline logs */}
                  <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col gap-6">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                      <FolderSync className="w-4 h-4 text-violet-400" />
                      Recent Workspace Logs
                    </h3>
                    <ActivityTimeline 
                      activities={user.role === 'super_admin' ? systemStats?.activityFeed : wingStats?.recentActivity} 
                    />
                  </div>

                  {/* Quick System Info */}
                  <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 justify-between">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                      <Network className="w-4 h-4 text-cyan-400" />
                      System Access Thresholds
                    </h3>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-bold">Authorized Role</span>
                        <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold">
                          {user.role}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-bold">Files Database</span>
                        <span className="text-neutral-300 font-semibold">MongoDB v8.0 / JSON Fallback</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-bold">Network Core</span>
                        <span className="text-neutral-300 font-semibold">Express Endpoint Server</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] text-neutral-500 leading-relaxed font-semibold">
                      Please monitor storage allocations. Super admins can allocate up to 25 GB limit across all wings dynamically.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. File Explorer Tab */}
            {activeTab === 'files' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">File Manager</h1>
                  <p className="text-xs text-neutral-500 font-semibold mt-0.5">Upload, folder-nest, and search records</p>
                </div>
                <div className="glass-panel rounded-2xl p-6">
                  <FileManager />
                </div>
              </div>
            )}

            {/* 3. Analytics Charts Tab */}
            {activeTab === 'analytics' && (
              <div className="flex flex-col gap-8">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Platform Analytics</h1>
                  <p className="text-xs text-neutral-500 font-semibold mt-0.5">Live metrics and storage analytics</p>
                </div>

                {user.role === 'super_admin' && systemStats && (
                  <div className="flex flex-col gap-8">
                    {/* SVG Analytics Chart */}
                    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-violet-400" />
                        Storage Growth (Last 6 Months)
                      </h3>
                      
                      <div className="w-full h-48 bg-neutral-950/40 rounded-xl border border-white/5 p-4 flex items-end justify-between relative">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                          <div className="border-b border-white/5 w-full h-0" />
                          <div className="border-b border-white/5 w-full h-0" />
                          <div className="border-b border-white/5 w-full h-0" />
                        </div>
                        
                        {systemStats.growth.map((g, idx) => {
                          const percent = Math.min(100, Math.max(10, (g.storageUsed / systemStats.storage.totalLimit) * 100 * 5)); // scaled for visual
                          return (
                            <div key={idx} className="flex flex-col items-center gap-2 z-10 w-12 group">
                              <span className="text-[10px] font-bold text-violet-400 opacity-0 group-hover:opacity-100 transition duration-300">
                                {(g.storageUsed / (1024 * 1024 * 1024)).toFixed(1)} GB
                              </span>
                              <div 
                                className="w-6 bg-gradient-to-t from-violet-600 to-cyan-400 rounded-t-lg transition-all duration-500 group-hover:scale-y-105"
                                style={{ height: `${percent}px` }}
                              />
                              <span className="text-[10px] text-neutral-500 font-bold">{g.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quota breakdown lists */}
                    <div className="glass-panel rounded-2xl overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/[0.02] text-neutral-400 font-bold uppercase tracking-wider">
                            <th className="p-4">Union Wing Name</th>
                            <th className="p-4">Quota Allocation</th>
                            <th className="p-4">Disk Space Used</th>
                            <th className="p-4">Consumption Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {systemStats.wingBreakdown.map(wb => (
                            <tr key={wb.name} className="border-b border-white/5 hover:bg-white/[0.01] transition">
                              <td className="p-4 font-semibold text-neutral-200">{wb.name}</td>
                              <td className="p-4 text-neutral-400">{formatSize(wb.storageQuota)}</td>
                              <td className="p-4 text-neutral-400">{formatSize(wb.storageUsed)}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-white/5">
                                    <div 
                                      className="h-full bg-violet-500 rounded-full" 
                                      style={{ width: `${Math.min(100, parseFloat(wb.percentage))}%` }}
                                    />
                                  </div>
                                  <span className="font-semibold text-neutral-300">{wb.percentage}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {user.role === 'wing_admin' && wingStats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Media Type Distribution Chart */}
                    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        Media Quota Distribution
                      </h3>

                      <div className="flex flex-col gap-4">
                        {Object.entries(wingStats.breakdown).map(([type, size]) => {
                          const percent = wingStats.storageUsed > 0 ? ((size / wingStats.storageUsed) * 100).toFixed(1) : 0;
                          return (
                            <div key={type} className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-neutral-300 capitalize">{type}s</span>
                                <span className="text-neutral-500 font-bold">{formatSize(size)} ({percent}%)</span>
                              </div>
                              <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-white/5">
                                <div 
                                  className="h-full bg-cyan-400 rounded-full" 
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. User Quotas Tab (Super Admin Only) */}
            {activeTab === 'users' && user.role === 'super_admin' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Quota Control Hub</h1>
                  <p className="text-xs text-neutral-500 font-semibold mt-0.5">Register coordinators and assign space thresholds</p>
                </div>
                <UserManagement />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
