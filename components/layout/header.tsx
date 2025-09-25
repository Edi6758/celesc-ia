'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUIStore } from '@/app/_state/ui-store';
import { useAuthStore } from '@/app/_state/auth-store';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { MoonIcon, SunIcon } from 'lucide-react';

export function Header() {
  const { darkMode, toggleDarkMode } = useUIStore();
  const { currentUser } = useAuthStore();

  if (!currentUser) return null;

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
      <div className="flex items-center justify-between h-full">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="CELESC IA"
            className="w-8 h-8 object-contain"
          />
          <div>
            <h1 className="text-lg font-semibold">
              Sistema de Críticas - CELESC IA
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getCurrentPageTitle()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <NotificationCenter />

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <SunIcon className="h-4 w-4" />
            <Switch
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
            />
            <MoonIcon className="h-4 w-4" />
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentUser.role}{currentUser.region && ` • ${currentUser.region}`}
              </p>
            </div>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function getCurrentPageTitle(): string {
  if (typeof window === 'undefined') return '';

  const path = window.location.pathname;

  const titles: Record<string, string> = {
    '/': 'Dashboard Principal',
    '/leiturista': 'Rota do Dia',
    '/leiturista/releituras': 'Releituras Solicitadas',
    '/analista': 'Workbench de Análise',
    '/analista/reports': 'Relatórios de Análise',
    '/admin': 'Gestão de Usuários',
    '/admin/rules': 'Gestão de Regras',
    '/admin/audit': 'Auditoria',
    '/admin/integrations': 'Integrações',
    '/gestor': 'Dashboard Executivo',
    '/gestor/kpis': 'KPIs e Métricas',
    '/gestor/reports': 'Relatórios Executivos',
  };

  return titles[path] || 'CELESC IA';
}