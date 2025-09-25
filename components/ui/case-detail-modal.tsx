'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  CpuIcon,
  SparklesIcon,
  TrendingUpIcon,
  MapPinIcon,
  CameraIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  BarChart3Icon,
  ZapIcon,
  BrainIcon,
  CalendarIcon,
  UserIcon,
  HomeIcon,
  BuildingIcon,
  FactoryIcon,
  FileTextIcon,
  ShieldCheckIcon
} from 'lucide-react';

interface CaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any;
}

export function CaseDetailModal({ isOpen, onClose, caseData }: CaseDetailModalProps) {
  if (!caseData) return null;

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case 'RESIDENTIAL': return HomeIcon;
      case 'COMMERCIAL': return BuildingIcon;
      case 'INDUSTRIAL': return FactoryIcon;
      default: return UserIcon;
    }
  };

  const getClientTypeLabel = (type: string) => {
    switch (type) {
      case 'RESIDENTIAL': return 'Residencial';
      case 'COMMERCIAL': return 'Comercial';
      case 'INDUSTRIAL': return 'Industrial';
      default: return 'Não definido';
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'AUTO_APPROVED': return 'bg-green-100 text-green-800';
      case 'AUTO_REJECTED': return 'bg-red-100 text-red-800';
      case 'NEEDS_REVIEW': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionLabel = (decision: string) => {
    switch (decision) {
      case 'AUTO_APPROVED': return 'Aprovado Automaticamente';
      case 'AUTO_REJECTED': return 'Rejeitado Automaticamente';
      case 'NEEDS_REVIEW': return 'Necessita Revisão';
      default: return 'Não definido';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'AUTO_APPROVED': return CheckCircleIcon;
      case 'AUTO_REJECTED': return XCircleIcon;
      case 'NEEDS_REVIEW': return AlertTriangleIcon;
      default: return CpuIcon;
    }
  };

  const ClientTypeIcon = getClientTypeIcon(caseData.clientType);
  const DecisionIcon = getDecisionIcon(caseData.aiDecision);

  // Mock AI analysis details
  const aiAnalysis = {
    processingTime: caseData.processingTime || '2.3s',
    confidence: caseData.confidence || 0.94,
    modelsUsed: ['Consumption Pattern Analysis', 'Anomaly Detection', 'Historical Comparison'],
    factors: [
      { name: 'Padrão Histórico', weight: 35, score: 92, status: 'normal' },
      { name: 'Variação Sazonal', weight: 25, score: 88, status: 'normal' },
      { name: 'Qualidade da Foto', weight: 20, score: 95, status: 'excellent' },
      { name: 'Precisão OCR', weight: 15, score: 97, status: 'excellent' },
      { name: 'Localização GPS', weight: 5, score: 100, status: 'excellent' }
    ],
    reasoning: caseData.reasoning || 'Análise automática identificou padrão de consumo consistente com histórico do cliente. Variação dentro dos limites aceitáveis para o perfil residencial.',
    similarCases: caseData.similarCases || 15,
    riskLevel: caseData.riskLevel || 'LOW'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CpuIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <DialogTitle className="flex items-center gap-2">
                Detalhes da Análise IA - {caseData.id}
              </DialogTitle>
              <DialogDescription>
                Caso processado automaticamente pela Inteligência Artificial
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="ai-analysis">Análise IA</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="technical">Técnico</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClientTypeIcon className="w-5 h-5" />
                    Informações do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nome</p>
                    <p className="font-semibold">{caseData.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Código</p>
                    <p className="font-mono">{caseData.clientCode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tipo</p>
                    <Badge variant="outline">
                      <ClientTypeIcon className="w-3 h-3 mr-1" />
                      {getClientTypeLabel(caseData.clientType)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Endereço</p>
                    <p className="text-sm">{caseData.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Região</p>
                    <Badge variant="secondary">{caseData.region}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* AI Decision */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-purple-600" />
                    Decisão da IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <DecisionIcon className="w-8 h-8 text-green-600" />
                    <div>
                      <Badge className={getDecisionColor(caseData.aiDecision)}>
                        {getDecisionLabel(caseData.aiDecision)}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        Processado em {aiAnalysis.processingTime}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Confiança</span>
                      <span className="text-sm font-bold text-green-600">
                        {(aiAnalysis.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={aiAnalysis.confidence * 100} className="h-2" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Processado por</p>
                    <div className="text-xs text-gray-500">
                      {aiAnalysis.modelsUsed.map((model, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <BrainIcon className="w-3 h-3" />
                          {model}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Consumption Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3Icon className="w-5 h-5" />
                  Detalhes do Consumo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{caseData.consumptionReading}</p>
                    <p className="text-sm text-gray-600">kWh Atual</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-600">{caseData.avgConsumption}</p>
                    <p className="text-sm text-gray-600">kWh Média</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${caseData.variation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {caseData.variation > 0 ? '+' : ''}{caseData.variation.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Variação</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-analysis" className="space-y-6">
            {/* AI Analysis Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainIcon className="w-5 h-5 text-purple-600" />
                  Fatores de Análise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiAnalysis.factors.map((factor, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{factor.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Peso: {factor.weight}%</span>
                        <Badge
                          variant="outline"
                          className={
                            factor.status === 'excellent' ? 'bg-green-50 text-green-700' :
                            factor.status === 'normal' ? 'bg-blue-50 text-blue-700' :
                            'bg-yellow-50 text-yellow-700'
                          }
                        >
                          {factor.score}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={factor.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Reasoning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="w-5 h-5" />
                  Justificativa da IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {aiAnalysis.reasoning}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BarChart3Icon className="w-4 h-4" />
                    {aiAnalysis.similarCases} casos similares
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheckIcon className="w-4 h-4" />
                    Risco {aiAnalysis.riskLevel.toLowerCase()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Consumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {caseData.historicalData?.map((value: number, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">Mês {6-i}</span>
                      <span className="font-mono font-medium">{value} kWh</span>
                    </div>
                  )) || <p className="text-gray-500">Nenhum histórico disponível</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CameraIcon className="w-5 h-5" />
                    Qualidade da Captura
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Qualidade da Foto</p>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {caseData.photoQuality || 'EXCELLENT'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Precisão OCR</p>
                    <p className="font-semibold">{caseData.ocrAccuracy || 97}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">GPS</p>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {caseData.gpsAccuracy || 'HIGH'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Timestamps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Criado em</p>
                    <p className="text-sm">{new Date(caseData.createdAt).toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resolvido em</p>
                    <p className="text-sm">{new Date(caseData.resolvedAt).toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Medidor</p>
                    <p className="font-mono text-sm">{caseData.meterSerial}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}