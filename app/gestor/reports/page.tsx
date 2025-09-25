'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  FileTextIcon,
  DownloadIcon,
  CalendarIcon,
  TrendingUpIcon,
  BarChart3Icon,
  PieChartIcon,
  PlayIcon,
  PauseIcon,
  FilterIcon,
  PlusIcon,
  EyeIcon,
  SettingsIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'operational' | 'financial' | 'quality' | 'compliance';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  isActive: boolean;
  lastGenerated: string;
  nextScheduled: string;
  format: 'pdf' | 'excel' | 'csv';
  recipients: string[];
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Relatório Operacional Diário',
    description: 'Resumo diário de faturas processadas, críticas e SLA',
    type: 'operational',
    frequency: 'daily',
    isActive: true,
    lastGenerated: '2024-01-15 08:00:00',
    nextScheduled: '2024-01-16 08:00:00',
    format: 'pdf',
    recipients: ['gestor@celesc.com.br', 'diretoria@celesc.com.br']
  },
  {
    id: '2',
    name: 'Análise de Performance Semanal',
    description: 'Performance detalhada dos analistas e métricas de qualidade',
    type: 'quality',
    frequency: 'weekly',
    isActive: true,
    lastGenerated: '2024-01-14 18:00:00',
    nextScheduled: '2024-01-21 18:00:00',
    format: 'excel',
    recipients: ['rh@celesc.com.br', 'supervisores@celesc.com.br']
  },
  {
    id: '3',
    name: 'Impacto Financeiro Mensal',
    description: 'ROI da automação, economia gerada e custos operacionais',
    type: 'financial',
    frequency: 'monthly',
    isActive: true,
    lastGenerated: '2024-01-01 09:00:00',
    nextScheduled: '2024-02-01 09:00:00',
    format: 'pdf',
    recipients: ['financeiro@celesc.com.br', 'cfo@celesc.com.br']
  },
  {
    id: '4',
    name: 'Auditoria e Compliance',
    description: 'Conformidade com regulamentações e auditoria interna',
    type: 'compliance',
    frequency: 'quarterly',
    isActive: true,
    lastGenerated: '2024-01-01 10:00:00',
    nextScheduled: '2024-04-01 10:00:00',
    format: 'pdf',
    recipients: ['compliance@celesc.com.br', 'auditoria@celesc.com.br']
  },
  {
    id: '5',
    name: 'Dashboard Executivo',
    description: 'Resumo executivo com KPIs principais e alertas',
    type: 'operational',
    frequency: 'weekly',
    isActive: false,
    lastGenerated: '2024-01-07 07:00:00',
    nextScheduled: '2024-01-14 07:00:00',
    format: 'pdf',
    recipients: ['executivo@celesc.com.br']
  }
];

const reportTemplates = [
  {
    name: 'Performance Regional',
    description: 'Análise comparativa de performance entre regiões',
    type: 'operational',
    defaultFrequency: 'monthly'
  },
  {
    name: 'Análise de Fraudes',
    description: 'Detecção e estatísticas de possíveis fraudes',
    type: 'compliance',
    defaultFrequency: 'weekly'
  },
  {
    name: 'Eficiência da IA',
    description: 'Performance do motor de decisão automática',
    type: 'quality',
    defaultFrequency: 'daily'
  },
  {
    name: 'Satisfação do Cliente',
    description: 'Métricas de satisfação e NPS',
    type: 'quality',
    defaultFrequency: 'monthly'
  }
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [newReportDialog, setNewReportDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  const toggleReportStatus = (reportId: string) => {
    setReports(reports.map(report =>
      report.id === reportId ? { ...report, isActive: !report.isActive } : report
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'operational': return <BarChart3Icon className="w-4 h-4" />;
      case 'financial': return <TrendingUpIcon className="w-4 h-4" />;
      case 'quality': return <CheckCircleIcon className="w-4 h-4" />;
      case 'compliance': return <AlertTriangleIcon className="w-4 h-4" />;
      default: return <FileTextIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'operational': return 'bg-blue-500';
      case 'financial': return 'bg-green-500';
      case 'quality': return 'bg-purple-500';
      case 'compliance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Diário';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensal';
      case 'quarterly': return 'Trimestral';
      default: return frequency;
    }
  };

  const getFormatBadge = (format: string) => {
    const colors = {
      pdf: 'bg-red-100 text-red-800',
      excel: 'bg-green-100 text-green-800',
      csv: 'bg-blue-100 text-blue-800'
    };
    return colors[format as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios e Dashboards</h1>
          <p className="text-muted-foreground">
            Geração automática e agendamento de relatórios executivos
          </p>
        </div>
        <Dialog open={newReportDialog} onOpenChange={setNewReportDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Novo Relatório
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Relatório</DialogTitle>
              <DialogDescription>
                Configure um novo relatório automatizado.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="report-name">Nome do Relatório</Label>
                  <Input id="report-name" placeholder="Digite o nome do relatório" />
                </div>
                <div>
                  <Label htmlFor="report-type">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operacional</SelectItem>
                      <SelectItem value="financial">Financeiro</SelectItem>
                      <SelectItem value="quality">Qualidade</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="report-description">Descrição</Label>
                <Textarea
                  id="report-description"
                  placeholder="Descreva o conteúdo do relatório..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="report-frequency">Frequência</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="report-format">Formato</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch id="auto-send" />
                  <Label htmlFor="auto-send" className="text-sm">Envio automático</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="report-recipients">Destinatários (separados por vírgula)</Label>
                <Input
                  id="report-recipients"
                  placeholder="email1@celesc.com.br, email2@celesc.com.br"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewReportDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setNewReportDialog(false)}>
                  Criar Relatório
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Relatórios</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              {reports.filter(r => r.isActive).length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gerados Hoje</CardTitle>
            <PlayIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">7</div>
            <p className="text-xs text-muted-foreground">
              100% de sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos 24h</CardTitle>
            <ClockIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3</div>
            <p className="text-xs text-muted-foreground">
              agendamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Entrega</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">98.5%</div>
            <p className="text-xs text-muted-foreground">
              últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Relatórios Ativos</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="schedule">Agenda</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar relatórios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="operational">Operacional</SelectItem>
                <SelectItem value="financial">Financeiro</SelectItem>
                <SelectItem value="quality">Qualidade</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${getTypeColor(report.type)} rounded-lg flex items-center justify-center`}>
                        {getTypeIcon(report.type)}
                        <span className="sr-only">{report.type}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <CardDescription>{report.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getFormatBadge(report.format)}>
                        {report.format.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {getFrequencyLabel(report.frequency)}
                      </Badge>
                      <Switch
                        checked={report.isActive}
                        onCheckedChange={() => toggleReportStatus(report.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Última Geração</p>
                      <p className="text-sm font-medium">{report.lastGenerated}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Próxima Geração</p>
                      <p className="text-sm font-medium">{report.nextScheduled}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Destinatários</p>
                      <p className="text-sm font-medium">{report.recipients.length} pessoa(s)</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {report.recipients.slice(0, 2).map((email, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {email.split('@')[0]}
                        </Badge>
                      ))}
                      {report.recipients.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{report.recipients.length - 2} mais
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <EyeIcon className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button variant="ghost" size="sm">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Baixar Último
                      </Button>
                      <Button variant="ghost" size="sm">
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTemplates.map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${getTypeColor(template.type)} rounded-lg flex items-center justify-center`}>
                        {getTypeIcon(template.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline">{getFrequencyLabel(template.defaultFrequency)}</Badge>
                      <Badge className={getTypeColor(template.type).replace('bg-', 'text-').replace('500', '700')}>
                        {template.type}
                      </Badge>
                    </div>
                    <Button size="sm">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Usar Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Geração</CardTitle>
              <CardDescription>
                Relatórios gerados nos últimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { report: 'Relatório Operacional Diário', date: '2024-01-15 08:00:00', status: 'success', size: '2.1 MB' },
                  { report: 'Análise de Performance Semanal', date: '2024-01-14 18:00:00', status: 'success', size: '4.7 MB' },
                  { report: 'Dashboard Executivo', date: '2024-01-14 07:00:00', status: 'failed', size: '-' },
                  { report: 'Relatório Operacional Diário', date: '2024-01-14 08:00:00', status: 'success', size: '2.3 MB' },
                  { report: 'Relatório Operacional Diário', date: '2024-01-13 08:00:00', status: 'success', size: '1.9 MB' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{item.report}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{item.size}</span>
                      <Badge variant={item.status === 'success' ? 'default' : 'destructive'}>
                        {item.status === 'success' ? 'Sucesso' : 'Falha'}
                      </Badge>
                      {item.status === 'success' && (
                        <Button variant="ghost" size="sm">
                          <DownloadIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Gerações</CardTitle>
              <CardDescription>
                Relatórios agendados para os próximos dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports
                  .filter(r => r.isActive)
                  .sort((a, b) => new Date(a.nextScheduled).getTime() - new Date(b.nextScheduled).getTime())
                  .slice(0, 10)
                  .map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(report.nextScheduled).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {getFrequencyLabel(report.frequency)} • {report.format.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(report.type).replace('bg-', 'text-').replace('500', '700')}>
                          {report.type}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <PlayIcon className="w-4 h-4 mr-2" />
                          Executar Agora
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}