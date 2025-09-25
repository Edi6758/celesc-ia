'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockInvoices } from '@/app/_mocks/invoices';
import { mockReadings } from '@/app/_mocks/readings';
import { mockAuditEvents } from '@/app/_mocks/audit';
import { HistoryTimeline } from '@/components/shared/history-timeline';
import {
  ArrowLeftIcon,
  BrainIcon,
  CheckCircleIcon,
  XCircleIcon,
  RefreshCcwIcon,
  AlertCircleIcon,
  UserIcon,
  CameraIcon,
  MapPinIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  FileTextIcon,
  ShieldCheckIcon,
  WifiIcon,
  BatteryIcon,
  CalendarIcon,
  TagIcon
} from 'lucide-react';

export default function CasoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, fetch based on params.id
  const invoice = mockInvoices.find(inv => inv.status === 'CRITICAL') || mockInvoices[0];
  const readings = mockReadings.filter(r => r.invoiceId === invoice.id);
  const auditEvents = mockAuditEvents.filter(e => e.invoiceId === invoice.id).slice(0, 5);

  // Mock historical consumption for chart
  const historicalData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleDateString('pt-BR', { month: 'short' }),
    consumption: Math.floor(180 + Math.random() * 80 + (i === 11 ? 100 : 0)),
    isAnomaly: i === 11
  }));

  // Mock AI analysis
  const aiAnalysis = {
    decision: 'TO_ANALYST',
    confidence: 0.84,
    primaryReason: 'Consumo 28% acima da média histórica',
    factors: [
      { factor: 'Variação de consumo', impact: 'Alto', value: '+28%', status: 'warning' },
      { factor: 'Qualidade da foto', impact: 'Médio', value: '89%', status: 'good' },
      { factor: 'Precisão OCR', impact: 'Baixo', value: '94%', status: 'good' },
      { factor: 'Geolocalização', impact: 'Baixo', value: 'OK', status: 'good' },
      { factor: 'Histórico do cliente', impact: 'Médio', value: 'Regular', status: 'neutral' }
    ],
    recommendations: [
      'Verificar se houve mudança no padrão de uso',
      'Considerar solicitação de releitura para confirmação',
      'Analisar faturas dos últimos 6 meses',
      'Verificar possível problema no medidor'
    ],
    riskAssessment: {
      fraudRisk: 0.23,
      equipmentFailure: 0.15,
      measurementError: 0.31,
      patternChange: 0.67
    }
  };

  const handleAction = async (action: string) => {
    if (!justification.trim()) {
      alert('Justificativa é obrigatória');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert(`Ação "${action}" executada com sucesso!`);
    setIsSubmitting(false);
    setSelectedAction(null);
    setJustification('');

    // In real app, redirect or update state
    router.push('/analista');
  };

  const getFactorIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircleIcon className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default: return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar ao Workbench
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Análise de Caso - UC {invoice.uc}</h1>
            <p className="text-gray-600 dark:text-gray-400">{invoice.customerName} • {invoice.region}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">
              SLA: {invoice.slaHoursLeft}h
            </Badge>
            <Badge variant="outline">
              Risco: {Math.round((invoice.riskScore || 0) * 100)}%
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Case Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BrainIcon className="h-5 w-5 text-purple-600" />
                    Análise da IA
                  </CardTitle>
                  <Badge variant="outline" className="text-purple-600">
                    Confiança: {Math.round(aiAnalysis.confidence * 100)}%
                  </Badge>
                </div>
                <CardDescription>
                  {aiAnalysis.primaryReason}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiAnalysis.factors.map((factor, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getFactorIcon(factor.status)}
                        <span className="text-sm font-medium">{factor.factor}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{factor.value}</p>
                        <p className="text-xs text-gray-500">{factor.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Recomendações</h4>
                  <ul className="space-y-1">
                    {aiAnalysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Avaliação de Risco</h4>
                  <div className="space-y-2">
                    {Object.entries(aiAnalysis.riskAssessment).map(([risk, value]) => (
                      <div key={risk} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{risk.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                value > 0.6 ? 'bg-red-500' : value > 0.3 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${value * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono w-8">{Math.round(value * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Tabs */}
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b px-6">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Resumo</TabsTrigger>
                    <TabsTrigger value="photos">Fotos</TabsTrigger>
                    <TabsTrigger value="consumption">Consumo</TabsTrigger>
                    <TabsTrigger value="technical">Técnico</TabsTrigger>
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="p-6 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold font-mono">{invoice.currentReading.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Leitura Atual</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold font-mono">{invoice.previousReading.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Leitura Anterior</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{invoice.billedKWh?.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">kWh Faturado</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {invoice.amountBRL?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <p className="text-sm text-gray-600">Valor Total</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Informações da UC</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Classe:</span>
                            <span>Residencial</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Subclasse:</span>
                            <span>Residencial Normal</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tensão:</span>
                            <span>220V</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Grupo:</span>
                            <span>B1</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Dados do Medidor</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Número:</span>
                            <span className="font-mono">MTR7821</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Marca:</span>
                            <span>ELSTER</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Instalação:</span>
                            <span>15/03/2020</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Multiplicador:</span>
                            <span>1.0</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="photos" className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Foto Atual</h4>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                        <div className="text-center">
                          <CameraIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Foto do medidor</p>
                          <Badge variant="outline" className="mt-2 text-green-600">Boa Qualidade</Badge>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>OCR Confidence:</span>
                          <Badge variant="outline">94%</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Geolocalização:</span>
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">Validado</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Timestamp:</span>
                          <span>{new Date(invoice.readDate).toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Metadados Técnicos</h4>
                      <div className="space-y-3">
                        <Card>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Qualidade da Imagem</span>
                              <Badge variant="outline">89%</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>Resolução: 1920x1080</div>
                              <div>Formato: JPEG</div>
                              <div>Exposição: Auto</div>
                              <div>Flash: Desligado</div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Conectividade</span>
                              <div className="flex items-center gap-1">
                                <WifiIcon className="h-3 w-3" />
                                <BatteryIcon className="h-3 w-3" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>Sinal: -65 dBm</div>
                              <div>Bateria: 78%</div>
                              <div>Operadora: CLARO</div>
                              <div>Sync: Online</div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="consumption" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Histórico de Consumo (12 meses)</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="h-64 flex items-end justify-between gap-2">
                          {historicalData.map((month, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <div
                                className={`w-8 rounded-t transition-all ${
                                  month.isAnomaly ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                                style={{
                                  height: `${(month.consumption / 300) * 200}px`
                                }}
                                title={`${month.month}: ${month.consumption} kWh`}
                              ></div>
                              <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">{month.month}</span>
                              <span className="text-xs font-mono">{month.consumption}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <TrendingUpIcon className="h-8 w-8 mx-auto text-green-600 mb-2" />
                          <p className="text-2xl font-bold">195</p>
                          <p className="text-sm text-gray-600">Média kWh/mês</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <TrendingDownIcon className="h-8 w-8 mx-auto text-red-600 mb-2" />
                          <p className="text-2xl font-bold text-red-600">+28%</p>
                          <p className="text-sm text-gray-600">Variação Atual</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <CalendarIcon className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                          <p className="text-2xl font-bold">3</p>
                          <p className="text-sm text-gray-600">Meses Atípicos</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Regras Acionadas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <AlertCircleIcon className="h-4 w-4 text-red-600" />
                          <div className="flex-1">
                            <p className="font-medium text-red-800 dark:text-red-200">Consumo Anômalo</p>
                            <p className="text-xs text-red-600">Variação > 20% da média histórica</p>
                          </div>
                          <Badge variant="destructive">Crítica</Badge>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <ClockIcon className="h-4 w-4 text-yellow-600" />
                          <div className="flex-1">
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">SLA Crítico</p>
                            <p className="text-xs text-yellow-600">Menos de 4h para vencimento</p>
                          </div>
                          <Badge variant="outline">Atenção</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Validações Técnicas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Integridade do Lacre</span>
                          <Badge variant="outline" className="text-green-600">OK</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Sequência de Leitura</span>
                          <Badge variant="outline" className="text-green-600">Válida</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Limite de Demanda</span>
                          <Badge variant="outline" className="text-yellow-600">Próximo</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Padrão Sazonal</span>
                          <Badge variant="outline" className="text-red-600">Divergente</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="p-6">
                  <HistoryTimeline
                    events={auditEvents}
                    title="Trilha de Auditoria do Caso"
                    description={`Histórico completo de ações para a fatura ${invoice.id}`}
                    showFilters={false}
                    maxHeight="400px"
                    resourceFilter={invoice.id}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Action Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Disponíveis</CardTitle>
                <CardDescription>
                  Selecione a ação apropriada para este caso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start" onClick={() => setSelectedAction('LIBERAR')}>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Liberar Faturamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Liberar Faturamento</DialogTitle>
                      <DialogDescription>
                        Confirme a liberação da fatura para faturamento normal
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Justificativa *</label>
                        <Input
                          placeholder="Descreva o motivo da liberação..."
                          value={justification}
                          onChange={(e) => setJustification(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAction('LIBERAR')}
                          disabled={isSubmitting || !justification.trim()}
                          className="flex-1"
                        >
                          {isSubmitting ? 'Processando...' : 'Confirmar Liberação'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setSelectedAction('RELEITURA')}>
                      <RefreshCcwIcon className="h-4 w-4 mr-2" />
                      Solicitar Releitura
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Solicitar Releitura</DialogTitle>
                      <DialogDescription>
                        Envie uma ordem de serviço para nova coleta
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Motivo da Releitura *</label>
                        <Input
                          placeholder="Ex: Consumo fora do padrão, verificar medidor..."
                          value={justification}
                          onChange={(e) => setJustification(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAction('RELEITURA')}
                          disabled={isSubmitting || !justification.trim()}
                          className="flex-1"
                        >
                          {isSubmitting ? 'Processando...' : 'Solicitar Releitura'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setSelectedAction('AJUSTE')}>
                      <AlertCircleIcon className="h-4 w-4 mr-2" />
                      Ajuste Cadastral
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajuste Cadastral</DialogTitle>
                      <DialogDescription>
                        Solicite correção nos dados cadastrais
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Descrição do Ajuste *</label>
                        <Input
                          placeholder="Descreva o ajuste necessário..."
                          value={justification}
                          onChange={(e) => setJustification(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAction('AJUSTE')}
                          disabled={isSubmitting || !justification.trim()}
                          className="flex-1"
                        >
                          {isSubmitting ? 'Processando...' : 'Solicitar Ajuste'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full justify-start" onClick={() => setSelectedAction('ESCALAR')}>
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Escalar para Supervisor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Escalar Caso</DialogTitle>
                      <DialogDescription>
                        Encaminhe o caso para supervisão especializada
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Motivo do Escalamento *</label>
                        <Input
                          placeholder="Justifique porque o caso precisa ser escalado..."
                          value={justification}
                          onChange={(e) => setJustification(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAction('ESCALAR')}
                          disabled={isSubmitting || !justification.trim()}
                          variant="destructive"
                          className="flex-1"
                        >
                          {isSubmitting ? 'Processando...' : 'Escalar Caso'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Última Ocorrência</span>
                  <span className="text-sm font-medium">6 meses atrás</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pagamentos em Atraso</span>
                  <Badge variant="outline" className="text-green-600">0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Score de Confiabilidade</span>
                  <Badge variant="outline">Alto</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cliente desde</span>
                  <span className="text-sm font-medium">Março/2020</span>
                </div>
              </CardContent>
            </Card>

            {/* Similar Cases */}
            <Card>
              <CardHeader>
                <CardTitle>Casos Similares</CardTitle>
                <CardDescription>Histórico de decisões em casos parecidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">UC 1234567891</span>
                      <Badge variant="outline" className="text-green-600">Liberado</Badge>
                    </div>
                    <p className="text-xs text-gray-600">+25% consumo, releitura confirmou</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">UC 1234567892</span>
                      <Badge variant="outline" className="text-yellow-600">Releitura</Badge>
                    </div>
                    <p className="text-xs text-gray-600">+30% consumo, medidor defeituoso</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}