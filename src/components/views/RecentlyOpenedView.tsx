import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ExternalLink, 
  Trash2, 
  Layers, 
  Workflow, 
  FileSpreadsheet, 
  BarChart3, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { RecentAccessItem } from '../../types';
import { GoogleSheetService } from '../../services/googleSheetService';

interface RecentlyOpenedViewProps {
  darkMode: boolean;
  onExploreAll: () => void;
}

export const RecentlyOpenedView: React.FC<RecentlyOpenedViewProps> = ({
  darkMode,
  onExploreAll,
}) => {
  const [recentList, setRecentList] = useState<RecentAccessItem[]>([]);

  useEffect(() => {
    setRecentList(GoogleSheetService.getRecentAccessList());
  }, []);

  const handleClearHistory = () => {
    GoogleSheetService.clearRecentAccess();
    setRecentList([]);
  };

  const handleRelaunch = (item: RecentAccessItem) => {
    GoogleSheetService.openExternalUrl(
      item.url,
      item.title,
      item.systemId,
      item.type,
      item.department,
      item.stepHeader
    );
    // update list state
    setRecentList(GoogleSheetService.getRecentAccessList());
  };

  const formatTimestamp = (ts: number) => {
    const diffMs = Date.now() - ts;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getTypeBadge = (type: string, header?: string) => {
    switch (type) {
      case 'step':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${darkMode ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-cyan-100 text-cyan-700 border-cyan-300'}`}>
            <Workflow className="w-3 h-3" />
            {header || 'STEP WORKFLOW'}
          </span>
        );
      case 'sheet':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-300'}`}>
            <FileSpreadsheet className="w-3 h-3" />
            SHEET
          </span>
        );
      case 'dashboard':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${darkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-300'}`}>
            <BarChart3 className="w-3 h-3" />
            DASHBOARD
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${darkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-300'}`}>
            <Layers className="w-3 h-3" />
            SYSTEM
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Recently Opened History</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit trail and instant relaunch of systems, workflows, sheets, and dashboards you recently accessed.
              </p>
            </div>
          </div>

          {recentList.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* History Items List */}
      {recentList.length > 0 ? (
        <div className="space-y-3">
          {recentList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleRelaunch(item)}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850 hover:shadow-lg'
                  : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className={`p-2.5 rounded-xl border shrink-0 ${darkMode ? 'bg-slate-800 border-slate-700/50 text-cyan-400' : 'bg-slate-100 border-slate-200 text-cyan-600'}`}>
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-sm font-bold truncate ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                      {item.title}
                    </h4>
                    {getTypeBadge(item.type, item.stepHeader)}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${darkMode ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                      {item.department}
                    </span>
                  </div>
                  <p className={`text-xs font-mono truncate mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                    {item.url}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-xs font-mono text-slate-400">
                  {formatTimestamp(item.timestamp)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRelaunch(item);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all shadow-xs"
                >
                  <span>Relaunch</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`p-12 rounded-3xl border text-center ${
          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <Clock className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className={`text-base font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>No recently opened items</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Whenever you launch a system, step workflow, sheet, or dashboard, it will appear here for fast re-access.
          </p>
          <button
            onClick={onExploreAll}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
          >
            Open Command Hub
          </button>
        </div>
      )}

    </div>
  );
};
