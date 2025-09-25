'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  CameraIcon,
  MapPinIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  RefreshCwIcon,
  WifiOffIcon,
  BrainIcon,
  ClockIcon,
  ZapIcon,
  ImageIcon
} from 'lucide-react';

// Mock UC data
const mockUC = {
  id: 'UC-001',
  uc: '1234567890',
  customerName: 'João Silva Santos',
  address: 'Rua das Flores, 123 - Centro - Florianópolis/SC',
  lastReading: 12345,
  expectedRange: { min: 12500, max: 12700 },
  meterSerial: 'MTR7821',
  meterBrand: 'ELSTER',
  installDate: '2020-03-15',
  notes: 'Medidor no quintal lateral, portão azul',
  coordinates: { lat: -27.5954, lng: -48.5480 },
  photos: [
    { id: 1, url: 'https://picsum.photos/400/300?random=1', type: 'meter', takenAt: '2024-02-15T08:30:00Z' },
    { id: 2, url: 'https://picsum.photos/400/300?random=2', type: 'display', takenAt: '2024-02-15T08:31:00Z' }
  ]
};

export default function ColetaPage() {
  const params = useParams();
  const router = useRouter();
  const [currentReading, setCurrentReading] = useState('');
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [photoQuality, setPhotoQuality] = useState<'GOOD' | 'BLURRY' | 'DARK' | null>(null);
  const [geoStatus, setGeoStatus] = useState<'checking' | 'ok' | 'error' | 'out_of_range'>('checking');
  const [aiValidation, setAiValidation] = useState<{
    status: 'analyzing' | 'approved' | 'flagged';
    confidence: number;
    issues: string[];
  } | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isOffline] = useState(false);

  useEffect(() => {
    // Simulate geolocation check
    const checkGeolocation = () => {
      setTimeout(() => {
        const random = Math.random();
        if (random > 0.9) {
          setGeoStatus('out_of_range');
        } else if (random > 0.8) {
          setGeoStatus('error');
        } else {
          setGeoStatus('ok');
        }
      }, 2000);
    };

    checkGeolocation();
  }, []);

  const simulatePhotoCapture = () => {
    setShowCamera(true);
    setIsProcessingOCR(true);

    // Simulate OCR processing
    setTimeout(() => {
      const qualities = ['GOOD', 'BLURRY', 'DARK'] as const;
      const quality = qualities[Math.floor(Math.random() * qualities.length)];
      setPhotoQuality(quality);

      if (quality === 'GOOD') {
        const mockReading = Math.floor(Math.random() * 200) + 12500;
        setCurrentReading(mockReading.toString());

        // Simulate AI validation
        setTimeout(() => {
          const confidence = 0.7 + Math.random() * 0.25;
          const isWithinRange = mockReading >= mockUC.expectedRange.min && mockReading <= mockUC.expectedRange.max;

          setAiValidation({
            status: isWithinRange && confidence > 0.85 ? 'approved' : 'flagged',
            confidence: confidence,
            issues: !isWithinRange ? ['Leitura fora da faixa esperada'] : confidence < 0.85 ? ['Baixa confiança no OCR'] : []
          });
        }, 1000);
      } else {
        setAiValidation({
          status: 'flagged',
          confidence: 0.4,
          issues: ['Qualidade da foto inadequada', 'OCR não conseguiu processar']
        });
      }

      setIsProcessingOCR(false);
      setShowCamera(false);
    }, 3000);
  };

  const handleSubmit = () => {
    // Simulate submission
    alert('Leitura registrada com sucesso!');
    router.push('/leiturista');
  };

  const getGeoStatusInfo = () => {
    switch (geoStatus) {
      case 'checking':
        return { color: 'text-yellow-600', icon: RefreshCwIcon, text: 'Verificando localização...' };
      case 'ok':
        return { color: 'text-green-600', icon: CheckCircleIcon, text: 'Localização confirmada' };
      case 'error':
        return { color: 'text-red-600', icon: XCircleIcon, text: 'Erro de GPS' };
      case 'out_of_range':
        return { color: 'text-red-600', icon: AlertTriangleIcon, text: 'Fora da área esperada' };
    }
  };

  const geoInfo = getGeoStatusInfo();
  const GeoIcon = geoInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            ← Voltar
          </Button>
          {isOffline && (
            <Badge variant="outline" className="text-yellow-600">
              <WifiOffIcon className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold">Coleta de Leitura</h1>
        <p className="text-gray-600 dark:text-gray-400">UC {mockUC.uc} - {mockUC.customerName}</p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* UC Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações da UC</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Endereço</label>
                <p className="text-sm">{mockUC.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Última Leitura</label>
                <p className="text-sm font-mono">{mockUC.lastReading.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Medidor</label>
                <p className="text-sm">{mockUC.meterBrand} - {mockUC.meterSerial}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Faixa Esperada</label>
                <p className="text-sm font-mono">
                  {mockUC.expectedRange.min.toLocaleString()} - {mockUC.expectedRange.max.toLocaleString()}
                </p>
              </div>
            </div>

            {mockUC.notes && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  📝 {mockUC.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Geolocation Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <GeoIcon className={`h-5 w-5 ${geoInfo.color} ${geoStatus === 'checking' ? 'animate-spin' : ''}`} />
              <div className="flex-1">
                <p className={`font-medium ${geoInfo.color}`}>{geoInfo.text}</p>
                <p className="text-xs text-gray-500">
                  Lat: {mockUC.coordinates.lat}, Lng: {mockUC.coordinates.lng}
                </p>
              </div>
              {geoStatus === 'ok' && (
                <Badge variant="outline" className="text-green-600">
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  Validado
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Photo Capture */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CameraIcon className="h-5 w-5" />
              Captura de Foto
            </CardTitle>
            <CardDescription>
              Tire uma foto clara do display do medidor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!photoQuality ? (
              <Button
                onClick={simulatePhotoCapture}
                disabled={isProcessingOCR}
                className="w-full h-32 border-dashed border-2 border-gray-300 dark:border-gray-600"
              >
                {isProcessingOCR ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processando OCR...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <CameraIcon className="h-8 w-8" />
                    <span>Tirar Foto do Medidor</span>
                  </div>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Foto capturada</p>
                    <Badge
                      variant={photoQuality === 'GOOD' ? 'default' : 'destructive'}
                      className="mt-2"
                    >
                      Qualidade: {photoQuality === 'GOOD' ? 'Boa' : photoQuality === 'BLURRY' ? 'Desfocada' : 'Escura'}
                    </Badge>
                  </div>
                </div>

                {photoQuality !== 'GOOD' && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangleIcon className="h-4 w-4 text-red-600" />
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Foto com qualidade inadequada. Recomendamos tirar nova foto.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={simulatePhotoCapture}
                      className="mt-2"
                    >
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Tirar Nova Foto
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reading Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leitura Atual</CardTitle>
            <CardDescription>
              Digite ou confirme a leitura identificada pelo OCR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Digite a leitura"
                value={currentReading}
                onChange={(e) => setCurrentReading(e.target.value)}
                className="text-lg font-mono text-center h-12"
              />
              {currentReading && (
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Consumo: {(parseInt(currentReading) - mockUC.lastReading).toLocaleString()} kWh
                </p>
              )}
            </div>

            {/* AI Validation */}
            {aiValidation && (
              <div className={`p-3 rounded-lg ${
                aiValidation.status === 'approved'
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-yellow-50 dark:bg-yellow-900/20'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    <BrainIcon className={`h-4 w-4 ${
                      aiValidation.status === 'approved' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      aiValidation.status === 'approved' ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'
                    }`}>
                      IA - Confiança: {Math.round(aiValidation.confidence * 100)}%
                    </span>
                  </div>
                  <Badge variant={aiValidation.status === 'approved' ? 'default' : 'secondary'}>
                    {aiValidation.status === 'approved' ? 'Aprovado' : 'Revisar'}
                  </Badge>
                </div>

                {aiValidation.issues.length > 0 && (
                  <div className="mt-2">
                    {aiValidation.issues.map((issue, i) => (
                      <p key={i} className={`text-xs ${
                        aiValidation.status === 'approved' ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
                      }`}>
                        • {issue}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historical Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fotos Anteriores</CardTitle>
            <CardDescription>
              Referência de coletas passadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {mockUC.photos.map((photo) => (
                <div key={photo.id} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(photo.takenAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={!currentReading || geoStatus !== 'ok'}
            className="w-full h-12"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Registrar Leitura
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <ClockIcon className="h-4 w-4 mr-2" />
              Reagendar
            </Button>
            <Button variant="outline">
              <ZapIcon className="h-4 w-4 mr-2" />
              Sem Acesso
            </Button>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Processando Foto</DialogTitle>
            <DialogDescription>
              Aguarde enquanto processamos a imagem com OCR...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}