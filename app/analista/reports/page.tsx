'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DownloadIcon,
  FileTextIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  FilterIcon,
  SearchIcon,
  CalendarIcon,
  BarChart3Icon,
  PieChartIcon,
  FileSpreadsheetIcon,
  PrinterIcon,
  EyeIcon
} from 'lucide-react';

// Mock data for reports
const mockReports = [
  {
    id: '001',
    title: 'Análise Mensal - Críticas Resolvidas',
    type: 'monthly',
    period: 'Setembro 2024',
    createdAt: '2024-09-23',
    status: 'completed',
    analysisCount: 156,
    successRate: 94.2,
    avgResolutionTime: '2.4h',
    criticalIssues: 3,
    category: 'performance'
  },
  {
    id: '002',
    title: 'Relatório de Qualidade - IA vs Manual',
    type: 'quality',
    period: 'Último Trimestre',
    createdAt: '2024-09-20',
    status: 'completed',
    analysisCount: 478,
    successRate: 96.8,
    avgResolutionTime: '1.8h',
    criticalIssues: 1,
    category: 'quality'
  },
  {
    id: '003',
    title: 'Análise de Tendências - Padrões de Consumo',
    type: 'trends',
    period: 'Setembro 2024',
    createdAt: '2024-09-18',
    status: 'processing',
    analysisCount: 89,
    successRate: 92.1,
    avgResolutionTime: '3.1h',
    criticalIssues: 5,
    category: 'analysis'
  },
  {
    id: '004',
    title: 'Relatório de Exceções - Casos Complexos',
    type: 'exceptions',
    period: 'Última Semana',
    createdAt: '2024-09-22',
    status: 'completed',
    analysisCount: 23,
    successRate: 87.0,
    avgResolutionTime: '4.2h',
    criticalIssues: 8,
    category: 'exceptions'
  },
  {
    id: '005',
    title: 'Análise Comparativa - Regiões SC',
    type: 'regional',
    period: 'Setembro 2024',
    createdAt: '2024-09-21',
    status: 'completed',
    analysisCount: 312,
    successRate: 93.5,
    avgResolutionTime: '2.7h',
    criticalIssues: 4,
    category: 'regional'
  }
];

const mockDetailedMetrics = {
  '001': {
    totalInvoices: 1567,
    resolvedByAI: 1478,
    manualReview: 89,
    categories: [
      { name: 'Consumo Alto', count: 45, percentage: 28.8 },
      { name: 'Leitura Inconsistente', count: 38, percentage: 24.4 },
      { name: 'Média Histórica', count: 35, percentage: 22.4 },
      { name: 'Tarifa Especial', count: 23, percentage: 14.7 },
      { name: 'Outros', count: 15, percentage: 9.6 }
    ],
    timeline: [
      { date: '2024-09-01', resolved: 12, pending: 3 },
      { date: '2024-09-08', resolved: 18, pending: 2 },
      { date: '2024-09-15', resolved: 22, pending: 4 },
      { date: '2024-09-22', resolved: 15, pending: 1 }
    ],
    performance: {
      accuracy: 94.2,
      speed: 2.4,
      satisfaction: 4.7,
      efficiency: 89.3
    }
  }
};

export default function AnalistaReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleExport = async (format: 'pdf' | 'excel' | 'csv', reportId: string) => {
    setIsExporting(true);

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const report = mockReports.find(r => r.id === reportId);
    const fileName = `${report?.title.replace(/\s+/g, '_')}_${report?.period.replace(/\s+/g, '_')}.${format === 'excel' ? 'xlsx' : format}`;

    // In a real app, this would trigger actual file download
    console.log(`Exporting ${fileName} in ${format} format`);

    setIsExporting(false);
    alert(`Relatório exportado como ${fileName}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'processing': return <ClockIcon className="w-4 h-4" />;
      case 'error': return <AlertTriangleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Relatórios de Análise</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Relatórios detalhados das análises de críticas e performance do sistema
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Buscar relatórios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="quality">Qualidade</SelectItem>
                <SelectItem value="analysis">Análise</SelectItem>
                <SelectItem value="exceptions">Exceções</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <FilterIcon className="w-4 h-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {report.period}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(report.status)}>
                  {getStatusIcon(report.status)}
                  <span className="ml-1 capitalize">{report.status === 'completed' ? 'Concluído' : 'Processando'}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{report.analysisCount}</div>
                  <div className="text-xs text-blue-600">Análises</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{report.successRate}%</div>
                  <div className="text-xs text-green-600">Taxa Sucesso</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  Tempo Médio: {report.avgResolutionTime}
                </span>
                {report.criticalIssues > 0 && (
                  <span className="flex items-center gap-1 text-orange-600">
                    <AlertTriangleIcon className="w-4 h-4" />
                    {report.criticalIssues} críticos
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      Visualizar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{report.title}</DialogTitle>
                      <DialogDescription>
                        Relatório detalhado para o período: {report.period}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Detailed Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600">
                            {mockDetailedMetrics['001']?.totalInvoices || report.analysisCount}
                          </div>
                          <div className="text-sm text-blue-600">Total de Faturas</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">{report.successRate}%</div>
                          <div className="text-sm text-green-600">Precisão</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-3xl font-bold text-purple-600">{report.avgResolutionTime}</div>
                          <div className="text-sm text-purple-600">Tempo Médio</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-3xl font-bold text-orange-600">{report.criticalIssues}</div>
                          <div className="text-sm text-orange-600">Casos Críticos</div>
                        </div>
                      </div>

                      {/* Categories Breakdown */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5" />
                            Distribuição por Categoria
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {mockDetailedMetrics['001']?.categories.map((category, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    idx === 0 ? 'bg-blue-500' :
                                    idx === 1 ? 'bg-green-500' :
                                    idx === 2 ? 'bg-purple-500' :
                                    idx === 3 ? 'bg-orange-500' : 'bg-gray-500'
                                  }`}></div>
                                  <span className="text-sm">{category.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{category.count}</span>
                                  <span className="text-xs text-gray-500">({category.percentage}%)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Export Options */}
                      <div className="flex gap-2 justify-center pt-4 border-t">
                        <Button
                          onClick={() => handleExport('pdf', report.id)}
                          disabled={isExporting}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <FileTextIcon className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                        <Button
                          onClick={() => handleExport('excel', report.id)}
                          disabled={isExporting}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <FileSpreadsheetIcon className="w-4 h-4 mr-2" />
                          Excel
                        </Button>
                        <Button
                          onClick={() => handleExport('csv', report.id)}
                          disabled={isExporting}
                          variant="outline"
                        >
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          CSV
                        </Button>
                        <Button
                          onClick={() => window.print()}
                          variant="outline"
                        >
                          <PrinterIcon className="w-4 h-4 mr-2" />
                          Imprimir
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => handleExport('pdf', report.id)}
                  disabled={isExporting}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3Icon className="w-5 h-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <FileTextIcon className="w-6 h-6" />
              <span className="text-sm">Novo Relatório</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <TrendingUpIcon className="w-6 h-6" />
              <span className="text-sm">Análise Mensal</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <BarChart3Icon className="w-6 h-6" />
              <span className="text-sm">Dashboard</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <DownloadIcon className="w-6 h-6" />
              <span className="text-sm">Exportar Tudo</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {isExporting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Exportando relatório...</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}