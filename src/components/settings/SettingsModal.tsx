import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  RotateCw, 
  Database, 
  Sliders, 
  Save, 
  ShieldCheck, 
  Trash2,
  CheckCircle2,
  ExternalLink,
  Zap,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { GoogleSheetService } from '../../services/googleSheetService';
import { SPREADSHEET_ID, DEFAULT_SCRIPT_URL } from '../../services/appsScriptGenerator';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onRefreshData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  onRefreshData,
}) => {
  if (!isOpen) return null;

  const [apiUrl, setApiUrl] = useState(GoogleSheetService.getConfiguredApiUrl());
  const [sheetName, setSheetName] = useState(GoogleSheetService.getSheetName());
  const [refreshInterval, setRefreshInterval] = useState(GoogleSheetService.getRefreshInterval());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string | null>(null);

  const handleSave = () => {
    GoogleSheetService.setConfiguredApiUrl(apiUrl);
    GoogleSheetService.setSheetName(sheetName);
    GoogleSheetService.setRefreshInterval(refreshInterval);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onRefreshData();
      onClose();
    }, 800);
  };

  const handleTestConnection = async () => {
    if (!apiUrl || !GoogleSheetService.isValidUrl(apiUrl)) {
      setTestStatus('error');
      setTestMessage('Please enter a valid HTTP/HTTPS Google Apps Script Web App URL.');
      return;
    }

    setTestStatus('testing');
    setTestMessage(null);

    try {
      const url = new URL(apiUrl);
      if (sheetName) url.searchParams.set('sheet', sheetName);
      url.searchParams.set('_t', Date.now().toString());

      const res = await fetch(url.toString(), { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json();
      if (json && (json.success || Array.isArray(json.data) || Array.isArray(json))) {
        setTestStatus('success');
        const count = Array.isArray(json.data) ? json.data.length : (Array.isArray(json) ? json.length : 0);
        setTestMessage(`Connected successfully! Found ${count} row(s) in sheet "${sheetName}".`);
      } else {
        throw new Error(json?.error || 'Invalid JSON response format from Apps Script.');
      }
    } catch (err: unknown) {
      setTestStatus('error');
      setTestMessage(err instanceof Error ? err.message : String(err));
    }
  };

  const handleResetToDefault = () => {
    setApiUrl(DEFAULT_SCRIPT_URL);
    setSheetName('Data');
    GoogleSheetService.setConfiguredApiUrl(DEFAULT_SCRIPT_URL);
    GoogleSheetService.setSheetName('Data');
  };

  const handleClearCache = () => {
    GoogleSheetService.resetSimulatedSheetData();
    GoogleSheetService.clearRecentAccess();
    onRefreshData();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Portal & Google Sheet Connection</h3>
              <p className="text-xs text-slate-400">Configure Apps Script backend and automatic sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Settings updated and synced successfully!</span>
            </div>
          )}

          {/* Active Spreadsheet Banner */}
          <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-200">Google Spreadsheet ID</p>
                <p className="text-[11px] font-mono text-cyan-400 truncate">{SPREADSHEET_ID}</p>
              </div>
            </div>
            <a
              href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-colors"
            >
              <span>Open Sheet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Google Apps Script URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Google Apps Script Web App URL
              </label>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Reset Default
              </button>
            </div>
            <input
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          {/* Sheet Tab Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Target Sheet Tab Name
            </label>
            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="Data"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
            <p className="text-[11px] text-slate-400">
              Target tab name in your spreadsheet (defaults to <code>Data</code> as handled by your Apps Script).
            </p>
          </div>

          {/* Test Connection Button */}
          <div>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              {testStatus === 'testing' ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Testing Connection...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Test Google Sheet Connection</span>
                </>
              )}
            </button>

            {testStatus === 'success' && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{testMessage}</span>
              </div>
            )}

            {testStatus === 'error' && (
              <div className="mt-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="font-mono text-[11px]">{testMessage}</span>
              </div>
            )}
          </div>

          {/* Auto Refresh Interval */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Auto-Sync Refresh Interval
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value, 10))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
            >
              <option value={60000}>Every 1 Minute (Fast Sync)</option>
              <option value={300000}>Every 5 Minutes (Recommended)</option>
              <option value={600000}>Every 10 Minutes</option>
              <option value={0}>Manual Refresh Only (Disabled)</option>
            </select>
          </div>

          {/* Data Reset */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-300">Reset Local Cache</p>
              <p className="text-[11px] text-slate-500">Clear custom simulation rows and access history</p>
            </div>
            <button
              onClick={handleClearCache}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Reset Cache
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>

      </div>
    </div>
  );
};
