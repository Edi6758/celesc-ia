'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { mockUsers } from '@/app/_mocks/users';
import { UserRole } from '@/app/_types/profile';
import {
  UsersIcon,
  PlusIcon,
  SearchIcon,
  EditIcon,
  ShieldIcon,
  UserCheckIcon,
  UserXIcon,
  SettingsIcon,
  ActivityIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  pendingApprovals: number;
  totalSessions: number;
  failedLogins: number;
}

const adminStats: AdminStats = {
  totalUsers: 47,
  activeUsers: 42,
  inactiveUsers: 5,
  pendingApprovals: 3,
  totalSessions: 156,
  failedLogins: 12
};

const recentActivities = [
  {
    id: 1,
    user: 'Maria Santos',
    action: 'Login realizado',
    timestamp: '2024-01-15 09:30:00',
    status: 'success',
    ip: '192.168.1.45'
  },
  {
    id: 2,
    user: 'João Silva',
    action: 'Senha alterada',
    timestamp: '2024-01-15 08:15:00',
    status: 'success',
    ip: '192.168.1.32'
  },
  {
    id: 3,
    user: 'Ana Costa',
    action: 'Tentativa de login falhada',
    timestamp: '2024-01-15 07:45:00',
    status: 'error',
    ip: '192.168.1.78'
  },
  {
    id: 4,
    user: 'Sistema',
    action: 'Backup automático realizado',
    timestamp: '2024-01-15 02:00:00',
    status: 'info',
    ip: 'localhost'
  }
];

const systemIntegrations = [
  {
    id: 1,
    name: 'SAP S/4HANA IS-U',
    status: 'connected',
    lastSync: '2024-01-15 09:45:00',
    version: '2022 FP02',
    latency: '45ms'
  },
  {
    id: 2,
    name: 'AI Decision Engine',
    status: 'connected',
    lastSync: '2024-01-15 09:44:00',
    version: 'v2.1.3',
    latency: '120ms'
  },
  {
    id: 3,
    name: 'Mobile App API',
    status: 'degraded',
    lastSync: '2024-01-15 09:30:00',
    version: 'v1.8.2',
    latency: '450ms'
  },
  {
    id: 4,
    name: 'Backup Service',
    status: 'connected',
    lastSync: '2024-01-15 02:00:00',
    version: 'v1.2.0',
    latency: '25ms'
  }
];

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [newUserDialog, setNewUserDialog] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'connected':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return <ActivityIcon className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Conectado</Badge>;
      case 'degraded':
        return <Badge variant="destructive" className="bg-yellow-500">Degradado</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Desconectado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gestão de usuários, permissões e integrações do sistema
          </p>
        </div>
        <Dialog open={newUserDialog} onOpenChange={setNewUserDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo usuário do sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="Digite o nome completo" />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="Digite o e-mail" />
              </div>
              <div>
                <Label htmlFor="role">Perfil</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LEITURISTA">Leiturista</SelectItem>
                    <SelectItem value="ANALISTA">Analista</SelectItem>
                    <SelectItem value="GESTOR">Gestor</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="region">Região</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Norte">Norte</SelectItem>
                    <SelectItem value="Sul">Sul</SelectItem>
                    <SelectItem value="Leste">Leste</SelectItem>
                    <SelectItem value="Oeste">Oeste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewUserDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setNewUserDialog(false)}>
                  Criar Usuário
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +2 novos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheckIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{adminStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              89% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
            <ActivityIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{adminStats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              Pico às 10:00
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tentativas Falhadas</CardTitle>
            <ShieldIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{adminStats.failedLogins}</div>
            <p className="text-xs text-muted-foreground">
              -3% desde ontem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="activity">Atividades</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Usuários</CardTitle>
              <CardDescription>
                Visualize e gerencie todos os usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos os perfis</SelectItem>
                    <SelectItem value="LEITURISTA">Leiturista</SelectItem>
                    <SelectItem value="ANALISTA">Analista</SelectItem>
                    <SelectItem value="GESTOR">Gestor</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{user.email}</span>
                          <span>•</span>
                          <Badge variant="outline">{user.role}</Badge>
                          {user.region && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary">{user.region}</Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-500">
                        Ativo
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <EditIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Log de atividades e ações dos usuários no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(activity.status)}
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{activity.ip}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Status das Integrações</CardTitle>
              <CardDescription>
                Monitoramento de conectividade com sistemas externos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemIntegrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        {getStatusBadge(integration.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Versão:</span>
                          <span>{integration.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Latência:</span>
                          <span className={
                            integration.latency.includes('450') ? 'text-yellow-600' : 'text-green-600'
                          }>
                            {integration.latency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Última Sinc:</span>
                          <span>{integration.lastSync}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Políticas de segurança e controles de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Política de Senhas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3 h-3 text-green-500" />
                          <span>Mínimo 8 caracteres</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3 h-3 text-green-500" />
                          <span>Maiúsculas e minúsculas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3 h-3 text-green-500" />
                          <span>Caracteres especiais</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3 h-3 text-green-500" />
                          <span>Expiração em 90 dias</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Tentativas de Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Máximo de tentativas:</span>
                          <span className="font-medium">5</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bloqueio temporário:</span>
                          <span className="font-medium">15 min</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bloqueios hoje:</span>
                          <span className="font-medium text-red-600">7</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Sessões Ativas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Timeout de sessão:</span>
                          <span className="font-medium">4h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sessões simultâneas:</span>
                          <span className="font-medium">2</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total ativo:</span>
                          <span className="font-medium text-green-600">{adminStats.totalSessions}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-4">
                  <Button>
                    <ShieldIcon className="w-4 h-4 mr-2" />
                    Configurar Políticas
                  </Button>
                  <Button variant="outline">
                    <ActivityIcon className="w-4 h-4 mr-2" />
                    Log de Segurança
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}