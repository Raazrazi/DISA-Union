import React from 'react';
import { 
  CloudLightning, 
  Trash2, 
  FolderPlus, 
  LogIn, 
  ShieldAlert, 
  History 
} from 'lucide-react';

const ActivityTimeline = ({ activities }) => {
  const getIcon = (action) => {
    switch (action) {
      case 'UPLOAD_FILES':
        return { icon: CloudLightning, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'DELETE_FILES':
      case 'DELETE_FOLDER':
        return { icon: Trash2, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
      case 'CREATE_FOLDER':
        return { icon: FolderPlus, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' };
      case 'UPDATE_QUOTA':
        return { icon: ShieldAlert, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'CREATE_WING':
        return { icon: FolderPlus, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
      default:
        return { icon: History, color: 'text-neutral-400 bg-white/5 border-white/10' };
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-neutral-500 font-semibold">
        No recent activities logged.
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l border-white/5 flex flex-col gap-6">
      {activities.map((log) => {
        const { icon: Icon, color } = getIcon(log.action);
        return (
          <div key={log._id} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {/* Timeline Dot Indicator */}
            <div className={`absolute -left-[35px] p-1.5 rounded-full border ${color} z-10 bg-neutral-950`}>
              <Icon className="w-3.5 h-3.5" />
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <h4 className="text-xs font-semibold text-neutral-200 leading-snug">{log.description}</h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                By <span className="font-semibold text-neutral-400">{log.user}</span>
                {log.wing && <> in <span className="font-medium text-violet-400/80">{log.wing}</span></>}
              </p>
            </div>

            <span className="text-[10px] text-neutral-500 font-bold self-start sm:self-center flex-shrink-0">
              {formatDate(log.date || log.createdAt)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
