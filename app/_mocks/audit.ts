import { AuditEvent } from "../_types/audit";
import { mockInvoices } from "./invoices";

const detailedAuditEvents = [
  // System login events
  {
    action: "login",
    userId: "pedro.oliveira",
    details: "Usuário logou no sistema com sucesso",
    ipAddress: "192.168.1.45"
  },
  {
    action: "login",
    userId: "carlos.silva",
    details: "Leiturista acessou aplicativo móvel",
    ipAddress: "10.20.30.15"
  },
  {
    action: "logout",
    userId: "helena.gestora",
    details: "Sessão encerrada por timeout",
    ipAddress: "192.168.1.78"
  },

  // Invoice processing events
  {
    action: "invoice_reviewed",
    userId: "pedro.oliveira",
    details: "Fatura FAT-2024-001234 analisada e aprovada",
    resourceId: "FAT-2024-001234"
  },
  {
    action: "invoice_approved",
    userId: "SYSTEM",
    details: "Decisão automática - consumo dentro da faixa esperada (±8%)",
    resourceId: "FAT-2024-001235"
  },
  {
    action: "invoice_rejected",
    userId: "mariana.costa",
    details: "Fatura rejeitada - inconsistência no serial do medidor",
    resourceId: "FAT-2024-001236"
  },

  // Reading collection events
  {
    action: "reading_collected",
    userId: "carlos.silva",
    details: "Leitura coletada com OCR 92% de confiança",
    resourceId: "UC-789012",
    metadata: { confidence: 92, quality: "boa", gps_accuracy: 5 }
  },
  {
    action: "reading_collected",
    userId: "jose.santos",
    details: "Releitura executada - valor corrigido de 450 para 425 kWh",
    resourceId: "UC-456789",
    metadata: { previous_reading: 450, new_reading: 425, reason: "erro_digitacao" }
  },

  // Rule triggered events
  {
    action: "rule_triggered",
    userId: "SYSTEM",
    details: "Regra 'Consumo Anômalo Alto' acionada - aumento de 320%",
    resourceId: "RULE-003",
    metadata: { consumption_increase: 320, threshold: 300, action: "escalate" }
  },
  {
    action: "rule_triggered",
    userId: "SYSTEM",
    details: "Regra 'Foto Ilegível' acionada - qualidade 45%",
    resourceId: "RULE-002",
    metadata: { photo_quality: 45, threshold: 70, action: "request_reread" }
  },

  // Configuration changes
  {
    action: "config_changed",
    userId: "roberto.admin",
    details: "Threshold de qualidade de foto alterado de 70% para 75%",
    resourceId: "CONFIG-PHOTO-QUALITY",
    metadata: { old_value: 70, new_value: 75 }
  },
  {
    action: "config_changed",
    userId: "roberto.admin",
    details: "Nova regra de IA criada: 'Detecção Fraude Padrão'",
    resourceId: "RULE-005",
    metadata: { rule_type: "fraud_detection", confidence_threshold: 0.78 }
  },

  // System backup events
  {
    action: "system_backup",
    userId: "SYSTEM",
    details: "Backup automático executado com sucesso - 2.4GB",
    metadata: { backup_size: "2.4GB", duration: "45min", status: "success" }
  },
  {
    action: "system_backup",
    userId: "SYSTEM",
    details: "Falha no backup automático - espaço insuficiente",
    metadata: { error: "insufficient_space", required: "3.1GB", available: "2.8GB" }
  }
];

const actions = [
  "login", "logout", "invoice_reviewed", "invoice_approved", "invoice_rejected",
  "reading_collected", "rule_triggered", "system_backup", "config_changed",
  "AUTO_RELEASE", "AUTO_HOLD", "ASK_READING", "TO_ANALYST", "ADJUST_CADASTRO",
  "MANUAL_RELEASE", "ESCALATE"
];

const actors = [
  "SYSTEM", "pedro.oliveira", "mariana.costa", "roberto.admin",
  "helena.gestora", "carlos.silva", "jose.santos", "ana.ferreira"
];

const ipAddresses = [
  "192.168.1.45", "192.168.1.32", "192.168.1.78", "10.20.30.15",
  "10.20.30.28", "172.16.1.100", "172.16.1.200", "localhost"
];

function generateDetailedAuditEvent(index: number): AuditEvent {
  // Use predefined detailed events for first 20 entries
  if (index < detailedAuditEvents.length) {
    const event = detailedAuditEvents[index];
    return {
      id: `AUD-${String(index + 1).padStart(4, '0')}`,
      action: event.action,
      userId: event.userId,
      details: event.details,
      timestamp: new Date(Date.now() - (index * 30 * 60 * 1000)).toISOString(), // 30 min intervals
      ipAddress: event.ipAddress || ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
      resourceId: event.resourceId,
      metadata: event.metadata
    };
  }

  // Generate random events for remaining entries
  const invoice = mockInvoices[Math.floor(Math.random() * mockInvoices.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const actor = actors[Math.floor(Math.random() * actors.length)];

  const justifications = [
    "Leitura dentro do padrão histórico",
    "Foto de baixa qualidade detectada",
    "Serial do medidor não confere",
    "Consumo fora do padrão - solicitada releitura",
    "Ajuste cadastral necessário",
    "Análise manual aprovada",
    "Caso escalado para supervisão",
    "Evidência fotográfica adequada",
    "Validação geográfica falhou",
    "OCR com baixa confiança"
  ];

  const justification = justifications[Math.floor(Math.random() * justifications.length)];

  const timestamp = new Date(
    Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
  ).toISOString();

  return {
    id: `AUD-${String(index + 1).padStart(4, '0')}`,
    action,
    userId: actor === "SYSTEM" ? undefined : actor,
    details: `${action}: ${justification}`,
    timestamp,
    ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
    resourceId: action.includes('invoice') ? invoice.id : undefined,
    metadata: action === "rule_triggered" ? {
      confidence: Math.floor(Math.random() * 40) + 60,
      threshold: Math.floor(Math.random() * 20) + 70
    } : undefined
  };
}

export const mockAuditEvents: AuditEvent[] = Array.from(
  { length: 200 },
  (_, i) => generateDetailedAuditEvent(i)
);