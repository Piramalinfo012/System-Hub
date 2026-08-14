import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  UserProfile, 
  SystemItem, 
  ActiveTab, 
  ViewLayout, 
  GoogleSheetApiResponse 
} from './types';
import { GoogleSheetService } from './services/googleSheetService';
import { Login } from './components/auth/Login';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { KpiCard } from './components/common/KpiCard';
import { FilterBar } from './components/dashboard/FilterBar';
import { SystemGrid } from './components/dashboard/SystemGrid';
import { SystemDetailsModal } from './components/systems/SystemDetailsModal';
import { FavoritesView } from './components/views/FavoritesView';
import { RecentlyOpenedView } from './components/views/RecentlyOpenedView';
import { DepartmentView } from './components/views/DepartmentView';
import { DashboardsCatalogView } from './components/views/DashboardsCatalogView';
import { WhatsappAutomationView } from './components/views/WhatsappAutomationView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { GoogleSheetStudio } from './components/apps_script/GoogleSheetStudio';
import { SettingsModal } from './components/settings/SettingsModal';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { ErrorState } from './components/common/ErrorState';
import { EmptyState } from './components/common/EmptyState';
import { 
  Layers, 
  Building2, 
  BarChart3, 
  MessageSquare,
  Workflow, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  RotateCw,
  Search,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export default function App() {
  // Auth state
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('company_hub_user');
      if (stored) {
        try { return JSON.parse(stored); } catch { return null; }
      }
    }
    // Default logged-in user for fast experience
    return {
      name: 'Operations Director',
      email: 'ops.director@company.internal',
      role: 'Operations Lead',
      department: 'Executive Hub',
      rememberMe: true
    };
  });

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('company_hub_theme');
      return stored ? stored === 'dark' : true;
    }
    return true;
  });

  // Navigation & View
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [viewLayout, setViewLayout] = useState<ViewLayout>('grid');
  const [isCollapsedSidebar, setIsCollapsedSidebar] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Data & State
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [apiResponseMeta, setApiResponseMeta] = useState<GoogleSheetApiResponse['metadata'] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedSystemType, setSelectedSystemType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'steps' | 'department'>('default');

  // Modals & Details
  const [selectedSystemModal, setSelectedSystemModal] = useState<SystemItem | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Favorites & History
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentCount, setRecentCount] = useState<number>(0);

  // Synchronize Dark Mode Class on Root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('company_hub_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('company_hub_theme', 'light');
    }
  }, [darkMode]);

  // Debounce search query (150ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Initial Data
  const loadData = useCallback(async (forceReload = false) => {
    if (forceReload) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const response = await GoogleSheetService.fetchSystems(forceReload);
      if (response.success && Array.isArray(response.data)) {
        setSystems(response.data);
        setApiResponseMeta(response.metadata || null);
      } else {
        throw new Error(response.error || 'Failed to load system records from Google Sheet');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setFavoriteIds(GoogleSheetService.getFavoriteIds());
      setRecentCount(GoogleSheetService.getRecentAccessList().length);
    }
  }, []);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Auto-refresh timer loop (from settings e.g. 5m)
  useEffect(() => {
    const intervalMs = GoogleSheetService.getRefreshInterval();
    if (intervalMs <= 0) return;

    const timer = setInterval(() => {
      loadData(true);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [loadData]);

  // User Auth Handlers
  const handleLoginSuccess = (userProfile: UserProfile) => {
    setUser(userProfile);
    if (userProfile.rememberMe) {
      localStorage.setItem('company_hub_user', JSON.stringify(userProfile));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('company_hub_user');
  };

  const handleToggleFavorite = (systemId: string) => {
    const updated = GoogleSheetService.toggleFavorite(systemId);
    setFavoriteIds(updated);
  };

  // Dynamic Departments & System Types
  const availableDepartments = useMemo(() => {
    const depts = new Set<string>();
    systems.forEach((s) => {
      if (s.department) depts.add(s.department);
    });
    return Array.from(depts).sort();
  }, [systems]);

  const availableSystemTypes = useMemo(() => {
    const types = new Set<string>();
    systems.forEach((s) => {
      if (s.systemType) types.add(s.systemType);
    });
    return Array.from(types).sort();
  }, [systems]);

  // Filtered & Sorted Systems
  const filteredSystems = useMemo(() => {
    let result = [...systems];

    // Department Filter
    if (selectedDepartment !== 'ALL') {
      result = result.filter(
        (s) => s.department.toUpperCase() === selectedDepartment.toUpperCase()
      );
    }

    // System Type Filter
    if (selectedSystemType !== 'ALL') {
      result = result.filter(
        (s) => s.systemType.toUpperCase() === selectedSystemType.toUpperCase()
      );
    }

    // Search Query (across system name, department, doer, system type, step names)
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter((s) => {
        const matchName = s.systemName.toLowerCase().includes(q);
        const matchDept = s.department.toLowerCase().includes(q);
        const matchDoer = s.doer.toLowerCase().includes(q);
        const matchType = s.systemType.toLowerCase().includes(q);
        const matchSteps = s.steps.some(
          (st) => st.name.toLowerCase().includes(q) || st.header.toLowerCase().includes(q)
        );
        return matchName || matchDept || matchDoer || matchType || matchSteps;
      });
    }

    // Sorting
    if (sortBy === 'name') {
      result.sort((a, b) => a.systemName.localeCompare(b.systemName));
    } else if (sortBy === 'steps') {
      result.sort((a, b) => b.steps.length - a.steps.length);
    } else if (sortBy === 'department') {
      result.sort((a, b) => a.department.localeCompare(b.department));
    } else {
      // Natural SR order
      result.sort((a, b) => {
        const numA = typeof a.sr === 'number' ? a.sr : parseInt(String(a.sr), 10) || 0;
        const numB = typeof b.sr === 'number' ? b.sr : parseInt(String(b.sr), 10) || 0;
        return numA - numB;
      });
    }

    return result;
  }, [systems, selectedDepartment, selectedSystemType, debouncedSearch, sortBy]);

  // Top KPIs
  const totalSystemsCount = systems.length;
  const totalDepartmentsCount = availableDepartments.length;
  const totalDashboardsCount = systems.filter((s) => GoogleSheetService.isValidUrl(s.dashboardUrl)).length;
  const totalStepsCount = systems.reduce((acc, s) => acc + s.steps.length, 0);
  const totalActiveSystemsCount = systems.filter((s) => s.status === 'ACTIVE').length;

  // Render Login if not authenticated
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* 1. TOP HEADER */}
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        user={user}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefreshData={() => loadData(true)}
        isRefreshing={isRefreshing}
        lastUpdated={apiResponseMeta?.lastUpdated || new Date().toISOString()}
        dataSource={apiResponseMeta?.source || 'SIMULATOR'}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAppsScriptStudio={() => setActiveTab('apps_script')}
      />

      {/* 2. MAIN LAYOUT (SIDEBAR + CONTENT) */}
      <div className="flex">
        
        {/* Persistent Collapsible Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'systems') {
              setSelectedDepartment('ALL');
            }
          }}
          isCollapsed={isCollapsedSidebar}
          onToggleCollapse={() => setIsCollapsedSidebar(!isCollapsedSidebar)}
          darkMode={darkMode}
          totalSystems={totalSystemsCount}
          totalDepartments={totalDepartmentsCount}
          totalDashboards={totalDashboardsCount}
          favoritesCount={favoriteIds.length}
          recentCount={recentCount}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          
          {/* Active Tab: COMMAND CENTER / DASHBOARD & ALL SYSTEMS */}
          {(activeTab === 'dashboard' || activeTab === 'systems') && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Welcome & Command Center Hero Banner */}
              {activeTab === 'dashboard' && (
                <div className={`relative p-6 sm:p-8 rounded-3xl border overflow-hidden shadow-xl ${
                  darkMode 
                    ? 'bg-linear-to-r from-slate-900 via-slate-900/90 to-slate-950 border-slate-800' 
                    : 'bg-linear-to-r from-white via-blue-50/50 to-cyan-50/30 border-slate-200'
                }`}>
                  {/* Subtle Background Glow Accent */}
                  <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Connected to Master Google Sheet Database</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Welcome to Digital System Hub
                      </h1>
                      <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        One centralized place to access all company software, dashboards and operational workflows. 
                        Every system, workflow step and direct URL is synchronized in real-time.
                      </p>
                    </div>

                    {/* Quick Action Button */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => setActiveTab('whatsapp')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp Hub</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('apps_script')}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                        <span>Apps Script & Schema</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('dashboards')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>BI Catalog</span>
                      </button>
                    </div>
                  </div>

                  {/* Top Animated KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mt-8">
                    <KpiCard
                      title="TOTAL SYSTEMS"
                      value={totalSystemsCount}
                      subtitle="Indexed from Sheet"
                      icon={Layers}
                      colorScheme="cyan"
                      darkMode={darkMode}
                      trendText="Active"
                    />
                    <KpiCard
                      title="TOTAL DEPARTMENTS"
                      value={totalDepartmentsCount}
                      subtitle="Divisions & Teams"
                      icon={Building2}
                      colorScheme="blue"
                      darkMode={darkMode}
                      onClick={() => setActiveTab('departments')}
                    />
                    <KpiCard
                      title="TOTAL DASHBOARDS"
                      value={totalDashboardsCount}
                      subtitle="Looker & BI Reports"
                      icon={BarChart3}
                      colorScheme="amber"
                      darkMode={darkMode}
                      onClick={() => setActiveTab('dashboards')}
                    />
                    <KpiCard
                      title="TOTAL STEPS"
                      value={totalStepsCount}
                      subtitle="Operational Workflows"
                      icon={Workflow}
                      colorScheme="indigo"
                      darkMode={darkMode}
                    />
                    <KpiCard
                      title="ACTIVE SYSTEMS"
                      value={totalActiveSystemsCount}
                      subtitle="100% Operational"
                      icon={ShieldCheck}
                      colorScheme="emerald"
                      darkMode={darkMode}
                      trendText="Online"
                    />
                  </div>
                </div>
              )}

              {/* Filter & Search Bar */}
              <FilterBar
                departments={availableDepartments}
                selectedDepartment={selectedDepartment}
                onSelectDepartment={setSelectedDepartment}
                systemTypes={availableSystemTypes}
                selectedSystemType={selectedSystemType}
                onSelectSystemType={setSelectedSystemType}
                totalFilteredCount={filteredSystems.length}
                totalAllCount={totalSystemsCount}
                sortBy={sortBy}
                onSelectSortBy={setSortBy}
                viewLayout={viewLayout}
                onSelectViewLayout={setViewLayout}
                darkMode={darkMode}
                onResetFilters={() => {
                  setSelectedDepartment('ALL');
                  setSelectedSystemType('ALL');
                  setSearchQuery('');
                  setSortBy('default');
                }}
              />

              {/* Main System Grid / Loading / Error / Empty States */}
              {isLoading ? (
                <LoadingSkeleton darkMode={darkMode} />
              ) : errorMessage ? (
                <ErrorState
                  error={errorMessage}
                  onRetry={() => loadData(true)}
                  onOpenSettings={() => setIsSettingsModalOpen(true)}
                  darkMode={darkMode}
                />
              ) : totalSystemsCount === 0 ? (
                <EmptyState
                  onOpenAppsScript={() => setActiveTab('apps_script')}
                  darkMode={darkMode}
                />
              ) : (
                <SystemGrid
                  systems={filteredSystems}
                  favoriteIds={favoriteIds}
                  onToggleFavorite={handleToggleFavorite}
                  onViewDetails={(system) => setSelectedSystemModal(system)}
                  viewLayout={viewLayout}
                  darkMode={darkMode}
                  onClearFilters={() => {
                    setSelectedDepartment('ALL');
                    setSelectedSystemType('ALL');
                    setSearchQuery('');
                  }}
                />
              )}

            </div>
          )}

          {/* Active Tab: WHATSAPP AUTOMATIONS */}
          {activeTab === 'whatsapp' && (
            <WhatsappAutomationView
              darkMode={darkMode}
            />
          )}

          {/* Active Tab: DEPARTMENTS VIEW */}
          {activeTab === 'departments' && (
            <DepartmentView
              systems={systems}
              onSelectDepartmentFilter={(dept) => {
                setSelectedDepartment(dept);
                setActiveTab('systems');
              }}
              onViewDetails={(system) => setSelectedSystemModal(system)}
              darkMode={darkMode}
            />
          )}

          {/* Active Tab: DASHBOARDS CATALOG */}
          {activeTab === 'dashboards' && (
            <DashboardsCatalogView
              systems={systems}
              darkMode={darkMode}
            />
          )}

          {/* Active Tab: MY FAVORITES */}
          {activeTab === 'favorites' && (
            <FavoritesView
              systems={systems}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={(system) => setSelectedSystemModal(system)}
              darkMode={darkMode}
              onExploreAll={() => setActiveTab('systems')}
            />
          )}

          {/* Active Tab: RECENTLY OPENED */}
          {activeTab === 'recent' && (
            <RecentlyOpenedView
              darkMode={darkMode}
              onExploreAll={() => setActiveTab('systems')}
            />
          )}

          {/* Active Tab: ANALYTICS */}
          {activeTab === 'analytics' && (
            <AnalyticsView
              systems={systems}
              darkMode={darkMode}
            />
          )}

          {/* Active Tab: GOOGLE APPS SCRIPT STUDIO & SIMULATOR */}
          {activeTab === 'apps_script' && (
            <GoogleSheetStudio
              darkMode={darkMode}
              onRefreshData={() => loadData(true)}
              currentSystems={systems}
            />
          )}

          {/* Active Tab: SETTINGS */}
          {activeTab === 'settings' && (
            <div className={`p-6 rounded-3xl border max-w-2xl mx-auto ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Workflow className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Portal Configuration</h2>
                  <p className="text-xs text-slate-400">Manage Google Sheet integration and portal settings</p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left flex items-center justify-between transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-bold">Configure Google Apps Script API URL</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Switch between Live Google Sheet and Simulator</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </button>

                <button
                  onClick={() => setActiveTab('apps_script')}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left flex items-center justify-between transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-bold">Apps Script Engine (Code.gs) & Step Detector</h4>
                    <p className="text-xs text-slate-400 mt-0.5">View copyable script and test sheet payloads</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. SYSTEM DETAILS MODAL */}
      <SystemDetailsModal
        system={selectedSystemModal}
        isOpen={Boolean(selectedSystemModal)}
        onClose={() => setSelectedSystemModal(null)}
        isFavorite={Boolean(selectedSystemModal && favoriteIds.includes(selectedSystemModal.id))}
        onToggleFavorite={handleToggleFavorite}
        darkMode={darkMode}
      />

      {/* 4. SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        darkMode={darkMode}
        onRefreshData={() => loadData(true)}
      />

    </div>
  );
}
