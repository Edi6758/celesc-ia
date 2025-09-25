'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/app/_state/auth-store';
import { mockUsers } from '@/app/_mocks/users';
import { UserRole } from '@/app/_types/profile';
import {
  MapIcon,
  SearchIcon,
  UsersIcon,
  BarChart3Icon,
  EyeIcon,
  EyeOffIcon,
  LogInIcon,
  BrainIcon,
  ShieldIcon,
  ClockIcon,
  TrendingUpIcon
} from 'lucide-react';

const profileFeatures = {
  LEITURISTA: {
    icon: MapIcon,
    color: 'bg-blue-500',
    title: 'Leiturista de Campo',
    description: 'Coleta de leituras e execução de releituras',
    features: [
      'Rota diária otimizada por IA',
      'Captura de fotos com OCR automático',
      'Validação de geolocalização',
      'Modo offline com sincronização',
      'Alertas de qualidade em tempo real'
    ],
    mockCredentials: { username: 'carlos.silva', password: 'leit123' }
  },
  ANALISTA: {
    icon: SearchIcon,
    color: 'bg-green-500',
    title: 'Analista de Críticas',
    description: 'Análise inteligente de faturas em crítica',
    features: [
      'Workbench unificado com IA',
      'Priorização automática por SLA',
      'Sugestões com nível de confiança',
      'Histórico de consumo visualizado',
      'Fluxo de decisão guiado'
    ],
    mockCredentials: { username: 'pedro.oliveira', password: 'anal123' }
  },
  ADMIN: {
    icon: UsersIcon,
    color: 'bg-purple-500',
    title: 'Administrador do Sistema',
    description: 'Gestão completa do sistema e usuários',
    features: [
      'Gestão de usuários e permissões',
      'Configuração de regras de IA',
      'Auditoria completa do sistema',
      'Monitoramento de integrações',
      'Relatórios de compliance'
    ],
    mockCredentials: { username: 'roberto.admin', password: 'adm123' }
  },
  GESTOR: {
    icon: BarChart3Icon,
    color: 'bg-pink-500',
    title: 'Gestor Comercial',
    description: 'Visão estratégica e KPIs executivos',
    features: [
      'Dashboard executivo em tempo real',
      'KPIs de performance e qualidade',
      'Análise de tendências e padrões',
      'Relatórios gerenciais automáticos',
      'Alertas de negócio inteligentes'
    ],
    mockCredentials: { username: 'helena.gestora', password: 'ges123' }
  }
};

export function LoginScreen() {
  const { login } = useAuthStore();
  const [selectedProfile, setSelectedProfile] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileSelect = (role: UserRole) => {
    setSelectedProfile(role);
    const profile = profileFeatures[role];
    setCredentials({
      username: profile.mockCredentials.username,
      password: profile.mockCredentials.password
    });
  };

  const handleLogin = async () => {
    if (!selectedProfile) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const user = mockUsers.find(u => u.role === selectedProfile);
    if (user) {
      login(selectedProfile, user.region);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mr-4 shadow-xl p-2">
              <img
                src="/logo.png"
                alt="CELESC IA"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                CELESC IA
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Sistema Inteligente de Críticas</p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Plataforma integrada <span className="font-semibold text-blue-600 dark:text-blue-400">SAP S/4HANA IS-U</span> com
              <span className="font-semibold text-purple-600 dark:text-purple-400"> Inteligência Artificial</span> para
              tratamento automático de faturas em crítica
            </p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sistema Operacional</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>IA Ativa</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>SAP Integrado</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Selection */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Escolha seu Perfil de Acesso</h2>
              <p className="text-gray-600 dark:text-blue-200">Selecione sua área de atuação no sistema</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(profileFeatures).map(([role, profile]) => {
                const Icon = profile.icon;
                const isSelected = selectedProfile === role;

                return (
                  <Card
                    key={role}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      isSelected
                        ? 'ring-2 ring-white ring-opacity-50 bg-white/10 backdrop-blur-sm'
                        : 'bg-white/5 backdrop-blur-sm hover:bg-white/10'
                    }`}
                    onClick={() => handleProfileSelect(role as UserRole)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${profile.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-gray-800 dark:text-white text-sm">{profile.title}</CardTitle>
                          <CardDescription className="text-gray-600 dark:text-blue-200 text-xs">
                            {profile.description}
                          </CardDescription>
                        </div>
                        {isSelected && (
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1">
                        {profile.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="text-xs text-gray-600 dark:text-blue-100 flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-500 dark:bg-blue-300 rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <ShieldIcon className="w-8 h-8 text-gray-700 dark:text-white" />
                </div>
                <CardTitle className="text-gray-800 dark:text-white">
                  {selectedProfile ? `Login ${profileFeatures[selectedProfile].title}` : 'Faça seu Login'}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-blue-200">
                  {selectedProfile
                    ? 'Use as credenciais abaixo para acessar o sistema'
                    : 'Selecione um perfil para continuar'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProfile && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black dark:text-white">Usuário</label>
                      <Input
                        type="text"
                        placeholder="Digite seu usuário"
                        value={credentials.username}
                        onChange={(e) => setCredentials(prev => ({...prev, username: e.target.value}))}
                        className="bg-white border-gray-300 text-black placeholder:text-gray-400 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder:text-blue-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black dark:text-white">Senha</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={credentials.password}
                          onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                          className="bg-white border-gray-300 text-black placeholder:text-gray-400 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder:text-blue-200 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4 text-blue-200" />
                          ) : (
                            <EyeIcon className="h-4 w-4 text-blue-200" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={isLoading || !credentials.username || !credentials.password}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Autenticando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <LogInIcon className="w-4 h-4" />
                          Entrar no Sistema
                        </div>
                      )}
                    </Button>

                    {/* Mock Credentials Display */}
                    <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-400/30">
                      <p className="text-xs text-blue-600 dark:text-blue-200 mb-2 font-medium">Credenciais de Demo:</p>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-700 dark:text-white font-mono">
                          👤 {profileFeatures[selectedProfile].mockCredentials.username}
                        </p>
                        <p className="text-xs text-gray-700 dark:text-white font-mono">
                          🔑 {profileFeatures[selectedProfile].mockCredentials.password}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {!selectedProfile && (
                  <div className="text-center py-8">
                    <ClockIcon className="w-12 h-12 text-blue-300 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-600 dark:text-blue-200">Selecione um perfil acima para continuar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Overview */}
        {selectedProfile && (
          <div className="mt-8">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-gray-800 dark:text-white text-center">
                  Funcionalidades do {profileFeatures[selectedProfile].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {profileFeatures[selectedProfile].features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                      <p className="text-sm text-gray-700 dark:text-blue-100">{feature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-6 text-gray-600 dark:text-blue-200 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4" />
              <span>73% Taxa de Automação</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>4.2h Tempo Médio de Resolução</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3Icon className="w-4 h-4" />
              <span>98.2% Precisão da IA</span>
            </div>
          </div>
          <p className="text-gray-500 dark:text-blue-300 text-xs mt-4">
            © 2024 CELESC - Centrais Elétricas de Santa Catarina | Sistema Demonstrativo
          </p>
        </div>
      </div>
    </div>
  );
}