export interface StepItem {
  order: number;
  header: string; // e.g. "STEP-1", "STEP-2", "STEP-10"
  name: string; // The display name (e.g. "NEW CRM")
  url: string; // The target destination URL
  isAvailable: boolean; // True if valid URL exists
  sourceColumn?: string;
}

export interface SystemItem {
  id: string;
  sr: number | string;
  systemName: string;
  softwareUrl: string;
  department: string;
  doer: string;
  systemType: string;
  sheetUrl: string;
  dashboardUrl: string;
  description?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'PLANNED' | 'BETA';
  steps: StepItem[];
  sheetRowIndex?: number; // 1-based row index in Google Sheet for updates/deletes
  rawValues?: unknown[];
  rawRowsCount?: number;
  lastUpdated?: string;
  category?: string;
}

export interface GoogleSheetApiResponse {
  success: boolean;
  data: SystemItem[];
  metadata?: {
    totalSystems: number;
    totalSteps: number;
    totalDepartments: number;
    departments: string[];
    systemTypes: string[];
    detectedStepColumns: string[];
    sheetName?: string;
    lastUpdated: string;
    source: 'GOOGLE_APPS_SCRIPT' | 'SIMULATOR' | 'LOCAL_CACHE';
  };
  error?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'Administrator' | 'Operations Lead' | 'Department Manager' | 'Team Member';
  department: string;
  avatarUrl?: string;
  rememberMe?: boolean;
}

export interface RecentAccessItem {
  id: string;
  systemId: string;
  title: string;
  type: 'system' | 'step' | 'sheet' | 'dashboard';
  url: string;
  department: string;
  timestamp: number;
  stepHeader?: string;
}

export interface WhatsappAutomationItem {
  id: string;
  rowIndex?: number;
  sheetName: string;
  url: string;
  purpose: string;
  status?: 'ACTIVE' | 'PAUSED' | 'TESTING';
  category?: string;
  lastTriggered?: string;
  triggersCount?: number;
}

export interface SystemHeartbeatStatus {
  systemId: string;
  url: string;
  status: 'ONLINE' | 'OFFLINE' | 'CHECKING' | 'NO_URL';
  statusCode?: number;
  responseTimeMs?: number;
  lastChecked: number;
  message?: string;
  checkedVia?: 'APPS_SCRIPT' | 'SIMULATOR_PING' | 'DIRECT';
}

export type ViewLayout = 'grid' | 'compact' | 'table' | 'workflow';
export type ActiveTab = 'dashboard' | 'systems' | 'whatsapp' | 'departments' | 'dashboards' | 'favorites' | 'recent' | 'analytics' | 'apps_script' | 'settings';
