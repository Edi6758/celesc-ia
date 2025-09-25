export type InvoiceStatus = "CRITICAL" | "RELEASED" | "HOLD" | "REQUEST_READING" | "ESCALATED";
export type Decision = "AUTO_RELEASE" | "AUTO_HOLD" | "ASK_READING" | "TO_ANALYST" | "ADJUST_CADASTRO";

export interface Invoice {
  id: string;
  uc: string; // Unidade consumidora
  customerName: string;
  region: "Norte" | "Sul" | "Leste" | "Oeste";
  dueDate: string;
  readDate: string;
  currentReading: number; // leitura informada
  previousReading: number;
  billedKWh?: number;
  amountBRL?: number;
  status: InvoiceStatus;
  criticalReason?: string; // ex.: "Leitura fora do padrão", "Divergência cadastral"
  riskScore?: number; // 0..1
  slaHoursLeft?: number; // negativo = atrasado
}