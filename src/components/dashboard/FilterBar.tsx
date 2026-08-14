import React from 'react';
import { 
  Filter, 
  LayoutGrid, 
  List, 
  Table as TableIcon, 
  Workflow, 
  ArrowUpDown, 
  X, 
  Sparkles, 
  Building2, 
  Layers, 
  Terminal,
  Activity,
  RotateCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewLayout } from '../../types';

interface FilterBarProps {
  departments: string[];
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
  systemTypes: string[];
  selectedSystemType: string;
  onSelectSystemType: (type: string) => void;
  totalFilteredCount: number;
  totalAllCount: number;
  sortBy: 'default' | 'name' | 'steps' | 'department';
  onSelectSortBy: (sort: 'default' | 'name' | 'steps' | 'department') => void;
  viewLayout: ViewLayout;
  onSelectViewLayout: (layout: ViewLayout) => void;
  darkMode: boolean;
  onResetFilters: () => void;
  onRefreshAllHeartbeats?: () => void;
  isPingingAll?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  departments,
  selectedDepartment,
  onSelectDepartment,
  systemTypes,
  selectedSystemType,
  onSelectSystemType,
  totalFilteredCount,
  totalAllCount,
  sortBy,
  onSelectSortBy,
  viewLayout,
  onSelectViewLayout,
  darkMode,
  onResetFilters,
  onRefreshAllHeartbeats,
  isPingingAll = false,
}) => {
  const isFiltered = selectedDepartment !== 'ALL' || selectedSystemType !== 'ALL';

  return (
    <div className="space-y-3.5 mb-6">
      
      {/* Top Filter Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Dynamic Department Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          <motion.button
            whileTap={{ scale: 0.95 }}
            id="filter-dept-all"
            onClick={() => onSelectDepartment('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono shrink-0 transition-all ${
              selectedDepartment === 'ALL'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold ring-1 ring-cyan-300'
                : darkMode
                ? 'bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            ALL_DEPTS ({totalAllCount})
          </motion.button>

          {departments.map((dept) => {
            const isSelected = selectedDepartment === dept;
            return (
              <motion.button
                key={dept}
                whileTap={{ scale: 0.95 }}
                id={`filter-dept-${dept.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onSelectDepartment(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono shrink-0 transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold ring-1 ring-cyan-300'
                    : darkMode
                    ? 'bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {dept}
              </motion.button>
            );
          })}
        </div>

        {/* Right Tools: Type Filter, Sort, View Layouts */}
        <div className="flex items-center gap-2 ml-auto">
          
          {/* System Type Selector */}
          <div className="relative">
            <select
              id="filter-system-type-select"
              value={selectedSystemType}
              onChange={(e) => onSelectSystemType(e.target.value)}
              className={`pl-3 pr-8 py-1.5 rounded-xl text-xs font-mono font-medium border appearance-none transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="ALL">ALL_SYS_TYPES</option>
              {systemTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Sort By Selector */}
          <div className="relative">
            <select
              id="filter-sort-select"
              value={sortBy}
              onChange={(e) => onSelectSortBy(e.target.value as 'default' | 'name' | 'steps' | 'department')}
              className={`pl-3 pr-8 py-1.5 rounded-xl text-xs font-mono font-medium border appearance-none transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="default">SORT: DEFAULT_IDX</option>
              <option value="name">SORT: NAME (A-Z)</option>
              <option value="steps">SORT: STEPS (MAX)</option>
              <option value="department">SORT: DEPARTMENT</option>
            </select>
          </div>

          {/* Reset Filters Pill (if active) */}
          <AnimatePresence>
            {isFiltered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.95 }}
                onClick={onResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25 transition-colors shadow-xs"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>CLEAR_FILTERS</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Layout Mode Toggles */}
          <div className={`hidden sm:flex items-center p-1 rounded-xl border relative ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {[
              { id: 'grid', icon: LayoutGrid, title: 'Grid View (Cyber Cards)' },
              { id: 'compact', icon: List, title: 'Compact View' },
              { id: 'table', icon: TableIcon, title: 'Enterprise Table View' },
              { id: 'workflow', icon: Workflow, title: 'Workflow Matrix View' },
            ].map((layout) => {
              const Icon = layout.icon;
              const isSelected = viewLayout === layout.id;
              return (
                <button
                  key={layout.id}
                  onClick={() => onSelectViewLayout(layout.id as ViewLayout)}
                  className={`p-2 rounded-lg relative transition-all ${
                    isSelected
                      ? darkMode ? 'text-cyan-300 font-bold' : 'text-blue-600 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={layout.title}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeLayoutIndicator"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      className={`absolute inset-0 rounded-lg ${
                        darkMode ? 'bg-cyan-500/20 border border-cyan-500/50 shadow-sm shadow-cyan-500/20' : 'bg-white shadow-xs border border-slate-200'
                      }`}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Summary Count Bar & Realtime Heartbeat Stream */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1 font-mono">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-cyan-400" />
          <span>SYS_INDEX:</span> <strong className="text-cyan-300 font-bold">{totalFilteredCount}</strong> of <strong className="text-slate-200">{totalAllCount}</strong> ACTIVE_NODES
          {selectedDepartment !== 'ALL' && <span className="text-cyan-400">[{selectedDepartment}]</span>}
        </span>
        
        <div className="flex items-center gap-2">
          {onRefreshAllHeartbeats && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onRefreshAllHeartbeats}
              disabled={isPingingAll}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all disabled:opacity-50"
              title="Ping all system URLs via Google Apps Script backend proxy"
            >
              <RotateCw className={`w-2.5 h-2.5 ${isPingingAll ? 'animate-spin' : ''}`} />
              <span>{isPingingAll ? 'PINGING_ALL...' : 'RE-CHECK_HEARTBEATS'}</span>
            </motion.button>
          )}
          <span className="text-[11px] text-cyan-400 hidden sm:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            APPS_SCRIPT_PROXY_LIVE
          </span>
        </div>
      </div>

    </div>
  );
};

