'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  CameraIcon,
  AlertTriangleIcon,
  ClockIcon,
  MapPinIcon,
  InfoIcon,
  CheckCircle2Icon,
  EyeIcon,
  VideoIcon,
  ImageIcon,
  XIcon
} from 'lucide-react';

// Mock data for releituras (re-reading requests)
const mockReleituras = [
  {
    id: 'REL-001',
    uc: '1234567893',
    customerName: 'Carlos Eduardo Martins',
    address: 'Rua das Acácias, 321 - Jardim Primavera',
    requestDate: '2024-03-15T10:30:00Z',
    dueDate: '2024-03-16T18:00:00Z',
    reason: 'Leitura fora do padrão',
    lastReading: 23456,
    reportedReading: 25890,
    expectedRange: { min: 23500, max: 24000 },
    priority: 'urgent' as const,
    requestedBy: 'Sistema Automático',
    status: 'pending' as const
  },
  {
    id: 'REL-002',
    uc: '1234567894',
    customerName: 'Lucia Helena Rodrigues',
    address: 'Av. Santos Dumont, 567 - Centro',
    requestDate: '2024-03-14T14:20:00Z',
    dueDate: '2024-03-17T12:00:00Z',
    reason: 'Foto de baixa qualidade',
    lastReading: 15432,
    reportedReading: 15678,
    expectedRange: { min: 15500, max: 15700 },
    priority: 'normal' as const,
    requestedBy: 'Pedro Oliveira',
    status: 'pending' as const
  },
  {
    id: 'REL-003',
    uc: '1234567895',
    customerName: 'Roberto Carlos Almeida',
    address: 'Rua São Pedro, 890 - Vila Nova',
    requestDate: '2024-03-13T16:45:00Z',
    dueDate: '2024-03-15T16:45:00Z',
    reason: 'Serial do medidor não confere',
    lastReading: 34567,
    reportedReading: 34890,
    expectedRange: { min: 34600, max: 34900 },
    priority: 'urgent' as const,
    requestedBy: 'Mariana Costa',
    status: 'completed' as const,
    completedAt: '2024-03-15T14:20:00Z',
    finalReading: 34823
  }
];

export default function ReliturasPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  // Modal states
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    releitura: any;
  }>({
    isOpen: false,
    releitura: null
  });

  const [cameraModal, setCameraModal] = useState<{
    isOpen: boolean;
    releitura: any;
  }>({
    isOpen: false,
    releitura: null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredReleituras = mockReleituras.filter(rel => {
    if (filter === 'all') return true;
    return rel.status === filter;
  });

  const stats = {
    total: mockReleituras.length,
    pending: mockReleituras.filter(r => r.status === 'pending').length,
    urgent: mockReleituras.filter(r => r.priority === 'urgent' && r.status === 'pending').length,
    overdue: mockReleituras.filter(r =>
      r.status === 'pending' && new Date(r.dueDate) < new Date()
    ).length
  };

  const getTimeUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffHours = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffHours < 0) {
      return { text: `${Math.abs(diffHours)}h atrasado`, color: 'text-red-600', urgent: true };
    } else if (diffHours <= 4) {
      return { text: `${diffHours}h restantes`, color: 'text-yellow-600', urgent: true };
    } else {
      return { text: `${diffHours}h restantes`, color: 'text-gray-600', urgent: false };
    }
  };

  const isReadingOutOfRange = (reading: number, range: { min: number; max: number }) => {
    return reading < range.min || reading > range.max;
  };

  const handleOpenDetails = (releitura: any) => {
    setDetailModal({
      isOpen: true,
      releitura
    });
  };

  const handleOpenCamera = (releitura: any) => {
    setCameraModal({
      isOpen: true,
      releitura
    });
  };

  const handleCameraCapture = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Request camera access
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          alert('Câmera aberta! Em um aplicativo real, a câmera seria ativada aqui.');
          setCameraModal({ isOpen: false, releitura: null });
        })
        .catch(() => {
          // Fallback to file input
          fileInputRef.current?.click();
        });
    } else {
      // Fallback to file input
      fileInputRef.current?.click();
    }
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Foto capturada: ${file.name}`);
      setCameraModal({ isOpen: false, releitura: null });
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Releituras Solicitadas</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ordens de serviço para releitura de medidores
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border text-center">
          <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Urgentes</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border text-center">
          <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Vencidas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          size="sm"
        >
          Pendentes
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
          size="sm"
        >
          Concluídas
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          Todas
        </Button>
      </div>

      {/* Releituras List */}
      <div className="space-y-3">
        {filteredReleituras.map((releitura) => {
          const timeInfo = getTimeUntilDue(releitura.dueDate);
          const isOutOfRange = isReadingOutOfRange(releitura.reportedReading, releitura.expectedRange);

          return (
            <Card key={releitura.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono text-xs">
                        {releitura.uc}
                      </Badge>
                      <Badge
                        variant={releitura.priority === 'urgent' ? 'destructive' : 'secondary'}
                      >
                        {releitura.priority === 'urgent' ? 'Urgente' : 'Normal'}
                      </Badge>
                      {releitura.status === 'completed' && (
                        <Badge variant="outline" className="text-green-700">
                          <CheckCircle2Icon className="h-3 w-3 mr-1" />
                          Concluída
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium text-sm">{releitura.customerName}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" />
                      {releitura.address}
                    </p>
                  </div>

                  {releitura.status === 'pending' && (
                    <Badge variant="outline" className={`${timeInfo.color} border-current`}>
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {timeInfo.text}
                    </Badge>
                  )}
                </div>

                {/* Reason */}
                <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangleIcon className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        {releitura.reason}
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Solicitado por: {releitura.requestedBy}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reading Analysis */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Última Leitura</p>
                      <p className="font-mono font-medium">{releitura.lastReading.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Leitura Informada</p>
                      <p className={`font-mono font-medium ${isOutOfRange ? 'text-red-600' : ''}`}>
                        {releitura.reportedReading.toLocaleString()}
                        {isOutOfRange && <span className="ml-1">⚠️</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Faixa Esperada</p>
                      <p className="font-mono text-xs">
                        {releitura.expectedRange.min.toLocaleString()} - {releitura.expectedRange.max.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {releitura.status === 'completed' && releitura.finalReading && (
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Leitura Final Confirmada</p>
                          <p className="font-mono text-green-600">{releitura.finalReading.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    OS: {releitura.id}
                  </div>

                  <div className="flex gap-2">
                    {releitura.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => handleOpenDetails(releitura)}
                        >
                          <InfoIcon className="h-3 w-3 mr-1" />
                          Detalhes
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs"
                          onClick={() => handleOpenCamera(releitura)}
                        >
                          <CameraIcon className="h-3 w-3 mr-1" />
                          Executar
                        </Button>
                      </>
                    )}
                    {releitura.status === 'completed' && (
                      <Button size="sm" variant="outline" className="text-xs">
                        Ver Resultado
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredReleituras.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle2Icon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              Nenhuma releitura {filter === 'pending' ? 'pendente' : filter === 'completed' ? 'concluída' : ''} encontrada.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      <Dialog open={detailModal.isOpen} onOpenChange={(open) => !open && setDetailModal({ isOpen: false, releitura: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <InfoIcon className="w-5 h-5" />
              Detalhes da Releitura - {detailModal.releitura?.id}
            </DialogTitle>
            <DialogDescription>
              Informações completas da ordem de serviço
            </DialogDescription>
          </DialogHeader>

          {detailModal.releitura && (
            <div className="space-y-4">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Informações do Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-600">UC</p>
                      <p className="font-mono">{detailModal.releitura.uc}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">Nome</p>
                      <p>{detailModal.releitura.customerName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Endereço</p>
                    <p className="text-sm">{detailModal.releitura.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Reading Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Informações da Leitura</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-800">{detailModal.releitura.lastReading}</p>
                      <p className="text-xs text-gray-600">Última Leitura</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-600">{detailModal.releitura.reportedReading}</p>
                      <p className="text-xs text-gray-600">Leitura Reportada</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">
                        {detailModal.releitura.expectedRange.min} - {detailModal.releitura.expectedRange.max}
                      </p>
                      <p className="text-xs text-gray-600">Faixa Esperada</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-800 mb-1">Motivo da Releitura</p>
                    <p className="text-sm text-yellow-700">{detailModal.releitura.reason}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Service Order Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Ordem de Serviço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Solicitada em</p>
                      <p>{new Date(detailModal.releitura.requestDate).toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">Prazo</p>
                      <p>{new Date(detailModal.releitura.dueDate).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Solicitado por</p>
                    <p>{detailModal.releitura.requestedBy}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Camera Modal */}
      <Dialog open={cameraModal.isOpen} onOpenChange={(open) => !open && setCameraModal({ isOpen: false, releitura: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CameraIcon className="w-5 h-5" />
              Executar Releitura
            </DialogTitle>
            <DialogDescription>
              {cameraModal.releitura?.uc} - {cameraModal.releitura?.customerName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <CameraIcon className="w-8 h-8 text-blue-600" />
              </div>

              <div>
                <h3 className="font-medium mb-2">Capturar Nova Leitura</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Abra a câmera para fotografar o medidor e registrar a nova leitura.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleCameraCapture}
                >
                  <VideoIcon className="w-4 h-4 mr-2" />
                  Abrir Câmera
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => setCameraModal({ isOpen: false, releitura: null })}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden file input for photo capture fallback */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileSelection}
      />
    </div>
  );
}