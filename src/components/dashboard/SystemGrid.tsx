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
  SearchX,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemItem, ViewLayout, SystemHeartbeatStatus } from '../../types';
import { SystemCard } from '../systems/SystemCard';
import { GoogleSheetService } from '../../services/googleSheetService';
import { HeartbeatIndicator } from '../common/HeartbeatIndicator';

interface SystemGridProps {
  systems: SystemItem[];
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onViewDetails: (system: SystemItem) => void;
  viewLayout: ViewLayout;
  darkMode: boolean;
  onClearFilters: () => void;
  heartbeats?: Record<string, SystemHeartbeatStatus>;
  onRefreshHeartbeat?: (system: SystemItem) => Promise<void> | void;
}

export const SystemGrid: React.FC<SystemGridProps> = ({
  systems,
  favoriteIds,
  onToggleFavorite,
  onViewDetails,
  viewLayout,
  darkMode,
  onClearFilters,
  heartbeats = {},
  onRefreshHeartbeat,
}) => {
  if (systems.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-12 rounded-3xl border text-center my-6 relative overflow-hidden ${
          darkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
        }`}
      >
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></span>
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></span>
        <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold font-mono tracking-tight text-slate-100">SYSTEM_NOT_FOUND</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
          No operational records match your active query. Reset filters to return to telemetry stream.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
        >
          Reset Telemetry Filters
        </button>
      </motion.div>
    );
  }

  // 1. STANDARD GRID LAYOUT
  if (viewLayout === 'grid') {
    return (
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {systems.map((system) => (
            <SystemCard
              key={system.id}
              system={system}
              isFavorite={favoriteIds.includes(system.id)}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewDetails}
              darkMode={darkMode}
              heartbeatStatus={heartbeats[system.id]}
              onRefreshHeartbeat={onRefreshHeartbeat}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    );
  }

  // 2. COMPACT LIST LAYOUT
  if (viewLayout === 'compact') {
    return (
      <motion.div layout className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {systems.map((system) => {
            const isFav = favoriteIds.includes(system.id);

            return (
              <motion.div
                key={system.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                whileHover={{ scale: 1.008, x: 3 }}
                onClick={() => onViewDetails(system)}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer relative overflow-hidden group ${
                  darkMode
                    ? 'bg-slate-900/85 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 shadow-md hover:shadow-cyan-500/10'
                    : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(system.id);
                    }}
                    className="text-slate-500 hover:text-yellow-400 p-1 shrink-0"
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-bold text-cyan-400 font-mono">#{system.sr}</span>
                      <h4 className="text-sm font-bold text-slate-100 dark:text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {system.systemName}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {system.department}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <HeartbeatIndicator 
                    status={heartbeats[system.id]}
                    system={system}
                    onRefreshPing={onRefreshHeartbeat}
                    darkMode={darkMode}
                    showLatency={true}
                  />
                  <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all font-mono">
                    <span>DETAILS</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    );
  }

  // 3. ENTERPRISE TABLE VIEW
  if (viewLayout === 'table') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border overflow-hidden relative ${
          darkMode ? 'bg-slate-900/80 border-slate-800/90 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></span>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b uppercase tracking-wider font-mono font-bold text-[10px] ${
              darkMode ? 'bg-slate-950/90 border-slate-800 text-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">SR</th>
                <th className="py-3.5 px-4">System Name</th>
                <th className="py-3.5 px-4 text-center">Heartbeat</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Doer / Owner</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-center">Steps</th>
                <th className="py-3.5 px-4 text-right">Quick Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {systems.map((system) => {
                const hasSoftware = GoogleSheetService.isValidUrl(system.softwareUrl);
                const hasSheet = GoogleSheetService.isValidUrl(system.sheetUrl);
                const hasDash = GoogleSheetService.isValidUrl(system.dashboardUrl);

                return (
                  <tr
                    key={system.id}
                    onClick={() => onViewDetails(system)}
                    className={`hover:bg-cyan-500/10 transition-colors cursor-pointer ${
                      darkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-center text-cyan-400">
                      {system.sr}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      <div className="flex items-center gap-2">
                        <span>{system.systemName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <HeartbeatIndicator 
                        status={heartbeats[system.id]}
                        system={system}
                        onRefreshPing={onRefreshHeartbeat}
                        darkMode={darkMode}
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {system.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">
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
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-xs"
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
      </motion.div>
    );
  }

  // 4. WORKFLOW MATRIX VIEW
  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <AnimatePresence mode="popLayout">
        {systems.map((system) => (
          <motion.div
            key={system.id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -3 }}
            className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
              darkMode ? 'bg-slate-900/85 border-slate-800/90 backdrop-blur-md hover:border-cyan-500/40 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></span>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {system.department} • {system.systemType}
                  </span>
                  <HeartbeatIndicator 
                    status={heartbeats[system.id]}
                    system={system}
                    onRefreshPing={onRefreshHeartbeat}
                    darkMode={darkMode}
                  />
                </div>
                <h3 className="text-base font-bold text-slate-100">{system.systemName}</h3>
              </div>
              <button
                onClick={() => onViewDetails(system)}
                className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>OPEN_MATRIX</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Workflow Steps Inline */}
            <div className="space-y-2 mt-4">
              {system.steps.map((st) => {
                const isClickable = st.isAvailable && Boolean(st.url);
                return (
                  <motion.div
                    key={st.header}
                    whileHover={isClickable ? { x: 3 } : {}}
                    onClick={() => {
                      if (isClickable) {
                        GoogleSheetService.openExternalUrl(st.url, `${system.systemName} - ${st.name}`, system.id, 'step', system.department, st.header);
                      }
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      isClickable
                        ? darkMode
                          ? 'bg-slate-950/70 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 cursor-pointer text-slate-200'
                          : 'bg-slate-50 border-slate-200 hover:border-blue-400 cursor-pointer text-slate-800'
                        : 'opacity-50 border-transparent bg-slate-950/30 cursor-not-allowed text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {st.header}
                      </span>
                      <span className="truncate font-medium">{st.name}</span>
                    </div>
                    {isClickable && <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};


