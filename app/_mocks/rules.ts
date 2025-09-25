import { Rule } from "../_types/rule";

export const mockRules: Rule[] = [
  {
    id: "rule-001",
    name: "Validação de Foto",
    description: "Verifica qualidade da foto e solicita releitura se necessário",
    enabled: true,
    json: {
      conditions: [
        { field: "photoQuality", operator: "!=", value: "GOOD" }
      ],
      action: "ASK_READING",
      priority: 1
    },
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-02-01T14:30:00Z",
    author: "Roberto Admin"
  },
  {
    id: "rule-002",
    name: "Verificação de Serial",
    description: "Compara serial OCR com serial esperado do medidor",
    enabled: true,
    json: {
      conditions: [
        { field: "serialMatch", operator: "==", value: false }
      ],
      action: "ADJUST_CADASTRO",
      priority: 2
    },
    createdAt: "2024-01-10T10:15:00Z",
    updatedAt: "2024-01-10T10:15:00Z",
    author: "Roberto Admin"
  },
  {
    id: "rule-003",
    name: "Alto Risco de Fraude",
    description: "Escala casos com alto score de risco para análise humana",
    enabled: true,
    json: {
      conditions: [
        { field: "riskScore", operator: ">=", value: 0.8 }
      ],
      action: "TO_ANALYST",
      priority: 3
    },
    createdAt: "2024-01-20T16:45:00Z",
    updatedAt: "2024-02-15T09:20:00Z",
    author: "Helena Gestora"
  },
  {
    id: "rule-004",
    name: "SLA Crítico",
    description: "Prioriza casos próximos ao vencimento do SLA",
    enabled: true,
    json: {
      conditions: [
        { field: "slaHoursLeft", operator: "<", value: 0 }
      ],
      action: "TO_ANALYST",
      priority: 0
    },
    createdAt: "2024-01-05T12:00:00Z",
    updatedAt: "2024-01-05T12:00:00Z",
    author: "Roberto Admin"
  },
  {
    id: "rule-005",
    name: "Consumo Padrão",
    description: "Libera automaticamente leituras dentro do padrão histórico",
    enabled: true,
    json: {
      conditions: [
        { field: "consumptionVariation", operator: "<=", value: 0.15 },
        { field: "photoQuality", operator: "==", value: "GOOD" },
        { field: "serialMatch", operator: "==", value: true }
      ],
      action: "AUTO_RELEASE",
      priority: 4
    },
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-02-10T11:30:00Z",
    author: "Roberto Admin"
  }
];