'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthStore } from '@/app/_state/auth-store';
import { useUIStore } from '@/app/_state/ui-store';
import {
  HomeIcon,
  ClipboardListIcon,
  SearchIcon,
  SettingsIcon,
  BarChart3Icon,
  MapIcon,
  UsersIcon,
  ShieldCheckIcon,
  FileTextIcon,
  MenuIcon,
  XIcon,
  LogOutIcon
} from 'lucide-react';

const navigation = {
  LEITURISTA: [
    { name: 'Início', href: '/', icon: HomeIcon },
    { name: 'Rota do Dia', href: '/leiturista', icon: MapIcon },
    { name: 'Dashboard', href: '/leiturista/dashboard', icon: BarChart3Icon },
    { name: 'Releituras', href: '/leiturista/releituras', icon: ClipboardListIcon },
  ],
  ANALISTA: [
    { name: 'Início', href: '/', icon: HomeIcon },
    { name: 'Workbench', href: '/analista', icon: SearchIcon },
    { name: 'Relatórios', href: '/analista/reports', icon: FileTextIcon },
  ],
  ADMIN: [
    { name: 'Início', href: '/', icon: HomeIcon },
    { name: 'Usuários', href: '/admin', icon: UsersIcon },
    { name: 'Regras', href: '/admin/rules', icon: ShieldCheckIcon },
    { name: 'Auditoria', href: '/admin/audit', icon: FileTextIcon },
    { name: 'Integrações', href: '/admin/integrations', icon: SettingsIcon },
  ],
  GESTOR: [
    { name: 'Início', href: '/', icon: HomeIcon },
    { name: 'Dashboard', href: '/gestor', icon: BarChart3Icon },
    { name: 'KPIs', href: '/gestor/kpis', icon: BarChart3Icon },
    { name: 'Relatórios', href: '/gestor/reports', icon: FileTextIcon },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  if (!currentUser) return null;

  const userNavigation = navigation[currentUser.role] || [];

  const handleLogout = () => {
    logout();
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="CELESC IA"
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="font-semibold text-sm">CELESC IA</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Críticas</p>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? <MenuIcon className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {currentUser.role}
                  </Badge>
                  {currentUser.region && (
                    <Badge variant="outline" className="text-xs">
                      {currentUser.region}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {userNavigation.map((item) => {
            const isActive = pathname === item.href;

            const navItem = (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    sidebarCollapsed ? "px-2" : "px-3",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 flex-shrink-0",
                    !sidebarCollapsed && "mr-3"
                  )} />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Button>
              </Link>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    {navItem}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return navItem;
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className={cn(
                  "w-full",
                  sidebarCollapsed ? "px-2 justify-center" : "px-3 justify-start"
                )}
              >
                <LogOutIcon className={cn(
                  "h-4 w-4 flex-shrink-0",
                  !sidebarCollapsed && "mr-3"
                )} />
                {!sidebarCollapsed && <span>Sair</span>}
              </Button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right">
                <p>Sair</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}