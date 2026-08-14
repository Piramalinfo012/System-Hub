import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, 
  Search, 
  RotateCw, 
  FileSpreadsheet, 
  ShieldCheck,
  ArrowUpRight,
  Plus,
  X
} from 'lucide-react';
import { EmailMasterItem } from '../../types';
import { GoogleSheetService } from '../../services/googleSheetService';
import { SPREADSHEET_ID } from '../../services/appsScriptGenerator';

interface EmailMasterViewProps {
  darkMode: boolean;
}

export const EmailMasterView: React.FC<EmailMasterViewProps> = ({ darkMode }) => {
  const [emails, setEmails] = useState<EmailMasterItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Add Email Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEmail, setNewEmail] = useState({
    personName: '',
    department: '',
    emailId: '',
    password: '',
    usingMobileNumberForMaking: '',
    recoveryMail: '',
    personUse: '',
    status: 'Active'
  });

  const loadData = async (force = false) => {
    if (force) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await GoogleSheetService.fetchEmailMaster(force);
      if (res.success && Array.isArray(res.data)) {
        setEmails(res.data);
      }
    } catch (err) {
      console.error('Failed to load Email Master:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, []);

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await GoogleSheetService.insertEmailMaster(newEmail);
      setIsAddModalOpen(false);
      setNewEmail({ personName: '', department: '', emailId: '', password: '', usingMobileNumberForMaking: '', recoveryMail: '', personUse: '', status: 'Active' });
      await loadData(true);
    } catch (err) {
      alert('Failed to add email record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEmails = useMemo(() => {
    return emails.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = (
        item.personName.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.emailId.toLowerCase().includes(q) ||
        item.personUse.toLowerCase().includes(q)
      );
      
      const itemStatus = item.status.toLowerCase();
      let matchesStatus = true;
      if (statusFilter === 'ACTIVE') {
        matchesStatus = itemStatus === 'active';
      } else if (statusFilter === 'INACTIVE') {
        matchesStatus = itemStatus !== 'active';
      }

      return matchesSearch && matchesStatus;
    });
  }, [emails, searchQuery, statusFilter]);

  const activeCount = emails.filter(e => e.status.toLowerCase() === 'active').length;
  const inactiveCount = emails.length - activeCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-slate-950 shadow-lg shadow-rose-500/20 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">Email Master</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                  Connected to Tab "Email Master"
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Directly synchronized with the <code className="text-rose-400 font-mono">Email Master</code> tab. View email configurations, passwords, and recovery contacts.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-rose-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Record</span>
            </button>

            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Refresh from Database"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-400' : ''}`} />
              <span className="hidden sm:inline">Sync Sheet</span>
            </button>

            <a
              href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-rose-400" />
              <span>Open Tab in Database</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center gap-3 justify-between ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, department, or email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
            />
          </div>
          
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'ALL' 
                  ? 'bg-slate-800 text-slate-200 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'ACTIVE' 
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-xs border border-emerald-500/30' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('INACTIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'INACTIVE' 
                  ? 'bg-rose-500/20 text-rose-400 shadow-xs border border-rose-500/30' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Total:</span>
            <span className="text-slate-200">{emails.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Active:</span>
            <span className="text-emerald-400">{activeCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Inactive:</span>
            <span className="text-rose-400">{inactiveCount}</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-48 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filteredEmails.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <Mail className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-200">No Email Records Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Ensure the "Email Master" tab exists in the sheet.'}
          </p>
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white shadow-xs'}`}>
          <table className="w-full text-left text-xs">
            <thead className={`text-[10px] uppercase tracking-wider border-b ${darkMode ? 'bg-slate-950/50 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
              <tr>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Person Name</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Email ID</th>
                <th className="px-4 py-3 font-semibold">Password</th>
                <th className="px-4 py-3 font-semibold">Mobile (Making)</th>
                <th className="px-4 py-3 font-semibold">Recovery Mail</th>
                <th className="px-4 py-3 font-semibold">Person Use</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {filteredEmails.map((item, index) => (
                <tr key={item.id} className={`transition-colors ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.status.toLowerCase() === 'active' 
                        ? darkMode ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                        : darkMode ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-rose-100 text-rose-700 border-rose-300'
                    }`}>
                      {item.status || 'Unknown'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.personName}</td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.department}</td>
                  <td className={`px-4 py-3 font-mono ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{item.emailId}</td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.password}</td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.usingMobileNumberForMaking}</td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.recoveryMail}</td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.personUse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Email Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => !isSubmitting && setIsAddModalOpen(false)}></div>
          <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50'}`}>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Mail className="w-5 h-5 text-rose-500" />
                Add New Email Record
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddEmail} className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Person Name</label>
                  <input required type="text" value={newEmail.personName} onChange={e => setNewEmail({...newEmail, personName: e.target.value})} className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-hidden focus:border-rose-500 transition-colors ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} placeholder="e.g. John Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Department</label>
                  <input required type="text" value={newEmail.department} onChange={e => setNewEmail({...newEmail, department: e.target.value})} className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-hidden focus:border-rose-500 transition-colors ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} placeholder="e.g. Sales" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Email ID</label>
                  <input required type="email" value={newEmail.emailId} onChange={e => setNewEmail({...newEmail, emailId: e.target.value})} className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-hidden focus:border-rose-500 transition-colors ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} placeholder="name@company.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Password</label>
                  <input required type="text" value={newEmail.password} onChange={e => setNewEmail({...newEmail, password: e.target.value})} className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-hidden focus:border-rose-500 transition-colors ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} placeholder="Strong password" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Mobile Number (Making)</label>
                  <input type="text" value={newEmail.usingMobileNumberForMaking} onChange={e => setNewEmail({...newEmail, usingMobileNumberForMaking: e.target.value})} className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-hidden focus:border-rose-500 transition-colors ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} placeholder="Linked phone number" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Recovery Mail</label>
                  <input type="email" value={newEmail.recoveryMail} onChange={e => setNewEmail({...newEmail, recoveryMail: e.target.value})} className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-hidden focus:border-rose-500 transition-colors ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} placeholder="recovery@company.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Person Use</label>
                  <input type="text" value={newEmail.personUse} onChange={e => setNewEmail({...newEmail, personUse: e.target.value})} className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-hidden focus:border-rose-500 transition-colors ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} placeholder="Primary user" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Status</label>
                  <select value={newEmail.status} onChange={e => setNewEmail({...newEmail, status: e.target.value})} className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-hidden focus:border-rose-500 transition-colors ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className={`px-4 py-2 rounded-xl text-sm font-bold bg-rose-500 text-slate-950 transition-colors shadow-lg shadow-rose-500/20 flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-400'}`}>
                  {isSubmitting ? <RotateCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {isSubmitting ? 'Saving...' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
