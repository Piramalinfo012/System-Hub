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
  FileSpreadsheet,
  Activity,
  Radio,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

  const profileMenuRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    if (!isoString) return 'LIVE';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'LIVE';
    }
  };

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-30 w-full transition-colors duration-200 border-b backdrop-blur-md relative ${
        darkMode
          ? 'bg-slate-950/85 border-slate-800/80 text-slate-100 shadow-lg shadow-cyan-950/20'
          : 'bg-white/90 border-slate-200 text-slate-800 shadow-xs'
      }`}
    >
      {/* Cyber Top Scanning Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-cyan-400 to-transparent opacity-80"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <motion.div 
              whileHover={{ rotate: 90, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="w-10 h-10 rounded-xl bg-linear-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40 relative group cursor-pointer"
            >
              <Cpu className="w-5 h-5 text-slate-950" />
              <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-md -z-10 group-hover:blur-lg transition-all"></div>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider font-mono text-base sm:text-lg leading-tight cyber-gradient-text inline-block">
                  {"DIGITAL SYSTEM HUB".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      style={{ whiteSpace: 'pre' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-xs shadow-cyan-500/20">
                  <div className="flex items-end gap-[2px] h-3">
                    <span className="w-0.5 bg-cyan-400 rounded-full animate-wave-1"></span>
                    <span className="w-0.5 bg-cyan-300 rounded-full animate-wave-2"></span>
                    <span className="w-0.5 bg-cyan-400 rounded-full animate-wave-3"></span>
                  </div>
                  CYBER_HUD
                </span>
              </div>
              <p className={`text-[11px] hidden sm:block font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Operational Intelligence & Workflow Engine
              </p>
            </div>
          </div>

          {/* Source Indicator Badge */}
          <button
            id="source-indicator-badge"
            onClick={onOpenAppsScriptStudio}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border transition-all ${
              dataSource === 'GOOGLE_APPS_SCRIPT'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25 shadow-xs shadow-emerald-500/20'
                : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/25 shadow-xs shadow-cyan-500/20'
            }`}
            title="Click to view Google Apps Script configuration"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dataSource === 'GOOGLE_APPS_SCRIPT' ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${dataSource === 'GOOGLE_APPS_SCRIPT' ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
            </span>
            <span>{dataSource === 'GOOGLE_APPS_SCRIPT' ? 'LIVE_API' : 'LOCAL_SIMULATOR'}</span>
          </button>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-4">
          <div className="relative">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-cyan-400' : 'text-slate-400'}`} />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search systems, workflows, doers, or departments..."
              className={`w-full pl-10 pr-16 py-2 rounded-xl text-xs sm:text-sm transition-all focus:outline-hidden focus:ring-2 ${
                darkMode
                  ? 'bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-500/20 shadow-inner'
                  : 'bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20'
              }`}
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:text-white"
              >
                ESC
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <kbd className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${darkMode ? 'bg-slate-950 border-slate-700 text-cyan-400' : 'bg-slate-200 border-slate-300 text-slate-500'}`}>
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
            <motion.button
              whileTap={{ scale: 0.95 }}
              id="header-refresh-button"
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-cyan-500/40 hover:text-cyan-300'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              } ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
              title={`Last sync: ${formatLastUpdated(lastUpdated)}`}
            >
              <RotateCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isRefreshing ? 'SYNCING...' : 'SYNC'}
              </span>
            </motion.button>

            {/* Quick Refresh Confirmation Toast */}
            {refreshSuccessToast && !isRefreshing && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-full mt-2 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-mono font-bold shadow-lg shadow-emerald-500/20 whitespace-nowrap"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                SYNC_OK
              </motion.div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              id="header-notifications-button"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl border transition-all relative ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300'
                  : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
              }`}
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse"></span>
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border p-4 z-50 relative overflow-hidden ${
                    darkMode ? 'bg-slate-900/95 border-cyan-500/30 text-slate-100 backdrop-blur-md' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></span>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-mono font-bold text-xs uppercase tracking-wider text-cyan-400">TELEMETRY_LOGS</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">CORE_LIVE</span>
                  </div>
                  <div className="py-2 space-y-2.5 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300">GOOGLE_APPS_SCRIPT_OK</span>
                        <span className="text-[10px] text-slate-500">REALTIME</span>
                      </div>
                      <p className="text-slate-400 mt-1 text-[11px] font-sans">
                        Schema auto-mapped with natural workflow step sorter (STEP-1..10).
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400">DEDUPLICATION_ACTIVE</span>
                        <span className="text-[10px] text-slate-500">SYNCED</span>
                      </div>
                      <p className="text-slate-400 mt-1 text-[11px] font-sans">
                        Intelligent row consolidator merged multi-entry systems.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              id="header-user-profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-cyan-500/40 hover:bg-slate-850'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-linear-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 text-xs font-black shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold font-mono leading-tight line-clamp-1 text-slate-200">{user?.name || 'OPERATOR'}</p>
                <p className={`text-[10px] font-mono ${darkMode ? 'text-cyan-400' : 'text-slate-500'}`}>{user?.role || 'SYSTEM_ADMIN'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border p-2 z-50 relative overflow-hidden ${
                    darkMode ? 'bg-slate-900/95 border-cyan-500/30 text-slate-100 backdrop-blur-md' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></span>
                  <div className="px-3 py-2.5 border-b border-slate-800">
                    <p className="text-sm font-bold font-mono text-cyan-300">{user?.name || 'Enterprise User'}</p>
                    <p className="text-xs text-slate-400 truncate font-mono">{user?.email || 'operator@hub.internal'}</p>
                    <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {user?.department || 'Operations'} • {user?.role || 'Commander'}
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5 text-xs font-medium">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenAppsScriptStudio();
                      }}
                      className="hidden w-full items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-cyan-500/15 hover:text-cyan-300 transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                      <span className="font-mono text-xs">Apps Script Setup</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenSettings();
                      }}
                      className="hidden w-full items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-800 transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-slate-400" />
                      <span className="font-mono text-xs">Portal Settings & API</span>
                    </button>
                  </div>

                  <div className="pt-1 mt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-bold font-mono"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>TERMINATE_SESSION</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Direct Logout Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className={`p-2 rounded-xl border transition-all ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-rose-400 hover:border-rose-500/40 hover:bg-rose-950/30'
                : 'bg-slate-100 border-slate-300 text-rose-500 hover:bg-rose-100'
            }`}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>

        </div>

      </div>
    </header>
  );
};

