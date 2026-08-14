import React from 'react';
import { 
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
  ShieldCheck
} from 'lucide-react';
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
      id: 'dashboard' as ActiveTab,
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: null,
      color: 'text-cyan-400'
    },
    {
      id: 'systems' as ActiveTab,
      label: 'All Systems',
      icon: Layers,
      badge: totalSystems,
      color: 'text-blue-400'
    },
    {
      id: 'whatsapp' as ActiveTab,
      label: 'WhatsApp Automation',
      icon: MessageSquare,
      badge: 'LIVE',
      color: 'text-emerald-400'
    },
    {
      id: 'departments' as ActiveTab,
      label: 'Departments',
      icon: Building2,
      badge: totalDepartments,
      color: 'text-indigo-400'
    },
    {
      id: 'dashboards' as ActiveTab,
      label: 'Dashboards Catalog',
      icon: BarChart3,
      badge: totalDashboards,
      color: 'text-amber-400'
    },
    {
      id: 'favorites' as ActiveTab,
      label: 'My Favorites',
      icon: Star,
      badge: favoritesCount > 0 ? favoritesCount : null,
      color: 'text-yellow-400'
    },
    {
      id: 'recent' as ActiveTab,
      label: 'Recently Opened',
      icon: Clock,
      badge: recentCount > 0 ? recentCount : null,
      color: 'text-emerald-400'
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Analytics & Matrix',
      icon: LineChart,
      badge: null,
      color: 'text-purple-400'
    },
    {
      id: 'apps_script' as ActiveTab,
      label: 'Apps Script & Sheet',
      icon: FileCode2,
      badge: 'API',
      color: 'text-teal-400'
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings & Config',
      icon: Settings,
      badge: null,
      color: 'text-slate-400'
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none">
      <div>
        {/* Navigation Items */}
        <div className="space-y-1 py-4 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative group ${
                  isActive
                    ? darkMode
                      ? 'bg-cyan-500/15 text-cyan-300 font-semibold shadow-xs border border-cyan-500/30'
                      : 'bg-blue-50 text-blue-700 font-semibold shadow-xs border border-blue-200'
                    : darkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-150 ${isActive ? item.color : 'text-slate-400 group-hover:scale-110'}`} />
                
                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!isCollapsed && item.badge !== null && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-all ${
                      typeof item.badge === 'string'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isActive
                        ? 'bg-cyan-500/25 text-cyan-200'
                        : darkMode
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Left Active Glow Indicator */}
                {isActive && (
                  <span className="absolute -left-2 top-1.5 bottom-1.5 w-1 rounded-r-full bg-cyan-400"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Info Card (when expanded) */}
      <div className="p-3">
        {!isCollapsed ? (
          <div className={`p-3 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-100 border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300">
                Single Source of Truth
              </span>
            </div>
            <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Google Sheet drives all systems, workflows & URLs.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-cyan-400 font-medium">Auto-Index v2.4</span>
              <span className="text-slate-500 font-mono">100% Sync</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
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
            className={`mt-2 w-full flex items-center justify-center gap-2 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              darkMode
                ? 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Collapse Sidebar</span>
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
            ? 'bg-slate-950/70 border-slate-800/80'
            : 'bg-slate-50/90 border-slate-200'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div
            className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 border-r shadow-2xl z-50 ${
              darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="px-4 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-sm tracking-tight text-cyan-400">DIGITAL SYSTEM HUB</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg bg-slate-800 text-slate-300"
              >
                ✕
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
