'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from './_state/auth-store';
import Link from 'next/link';
import {
  MapIcon,
  SearchIcon,
  UsersIcon,
  BarChart3Icon,
  AlertTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  TrendingUpIcon
} from 'lucide-react';

const roleCards = {
  LEITURISTA: [
    {
      title: 'Rota do Dia',
      description: 'Visualizar e executar coletas programadas',
      href: '/leiturista',
      icon: MapIcon,
      stats: '12 pendentes',
      color: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Releituras',
      description: 'Atender solicitações de releitura',
      href: '/leiturista/releituras',
      icon: ClockIcon,
      stats: '3 urgentes',
      color: 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800'
    }
  ],
  ANALISTA: [
    {
      title: 'Workbench',
      description: 'Analisar faturas em crítica',
      href: '/analista',
      icon: SearchIcon,
      stats: '25 pendentes',
      color: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
    },
    {
      title: 'Casos Urgentes',
      description: 'SLA crítico ou alto risco',
      href: '/analista?urgent=true',
      icon: AlertTriangleIcon,
      stats: '5 críticos',
      color: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
    }
  ],
  ADMIN: [
    {
      title: 'Usuários',
      description: 'Gerenciar usuários e permissões',
      href: '/admin',
      icon: UsersIcon,
      stats: '6 ativos',
      color: 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800'
    },
    {
      title: 'Regras',
      description: 'Configurar regras de decisão',
      href: '/admin/rules',
      icon: CheckCircleIcon,
      stats: '5 ativas',
      color: 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800'
    }
  ],
  GESTOR: [
    {
      title: 'Dashboard',
      description: 'KPIs e métricas executivas',
      href: '/gestor',
      icon: BarChart3Icon,
      stats: '73% auto',
      color: 'bg-pink-50 dark:bg-pink-900/10 border-pink-200 dark:border-pink-800'
    },
    {
      title: 'Tendências',
      description: 'Análise de performance e trends',
      href: '/gestor/trends',
      icon: TrendingUpIcon,
      stats: '+12% mês',
      color: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
    }
  ]
};

export default function HomePage() {
  const { currentUser } = useAuthStore();

  if (!currentUser) return null;

  const userCards = roleCards[currentUser.role] || [];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo, {currentUser.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Aqui está uma visão geral das suas principais atividades no sistema.
        </p>
      </div>

      {/* Role-specific Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userCards.map((card) => (
          <Card key={card.href} className={`hover:shadow-lg transition-shadow ${card.color}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <card.icon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                <Badge variant="secondary">{card.stats}</Badge>
              </div>
              <CardTitle className="text-lg">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={card.href}>
                <Button className="w-full">
                  Acessar
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
          <CardDescription>
            Integrações e serviços principais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">SAP S/4HANA</p>
                <p className="text-sm text-gray-500">Operacional</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">OCR Service</p>
                <p className="text-sm text-gray-500">Degradado</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Message Queue</p>
                <p className="text-sm text-gray-500">Operacional</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">MLOps Pipeline</p>
                <p className="text-sm text-gray-500">Operacional</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Atividades</CardTitle>
          <CardDescription>
            Últimas 24 horas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Faturas Processadas</p>
                <p className="text-sm text-gray-500">Total geral</p>
              </div>
              <Badge variant="outline">247</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Decisões Automáticas</p>
                <p className="text-sm text-gray-500">Taxa de automação</p>
              </div>
              <Badge variant="outline">73%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Casos Pendentes</p>
                <p className="text-sm text-gray-500">Aguardando análise</p>
              </div>
              <Badge variant="outline">25</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}