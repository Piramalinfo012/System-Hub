import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  ExternalLink, 
  Play, 
  Layers, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save,
  HelpCircle,
  ShieldCheck,
  Zap,
  Sliders,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { APPS_SCRIPT_SOURCE_CODE, SPREADSHEET_ID, DEFAULT_SCRIPT_URL } from '../../services/appsScriptGenerator';
import { GoogleSheetService } from '../../services/googleSheetService';
import { SystemItem } from '../../types';

interface GoogleSheetStudioProps {
  darkMode: boolean;
  onRefreshData: () => void;
  currentSystems: SystemItem[];
}

export const GoogleSheetStudio: React.FC<GoogleSheetStudioProps> = ({
  darkMode,
  onRefreshData,
  currentSystems,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'guide' | 'tester' | 'simulator'>('tester');
  const [apiUrlInput, setApiUrlInput] = useState(GoogleSheetService.getConfiguredApiUrl());
  const [sheetNameInput, setSheetNameInput] = useState(GoogleSheetService.getSheetName());
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<string | null>(null);

  // Simulator state
  const [simulatorRows, setSimulatorRows] = useState<SystemItem[]>(currentSystems);
  const [savedSimToast, setSavedSimToast] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestConnection = async () => {
    if (!apiUrlInput || !GoogleSheetService.isValidUrl(apiUrlInput)) {
      setTestStatus('error');
      setTestResult('Please enter a valid HTTP/HTTPS Google Apps Script Web App URL.');
      return;
    }

    setTestStatus('testing');
    setTestResult(null);

    try {
      const url = new URL(apiUrlInput);
      if (sheetNameInput) url.searchParams.set('sheet', sheetNameInput);
      url.searchParams.set('_t', Date.now().toString());

      const res = await fetch(url.toString(), { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json();
      setTestStatus('success');
      setTestResult(JSON.stringify(json, null, 2));
      GoogleSheetService.setConfiguredApiUrl(apiUrlInput);
      GoogleSheetService.setSheetName(sheetNameInput);
      onRefreshData();
    } catch (err: unknown) {
      setTestStatus('error');
      setTestResult(err instanceof Error ? err.message : String(err));
    }
  };

  const handleAddSimulatorRow = () => {
    const newSr = simulatorRows.length + 1;
    const newRow: SystemItem = {
      id: `sys_custom_${Date.now()}`,
      sr: newSr,
      sheetRowIndex: simulatorRows.length + 2,
      systemName: `NEW OPERATIONAL SYSTEM ${newSr}`,
      softwareUrl: 'https://app.companycloud.internal',
      department: 'OPERATIONS',
      doer: 'Assigned Lead',
      systemType: 'SOFTWARE',
      sheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
      dashboardUrl: 'https://lookerstudio.google.com/sample',
      description: 'Custom system added via live Google Sheet visualizer.',
      status: 'ACTIVE',
      steps: [
        { order: 1, header: 'STEP-1', name: 'Initial Induction', url: 'https://app.companycloud.internal/step1', isAvailable: true },
        { order: 2, header: 'STEP-2', name: 'Operational Execution', url: 'https://app.companycloud.internal/step2', isAvailable: true },
        { order: 10, header: 'STEP-10', name: 'Final SLA Review', url: 'https://app.companycloud.internal/step10', isAvailable: true },
      ]
    };
    setSimulatorRows([...simulatorRows, newRow]);
  };

  const handleSaveSimulator = () => {
    GoogleSheetService.saveSimulatedSheetData(simulatorRows);
    setSavedSimToast(true);
    setTimeout(() => setSavedSimToast(false), 2500);
    onRefreshData();
  };

  const handleResetSimulator = () => {
    GoogleSheetService.resetSimulatedSheetData();
    const defaultData = GoogleSheetService.getSimulatedSheetData();
    setSimulatorRows(defaultData.data);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-cyan-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Google Sheet & Apps Script Integration</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Live Apps Script v2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Connected directly to Google Spreadsheet <code className="text-cyan-400 font-mono">{SPREADSHEET_ID}</code> with zero backend modifications needed.
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className={`flex flex-wrap items-center p-1 rounded-2xl border ${
            darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTab('tester')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tester'
                  ? darkMode ? 'bg-slate-800 text-cyan-400 shadow-xs' : 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Connection
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'code'
                  ? darkMode ? 'bg-slate-800 text-cyan-400 shadow-xs' : 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Code.gs Script
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'guide'
                  ? darkMode ? 'bg-slate-800 text-cyan-400 shadow-xs' : 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              API Reference
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'simulator'
                  ? darkMode ? 'bg-slate-800 text-cyan-400 shadow-xs' : 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sheet Editor
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE CONNECTION & TESTER */}
      {activeTab === 'tester' && (
        <div className={`p-6 rounded-3xl border space-y-6 ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Live Google Apps Script Web App Connection</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Your frontend is configured to directly read and write using your deployed Google Apps Script.
              </p>
            </div>

            <a
              href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold border border-cyan-500/30 transition-colors shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Open Spreadsheet in Google Docs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left 2 Cols: Endpoint Inputs */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Google Apps Script Web App URL
                  </label>
                  <button
                    type="button"
                    onClick={() => setApiUrlInput(DEFAULT_SCRIPT_URL)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Load Default URL
                  </button>
                </div>
                <input
                  type="url"
                  value={apiUrlInput}
                  onChange={(e) => setApiUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Sheet Tab Name
                  </label>
                  <input
                    type="text"
                    value={sheetNameInput}
                    onChange={(e) => setSheetNameInput(e.target.value)}
                    placeholder="Data"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testStatus === 'testing'}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-md active:scale-95"
                  >
                    {testStatus === 'testing' ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Test & Sync Live Sheet</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Sheet Details Card */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Spreadsheet Meta</span>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Spreadsheet ID:</span>
                  <span className="font-mono text-[11px] text-cyan-300 break-all">{SPREADSHEET_ID}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Active Tab:</span>
                  <span className="font-semibold text-slate-200">{sheetNameInput || 'Data'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Parser Mode:</span>
                  <span className="text-emerald-400 font-semibold">2D Array Auto-Normalizer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Status Banner */}
          {testStatus === 'success' && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Connected Successfully to Google Sheet Web App!</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                The Digital System Hub is now actively pulling and synchronizing live records directly from your sheet.
              </p>
            </div>
          )}

          {testStatus === 'error' && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Connection Test Failed</span>
              </div>
              <p className="text-slate-300 font-mono text-[11px]">{testResult}</p>
            </div>
          )}

          {/* JSON preview */}
          {testResult && testStatus === 'success' && (
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400">Response Payload:</span>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 max-h-60 overflow-y-auto">
                {testResult}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CODE.GS SCRIPT VIEWER */}
      {activeTab === 'code' && (
        <div className={`p-6 rounded-3xl border ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 flex items-center gap-2">
                <span>Exact Backend Code (Code.gs)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Matches your Google Apps Script backend code with ID <code className="text-cyan-400">{SPREADSHEET_ID}</code>.
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-md active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>COPIED CODE!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY CODE.GS</span>
                </>
              )}
            </button>
          </div>

          {/* Code block */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 max-h-[500px] overflow-y-auto">
            <pre className="whitespace-pre">{APPS_SCRIPT_SOURCE_CODE}</pre>
          </div>
        </div>
      )}

      {/* TAB 3: API REFERENCE & GUIDE */}
      {activeTab === 'guide' && (
        <div className={`p-6 rounded-3xl border space-y-6 ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h3 className="text-base font-bold text-slate-100">Apps Script Backend Action Support</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Summary of supported actions executed by your Google Apps Script backend:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-500/10 text-cyan-400 font-bold">
                GET ?sheet=Data
              </span>
              <h4 className="font-bold text-slate-200">doGet(e) Query</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Fetches sheet data via <code>sheet.getDataRange().getValues()</code> and returns 2D array of rows and headers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">
                POST action=insert
              </span>
              <h4 className="font-bold text-slate-200">doPost &gt; insert</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Appends a row with <code>sheet.appendRow(JSON.parse(params.rowData))</code> and flushes immediately.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-indigo-500/10 text-indigo-400 font-bold">
                POST action=update
              </span>
              <h4 className="font-bold text-slate-200">doPost &gt; update</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Updates row index with non-empty values using single batch <code>setValues</code> (20x faster).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-rose-500/10 text-rose-400 font-bold">
                POST action=delete
              </span>
              <h4 className="font-bold text-slate-200">doPost &gt; delete / markDeleted</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Removes or soft-deletes a row using <code>sheet.deleteRow(rowIndex)</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SPREADSHEET SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className={`p-6 rounded-3xl border space-y-6 ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                <span>In-Browser Google Sheet Visualizer & Editor</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect local cache rows, edit items, or test data formatting.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddSimulatorRow}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>

              <button
                onClick={handleSaveSimulator}
                className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Hub</span>
              </button>

              <button
                onClick={handleResetSimulator}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
                title="Reset to Default"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {savedSimToast && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Spreadsheet simulator updated! The entire portal has re-indexed the modified data.
            </div>
          )}

          {/* Table Simulator */}
          <div className="rounded-2xl border border-slate-800 overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3 w-12 text-center">SR</th>
                  <th className="p-3 min-w-[180px]">SYSTEM NAME</th>
                  <th className="p-3 min-w-[120px]">DEPARTMENT</th>
                  <th className="p-3 min-w-[120px]">DOER</th>
                  <th className="p-3 min-w-[100px]">SYSTEM TYPE</th>
                  <th className="p-3 min-w-[160px]">STEP-1 (WORKFLOW)</th>
                  <th className="p-3 min-w-[160px]">STEP-2 (WORKFLOW)</th>
                  <th className="p-3 w-12 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 bg-slate-900/60">
                {simulatorRows.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-800/40">
                    <td className="p-3 text-center font-mono text-slate-400">{row.sr}</td>
                    <td className="p-3 font-bold text-slate-100">
                      <input
                        type="text"
                        value={row.systemName}
                        onChange={(e) => {
                          const updated = [...simulatorRows];
                          updated[idx].systemName = e.target.value;
                          setSimulatorRows(updated);
                        }}
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-100"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={row.department}
                        onChange={(e) => {
                          const updated = [...simulatorRows];
                          updated[idx].department = e.target.value;
                          setSimulatorRows(updated);
                        }}
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-cyan-300 uppercase"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={row.doer}
                        onChange={(e) => {
                          const updated = [...simulatorRows];
                          updated[idx].doer = e.target.value;
                          setSimulatorRows(updated);
                        }}
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={row.systemType}
                        onChange={(e) => {
                          const updated = [...simulatorRows];
                          updated[idx].systemType = e.target.value;
                          setSimulatorRows(updated);
                        }}
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-400 uppercase"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={row.steps[0]?.name || ''}
                        onChange={(e) => {
                          const updated = [...simulatorRows];
                          if (!updated[idx].steps[0]) {
                            updated[idx].steps[0] = { order: 1, header: 'STEP-1', name: e.target.value, url: 'https://example.com', isAvailable: true };
                          } else {
                            updated[idx].steps[0].name = e.target.value;
                          }
                          setSimulatorRows(updated);
                        }}
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={row.steps[1]?.name || ''}
                        onChange={(e) => {
                          const updated = [...simulatorRows];
                          if (!updated[idx].steps[1]) {
                            updated[idx].steps[1] = { order: 2, header: 'STEP-2', name: e.target.value, url: 'https://example.com', isAvailable: true };
                          } else {
                            updated[idx].steps[1].name = e.target.value;
                          }
                          setSimulatorRows(updated);
                        }}
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const updated = simulatorRows.filter((_, i) => i !== idx);
                          setSimulatorRows(updated);
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
