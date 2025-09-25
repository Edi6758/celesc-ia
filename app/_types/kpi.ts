export interface KPIData {
  totalInvoices: number;
  criticalInvoices: number;
  autoDecisionRate: number;
  backlogCount: number;
  slaAtRisk: number;
  reworkRate: number;
  avgResolutionTime: number;
  refactorings: number;
}

export interface ProductivityData {
  analyst: string;
  casesPerHour: number;
  accuracyRate: number;
  totalCases: number;
}

export interface IntegrationHealth {
  service: string;
  status: "OK" | "DEGRADED" | "DOWN";
  lastHeartbeat: string;
  uptime: number;
}