import { KPIData, ProductivityData, IntegrationHealth } from "../_types/kpi";
import { mockInvoices } from "./invoices";

export const mockKPIData: KPIData = {
  totalInvoices: mockInvoices.length,
  criticalInvoices: mockInvoices.filter(inv => inv.status === "CRITICAL").length,
  autoDecisionRate: 0.73, // 73% auto-decision
  backlogCount: mockInvoices.filter(inv => inv.slaHoursLeft && inv.slaHoursLeft < 0).length,
  slaAtRisk: mockInvoices.filter(inv => inv.slaHoursLeft && inv.slaHoursLeft < 12).length,
  reworkRate: 0.12, // 12% rework
  avgResolutionTime: 4.2, // 4.2 hours average
  refactorings: 23
};

export const mockProductivityData: ProductivityData[] = [
  {
    analyst: "Pedro Oliveira",
    casesPerHour: 8.3,
    accuracyRate: 0.94,
    totalCases: 247
  },
  {
    analyst: "Mariana Costa",
    casesPerHour: 9.1,
    accuracyRate: 0.91,
    totalCases: 312
  },
  {
    analyst: "Roberto Analista",
    casesPerHour: 7.8,
    accuracyRate: 0.96,
    totalCases: 189
  },
  {
    analyst: "Claudia Ferreira",
    casesPerHour: 8.7,
    accuracyRate: 0.89,
    totalCases: 267
  }
];

export const mockIntegrationHealth: IntegrationHealth[] = [
  {
    service: "SAP S/4HANA IS-U",
    status: "OK",
    lastHeartbeat: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    uptime: 0.998
  },
  {
    service: "OCR Service",
    status: "DEGRADED",
    lastHeartbeat: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    uptime: 0.945
  },
  {
    service: "Message Queue",
    status: "OK",
    lastHeartbeat: new Date(Date.now() - 30 * 1000).toISOString(),
    uptime: 0.999
  },
  {
    service: "MLOps Pipeline",
    status: "OK",
    lastHeartbeat: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    uptime: 0.987
  }
];

// Historical data for charts (last 8 weeks)
export const mockHistoricalData = Array.from({ length: 8 }, (_, i) => {
  const weekAgo = new Date(Date.now() - (7 - i) * 7 * 24 * 60 * 60 * 1000);
  return {
    week: `Sem ${8 - i}`,
    date: weekAgo.toISOString().split('T')[0],
    criticals: Math.floor(Math.random() * 50) + 20,
    resolved: Math.floor(Math.random() * 45) + 35,
    backlog: Math.floor(Math.random() * 30) + 10,
    autoDecision: Math.floor(Math.random() * 20) + 60
  };
});