'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockUsers } from '@/app/_mocks/users';
import { useAuthStore } from '@/app/_state/auth-store';
import { UserRole } from '@/app/_types/profile';

const roleLabels: Record<UserRole, string> = {
  LEITURISTA: 'Leiturista',
  ANALISTA: 'Analista de Críticas',
  ADMIN: 'Administrador',
  GESTOR: 'Gestor/Comercial'
};

const roleDescriptions: Record<UserRole, string> = {
  LEITURISTA: 'Coleta de leituras e atendimento de releituras',
  ANALISTA: 'Análise de faturas em crítica e tomada de decisões',
  ADMIN: 'Gestão de usuários, regras e configurações',
  GESTOR: 'Visualização de dashboards e relatórios executivos'
};

const roleColors: Record<UserRole, string> = {
  LEITURISTA: 'bg-blue-500',
  ANALISTA: 'bg-green-500',
  ADMIN: 'bg-purple-500',
  GESTOR: 'bg-pink-500'
};

interface ProfileSelectorProps {
  onProfileSelect?: () => void;
}

export function ProfileSelector({ onProfileSelect }: ProfileSelectorProps) {
  const { login } = useAuthStore();

  const handleSelectProfile = (role: UserRole, region?: string) => {
    login(role, region);
    onProfileSelect?.();
  };

  const groupedUsers = mockUsers.reduce((acc, user) => {
    if (!acc[user.role]) {
      acc[user.role] = [];
    }
    acc[user.role].push(user);
    return acc;
  }, {} as Record<UserRole, typeof mockUsers>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            CELESC IA - Sistema de Críticas
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Selecione seu perfil para acessar o sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedUsers).map(([role, users]) => (
            <Card key={role} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${roleColors[role as UserRole]}`} />
                  <CardTitle>{roleLabels[role as UserRole]}</CardTitle>
                </div>
                <CardDescription>
                  {roleDescriptions[role as UserRole]}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        {user.region && (
                          <Badge variant="secondary" className="text-xs">
                            {user.region}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSelectProfile(user.role, user.region)}
                    >
                      Entrar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Sistema demo - Integração SAP S/4HANA IS-U simulada</p>
        </div>
      </div>
    </div>
  );
}