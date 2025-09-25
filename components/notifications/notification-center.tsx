'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BellIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  XIcon,
  SettingsIcon,
  ClockIcon,
  UserIcon,
  ShieldIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  XCircleIcon,
  MailIcon,
  SmartphoneIcon
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: 'system' | 'sla' | 'performance' | 'security' | 'integration';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

// Temporary simple components until we have full UI library
const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
  <button
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const Label = ({ children, htmlFor, className = "" }: { children: React.ReactNode; htmlFor?: string; className?: string }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>
    {children}
  </label>
);

interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  categories: {
    system: boolean;
    sla: boolean;
    performance: boolean;
    security: boolean;
    integration: boolean;
  };
  priority: {
    low: boolean;
    medium: boolean;
    high: boolean;
    critical: boolean;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'error',
    priority: 'critical',
    title: 'SLA Crítico',
    message: '12 faturas com SLA vencendo em menos de 2 horas',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: false,
    category: 'sla',
    actionUrl: '/analista',
    actionLabel: 'Ver Fila',
    metadata: { count: 12, remaining_hours: 2 }
  },
  {
    id: '2',
    type: 'warning',
    priority: 'high',
    title: 'Performance Degradada',
    message: 'API Mobile com latência elevada (850ms médio)',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    isRead: false,
    category: 'performance',
    actionUrl: '/admin/integrations',
    actionLabel: 'Verificar Status',
    metadata: { latency: 850, threshold: 500 }
  },
  {
    id: '3',
    type: 'info',
    priority: 'medium',
    title: 'Backup Concluído',
    message: 'Backup automático executado com sucesso (2.4GB)',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    category: 'system',
    metadata: { backup_size: '2.4GB', duration: '45min' }
  },
  {
    id: '4',
    type: 'warning',
    priority: 'high',
    title: 'Múltiplas Tentativas de Login',
    message: 'IP 192.168.1.100 tentou 5 vezes login para usuário admin',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    category: 'security',
    actionUrl: '/admin/audit',
    actionLabel: 'Ver Log',
    metadata: { ip: '192.168.1.100', attempts: 5, user: 'admin' }
  },
  {
    id: '5',
    type: 'success',
    priority: 'low',
    title: 'Meta de Automação Atingida',
    message: 'Taxa de decisão automática chegou a 75% (meta: 70%)',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    category: 'performance',
    metadata: { current_rate: 75, target: 70 }
  },
  {
    id: '6',
    type: 'error',
    priority: 'high',
    title: 'Integração SAP Instável',
    message: 'Conexão com SAP S/4HANA apresentando intermitências',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    category: 'integration',
    actionUrl: '/admin/integrations',
    actionLabel: 'Diagnosticar',
    metadata: { system: 'SAP S/4HANA', status: 'intermittent' }
  }
];

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    inApp: true,
    categories: {
      system: true,
      sla: true,
      performance: true,
      security: true,
      integration: true
    },
    priority: {
      low: false,
      medium: true,
      high: true,
      critical: true
    }
  });
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const criticalCount = notifications.filter(n => !n.isRead && n.priority === 'critical').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'info': return <InfoIcon className="w-4 h-4 text-blue-500" />;
      default: return <InfoIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system': return <SettingsIcon className="w-3 h-3" />;
      case 'sla': return <ClockIcon className="w-3 h-3" />;
      case 'performance': return <TrendingUpIcon className="w-3 h-3" />;
      case 'security': return <ShieldIcon className="w-3 h-3" />;
      case 'integration': return <AlertCircleIcon className="w-3 h-3" />;
      default: return <InfoIcon className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${diffDays}d atrás`;
  };

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' || !n.isRead
  );

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className={`absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs ${
                  criticalCount > 0 ? 'animate-pulse bg-red-600' : ''
                }`}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Central de Notificações</DialogTitle>
                <DialogDescription>
                  {unreadCount} não lidas de {notifications.length} total
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    Marcar todas como lidas
                  </Button>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <SettingsIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Configurações de Notificação</DialogTitle>
                      <DialogDescription>
                        Personalize como você recebe notificações
                      </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="channels" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="channels">Canais</TabsTrigger>
                        <TabsTrigger value="filters">Filtros</TabsTrigger>
                      </TabsList>
                      <TabsContent value="channels" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MailIcon className="w-4 h-4" />
                              <Label>E-mail</Label>
                            </div>
                            <Switch checked={settings.email} onCheckedChange={(checked) =>
                              setSettings({...settings, email: checked})
                            } />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <SmartphoneIcon className="w-4 h-4" />
                              <Label>Push</Label>
                            </div>
                            <Switch checked={settings.push} onCheckedChange={(checked) =>
                              setSettings({...settings, push: checked})
                            } />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BellIcon className="w-4 h-4" />
                              <Label>In-App</Label>
                            </div>
                            <Switch checked={settings.inApp} onCheckedChange={(checked) =>
                              setSettings({...settings, inApp: checked})
                            } />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="filters" className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Categorias</h4>
                          <div className="space-y-2">
                            {Object.entries(settings.categories).map(([category, enabled]) => (
                              <div key={category} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getCategoryIcon(category)}
                                  <Label className="capitalize">{category}</Label>
                                </div>
                                <Switch
                                  checked={enabled}
                                  onCheckedChange={(checked) =>
                                    setSettings({
                                      ...settings,
                                      categories: {...settings.categories, [category]: checked}
                                    })
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Prioridades</h4>
                          <div className="space-y-2">
                            {Object.entries(settings.priority).map(([priority, enabled]) => (
                              <div key={priority} className="flex items-center justify-between">
                                <Label className="capitalize">{priority}</Label>
                                <Switch
                                  checked={enabled}
                                  onCheckedChange={(checked) =>
                                    setSettings({
                                      ...settings,
                                      priority: {...settings.priority, [priority]: checked}
                                    })
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Todas ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Não lidas ({unreadCount})
              </Button>
            </div>

            {/* Notifications List */}
            <div className="h-96 overflow-y-auto">
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BellIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma notificação encontrada</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg transition-all ${
                        !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getTypeIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {getCategoryIcon(notification.category)}
                                <span className="ml-1 capitalize">{notification.category}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <div className="flex gap-2">
                                {notification.actionUrl && (
                                  <Button variant="outline" size="sm">
                                    {notification.actionLabel || 'Ver detalhes'}
                                  </Button>
                                )}
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    Marcar como lida
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <XIcon className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}