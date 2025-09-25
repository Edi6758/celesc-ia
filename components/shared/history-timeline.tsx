'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuditEvent } from '@/app/_types/audit';
import {
  SearchIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  ActivityIcon,
  FilterIcon,
  EyeIcon,
  ShieldIcon,
  RefreshCwIcon,
  FileTextIcon,
  SettingsIcon
} from 'lucide-react';

interface HistoryTimelineProps {
  events: AuditEvent[];
  title?: string;
  description?: string;
  showFilters?: boolean;
  maxHeight?: string;
  resourceFilter?: string; // Filter events by specific resource
}

export function HistoryTimeline({
  events,
  title = "Histórico de Atividades",
  description = "Timeline de eventos e ações realizadas",
  showFilters = true,
  maxHeight = "600px",
  resourceFilter
}: HistoryTimelineProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');

  // Filter events
  let filteredEvents = events;

  if (resourceFilter) {
    filteredEvents = filteredEvents.filter(event =>
      event.resourceId === resourceFilter || event.invoiceId === resourceFilter
    );
  }

  filteredEvents = filteredEvents.filter(event => {
    const matchesSearch = event.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.userId && event.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (event.actor && event.actor.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = actionFilter === 'all' || event.action === actionFilter;
    const matchesUser = userFilter === 'all' || event.userId === userFilter || event.actor === userFilter;

    return matchesSearch && matchesAction && matchesUser;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
      case 'logout':
        return <UserIcon className="w-4 h-4 text-blue-500" />;
      case 'invoice_reviewed':
      case 'invoice_approved':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'invoice_rejected':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'reading_collected':
        return <ShieldIcon className="w-4 h-4 text-blue-500" />;
      case 'rule_triggered':
        return <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'system_backup':
        return <RefreshCwIcon className="w-4 h-4 text-purple-500" />;
      case 'config_changed':
        return <SettingsIcon className="w-4 h-4 text-orange-500" />;
      case 'AUTO_RELEASE':
      case 'MANUAL_RELEASE':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'AUTO_HOLD':
      case 'ASK_READING':
        return <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'ESCALATE':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <ActivityIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'invoice_approved':
      case 'reading_collected':
      case 'AUTO_RELEASE':
      case 'MANUAL_RELEASE':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'invoice_rejected':
      case 'ESCALATE':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'rule_triggered':
      case 'ASK_READING':
      case 'AUTO_HOLD':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'login':
      case 'logout':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'config_changed':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'system_backup':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      login: 'Login',
      logout: 'Logout',
      invoice_reviewed: 'Fatura Revisada',
      invoice_approved: 'Fatura Aprovada',
      invoice_rejected: 'Fatura Rejeitada',
      reading_collected: 'Leitura Coletada',
      rule_triggered: 'Regra Acionada',
      system_backup: 'Backup Sistema',
      config_changed: 'Config. Alterada',
      AUTO_RELEASE: 'Liberação Automática',
      AUTO_HOLD: 'Retenção Automática',
      ASK_READING: 'Solicitar Releitura',
      TO_ANALYST: 'Encaminhar Analista',
      ADJUST_CADASTRO: 'Ajustar Cadastro',
      MANUAL_RELEASE: 'Liberação Manual',
      ESCALATE: 'Escalar Caso'
    };

    return labels[action] || action.replace('_', ' ').replace(/^\w/, c => c.toUpperCase());
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const uniqueActions = Array.from(new Set(events.map(e => e.action)));
  const uniqueUsers = Array.from(new Set([
    ...events.map(e => e.userId).filter(Boolean),
    ...events.map(e => e.actor).filter(Boolean)
  ]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
                <SelectItem value="SYSTEM">Sistema</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user || ''}>
                    {user || 'N/A'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-4" style={{ maxHeight, overflowY: 'auto' }}>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileTextIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum evento encontrado com os filtros aplicados</p>
              {showFilters && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setActionFilter('all');
                    setUserFilter('all');
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 relative"
              >
                {/* Timeline connector */}
                {index < filteredEvents.length - 1 && (
                  <div className="absolute left-8 top-12 w-px h-8 bg-border"></div>
                )}

                {/* Icon */}
                <div className="w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center flex-shrink-0">
                  {getActionIcon(event.action)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getActionColor(event.action)}>
                        {getActionLabel(event.action)}
                      </Badge>
                      {(event.userId || event.actor) && (
                        <Badge variant="outline">
                          {event.userId || event.actor}
                        </Badge>
                      )}
                      {event.resourceId && (
                        <Badge variant="secondary">
                          {event.resourceId}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ClockIcon className="w-3 h-3" />
                      {formatTimestamp(event.timestamp)}
                    </div>
                  </div>

                  <p className="text-sm text-foreground mb-2">
                    {event.details || event.justification}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    {event.ipAddress && (
                      <span>IP: {event.ipAddress}</span>
                    )}
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <div className="flex gap-2">
                        {Object.entries(event.metadata).map(([key, value]) => (
                          <span key={key}>
                            {key}: <strong>{String(value)}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="font-medium text-lg">{filteredEvents.length}</p>
              <p className="text-muted-foreground">Eventos</p>
            </div>
            <div>
              <p className="font-medium text-lg">
                {filteredEvents.filter(e => e.userId === 'SYSTEM' || e.actor === 'SYSTEM').length}
              </p>
              <p className="text-muted-foreground">Automáticos</p>
            </div>
            <div>
              <p className="font-medium text-lg">{uniqueUsers.length}</p>
              <p className="text-muted-foreground">Usuários Únicos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}