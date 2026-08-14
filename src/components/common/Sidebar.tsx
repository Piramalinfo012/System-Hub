import React from 'react';
import { 
  Home,
  LayoutDashboard, 
  Layers, 
  MessageSquare,
  Building2, 
  BarChart3, 
  Star, 
  Clock, 
  LineChart, 
  FileCode2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Activity,
  Terminal,
  Mail,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  darkMode: boolean;
  totalSystems: number;
  totalDepartments: number;
  totalDashboards: number;
  favoritesCount: number;
  recentCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  darkMode,
  totalSystems,
  totalDepartments,
  totalDashboards,
  favoritesCount,
  recentCount,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'home' as ActiveTab,
      label: 'Home',
      icon: Home,
      badge: null,
      color: 'text-blue-400',
      tag: 'HOME'
    },
    {
      id: 'dashboard' as ActiveTab,
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: null,
      color: 'text-cyan-400',
      tag: 'HUD_CORE'
    },
    {
      id: 'systems' as ActiveTab,
      label: 'All Systems',
      icon: Layers,
      badge: totalSystems,
      color: 'text-cyan-400',
      tag: 'INDEX'
    },
    {
      id: 'whatsapp' as ActiveTab,
      label: 'WhatsApp Automation',
      icon: MessageSquare,
      badge: 'LIVE',
      color: 'text-emerald-400',
      tag: 'BOT'
    },
    {
      id: 'email_master' as ActiveTab,
      label: 'Email Master',
      icon: Mail,
      badge: null,
      color: 'text-rose-400',
      tag: 'EMAIL'
    },
    {
      id: 'all_contacts' as ActiveTab,
      label: 'All Contacts',
      icon: Users,
      badge: null,
      color: 'text-orange-400',
      tag: 'CONTACTS'
    },
    {
      id: 'departments' as ActiveTab,
      label: 'Departments',
      icon: Building2,
      badge: totalDepartments,
      color: 'text-indigo-400',
      tag: 'MATRIX'
    },
    {
      id: 'dashboards' as ActiveTab,
      label: 'Dashboards Catalog',
      icon: BarChart3,
      badge: totalDashboards,
      color: 'text-amber-400',
      tag: 'BI_VIEW'
    },
    {
      id: 'favorites' as ActiveTab,
      label: 'My Favorites',
      icon: Star,
      badge: favoritesCount > 0 ? favoritesCount : null,
      color: 'text-yellow-400',
      tag: 'FAV'
    },
    {
      id: 'recent' as ActiveTab,
      label: 'Recently Opened',
      icon: Clock,
      badge: recentCount > 0 ? recentCount : null,
      color: 'text-emerald-400',
      tag: 'LOG'
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Analytics & Matrix',
      icon: LineChart,
      badge: null,
      color: 'text-purple-400',
      tag: 'METRICS'
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none font-sans">
      <div>
        {/* Navigation Items */}
        <div className="space-y-1.5 py-4 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative group ${
                  isActive
                    ? darkMode
                      ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : 'bg-cyan-50 text-cyan-900 font-bold border border-cyan-200'
                    : darkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/90 border border-transparent hover:border-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`relative z-10 w-4 h-4 shrink-0 transition-transform duration-150 ${isActive ? item.color : 'text-slate-400 group-hover:scale-110 group-hover:text-cyan-400'}`} />
                
                {!isCollapsed && (
                  <span className="relative z-10 truncate flex-1 text-left font-medium">{item.label}</span>
                )}

                {!isCollapsed && item.badge !== null && (
                  <span
                    className={`relative z-10 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-all ${
                      typeof item.badge === 'string'
                        ? darkMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs' : 'bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-xs'
                        : isActive
                        ? darkMode ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/30' : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                        : darkMode
                        ? 'bg-slate-900 text-slate-400 border border-slate-800'
                        : 'bg-slate-200 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Active Sliding Background & Left Glow Indicator */}
                {isActive && (
                  <>
                    <motion.div 
                      layoutId="sidebar-active-bg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className={`absolute inset-0 rounded-xl z-0 ${
                        darkMode
                          ? 'bg-linear-to-r from-cyan-500/20 via-cyan-500/10 to-transparent border border-cyan-500/40 shadow-sm shadow-cyan-500/15'
                          : 'bg-cyan-50 border border-cyan-300'
                      }`}
                    />
                    <motion.span 
                      layoutId="sidebar-active-indicator"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute -left-2 top-1.5 bottom-1.5 w-1 rounded-r-full bg-cyan-400 shadow-md shadow-cyan-400"
                    />
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Info Card (when expanded) */}
      <div className="p-3">
        {!isCollapsed ? (
          <div className={`p-3 rounded-2xl border relative overflow-hidden ${
            darkMode ? 'bg-slate-900/80 border-slate-800/90 backdrop-blur-md' : 'bg-slate-100 border-slate-200'
          }`}>
            <span className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${darkMode ? 'border-cyan-400' : 'border-cyan-600'}`}></span>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                SOURCE_OF_TRUTH
              </span>
            </div>
            <p className={`text-[11px] leading-relaxed font-sans ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Real-time Data synchronization active.
            </p>
            <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`font-bold flex items-center gap-1 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-ping ${darkMode ? 'bg-cyan-400' : 'bg-cyan-600'}`}></span>
                CYBER_INDEX 3.0
              </span>
              <span className={`font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>100% SYNC</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Collapse Toggle Button (Expanded mode) */}
        {!isCollapsed && (
          <button
            id="sidebar-collapse-toggle-button"
            onClick={onToggleCollapse}
            className={`mt-2 w-full flex items-center justify-center gap-2 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
              darkMode
                ? 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-850'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>COLLAPSE_NAV</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        id="desktop-sidebar"
        className={`hidden md:block shrink-0 transition-all duration-300 border-r z-20 sticky top-16 h-[calc(100vh-4rem)] ${
          isCollapsed ? 'w-18' : 'w-64'
        } ${
          darkMode
            ? 'bg-slate-950/80 border-slate-800/80 backdrop-blur-md'
            : 'bg-slate-50/90 border-slate-200'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 border-r shadow-2xl z-50 ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="px-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold font-mono text-sm tracking-wider text-cyan-400">DIGITAL SYSTEM HUB</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                >
                  ✕
                </button>
              </div>
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

