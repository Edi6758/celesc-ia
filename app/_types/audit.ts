import { ReadingEvidence } from "./reading";

export interface AuditEvent {
  id: string;
  invoiceId?: string; // Optional for non-invoice related events
  userId?: string; // User ID (undefined for SYSTEM actions)
  actor?: string; // Deprecated: use userId instead
  action: string; // ex.: "login", "invoice_approved", "rule_triggered", etc.
  justification?: string; // Deprecated: use details instead
  details: string; // Detailed description of the event
  timestamp: string;
  ipAddress?: string; // IP address where action originated
  resourceId?: string; // ID of the resource being acted upon
  metadata?: Record<string, any>; // Additional structured data
  evidence?: Partial<ReadingEvidence>; // For reading-related events
}