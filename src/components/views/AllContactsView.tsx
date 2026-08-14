import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Search, 
  RotateCw, 
  FileSpreadsheet, 
  ArrowUpRight
} from 'lucide-react';
import { AllContactsItem } from '../../types';
import { GoogleSheetService } from '../../services/googleSheetService';
import { SPREADSHEET_ID } from '../../services/appsScriptGenerator';

interface AllContactsViewProps {
  darkMode: boolean;
}

export const AllContactsView: React.FC<AllContactsViewProps> = ({ darkMode }) => {
  const [contacts, setContacts] = useState<AllContactsItem[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = async (force = false) => {
    if (force) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await GoogleSheetService.fetchAllContacts(force);
      if (res.success && Array.isArray(res.data)) {
        setContacts(res.data);
        if (res.headers) {
          setHeaders(res.headers);
        }
      }
    } catch (err) {
      console.error('Failed to load All Contacts:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, []);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    return contacts.filter(item => {
      const q = searchQuery.toLowerCase();
      // Search across all values in the contact object
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(q)
      );
    });
  }, [contacts, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/20 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">All Contacts</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                  Connected to Tab "All Contacts"
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Directly synchronized with the <code className="text-orange-400 font-mono">All Contacts</code> tab in your Google Spreadsheet.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Refresh from Database"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-orange-400' : ''}`} />
              <span className="hidden sm:inline">Sync Sheet</span>
            </button>

            <a
              href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-orange-400" />
              <span>Open Tab in Database</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all fields..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs focus:outline-hidden focus:border-orange-500 transition-colors ${
              darkMode ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500' : 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400'
            }`}
          />
        </div>
        <div className={`hidden sm:flex items-center gap-2 text-xs ml-auto px-3 py-1.5 rounded-lg border ${
          darkMode ? 'text-slate-400 bg-slate-900 border-slate-800' : 'text-slate-600 bg-slate-100 border-slate-200'
        }`}>
           <Users className="w-4 h-4 text-orange-400" />
           <span>{contacts.length} Total Contacts</span>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-48 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-200">No Contacts Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Ensure the "All Contacts" tab exists in the sheet.'}
          </p>
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white shadow-xs'}`}>
          <table className="w-full text-left text-xs">
            <thead className={`text-[10px] uppercase tracking-wider border-b ${darkMode ? 'bg-slate-950/50 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {filteredContacts.map((item) => (
                <tr key={item.id} className={`transition-colors ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                  {headers.map((h, i) => (
                    <td key={i} className={`px-4 py-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item[h]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
