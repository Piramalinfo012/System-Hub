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
  Layers
} from 'lucide-react';
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
}) => {
  const isFiltered = selectedDepartment !== 'ALL' || selectedSystemType !== 'ALL';

  return (
    <div className="space-y-3.5 mb-6">
      
      {/* Top Filter Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Dynamic Department Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          <button
            id="filter-dept-all"
            onClick={() => onSelectDepartment('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedDepartment === 'ALL'
                ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20 font-bold'
                : darkMode
                ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Departments ({totalAllCount})
          </button>

          {departments.map((dept) => {
            const isSelected = selectedDepartment === dept;
            return (
              <button
                key={dept}
                id={`filter-dept-${dept.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onSelectDepartment(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20 font-bold'
                    : darkMode
                    ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {dept}
              </button>
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
              className={`pl-3 pr-8 py-1.5 rounded-xl text-xs font-medium border appearance-none transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-500'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="ALL">All System Types</option>
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
              className={`pl-3 pr-8 py-1.5 rounded-xl text-xs font-medium border appearance-none transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-500'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="default">Sort: Default Index</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="steps">Sort: Most Steps</option>
              <option value="department">Sort: Department</option>
            </select>
          </div>

          {/* Reset Filters Pill (if active) */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {/* Layout Mode Toggles */}
          <div className={`hidden sm:flex items-center p-0.5 rounded-xl border ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => onSelectViewLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewLayout === 'grid'
                  ? darkMode ? 'bg-slate-800 text-cyan-400 shadow-xs' : 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectViewLayout('compact')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewLayout === 'compact'
                  ? darkMode ? 'bg-slate-800 text-cyan-400 shadow-xs' : 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Compact View"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectViewLayout('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewLayout === 'table'
                  ? darkMode ? 'bg-slate-800 text-cyan-400 shadow-xs' : 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Enterprise Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectViewLayout('workflow')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewLayout === 'workflow'
                  ? darkMode ? 'bg-slate-800 text-cyan-400 shadow-xs' : 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Workflow Matrix View"
            >
              <Workflow className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Summary Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-200 font-mono">{totalFilteredCount}</strong> of <strong className="text-slate-200 font-mono">{totalAllCount}</strong> operational systems
          {selectedDepartment !== 'ALL' && ` in ${selectedDepartment}`}
        </span>
        <span className="font-mono text-[11px] text-cyan-400 hidden sm:inline">
          Live Synced from Google Sheet
        </span>
      </div>

    </div>
  );
};
