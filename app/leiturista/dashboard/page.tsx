'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  MapPinIcon,
  CameraIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  AwardIcon,
  TargetIcon,
  ZapIcon,
  BatteryIcon,
  WifiIcon,
  StarIcon
} from 'lucide-react';

// Mock data for leiturista performance
const mockPerformanceData = {
  today: {
    completed: 23,
    total: 30,
    efficiency: 76.7,
    avgTimePerReading: 8.5,
    qualityScore: 94.2,
    accuracyRate: 98.1
  },
  week: {
    completed: 156,
    total: 180,
    efficiency: 86.7,
    avgTimePerReading: 7.8,
    qualityScore: 95.8,
    accuracyRate: 97.9
  },
  month: {
    completed: 672,
    total: 750,
    efficiency: 89.6,
    avgTimePerReading: 7.2,
    qualityScore: 96.1,
    accuracyRate: 98.3
  },
  achievements: [
    { id: 1, title: 'Eficiência Máxima', description: '95%+ de eficiência por 5 dias consecutivos', earned: true, date: '2024-03-15' },
    { id: 2, title: 'Qualidade Premium', description: 'Score de qualidade acima de 95% no mês', earned: true, date: '2024-03-10' },
    { id: 3, title: 'Velocidade Sonic', description: 'Tempo médio abaixo de 7min por leitura', earned: true, date: '2024-03-12' },
    { id: 4, title: 'Zero Defeito', description: '100% de precisão em 50 leituras consecutivas', earned: false, progress: 87 }
  ],
  recentIssues: [
    { id: 1, type: 'Foto Ruim', count: 2, severity: 'low', description: 'Fotos com baixa qualidade detectadas' },
    { id: 2, type: 'Geolocalização', count: 1, severity: 'medium', description: 'Leitura fora da área esperada' },
    { id: 3, type: 'OCR Erro', count: 1, severity: 'low', description: 'Falha na leitura automática' }
  ],
  ranking: {
    position: 2,
    total: 15,
    score: 94.5,
    leader: 'Ana Santos',
    leaderScore: 95.2
  }
};

const ProgressBar = ({ value, className = "" }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ${className}`}>
    <div
      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    ></div>
  </div>
);

export default function LeituraristasDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const currentData = mockPerformanceData[selectedPeriod];

  return (
    <div className="p-4 space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Dashboard do Leiturista</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Acompanhe sua performance e estatísticas detalhadas
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        {(['today', 'week', 'month'] as const).map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
          >
            {period === 'today' ? 'Hoje' : period === 'week' ? 'Semana' : 'Mês'}
          </Button>
        ))}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <TrendingUpIcon className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{currentData.completed}</p>
            <p className="text-xs text-gray-600">de {currentData.total} leituras</p>
            <ProgressBar value={(currentData.completed / currentData.total) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TargetIcon className="h-5 w-5 text-blue-600" />
              <Badge variant="outline">{currentData.efficiency.toFixed(1)}%</Badge>
            </div>
            <p className="text-2xl font-bold">{currentData.efficiency.toFixed(0)}%</p>
            <p className="text-xs text-gray-600">Eficiência</p>
            <ProgressBar value={currentData.efficiency} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <ClockIcon className="h-5 w-5 text-purple-600" />
              <TrendingDownIcon className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{currentData.avgTimePerReading}</p>
            <p className="text-xs text-gray-600">min/leitura</p>
            <div className="mt-2 text-xs text-green-600">-0.3min vs período anterior</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <StarIcon className="h-5 w-5 text-yellow-600" />
              <Badge variant="outline" className="text-green-600">Excelente</Badge>
            </div>
            <p className="text-2xl font-bold">{currentData.qualityScore}</p>
            <p className="text-xs text-gray-600">Score Qualidade</p>
            <ProgressBar value={currentData.qualityScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Diária</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, i) => {
                const value = 70 + Math.random() * 25;
                const completed = Math.floor(20 + Math.random() * 15);
                const total = Math.floor(completed / (value / 100));

                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-8 text-sm font-medium">{day}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{completed}/{total}</span>
                        <span>{value.toFixed(0)}%</span>
                      </div>
                      <ProgressBar value={value} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quality Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Métricas de Qualidade</CardTitle>
            <CardDescription>Indicadores de performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CameraIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Qualidade Foto</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{currentData.qualityScore.toFixed(1)}%</span>
                <ProgressBar value={currentData.qualityScore} className="w-16" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ZapIcon className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Precisão OCR</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{currentData.accuracyRate.toFixed(1)}%</span>
                <ProgressBar value={currentData.accuracyRate} className="w-16" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm">Geolocalização</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">97.8%</span>
                <ProgressBar value={97.8} className="w-16" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BatteryIcon className="h-4 w-4 text-red-600" />
                <span className="text-sm">Bateria Média</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">78%</span>
                <ProgressBar value={78} className="w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AwardIcon className="h-5 w-5 text-yellow-600" />
            Conquistas
          </CardTitle>
          <CardDescription>Seus marcos de performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockPerformanceData.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      achievement.earned ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned ? (
                    <Badge variant="default" className="bg-yellow-600">
                      Conquistado
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      {achievement.progress}%
                    </Badge>
                  )}
                </div>
                {!achievement.earned && achievement.progress && (
                  <ProgressBar value={achievement.progress} className="mt-2" />
                )}
                {achievement.earned && achievement.date && (
                  <p className="text-xs text-yellow-600 mt-2">
                    Conquistado em {new Date(achievement.date).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ranking Regional</CardTitle>
          <CardDescription>Sua posição entre os leituristas da região</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="text-3xl">🥈</div>
              <div>
                <p className="text-2xl font-bold">#{mockPerformanceData.ranking.position}</p>
                <p className="text-sm text-gray-600">de {mockPerformanceData.ranking.total} leituristas</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Seu Score: {mockPerformanceData.ranking.score}</p>
              <ProgressBar value={(mockPerformanceData.ranking.score / 100) * 100} />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0</span>
                <span className="font-medium">Líder: {mockPerformanceData.ranking.leader} ({mockPerformanceData.ranking.leaderScore})</span>
                <span>100</span>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Faltam apenas {(mockPerformanceData.ranking.leaderScore - mockPerformanceData.ranking.score).toFixed(1)} pontos para o 1º lugar!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alertas Recentes</CardTitle>
          <CardDescription>Pontos de atenção identificados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPerformanceData.recentIssues.map((issue) => (
              <div key={issue.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <AlertTriangleIcon className={`h-4 w-4 mt-0.5 ${
                  issue.severity === 'high' ? 'text-red-600' :
                  issue.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{issue.type}</h4>
                    <Badge variant="outline" className="text-xs">
                      {issue.count} ocorrência{issue.count > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{issue.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}