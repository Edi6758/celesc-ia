import { DecisionSuggestion, DecisionContext } from '../_types/decision';
import { Decision } from '../_types/invoice';
import { mockApiResponse } from './api';

export class DecisionEngine {
  static async getSuggestion(context: DecisionContext): Promise<DecisionSuggestion> {
    const {
      currentReading,
      previousReading,
      historicalAverage,
      photoQuality,
      serialMatch,
      riskScore,
      slaHours
    } = context;

    const consumptionVariation = Math.abs(
      (currentReading - previousReading - historicalAverage) / historicalAverage
    );

    const triggeredRules: string[] = [];
    const reasoning: string[] = [];
    let decision: Decision = 'AUTO_RELEASE';
    let confidence = 0.8;

    // Rule 1: Photo Quality Check
    if (photoQuality !== 'GOOD') {
      decision = 'ASK_READING';
      confidence = 0.9;
      triggeredRules.push('Validação de Foto');
      reasoning.push('Qualidade de foto insuficiente detectada');
    }

    // Rule 2: Serial Match Check
    if (!serialMatch) {
      decision = 'ADJUST_CADASTRO';
      confidence = 0.95;
      triggeredRules.push('Verificação de Serial');
      reasoning.push('Serial do medidor não confere com cadastro');
    }

    // Rule 3: High Risk Score
    if (riskScore >= 0.8) {
      decision = 'TO_ANALYST';
      confidence = 0.85;
      triggeredRules.push('Alto Risco de Fraude');
      reasoning.push('Score de risco elevado - requer análise humana');
    }

    // Rule 4: SLA Critical
    if (slaHours < 0) {
      decision = 'TO_ANALYST';
      confidence = 0.7;
      triggeredRules.push('SLA Crítico');
      reasoning.push('SLA vencido - prioridade máxima');
    }

    // Rule 5: Consumption Pattern (only if no other rules triggered)
    if (triggeredRules.length === 0) {
      if (consumptionVariation <= 0.15 && photoQuality === 'GOOD' && serialMatch) {
        decision = 'AUTO_RELEASE';
        confidence = 0.92;
        triggeredRules.push('Consumo Padrão');
        reasoning.push('Leitura dentro do padrão histórico');
      } else if (consumptionVariation > 0.5) {
        decision = 'TO_ANALYST';
        confidence = 0.75;
        triggeredRules.push('Consumo Anômalo');
        reasoning.push('Variação significativa no consumo');
      } else {
        decision = 'AUTO_HOLD';
        confidence = 0.6;
        triggeredRules.push('Análise Conservadora');
        reasoning.push('Padrão incerto - retenção preventiva');
      }
    }

    const suggestion: DecisionSuggestion = {
      decision,
      confidence,
      reasoning,
      triggeredRules,
      suggestedJustification: reasoning[0] || 'Decisão automática baseada em regras'
    };

    return mockApiResponse(suggestion, 150); // Simulate AI processing time
  }

  static async batchAnalysis(contexts: DecisionContext[]): Promise<DecisionSuggestion[]> {
    const suggestions = await Promise.all(
      contexts.map(context => this.getSuggestion(context))
    );

    return mockApiResponse(suggestions, 500); // Longer delay for batch processing
  }
}