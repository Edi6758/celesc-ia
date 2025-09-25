'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  SettingsIcon,
  DatabaseIcon,
  BrainIcon,
  SmartphoneIcon,
  HardDriveIcon,
  WifiIcon,
  WifiOffIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  PauseIcon,
  RefreshCwIcon,
  PlusIcon,
  EditIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'database' | 'api' | 'service' | 'ai';
  status: 'connected' | 'disconnected' | 'degraded' | 'maintenance';
  isEnabled: boolean;
  version: string;
  endpoint: string;
  lastSync: string;
  latency: number;
  uptime: number;
  requestsToday: number;
  errorRate: number;
  config: Record<string, any>;
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'SAP S/4HANA IS-U',
    description: 'Sistema principal de faturamento e medição da CELESC',
    type: 'database',
    status: 'connected',
    isEnabled: true,
    version: '2022 FP02',
    endpoint: 'sap.celesc.com.br:8443/sap/opu/odata/sap/ZISU_BILLING_SRV',
    lastSync: '2024-01-15 09:45:23',
    latency: 45,
    uptime: 99.8,
    requestsToday: 1247,
    errorRate: 0.2,
    config: {
      client: '100',
      timeout: 30,
      batchSize: 50,
      compression: true
    }
  },
  {
    id: '2',
    name: 'AI Decision Engine',
    description: 'Motor de inteligência artificial para análise automática de críticas',
    type: 'ai',
    status: 'connected',
    isEnabled: true,
    version: 'v2.1.3',
    endpoint: 'ai-engine.celesc.internal/api/v2',
    lastSync: '2024-01-15 09:44:15',
    latency: 120,
    uptime: 99.2,
    requestsToday: 834,
    errorRate: 0.8,
    config: {
      model: 'celesc-critic-v2.1',
      confidence_threshold: 0.85,
      max_concurrent: 10,
      timeout: 5
    }
  },
  {
    id: '3',
    name: 'Mobile App API',
    description: 'API para aplicativo móvel dos leituristas',
    type: 'api',
    status: 'degraded',
    isEnabled: true,
    version: 'v1.8.2',
    endpoint: 'mobile-api.celesc.com.br/v1',
    lastSync: '2024-01-15 09:30:12',
    latency: 450,
    uptime: 96.5,
    requestsToday: 2156,
    errorRate: 3.5,
    config: {
      rate_limit: 1000,
      cache_ttl: 300,
      encryption: 'AES-256',
      auth_method: 'oauth2'
    }
  },
  {
    id: '4',
    name: 'Backup Service',
    description: 'Serviço automatizado de backup e recuperação',
    type: 'service',
    status: 'connected',
    isEnabled: true,
    version: 'v1.2.0',
    endpoint: 'backup.internal.celesc/api',
    lastSync: '2024-01-15 02:00:00',
    latency: 25,
    uptime: 100,
    requestsToday: 24,
    errorRate: 0,
    config: {
      schedule: 'daily',
      retention_days: 30,
      compression: 'gzip',
      encryption: true
    }
  },
  {
    id: '5',
    name: 'GIS Mapping Service',
    description: 'Serviço de geolocalização e mapeamento',
    type: 'service',
    status: 'maintenance',
    isEnabled: false,
    version: 'v3.0.1',
    endpoint: 'gis.celesc.com.br/maps/api',
    lastSync: '2024-01-14 18:30:00',
    latency: 200,
    uptime: 98.1,
    requestsToday: 0,
    errorRate: 0,
    config: {
      map_provider: 'google',
      precision: 'high',
      cache_enabled: true,
      api_key: '***masked***'
    }
  }
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [newIntegrationDialog, setNewIntegrationDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id ? { ...integration, isEnabled: !integration.isEnabled } : integration
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'degraded':
        return <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'maintenance':
        return <PauseIcon className="w-4 h-4 text-blue-500" />;
      default:
        return <WifiOffIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Conectado</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Desconectado</Badge>;
      case 'degraded':
        return <Badge variant="destructive" className="bg-yellow-500">Degradado</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Manutenção</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return <DatabaseIcon className="w-5 h-5" />;
      case 'api': return <WifiIcon className="w-5 h-5" />;
      case 'service': return <SettingsIcon className="w-5 h-5" />;
      case 'ai': return <BrainIcon className="w-5 h-5" />;
      default: return <SettingsIcon className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'database': return 'bg-blue-500';
      case 'api': return 'bg-green-500';
      case 'service': return 'bg-purple-500';
      case 'ai': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrações do Sistema</h1>
          <p className="text-muted-foreground">
            Gerencie conexões com sistemas externos e serviços
          </p>
        </div>
        <Dialog open={newIntegrationDialog} onOpenChange={setNewIntegrationDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Nova Integração
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Integração</DialogTitle>
              <DialogDescription>
                Configure uma nova integração com sistema externo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="integration-name">Nome</Label>
                  <Input id="integration-name" placeholder="Nome da integração" />
                </div>
                <div>
                  <Label htmlFor="integration-type">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="database">Base de Dados</SelectItem>
                      <SelectItem value="api">API REST</SelectItem>
                      <SelectItem value="service">Serviço</SelectItem>
                      <SelectItem value="ai">Inteligência Artificial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="integration-description">Descrição</Label>
                <Textarea
                  id="integration-description"
                  placeholder="Descreva a integração..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="integration-endpoint">Endpoint</Label>
                  <Input id="integration-endpoint" placeholder="https://api.example.com" />
                </div>
                <div>
                  <Label htmlFor="integration-version">Versão</Label>
                  <Input id="integration-version" placeholder="v1.0.0" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewIntegrationDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setNewIntegrationDialog(false)}>
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Integrações</CardTitle>
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
            <p className="text-xs text-muted-foreground">
              {integrations.filter(i => i.isEnabled).length} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Saudável</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {integrations.filter(i => i.status === 'connected').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Conectadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requisições Hoje</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {integrations.reduce((sum, i) => sum + i.requestsToday, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% vs. ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime Médio</CardTitle>
            <ClockIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {(integrations.reduce((sum, i) => sum + i.uptime, 0) / integrations.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${getTypeColor(integration.type)} rounded-lg flex items-center justify-center`}>
                        {getTypeIcon(integration.type)}
                        <span className="sr-only">{integration.type}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription className="text-sm">{integration.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(integration.status)}
                      <Switch
                        checked={integration.isEnabled}
                        onCheckedChange={() => toggleIntegration(integration.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Versão</p>
                        <p className="text-sm font-medium">{integration.version}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Latência</p>
                        <div className="flex items-center gap-1">
                          <p className={`text-sm font-medium ${
                            integration.latency > 200 ? 'text-red-600' :
                            integration.latency > 100 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {integration.latency}ms
                          </p>
                          {integration.latency > 200 ? <TrendingUpIcon className="w-3 h-3 text-red-600" /> :
                           integration.latency < 50 ? <TrendingDownIcon className="w-3 h-3 text-green-600" /> : null}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                        <p className="text-sm font-medium text-green-600">{integration.uptime}%</p>
                      </div>
                    </div>

                    {/* Status Details */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Requisições hoje:</span>
                        <span className="font-medium">{integration.requestsToday.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxa de erro:</span>
                        <span className={`font-medium ${
                          integration.errorRate > 2 ? 'text-red-600' :
                          integration.errorRate > 1 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {integration.errorRate}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Última sinc:</span>
                        <span className="font-medium">{integration.lastSync}</span>
                      </div>
                    </div>

                    {/* Uptime Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Disponibilidade</span>
                        <span>{integration.uptime}%</span>
                      </div>
                      <Progress value={integration.uptime} className="h-2" />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIntegration(integration)}
                      >
                        <EditIcon className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCwIcon className="w-4 h-4 mr-2" />
                        Testar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Latência das Integrações</CardTitle>
                <CardDescription>Tempo de resposta médio nas últimas 24 horas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.map(integration => (
                    <div key={integration.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 ${getTypeColor(integration.type)} rounded flex items-center justify-center`}>
                          {getTypeIcon(integration.type)}
                        </div>
                        <span className="text-sm">{integration.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              integration.latency > 200 ? 'bg-red-500' :
                              integration.latency > 100 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((integration.latency / 500) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium w-12 ${
                          integration.latency > 200 ? 'text-red-600' :
                          integration.latency > 100 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {integration.latency}ms
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status em Tempo Real</CardTitle>
                <CardDescription>Monitoramento contínuo das integrações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.map(integration => (
                    <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(integration.status)}
                        <div>
                          <p className="text-sm font-medium">{integration.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {integration.requestsToday} requisições hoje
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(integration.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {integration.uptime}% uptime
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Integração</CardTitle>
              <CardDescription>
                Histórico de eventos e erros das integrações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '09:45:23', integration: 'SAP S/4HANA IS-U', event: 'Sincronização bem-sucedida', level: 'info' },
                  { time: '09:44:15', integration: 'AI Decision Engine', event: 'Análise de 25 faturas processada', level: 'info' },
                  { time: '09:30:12', integration: 'Mobile App API', event: 'Timeout na requisição - retry automático', level: 'warning' },
                  { time: '02:00:00', integration: 'Backup Service', event: 'Backup diário executado com sucesso', level: 'info' },
                  { time: '18:30:00', integration: 'GIS Mapping Service', event: 'Iniciada manutenção programada', level: 'info' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      log.level === 'error' ? 'bg-red-500' :
                      log.level === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{log.integration}</p>
                        <span className="text-xs text-muted-foreground">{log.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configuration Dialog */}
      {selectedIntegration && (
        <Dialog open={true} onOpenChange={() => setSelectedIntegration(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configurar {selectedIntegration.name}</DialogTitle>
              <DialogDescription>
                Ajuste os parâmetros de configuração da integração
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="endpoint">Endpoint</Label>
                  <Input id="endpoint" value={selectedIntegration.endpoint} readOnly />
                </div>
                <div>
                  <Label htmlFor="version">Versão</Label>
                  <Input id="version" value={selectedIntegration.version} readOnly />
                </div>
              </div>

              <div>
                <Label>Configurações Específicas</Label>
                <div className="space-y-2 mt-2">
                  {Object.entries(selectedIntegration.config).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-2">
                      <Input value={key} readOnly className="text-sm" />
                      <Input
                        value={typeof value === 'string' && value.includes('***') ? value : String(value)}
                        className="text-sm font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => setSelectedIntegration(null)}>
                  Salvar Configurações
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}