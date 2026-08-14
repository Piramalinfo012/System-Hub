import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  Send, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  Search, 
  RotateCw, 
  FileSpreadsheet, 
  Zap, 
  CheckCircle2, 
  Bell, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  Smartphone,
  Filter,
  LayoutGrid,
  List,
  X
} from 'lucide-react';

const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

import { WhatsappAutomationItem } from '../../types';
import { GoogleSheetService, WHATSAPP_SHEET_GID } from '../../services/googleSheetService';
import { SPREADSHEET_ID } from '../../services/appsScriptGenerator';

interface WhatsappAutomationViewProps {
  darkMode: boolean;
}

export const WhatsappAutomationView: React.FC<WhatsappAutomationViewProps> = ({ darkMode }) => {
  const [automations, setAutomations] = useState<WhatsappAutomationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewStyle, setViewStyle] = useState<'grid' | 'list'>('grid');

  // Modal State for Adding New Automation
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newSheetName, setNewSheetName] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const [newPurpose, setNewPurpose] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Simulator Modal
  const [testingItem, setTestingItem] = useState<WhatsappAutomationItem | null>(null);
  const [testSent, setTestSent] = useState<boolean>(false);

  const loadData = async (force = false) => {
    if (force) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await GoogleSheetService.fetchWhatsappAutomations(force);
      if (res.success && Array.isArray(res.data)) {
        setAutomations(res.data);
      }
    } catch (err) {
      console.error('Failed to load WhatsApp automations:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, []);

  const handleCopyLink = (item: WhatsappAutomationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.url) return;
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenUrl = (item: WhatsappAutomationItem) => {
    if (!item.url) return;
    GoogleSheetService.openExternalUrl(
      item.url, 
      item.sheetName, 
      item.id, 
      'sheet', 
      item.category || 'WhatsApp Automation'
    );
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSheetName.trim()) return;

    setIsSubmitting(true);
    try {
      await GoogleSheetService.insertWhatsappAutomation({
        sheetName: newSheetName.trim(),
        url: newUrl.trim() || `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=${WHATSAPP_SHEET_GID}#gid=${WHATSAPP_SHEET_GID}`,
        purpose: newPurpose.trim() || 'Automated WhatsApp trigger & notification'
      });

      setSuccessToast(`"${newSheetName}" added to WhatsApp Automations!`);
      setNewSheetName('');
      setNewUrl('');
      setNewPurpose('');
      setIsAddModalOpen(false);
      await loadData(true);

      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    automations.forEach(a => {
      if (a.category) set.add(a.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [automations]);

  const filteredAutomations = useMemo(() => {
    return automations.filter(item => {
      const matchSearch = 
        !searchQuery.trim() ||
        item.sheetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [automations, searchQuery, selectedCategory]);

  const totalAutomations = automations.length;
  const activeCount = automations.filter(a => a.status !== 'PAUSED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner with Direct Link to User's Google Sheet Tab */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">WhatsApp Automation Hub</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected to Tab "Whatsapp"
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Directly synchronized with the <code className="text-emerald-400 font-mono">Whatsapp</code> tab in your Google Spreadsheet. View, trigger, and open all sheet-linked WhatsApp workflows.
                Directly synchronized with the database. View, trigger, and open all linked WhatsApp workflows.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className={`p-2 rounded-xl transition-all disabled:opacity-50 ${
                darkMode ? 'bg-slate-900 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-slate-800' : 'bg-white text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-200'
              }`}
              title="Refresh from Database"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            <button
              onClick={() => window.open(WHATSAPP_SHEET_GID ? `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=${WHATSAPP_SHEET_GID}` : `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`, '_blank')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800 hover:text-emerald-400 border border-slate-800 transition-all flex items-center gap-1.5"
            >
              <span>Open Tab in Database</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Automation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Workflows</span>
            <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className={`mt-2 text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{totalAutomations}</div>
          <span className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Configured in Backend</span>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Active Automations</span>
            <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className={`mt-2 text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{activeCount}</div>
          <span className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Live Triggers Active</span>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Target Sheet Tab</span>
            <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-100 text-teal-700'}`}>
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className={`mt-2 text-base font-bold font-mono truncate ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>Whatsapp</div>
          <span className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Tab GID: 1379287055</span>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Webhook Engine</span>
            <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className={`mt-2 text-base font-bold flex items-center gap-1.5 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            <span className={`w-2 h-2 rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
            <span>Ready</span>
          </div>
          <span className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Apps Script Live Link</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search automation name, purpose, or URL..."
              className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs focus:outline-hidden focus:border-emerald-500 transition-colors ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500' : 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>
          
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setViewStyle('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewStyle === 'grid' 
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-xs border border-emerald-500/30' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewStyle('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewStyle === 'list' 
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-xs border border-emerald-500/30' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Chips */}
        {categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                    : darkMode
                    ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-48 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filteredAutomations.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <MessageSquare className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-200">No WhatsApp Automations Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Add your first automation to get started.'}
          </p>
        </div>
      ) : (
        <>
          {viewStyle === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-3 transition-all duration-200 group cursor-pointer border-dashed border-2 ${
                  darkMode 
                    ? 'bg-slate-900/20 border-slate-700 hover:bg-emerald-500/10 hover:border-emerald-500/50' 
                    : 'bg-slate-50/50 border-slate-300 hover:bg-emerald-50 hover:border-emerald-400 shadow-xs'
                } hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  darkMode ? 'bg-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/20' : 'bg-slate-200 text-slate-500 group-hover:text-emerald-600 group-hover:bg-emerald-100'
                }`}>
                  <Plus className="w-6 h-6" />
                </div>
                
                <div className="space-y-0.5 w-full">
                  <h3 className={`text-xs font-bold leading-tight transition-colors ${
                    darkMode ? 'text-slate-400 group-hover:text-emerald-400' : 'text-slate-600 group-hover:text-emerald-700'
                  }`}>
                    Add New
                  </h3>
                  <span className={`text-[9px] font-mono uppercase tracking-wider block ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    AUTOMATION
                  </span>
                </div>
              </button>

              {filteredAutomations.map((item) => {
                const hasValidUrl = GoogleSheetService.isValidUrl(item.url);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleOpenUrl(item)}
                    disabled={!hasValidUrl}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-3 transition-all duration-200 group ${
                      darkMode 
                        ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-emerald-500/40' 
                        : 'bg-white border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-300 shadow-xs'
                    } ${!hasValidUrl ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-1 hover:shadow-lg cursor-pointer'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${
                      darkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                    }`}>
                      <WhatsAppIcon className="w-6 h-6" />
                    </div>
                    
                    <div className="space-y-0.5 w-full">
                      <h3 className={`text-xs font-bold leading-tight line-clamp-2 transition-colors ${
                        darkMode ? 'text-slate-200 group-hover:text-emerald-300' : 'text-slate-700 group-hover:text-emerald-700'
                      }`}>
                        {item.sheetName}
                      </h3>
                      <span className={`text-[9px] font-mono uppercase tracking-wider block ${
                        darkMode ? 'text-slate-500' : 'text-slate-600'
                      }`}>
                        {item.category || 'WORKFLOW'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className={`w-full p-3 rounded-2xl border border-dashed border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 group text-left cursor-pointer ${
                  darkMode 
                    ? 'bg-slate-900/20 border-slate-700 hover:bg-emerald-500/10 hover:border-emerald-500/50' 
                    : 'bg-slate-50/50 border-slate-300 hover:bg-emerald-50 hover:border-emerald-400 shadow-xs'
                } hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                    darkMode ? 'bg-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/20' : 'bg-slate-200 text-slate-500 group-hover:text-emerald-600 group-hover:bg-emerald-100'
                  }`}>
                    <Plus className="w-5 h-5" />
                  </div>
                  
                  <div>
                    <h3 className={`text-sm font-bold transition-colors ${
                      darkMode ? 'text-slate-400 group-hover:text-emerald-400' : 'text-slate-600 group-hover:text-emerald-700'
                    }`}>
                      Create New Automation
                    </h3>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-500 group-hover:text-emerald-500/70' : 'text-slate-500 group-hover:text-emerald-600/70'}`}>
                      Add a new webhook workflow to your Backend
                    </p>
                  </div>
                </div>
              </button>

              {filteredAutomations.map((item, index) => {
                const hasValidUrl = GoogleSheetService.isValidUrl(item.url);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleOpenUrl(item)}
                    disabled={!hasValidUrl}
                    className={`w-full p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 group text-left ${
                      darkMode 
                        ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-emerald-500/40' 
                        : 'bg-white border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-300 shadow-xs'
                    } ${!hasValidUrl ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-110 ${
                        darkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                      }`}>
                        <WhatsAppIcon className="w-5 h-5" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className={`text-sm font-bold transition-colors ${
                            darkMode ? 'text-slate-200 group-hover:text-emerald-300' : 'text-slate-700 group-hover:text-emerald-700'
                          }`}>
                            {item.sheetName}
                          </h3>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 border ${
                            darkMode ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                          }`}>
                            LIVE
                          </span>
                        </div>
                        <p className={`text-xs line-clamp-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {item.purpose || 'Direct automated WhatsApp message dispatch.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:border-l sm:pl-4 sm:ml-auto border-slate-800 shrink-0">
                      <div className={`text-[10px] font-mono uppercase tracking-wider ${
                        darkMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {item.category || 'WORKFLOW'}
                      </div>
                      <div
                        className={`flex items-center gap-1 text-[11px] font-bold transition-all ${
                          hasValidUrl ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-slate-500'
                        }`}
                      >
                        <span>Open Sheet</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ADD AUTOMATION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Add WhatsApp Automation</h3>
                  <p className="text-xs text-slate-400">Append new record to "Whatsapp" sheet tab</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Sheet Name / Automation Title *
                </label>
                <input
                  type="text"
                  required
                  value={newSheetName}
                  onChange={(e) => setNewSheetName(e.target.value)}
                  placeholder="e.g. Leave Request, Sales Alert, Payment Notification"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Target Sheet or Webhook URL
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit...`}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-500 block">
                  Defaults to the current Google Spreadsheet WhatsApp tab if left blank.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Purpose / Trigger Description
                </label>
                <textarea
                  rows={3}
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder="Describe when this WhatsApp automation triggers and who receives the alert..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Automatically writes to column A, B, and C in the "Whatsapp" sheet tab.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving to Sheet...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Automation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEST FLOW PREVIEW MODAL */}
      {testingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">WhatsApp Trigger Test</h3>
                  <p className="text-xs text-slate-400">{testingItem.sheetName}</p>
                </div>
              </div>
              <button
                onClick={() => setTestingItem(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Message Preview</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-sans text-xs border border-slate-800 space-y-1.5">
                  <p className="font-bold text-emerald-300">🔔 {testingItem.sheetName.toUpperCase()} ALERT</p>
                  <p className="text-slate-300">Hello Manager, a new entry has been recorded in the system.</p>
                  <p className="text-slate-400 text-[11px]"><strong>Trigger Details:</strong> {testingItem.purpose}</p>
                  <p className="text-cyan-400 text-[11px] underline break-all">{testingItem.url}</p>
                  <p className="text-[10px] text-slate-500 pt-1">Timestamp: {new Date().toLocaleString()}</p>
                </div>
              </div>

              {testSent ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Test alert simulated and payload verified successfully!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setTestSent(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simulate Send Test Alert</span>
                </button>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
              <button
                onClick={() => setTestingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
