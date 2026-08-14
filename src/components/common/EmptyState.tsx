import React from 'react';
import { FileSpreadsheet, Plus } from 'lucide-react';

interface EmptyStateProps {
  onOpenAppsScript: () => void;
  darkMode: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onOpenAppsScript, darkMode }) => {
  return (
    <div className={`p-12 rounded-3xl border text-center my-8 max-w-lg mx-auto ${
      darkMode ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
        <FileSpreadsheet className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold">No Systems Available</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
        Please add systems and workflow rows to your connected Google Sheet or use the simulator to initialize systems.
      </p>
      <button
        onClick={onOpenAppsScript}
        className="mt-6 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
      >
        Configure Google Sheet & Script
      </button>
    </div>
  );
};
