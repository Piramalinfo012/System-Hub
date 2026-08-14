import React from 'react';
import { BarChart3, FileSpreadsheet, ExternalLink, Sparkles, SearchX } from 'lucide-react';
import { SystemItem } from '../../types';
import { GoogleSheetService } from '../../services/googleSheetService';

interface DashboardsCatalogViewProps {
  systems: SystemItem[];
  darkMode: boolean;
}

export const DashboardsCatalogView: React.FC<DashboardsCatalogViewProps> = ({
  systems,
  darkMode,
}) => {
  const systemsWithDashboard = systems.filter(s => GoogleSheetService.isValidUrl(s.dashboardUrl));
  const systemsWithSheet = systems.filter(s => GoogleSheetService.isValidUrl(s.sheetUrl));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Executive BI & Dashboard Catalog</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized catalog of all Looker Studio, PowerBI, Tableau, and Google Sheets dashboards linked to operational systems.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
            {systemsWithDashboard.length} BI Dashboards
          </span>
        </div>
      </div>

      {/* SECTION 1: BI DASHBOARDS */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          Connected Operational Dashboards ({systemsWithDashboard.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemsWithDashboard.map((sys) => (
            <div
              key={sys.id}
              onClick={() => GoogleSheetService.openExternalUrl(sys.dashboardUrl, `${sys.systemName} (Dashboard)`, sys.id, 'dashboard', sys.department)}
              className={`p-5 rounded-2xl border transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 shadow-md'
                  : 'bg-white border-slate-200 hover:border-amber-400 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {sys.department}
                  </span>
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-100 dark:text-slate-100">{sys.systemName}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sys.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">BI Report</span>
                <span className="text-amber-400 font-semibold">Launch Dashboard ↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: GOOGLE SHEETS */}
      <div className="pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          Master Google Sheets & Ledgers ({systemsWithSheet.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemsWithSheet.map((sys) => (
            <div
              key={sys.id}
              onClick={() => GoogleSheetService.openExternalUrl(sys.sheetUrl, `${sys.systemName} (Sheet)`, sys.id, 'sheet', sys.department)}
              className={`p-5 rounded-2xl border transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 shadow-md'
                  : 'bg-white border-slate-200 hover:border-emerald-400 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {sys.department}
                  </span>
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-100 dark:text-slate-100">{sys.systemName}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">Database & Ledger Sheet</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Google Sheet</span>
                <span className="text-emerald-400 font-semibold">Open Spreadsheet ↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
