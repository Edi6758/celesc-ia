'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockAuditEvents } from '@/app/_mocks/audit';
import {
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  FileTextIcon,
  UserIcon,
  ClockIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  RefreshCwIcon
} from 'lucide-react';

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);

  const filteredEvents = mockAuditEvents.filter(event => {
    const matchesSearch = event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.userId && event.userId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = actionFilter === 'all' || event.action === actionFilter;
    const matchesUser = userFilter === 'all' || event.userId === userFilter;

    return matchesSearch && matchesAction && matchesUser;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <UserIcon className="w-4 h-4 text-blue-500" />;
      case 'logout': return <UserIcon className="w-4 h-4 text-gray-500" />;
      case 'invoice_reviewed': return <EyeIcon className="w-4 h-4 text-green-500" />;
      case 'invoice_approved': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'invoice_rejected': return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'reading_collected': return <ShieldCheckIcon className="w-4 h-4 text-blue-500" />;
      case 'rule_triggered': return <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'system_backup': return <RefreshCwIcon className="w-4 h-4 text-purple-500" />;
      case 'config_changed': return <FilterIcon className="w-4 h-4 text-orange-500" />;
      default: return <FileTextIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'invoice_approved':
      case 'reading_collected': return 'bg-green-50 text-green-700 border-green-200';
      case 'invoice_rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'rule_triggered': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'login': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'config_changed': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'login': return 'Login';
      case 'logout': return 'Logout';
      case 'invoice_reviewed': return 'Fatura Revisada';
      case 'invoice_approved': return 'Fatura Aprovada';
      case 'invoice_rejected': return 'Fatura Rejeitada';
      case 'reading_collected': return 'Leitura Coletada';
      case 'rule_triggered': return 'Regra Acionada';
      case 'system_backup': return 'Backup Sistema';
      case 'config_changed': return 'Config. Alterada';
      default: return action.replace('_', ' ').replace(/^\w/, c => c.toUpperCase());
    }
  };

  const exportAuditLog = () => {
    // Mock export functionality
    console.log('Exporting audit log...');
  };

  const uniqueActions = Array.from(new Set(mockAuditEvents.map(e => e.action)));
  const uniqueUsers = Array.from(new Set(mockAuditEvents.map(e => e.userId).filter(Boolean)));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Auditoria do Sistema</h1>
          <p className="text-muted-foreground">
            Log completo de atividades e ações realizadas no sistema
          </p>
        </div>
        <Button onClick={exportAuditLog}>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Exportar Log
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAuditEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{uniqueUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              Distintos hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ações Críticas</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockAuditEvents.filter(e => e.action.includes('rejected') || e.action.includes('escalated')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.8%</div>
            <p className="text-xs text-muted-foreground">
              Ações bem-sucedidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>
                    {getActionLabel(action)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os usuários</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user || ''}>
                    {user || 'N/A'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              Período
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline de Eventos</CardTitle>
          <CardDescription>
            Histórico cronológico de todas as ações realizadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50"
              >
                {/* Icon and Line */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center">
                    {getActionIcon(event.action)}
                  </div>
                  <div className="w-px h-4 bg-border mt-2"></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getActionColor(event.action)}>
                        {getActionLabel(event.action)}
                      </Badge>
                      {event.userId && (
                        <Badge variant="outline">
                          {event.userId}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ClockIcon className="w-3 h-3" />
                      {event.timestamp}
                    </div>
                  </div>

                  <p className="text-sm text-foreground mb-2">
                    {event.details}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {event.ipAddress && (
                      <span>IP: {event.ipAddress}</span>
                    )}
                    {event.resourceId && (
                      <span>Recurso: {event.resourceId}</span>
                    )}
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <span>
                        {Object.entries(event.metadata).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileTextIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum evento encontrado com os filtros aplicados</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSearchTerm('');
                setActionFilter('all');
                setUserFilter('all');
              }}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uniqueActions.slice(0, 5).map(action => {
                const count = mockAuditEvents.filter(e => e.action === action).length;
                const percentage = (count / mockAuditEvents.length) * 100;
                return (
                  <div key={action} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getActionIcon(action)}
                      <span className="text-sm">{getActionLabel(action)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usuários Mais Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uniqueUsers.slice(0, 5).map(user => {
                const count = mockAuditEvents.filter(e => e.userId === user).length;
                const percentage = (count / mockAuditEvents.length) * 100;
                return (
                  <div key={user} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span className="text-sm truncate">{user}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Horários de Pico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['08:00-09:00', '09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'].map((hour, index) => {
                const count = Math.floor(Math.random() * 30) + 10; // Mock data
                const percentage = (count / 50) * 100;
                return (
                  <div key={hour} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span className="text-sm">{hour}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}