import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderOpen, 
  BarChart3, 
  Users, 
  ArrowLeft, 
  FolderLock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['super_admin', 'wing_admin', 'viewer'] },
    { id: 'files', label: 'File Manager', icon: FolderOpen, roles: ['super_admin', 'wing_admin', 'viewer'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['super_admin', 'wing_admin'] },
    { id: 'users', label: 'User Quotas', icon: Users, roles: ['super_admin'] }
  ];

  return (
    <aside className="w-64 glass-panel border-y-0 border-l-0 min-h-screen p-6 flex flex-col justify-between hidden md:flex">
      <div className="flex flex-col gap-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-500/20">
            <FolderLock className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-neutral-200">WORKSPACE</h1>
            <p className="text-xs text-neutral-500 font-medium capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1.5">
          {menuItems
            .filter(item => item.roles.includes(user?.role))
            .map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition duration-300 w-full text-left ${
                    isActive
                      ? 'bg-violet-600/15 border border-violet-500/30 text-violet-300 shadow-md shadow-violet-900/10'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-neutral-500'}`} />
                  {item.label}
                </button>
              );
            })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col gap-3">
        {user?.wing && (
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Associated Wing</span>
            <span className="text-xs text-neutral-300 font-semibold truncate" title={user.wing}>
              {user.wing}
            </span>
          </div>
        )}

        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition duration-300 group mt-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition duration-300" />
          Back to Portal
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
