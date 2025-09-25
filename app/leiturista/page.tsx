'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '../_state/auth-store';
import {
  MapPinIcon,
  CameraIcon,
  WifiOffIcon,
  RefreshCwIcon,
  SearchIcon,
  NavigationIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon
} from 'lucide-react';

// Mock data for route
const mockRoute = [
  {
    id: 'UC-001',
    uc: '1234567890',
    customerName: 'João Silva Santos',
    address: 'Rua das Flores, 123 - Centro',
    status: 'pending' as const,
    lastReading: 12345,
    estimatedReading: 12580,
    distance: '0.5 km',
    priority: 'normal' as const,
    notes: 'Medidor no quintal lateral'
  },
  {
    id: 'UC-002',
    uc: '1234567891',
    customerName: 'Maria Oliveira Costa',
    address: 'Av. Principal, 456 - Bairro Novo',
    status: 'completed' as const,
    lastReading: 8976,
    currentReading: 9123,
    distance: '0.8 km',
    priority: 'normal' as const
  },
  {
    id: 'UC-003',
    uc: '1234567892',
    customerName: 'Pedro Souza Lima',
    address: 'Rua São João, 789 - Vila Esperança',
    status: 'pending' as const,
    lastReading: 15678,
    estimatedReading: 15890,
    distance: '1.2 km',
    priority: 'urgent' as const,
    notes: 'Releitura solicitada - suspeita de erro'
  }
];

export default function LeituraristaPage() {
  const { currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOffline] = useState(false);
  const [syncQueue] = useState(2); // Mock offline queue

  const filteredRoute = mockRoute.filter(item =>
    item.uc.includes(searchTerm) ||
    item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: mockRoute.length,
    completed: mockRoute.filter(r => r.status === 'completed').length,
    pending: mockRoute.filter(r => r.status === 'pending').length,
    urgent: mockRoute.filter(r => r.priority === 'urgent').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      default: return <AlertCircleIcon className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent'
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="p-4 space-y-4 pb-20 max-w-4xl mx-auto">
      {/* Header Stats - Mobile Optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border text-center">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Feitas</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border text-center">
          <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Urgentes</p>
        </div>
      </div>

      {/* Offline Status */}
      {isOffline && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WifiOffIcon className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">Modo Offline</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {syncQueue} leituras na fila de sincronização
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Sincronizar
            </Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por UC, nome ou endereço..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Route List */}
      <div className="space-y-3">
        {filteredRoute.map((item, index) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.uc}
                    </Badge>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority === 'urgent' ? 'Urgente' : 'Normal'}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm">{item.customerName}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <MapPinIcon className="h-3 w-3" />
                    {item.address}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1">
                      {item.status === 'completed' ? 'Feito' : 'Pendente'}
                    </span>
                  </Badge>
                </div>
              </div>

              {/* Reading Info */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Última Leitura</p>
                    <p className="font-mono font-medium">{item.lastReading.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.status === 'completed' ? 'Leitura Atual' : 'Estimativa'}
                    </p>
                    <p className="font-mono font-medium">
                      {(item.currentReading || item.estimatedReading)?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {item.notes && (
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-2 mb-3">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    📝 {item.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <NavigationIcon className="h-3 w-3" />
                  {item.distance}
                </div>

                <div className="flex gap-2">
                  {item.status === 'pending' && (
                    <Button
                      size="sm"
                      className="text-xs"
                      onClick={() => window.location.href = `/leiturista/coleta/${item.id}`}
                    >
                      <CameraIcon className="h-3 w-3 mr-1" />
                      Coletar
                    </Button>
                  )}
                  {item.status === 'completed' && (
                    <Button size="sm" variant="outline" className="text-xs">
                      Ver Detalhes
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Action Button - Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
          <CameraIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}