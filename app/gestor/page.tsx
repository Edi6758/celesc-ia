'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockKPIData, mockProductivityData, mockHistoricalData } from '../_mocks/kpi';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BarChart3Icon,
  DownloadIcon,
  RefreshCcwIcon
} from 'lucide-react';

export default function GestorPage() {
  const kpis = mockKPIData;

  const getVariationColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getVariationIcon = (value: number) => {
    if (value > 0) return <TrendingUpIcon className="h-4 w-4" />;
    if (value < 0) return <TrendingDownIcon className="h-4 w-4" />;
    return null;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Executivo</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visão geral do sistema de críticas - Últimos 30 dias
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCcwIcon className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Processadas</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalInvoices.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={getVariationColor(12)}>
                {getVariationIcon(12)}
                +12% desde o mês passado
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Auto-Decisão</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(kpis.autoDecisionRate * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className={getVariationColor(5)}>
                {getVariationIcon(5)}
                +5% desde o mês passado
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas Pendentes</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.criticalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              <span className={getVariationColor(-8)}>
                {getVariationIcon(-8)}
                -8% desde o mês passado
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Médio (h)</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.avgResolutionTime.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={getVariationColor(-15)}>
                {getVariationIcon(-15)}
                -15% desde o mês passado
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência Histórica</CardTitle>
            <CardDescription>Evolução do volume de críticas nas últimas 8 semanas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockHistoricalData.map((week, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    {/* Críticas */}
                    <div
                      className="w-4 bg-red-500 rounded-t"
                      style={{
                        height: `${(week.criticals / 50) * 100}px`
                      }}
                      title={`Críticas: ${week.criticals}`}
                    ></div>
                    {/* Resolvidas */}
                    <div
                      className="w-4 bg-green-500 rounded-b"
                      style={{
                        height: `${(week.resolved / 50) * 80}px`
                      }}
                      title={`Resolvidas: ${week.resolved}`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 rotate-45 origin-center">
                    {week.week}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-sm">Críticas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm">Resolvidas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
            <CardDescription>Estado atual das faturas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Liberadas</span>
                </div>
                <span className="font-medium">45 (60%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Em Crítica</span>
                </div>
                <span className="font-medium">{kpis.criticalInvoices} (22%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">Releituras</span>
                </div>
                <span className="font-medium">8 (11%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm">Escaladas</span>
                </div>
                <span className="font-medium">5 (7%)</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-green-600">98.2%</p>
                  <p className="text-xs text-gray-600">Precisão IA</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">{kpis.avgResolutionTime}h</p>
                  <p className="text-xs text-gray-600">Tempo Médio</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">{kpis.reworkRate * 100}%</p>
                  <p className="text-xs text-gray-600">Retrabalho</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance dos Analistas</CardTitle>
          <CardDescription>Produtividade individual dos analistas no período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Analista</th>
                  <th className="text-right p-2">Casos/Hora</th>
                  <th className="text-right p-2">Precisão</th>
                  <th className="text-right p-2">Total Casos</th>
                  <th className="text-right p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockProductivityData.map((analyst, i) => (
                  <tr key={i} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2">{analyst.analyst}</td>
                    <td className="text-right p-2">{analyst.casesPerHour.toFixed(1)}</td>
                    <td className="text-right p-2">
                      <Badge
                        variant={analyst.accuracyRate > 0.9 ? "default" : "secondary"}
                      >
                        {Math.round(analyst.accuracyRate * 100)}%
                      </Badge>
                    </td>
                    <td className="text-right p-2">{analyst.totalCases}</td>
                    <td className="text-right p-2">
                      <Badge variant="outline" className="text-green-600">
                        Ativo
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas e Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
              <AlertTriangleIcon className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">SLA em Risco</p>
                <p className="text-xs text-gray-600">{kpis.slaAtRisk} casos com menos de 4h para vencimento</p>
              </div>
              <Badge variant="destructive">{kpis.slaAtRisk}</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Backlog Elevado</p>
                <p className="text-xs text-gray-600">Volume de casos pendentes acima da média</p>
              </div>
              <Badge variant="outline">{kpis.backlogCount}</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Meta de Automação</p>
                <p className="text-xs text-gray-600">Taxa de decisão automática acima da meta (70%)</p>
              </div>
              <Badge variant="outline" className="text-green-600">73%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}