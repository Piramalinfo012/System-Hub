import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RotateCw, 
  Bell, 
  LogOut, 
  CheckCircle2, 
  Sliders, 
  Layers, 
  ExternalLink,
  ChevronDown,
  User,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { UserProfile } from '../../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
  dataSource: 'GOOGLE_APPS_SCRIPT' | 'SIMULATOR' | 'LOCAL_CACHE';
  onOpenSettings: () => void;
  onOpenAppsScriptStudio: () => void;
  onSelectSystem?: (systemId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  user,
  onLogout,
  searchQuery,
  onSearchChange,
  onRefreshData,
  isRefreshing,
  lastUpdated,
  dataSource,
  onOpenSettings,
  onOpenAppsScriptStudio,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshSuccessToast, setRefreshSuccessToast] = useState(false);

  const handleRefreshClick = () => {
    onRefreshData();
    setRefreshSuccessToast(true);
    setTimeout(() => setRefreshSuccessToast(false), 3000);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatLastUpdated = (isoString: string) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-30 w-full transition-colors duration-200 border-b backdrop-blur-md ${
        darkMode
          ? 'bg-slate-950/80 border-slate-800/80 text-slate-100'
          : 'bg-white/85 border-slate-200 text-slate-800 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base sm:text-lg leading-tight bg-linear-to-r from-slate-100 via-cyan-200 to-blue-200 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                  DIGITAL SYSTEM HUB
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Command Center
                </span>
              </div>
              <p className={`text-[11px] hidden sm:block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Enterprise Operational Index & Workflows
              </p>
            </div>
          </div>

          {/* Source Indicator Badge */}
          <button
            id="source-indicator-badge"
            onClick={onOpenAppsScriptStudio}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              dataSource === 'GOOGLE_APPS_SCRIPT'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
            }`}
            title="Click to view Google Apps Script configuration"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dataSource === 'GOOGLE_APPS_SCRIPT' ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${dataSource === 'GOOGLE_APPS_SCRIPT' ? 'bg-emerald-500' : 'bg-cyan-500'}`}></span>
            </span>
            <span>{dataSource === 'GOOGLE_APPS_SCRIPT' ? 'Live Sheet API' : 'Sheet Simulator'}</span>
          </button>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-4">
          <div className="relative">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search systems, departments, doers, or workflow steps..."
              className={`w-full pl-10 pr-16 py-2 rounded-xl text-xs sm:text-sm transition-all focus:outline-hidden focus:ring-2 ${
                darkMode
                  ? 'bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                  : 'bg-slate-100 border border-slate-300/80 text-slate-900 placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20'
              }`}
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-300 hover:text-white"
              >
                ESC
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <kbd className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-200 border-slate-300 text-slate-500'}`}>
                  ⌘K
                </kbd>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Refresh Button */}
          <div className="relative">
            <button
              id="header-refresh-button"
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              } ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
              title={`Last updated: ${formatLastUpdated(lastUpdated)}`}
            >
              <RotateCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isRefreshing ? 'Updating...' : 'Refresh'}
              </span>
            </button>

            {/* Quick Refresh Confirmation Toast */}
            {refreshSuccessToast && !isRefreshing && (
              <div className="absolute right-0 top-full mt-2 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-1 duration-200 whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Data updated from Google Sheet
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />

          {/* Notifications */}
          <div className="relative">
            <button
              id="header-notifications-button"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl border transition-all relative ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
              }`}
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950"></span>
            </button>

            {showNotifications && (
              <div
                className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border p-4 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  darkMode ? 'bg-slate-900/95 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-semibold text-xs uppercase tracking-wider text-slate-400">System Logs & Updates</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">Live</span>
                </div>
                <div className="py-2 space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-cyan-300">Google Sheet Connected</span>
                      <span className="text-[10px] text-slate-400">Now</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px]">
                      Schema detected with natural step sorting (STEP-1 to STEP-10).
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-emerald-300">Auto-Deduplication Active</span>
                      <span className="text-[10px] text-slate-400">Sync</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px]">
                      Duplicate rows intelligently merged into singular operational cards.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              id="header-user-profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-linear-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold leading-tight line-clamp-1">{user?.name || 'Authorized User'}</p>
                <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{user?.role || 'Operator'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div
                className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  darkMode ? 'bg-slate-900/95 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="px-3 py-2.5 border-b border-slate-800">
                  <p className="text-sm font-semibold">{user?.name || 'Enterprise User'}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email || 'user@company.internal'}</p>
                  <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {user?.department || 'Operations'} • {user?.role || 'Member'}
                  </div>
                </div>

                <div className="py-1 space-y-0.5 text-xs">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAppsScriptStudio();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                    <span>Apps Script & Sheet Setup</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-800 transition-colors"
                  >
                    <Sliders className="w-4 h-4 text-slate-400" />
                    <span>Portal Settings & API</span>
                  </button>
                </div>

                <div className="pt-1 mt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
