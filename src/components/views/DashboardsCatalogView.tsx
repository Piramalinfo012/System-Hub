import React from 'react';
import { BarChart3, FileSpreadsheet, ExternalLink, Sparkles, SearchX } from 'lucide-react';
import { motion } from 'motion/react';
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
      <div className={`p-6 rounded-3xl border relative overflow-hidden ${
        darkMode ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-200'
      }`}>
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400"></span>
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
        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 font-mono ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          <BarChart3 className={`w-4 h-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
          Connected Operational Dashboards ({systemsWithDashboard.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemsWithDashboard.map((sys) => (
            <motion.div
              key={sys.id}
              whileHover={{ y: -5, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              onClick={() => GoogleSheetService.openExternalUrl(sys.dashboardUrl, `${sys.systemName} (Dashboard)`, sys.id, 'dashboard', sys.department)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 shadow-md hover:shadow-amber-500/10'
                  : 'bg-white border-slate-200 hover:border-amber-400 shadow-xs'
              }`}
            >
              <span className={`absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'border-amber-400/60' : 'border-amber-500'}`}></span>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${
                    darkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-100 text-amber-700 border-amber-300'
                  }`}>
                    {sys.department}
                  </span>
                  <ExternalLink className={`w-4 h-4 group-hover:scale-110 transition-transform ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                </div>
                <h4 className={`text-sm font-bold transition-colors line-clamp-1 ${darkMode ? 'text-slate-100 group-hover:text-amber-300' : 'text-slate-900 group-hover:text-amber-700'}`}>{sys.systemName}</h4>
                <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{sys.description}</p>
              </div>

              <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className={`font-mono ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>BI Report</span>
                <span className={`font-semibold flex items-center gap-1 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>Launch Dashboard ↗</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION 2: GOOGLE SHEETS */}
      <div className="pt-4">
        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 font-mono ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          <FileSpreadsheet className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          Master Google Sheets & Ledgers ({systemsWithSheet.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemsWithSheet.map((sys) => (
            <motion.div
              key={sys.id}
              whileHover={{ y: -5, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              onClick={() => GoogleSheetService.openExternalUrl(sys.sheetUrl, `${sys.systemName} (Sheet)`, sys.id, 'sheet', sys.department)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 shadow-md hover:shadow-emerald-500/10'
                  : 'bg-white border-slate-200 hover:border-emerald-400 shadow-xs'
              }`}
            >
              <span className={`absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'border-emerald-400/60' : 'border-emerald-500'}`}></span>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${
                    darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                  }`}>
                    {sys.department}
                  </span>
                  <ExternalLink className={`w-4 h-4 group-hover:scale-110 transition-transform ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <h4 className={`text-sm font-bold transition-colors line-clamp-1 ${darkMode ? 'text-slate-100 group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-700'}`}>{sys.systemName}</h4>
                <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Database & Ledger Sheet</p>
              </div>

              <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className={`font-mono ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Google Sheet</span>
                <span className={`font-semibold flex items-center gap-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Open Spreadsheet ↗</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};
