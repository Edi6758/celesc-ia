import { Invoice, InvoiceStatus } from "../_types/invoice";

const regions = ["Norte", "Sul", "Leste", "Oeste"] as const;
const criticalReasons = [
  "Leitura fora do padrão",
  "Divergência cadastral",
  "Foto de baixa qualidade",
  "Medidor não localizado",
  "Leitura inconsistente com histórico",
  "Violação de lacre",
  "Suspeita de fraude"
];

const customerNames = [
  "João Silva Santos",
  "Maria Oliveira Costa",
  "Pedro Souza Lima",
  "Ana Paula Fernandes",
  "Carlos Eduardo Martins",
  "Lucia Helena Rodrigues",
  "Roberto Carlos Almeida",
  "Patricia Santos Moraes",
  "Fernando José Pereira",
  "Claudia Regina Barbosa",
  "Marcos Antonio Silva",
  "Juliana Costa Lima",
  "Ricardo Oliveira Nunes",
  "Mariana Souza Campos",
  "Alexandre Santos Cruz"
];

function generateRandomInvoice(index: number): Invoice {
  const region = regions[Math.floor(Math.random() * regions.length)];
  const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
  const uc = `${Math.floor(Math.random() * 9000) + 1000}${Math.floor(Math.random() * 900) + 100}`;

  const baseReading = Math.floor(Math.random() * 10000) + 5000;
  const previousReading = baseReading - Math.floor(Math.random() * 500) - 50;
  const currentReading = baseReading + (Math.random() > 0.1 ? Math.floor(Math.random() * 200) : Math.floor(Math.random() * 2000)); // 10% chance of anomaly

  const billedKWh = currentReading - previousReading;
  const amountBRL = billedKWh * (0.45 + Math.random() * 0.3); // R$ 0.45-0.75 por kWh

  const now = new Date();
  const readDate = new Date(now.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString();
  const dueDate = new Date(now.getTime() + Math.floor(Math.random() * 15 + 5) * 24 * 60 * 60 * 1000).toISOString();

  const riskScore = Math.random();
  const slaHoursLeft = Math.floor(Math.random() * 72) - 24; // -24 to 48 hours

  let status: InvoiceStatus = "RELEASED";
  let criticalReason: string | undefined;

  // Generate critical cases based on risk factors
  if (riskScore > 0.7 || billedKWh > 800 || billedKWh < 0 || slaHoursLeft < 0) {
    status = "CRITICAL";
    criticalReason = criticalReasons[Math.floor(Math.random() * criticalReasons.length)];
  } else if (Math.random() > 0.8) {
    status = ["HOLD", "REQUEST_READING", "ESCALATED"][Math.floor(Math.random() * 3)] as InvoiceStatus;
  }

  return {
    id: `INV-${String(index + 1).padStart(4, '0')}`,
    uc,
    customerName,
    region,
    dueDate,
    readDate,
    currentReading,
    previousReading,
    billedKWh,
    amountBRL,
    status,
    criticalReason,
    riskScore,
    slaHoursLeft
  };
}

export const mockInvoices: Invoice[] = Array.from({ length: 75 }, (_, i) => generateRandomInvoice(i));