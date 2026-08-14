import React from 'react';
import { 
  ExternalLink, 
  FileSpreadsheet, 
  BarChart3, 
  Star, 
  ArrowRight, 
  Workflow, 
  Layers,
  Sparkles,
  SearchX
} from 'lucide-react';
import { SystemItem, ViewLayout } from '../../types';
import { SystemCard } from '../systems/SystemCard';
import { GoogleSheetService } from '../../services/googleSheetService';

interface SystemGridProps {
  systems: SystemItem[];
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onViewDetails: (system: SystemItem) => void;
  viewLayout: ViewLayout;
  darkMode: boolean;
  onClearFilters: () => void;
}

export const SystemGrid: React.FC<SystemGridProps> = ({
  systems,
  favoriteIds,
  onToggleFavorite,
  onViewDetails,
  viewLayout,
  darkMode,
  onClearFilters,
}) => {
  if (systems.length === 0) {
    return (
      <div className={`p-12 rounded-3xl border text-center my-6 ${
        darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
      }`}>
        <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold">No matching systems found</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          No operational systems match your active search or department filter. Try adjusting your query or resetting filters.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  // 1. STANDARD GRID LAYOUT
  if (viewLayout === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {systems.map((system) => (
          <SystemCard
            key={system.id}
            system={system}
            isFavorite={favoriteIds.includes(system.id)}
            onToggleFavorite={onToggleFavorite}
            onViewDetails={onViewDetails}
            darkMode={darkMode}
          />
        ))}
      </div>
    );
  }

  // 2. COMPACT LIST LAYOUT
  if (viewLayout === 'compact') {
    return (
      <div className="space-y-2.5">
        {systems.map((system) => {
          const isFav = favoriteIds.includes(system.id);
          const hasSoftware = GoogleSheetService.isValidUrl(system.softwareUrl);
          const hasSheet = GoogleSheetService.isValidUrl(system.sheetUrl);
          const hasDash = GoogleSheetService.isValidUrl(system.dashboardUrl);

          return (
            <div
              key={system.id}
              onClick={() => onViewDetails(system)}
              className={`p-3.5 sm:px-5 sm:py-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850'
                  : 'bg-white border-slate-200 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(system.id);
                  }}
                  className="text-slate-500 hover:text-yellow-400"
                >
                  <Star className={`w-4 h-4 ${isFav ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400 font-mono">#{system.sr}</span>
                    <h4 className="text-sm font-bold truncate text-slate-100 dark:text-slate-100">
                      {system.systemName}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                      {system.department}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {system.doer ? `Doer: ${system.doer} • ` : ''}{system.steps.length} workflow steps configured
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {hasSoftware && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      GoogleSheetService.openExternalUrl(system.softwareUrl, system.systemName, system.id, 'system', system.department);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                  >
                    <span>OPEN</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
                {hasSheet && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      GoogleSheetService.openExternalUrl(system.sheetUrl, system.systemName, system.id, 'sheet', system.department);
                    }}
                    className="p-1.5 rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    title="Open Sheet"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  </button>
                )}
                {hasDash && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      GoogleSheetService.openExternalUrl(system.dashboardUrl, system.systemName, system.id, 'dashboard', system.department);
                    }}
                    className="p-1.5 rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    title="Open Dashboard"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onViewDetails(system)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Details →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 3. ENTERPRISE TABLE VIEW
  if (viewLayout === 'table') {
    return (
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b uppercase tracking-wider font-semibold text-[11px] ${
              darkMode ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">SR</th>
                <th className="py-3.5 px-4">System Name</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Doer / Owner</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-center">Steps</th>
                <th className="py-3.5 px-4 text-right">Quick Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {systems.map((system) => {
                const hasSoftware = GoogleSheetService.isValidUrl(system.softwareUrl);
                const hasSheet = GoogleSheetService.isValidUrl(system.sheetUrl);
                const hasDash = GoogleSheetService.isValidUrl(system.dashboardUrl);

                return (
                  <tr
                    key={system.id}
                    onClick={() => onViewDetails(system)}
                    className={`hover:bg-cyan-500/5 transition-colors cursor-pointer ${
                      darkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-center text-slate-400">
                      {system.sr}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100 flex items-center gap-2">
                      <span>{system.systemName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-cyan-400 border border-slate-700">
                        {system.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {system.doer || '-'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {system.systemType}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-cyan-400">
                      {system.steps.length}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {hasSoftware && (
                          <button
                            onClick={() => GoogleSheetService.openExternalUrl(system.softwareUrl, system.systemName, system.id, 'system', system.department)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                          >
                            Open ↗
                          </button>
                        )}
                        {hasSheet && (
                          <button
                            onClick={() => GoogleSheetService.openExternalUrl(system.sheetUrl, system.systemName, system.id, 'sheet', system.department)}
                            className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                            title="Sheet"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {hasDash && (
                          <button
                            onClick={() => GoogleSheetService.openExternalUrl(system.dashboardUrl, system.systemName, system.id, 'dashboard', system.department)}
                            className="p-1.5 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                            title="Dashboard"
                          >
                            <BarChart3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 4. WORKFLOW MATRIX VIEW
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {systems.map((system) => (
        <div
          key={system.id}
          className={`p-5 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                {system.department} • {system.systemType}
              </span>
              <h3 className="text-base font-bold text-slate-100">{system.systemName}</h3>
            </div>
            <button
              onClick={() => onViewDetails(system)}
              className="text-xs font-semibold text-cyan-400 hover:underline"
            >
              Open Full Workflow →
            </button>
          </div>

          {/* Workflow Steps Inline */}
          <div className="space-y-2 mt-4">
            {system.steps.map((st) => {
              const isClickable = st.isAvailable && Boolean(st.url);
              return (
                <div
                  key={st.header}
                  onClick={() => {
                    if (isClickable) {
                      GoogleSheetService.openExternalUrl(st.url, `${system.systemName} - ${st.name}`, system.id, 'step', system.department, st.header);
                    }
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isClickable
                      ? darkMode
                        ? 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800 cursor-pointer'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-400 cursor-pointer'
                      : 'opacity-50 border-transparent bg-slate-950/20 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {st.header}
                    </span>
                    <span className="truncate font-medium">{st.name}</span>
                  </div>
                  {isClickable && <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
