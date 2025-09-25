'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { mockKPIData, mockProductivityData } from '../../_mocks/kpi';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BarChart3Icon,
  TargetIcon,
  ZapIcon,
  UserCheckIcon,
  ActivityIcon,
  DollarSignIcon,
  FilterIcon,
  CalendarIcon
} from 'lucide-react';

const advancedMetrics = {
  financialImpact: {
    automationSavings: 145000, // R$ per month
    manualCostPerCase: 12.50,
    automatedCostPerCase: 2.30,
    totalSavings: 1740000 // R$ per year
  },
  qualityMetrics: {
    customerSatisfaction: 94.2,
    firstCallResolution: 87.5,
    escalationRate: 3.2,
    reworkRate: 4.1
  },
  operationalMetrics: {
    systemAvailability: 99.7,
    averageLatency: 120, // ms
    throughputPerHour: 450,
    peakHoursCapacity: 85.3
  },
  complianceMetrics: {
    auditCompliance: 98.5,
    dataIntegrity: 99.8,
    regulatoryCompliance: 96.7,
    securityScore: 92.4
  }
};

const regionMetrics = [
  { region: 'Norte', cases: 1247, automation: 76.2, avgTime: 3.8, sla: 94.5 },
  { region: 'Sul', cases: 1089, automation: 72.1, avgTime: 4.2, sla: 91.2 },
  { region: 'Leste', cases: 987, automation: 69.8, avgTime: 4.6, sla: 89.7 },
  { region: 'Oeste', cases: 756, automation: 71.4, avgTime: 4.1, sla: 92.8 }
];

const trendData = [
  { period: 'Jan', automation: 68.2, satisfaction: 91.5, costs: 158000 },
  { period: 'Fev', automation: 70.1, satisfaction: 92.1, costs: 152000 },
  { period: 'Mar', automation: 71.8, satisfaction: 93.2, costs: 149000 },
  { period: 'Abr', automation: 73.2, satisfaction: 93.8, costs: 147000 },
  { period: 'Mai', automation: 73.9, satisfaction: 94.2, costs: 145000 }
];

export default function KPIsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const getScoreColor = (score: number, reverse = false) => {
    if (reverse) {
      if (score < 70) return 'text-green-600 bg-green-50';
      if (score < 85) return 'text-yellow-600 bg-yellow-50';
      return 'text-red-600 bg-red-50';
    } else {
      if (score >= 95) return 'text-green-600 bg-green-50';
      if (score >= 85) return 'text-yellow-600 bg-yellow-50';
      return 'text-red-600 bg-red-50';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">KPIs Avançados</h1>
          <p className="text-muted-foreground">
            Métricas detalhadas de performance e impacto do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Regiões</SelectItem>
              <SelectItem value="Norte">Norte</SelectItem>
              <SelectItem value="Sul">Sul</SelectItem>
              <SelectItem value="Leste">Leste</SelectItem>
              <SelectItem value="Oeste">Oeste</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="quality">Qualidade</TabsTrigger>
          <TabsTrigger value="operational">Operacional</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          {/* Financial Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Economia Mensal</CardTitle>
                <DollarSignIcon className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(advancedMetrics.financialImpact.automationSavings)}
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. processamento manual
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custo por Caso</CardTitle>
                <TargetIcon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(advancedMetrics.financialImpact.automatedCostPerCase)}
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. {formatCurrency(advancedMetrics.financialImpact.manualCostPerCase)} manual
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI Anual</CardTitle>
                <TrendingUpIcon className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(advancedMetrics.financialImpact.totalSavings)}
                </div>
                <p className="text-xs text-muted-foregreen">
                  84% de redução de custos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payback</CardTitle>
                <CalendarIcon className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  8.2
                </div>
                <p className="text-xs text-muted-foreground">
                  meses para recuperação
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução da Economia</CardTitle>
              <CardDescription>Comparativo mensal de custos e automação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendData.map((month, i) => (
                  <div key={month.period} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="font-medium text-sm w-12">{month.period}</div>
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-muted-foreground">Automação</p>
                          <p className="font-medium">{month.automation}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Satisfação</p>
                          <p className="font-medium">{month.satisfaction}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Custo Total</p>
                      <p className="font-bold text-green-600">{formatCurrency(month.costs)}</p>
                      {i > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <TrendingDownIcon className="w-3 h-3 text-green-600" />
                          <span className="text-green-600">
                            -{((trendData[i-1].costs - month.costs) / trendData[i-1].costs * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          {/* Quality Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfação do Cliente</CardTitle>
                <UserCheckIcon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {advancedMetrics.qualityMetrics.customerSatisfaction}%
                </div>
                <Progress value={advancedMetrics.qualityMetrics.customerSatisfaction} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolução 1ª Tentativa</CardTitle>
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {advancedMetrics.qualityMetrics.firstCallResolution}%
                </div>
                <Progress value={advancedMetrics.qualityMetrics.firstCallResolution} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Escalação</CardTitle>
                <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {advancedMetrics.qualityMetrics.escalationRate}%
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Meta: &lt; 5%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Retrabalho</CardTitle>
                <ActivityIcon className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {advancedMetrics.qualityMetrics.reworkRate}%
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Meta: &lt; 3%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quality Scorecard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scorecard de Qualidade</CardTitle>
                <CardDescription>Indicadores consolidados de qualidade do serviço</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        advancedMetrics.qualityMetrics.customerSatisfaction >= 90 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm">Satisfação do Cliente</span>
                    </div>
                    <Badge className={getScoreColor(advancedMetrics.qualityMetrics.customerSatisfaction)}>
                      {advancedMetrics.qualityMetrics.customerSatisfaction}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        advancedMetrics.qualityMetrics.firstCallResolution >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm">Resolução 1ª Tentativa</span>
                    </div>
                    <Badge className={getScoreColor(advancedMetrics.qualityMetrics.firstCallResolution)}>
                      {advancedMetrics.qualityMetrics.firstCallResolution}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        advancedMetrics.qualityMetrics.escalationRate <= 5 ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm">Taxa de Escalação</span>
                    </div>
                    <Badge className={getScoreColor(100 - advancedMetrics.qualityMetrics.escalationRate * 10)}>
                      {advancedMetrics.qualityMetrics.escalationRate}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        advancedMetrics.qualityMetrics.reworkRate <= 3 ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm">Taxa de Retrabalho</span>
                    </div>
                    <Badge className={getScoreColor(100 - advancedMetrics.qualityMetrics.reworkRate * 10)}>
                      {advancedMetrics.qualityMetrics.reworkRate}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conformidade e Segurança</CardTitle>
                <CardDescription>Indicadores de compliance e segurança</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm">Conformidade Auditoria</span>
                    <div className="flex items-center gap-2">
                      <Progress value={advancedMetrics.complianceMetrics.auditCompliance} className="w-20" />
                      <span className="text-sm font-medium">{advancedMetrics.complianceMetrics.auditCompliance}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm">Integridade dos Dados</span>
                    <div className="flex items-center gap-2">
                      <Progress value={advancedMetrics.complianceMetrics.dataIntegrity} className="w-20" />
                      <span className="text-sm font-medium">{advancedMetrics.complianceMetrics.dataIntegrity}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm">Compliance Regulatório</span>
                    <div className="flex items-center gap-2">
                      <Progress value={advancedMetrics.complianceMetrics.regulatoryCompliance} className="w-20" />
                      <span className="text-sm font-medium">{advancedMetrics.complianceMetrics.regulatoryCompliance}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm">Score de Segurança</span>
                    <div className="flex items-center gap-2">
                      <Progress value={advancedMetrics.complianceMetrics.securityScore} className="w-20" />
                      <span className="text-sm font-medium">{advancedMetrics.complianceMetrics.securityScore}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          {/* Operational Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disponibilidade</CardTitle>
                <ZapIcon className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {advancedMetrics.operationalMetrics.systemAvailability}%
                </div>
                <p className="text-xs text-muted-foreground">
                  SLA: 99.5%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latência Média</CardTitle>
                <ClockIcon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {advancedMetrics.operationalMetrics.averageLatency}ms
                </div>
                <p className="text-xs text-muted-foreground">
                  Meta: &lt; 200ms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Throughput/Hora</CardTitle>
                <ActivityIcon className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {advancedMetrics.operationalMetrics.throughputPerHour}
                </div>
                <p className="text-xs text-muted-foreground">
                  casos processados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Capacidade Pico</CardTitle>
                <BarChart3Icon className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {advancedMetrics.operationalMetrics.peakHoursCapacity}%
                </div>
                <p className="text-xs text-muted-foreground">
                  utilização máxima
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>Saúde do Sistema</CardTitle>
              <CardDescription>Indicadores técnicos em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Performance</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Memória</span>
                        <span>62%</span>
                      </div>
                      <Progress value={62} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Disco</span>
                        <span>38%</span>
                      </div>
                      <Progress value={38} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Conectividade</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">SAP S/4HANA</span>
                      <Badge variant="default" className="bg-green-500">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">AI Engine</span>
                      <Badge variant="default" className="bg-green-500">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Mobile API</span>
                      <Badge variant="destructive" className="bg-yellow-500">Degradado</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          {/* Regional Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance por Região</CardTitle>
              <CardDescription>Comparativo de indicadores regionais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Região</th>
                      <th className="text-center p-3">Casos</th>
                      <th className="text-center p-3">Automação</th>
                      <th className="text-center p-3">Tempo Médio</th>
                      <th className="text-center p-3">SLA</th>
                      <th className="text-center p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionMetrics.map((region) => (
                      <tr key={region.region} className="border-b last:border-b-0 hover:bg-muted/50">
                        <td className="p-3 font-medium">{region.region}</td>
                        <td className="text-center p-3">{region.cases.toLocaleString()}</td>
                        <td className="text-center p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={region.automation} className="w-16" />
                            <span className="text-sm">{region.automation}%</span>
                          </div>
                        </td>
                        <td className="text-center p-3">{region.avgTime}h</td>
                        <td className="text-center p-3">
                          <Badge className={getScoreColor(region.sla)}>
                            {region.sla}%
                          </Badge>
                        </td>
                        <td className="text-center p-3">
                          <Badge variant={region.sla >= 92 ? "default" : "destructive"} className={
                            region.sla >= 92 ? "bg-green-500" : region.sla >= 90 ? "bg-yellow-500" : "bg-red-500"
                          }>
                            {region.sla >= 92 ? 'Excelente' : region.sla >= 90 ? 'Bom' : 'Atenção'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Regional Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ranking de Automação</CardTitle>
                <CardDescription>Percentual de decisões automáticas por região</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionMetrics
                    .sort((a, b) => b.automation - a.automation)
                    .map((region, index) => (
                      <div key={region.region} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{region.region}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={region.automation} className="w-24" />
                          <span className="font-bold text-blue-600 w-12">{region.automation}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance SLA</CardTitle>
                <CardDescription>Cumprimento de SLA por região</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionMetrics
                    .sort((a, b) => b.sla - a.sla)
                    .map((region, index) => (
                      <div key={region.region} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{region.region}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={region.sla} className="w-24" />
                          <Badge className={getScoreColor(region.sla)}>
                            {region.sla}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}