import React from 'react';
import { HardDrive, File, Folder } from 'lucide-react';

const StorageOverview = ({ stats }) => {
  if (!stats) return null;

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const percentage = parseFloat(stats.percentage || 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Storage Gauge Card */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between gap-6 relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/10 blur-3xl rounded-full" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-200">Storage Usage</h3>
              <p className="text-xs text-neutral-500 font-medium">Dynamic platform allocation</p>
            </div>
          </div>
          <span className="text-xl font-bold text-neutral-200">{percentage.toFixed(1)}%</span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Progress bar */}
          <div className="w-full h-3 bg-neutral-950 rounded-full border border-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${
                percentage > 90 
                  ? 'from-red-500 to-rose-600' 
                  : percentage > 75 
                    ? 'from-orange-400 to-amber-500' 
                    : 'from-violet-500 to-cyan-400'
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-neutral-400 font-semibold px-0.5">
            <span>Used: {formatSize(stats.used || stats.storageUsed || 0)}</span>
            <span>Limit: {formatSize(stats.totalLimit || stats.storageQuota || 0)}</span>
          </div>
        </div>
      </div>

      {/* Mini Stats Card */}
      <div className="glass-panel rounded-2xl p-6 grid grid-cols-2 gap-4 items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <File className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Files</h4>
            <p className="text-lg font-bold text-neutral-200 mt-0.5">{stats.filesCount || stats.counts?.files || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Folder className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Folders</h4>
            <p className="text-lg font-bold text-neutral-200 mt-0.5">{stats.foldersCount || stats.counts?.folders || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageOverview;
