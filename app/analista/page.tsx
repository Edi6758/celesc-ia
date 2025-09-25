'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { CaseDetailModal } from '@/components/ui/case-detail-modal';
import { useInvoices } from '../_services/invoice-service';
import { useUIStore } from '../_state/ui-store';
import { useAuthStore } from '../_state/auth-store';
import {
  AlertTriangleIcon,
  ClockIcon,
  SearchIcon,
  FilterIcon,
  CameraIcon,
  MapPinIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  RefreshCcwIcon,
  UserIcon,
  BrainIcon,
  ZapIcon,
  ShieldCheckIcon,
  CpuIcon,
  SparklesIcon,
  TrendingDownIcon,
  FileCheckIcon,
  CalendarIcon,
  HomeIcon,
  BuildingIcon,
  FactoryIcon,
  EyeIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  RotateCcwIcon
} from 'lucide-react';

// Enhanced mock data for pending analysis cases
const mockPendingCases = [
  {
    id: 'PND001',
    clientCode: '78234567',
    clientName: 'José Silva Santos',
    clientType: 'RESIDENTIAL',
    consumptionReading: 850,
    avgConsumption: 420,
    variation: 102.4,
    riskLevel: 'URGENT',
    slaHours: 2,
    aiDecision: 'TO_ANALYST',
    confidence: 0.73,
    createdAt: '2024-09-25T09:30:00Z',
    region: 'Florianópolis',
    address: 'Rua das Flores, 123 - Centro',
    meterSerial: 'MT789456123',
    lastReadingDate: '2024-08-25',
    photoQuality: 'GOOD',
    ocrAccuracy: 92,
    gpsAccuracy: 'HIGH',
    reasoning: 'Consumo dobrou em relação à média. Possível irregularidade ou problema no medidor.',
    similarCases: 8,
    historicalData: [380, 420, 395, 445, 850],
    urgencyReasons: ['Variação extrema', 'SLA crítico', 'Histórico inconsistente']
  },
  {
    id: 'PND002',
    clientCode: '45678912',
    clientName: 'Padaria do João Ltda',
    clientType: 'COMMERCIAL',
    consumptionReading: 2850,
    avgConsumption: 2200,
    variation: 29.5,
    riskLevel: 'HIGH',
    slaHours: 8,
    aiDecision: 'TO_ANALYST',
    confidence: 0.81,
    createdAt: '2024-09-25T08:15:00Z',
    region: 'São José',
    address: 'Av. Comercial, 456 - Industrial',
    meterSerial: 'MT654321789',
    lastReadingDate: '2024-08-25',
    photoQuality: 'EXCELLENT',
    ocrAccuracy: 96,
    gpsAccuracy: 'HIGH',
    reasoning: 'Aumento gradual no consumo. Cliente comercial com expansão recente.',
    similarCases: 12,
    historicalData: [2100, 2200, 2150, 2300, 2850],
    urgencyReasons: ['Perfil comercial alterado', 'Crescimento acelerado']
  },
  {
    id: 'PND003',
    clientCode: '12345678',
    clientName: 'Indústria Metalúrgica SC',
    clientType: 'INDUSTRIAL',
    consumptionReading: 15200,
    avgConsumption: 18500,
    variation: -17.8,
    riskLevel: 'MEDIUM',
    slaHours: 12,
    aiDecision: 'TO_ANALYST',
    confidence: 0.87,
    createdAt: '2024-09-25T07:45:00Z',
    region: 'Joinville',
    address: 'Distrito Industrial, Lote 15',
    meterSerial: 'MT987654321',
    lastReadingDate: '2024-08-25',
    photoQuality: 'POOR',
    ocrAccuracy: 78,
    gpsAccuracy: 'MEDIUM',
    reasoning: 'Redução significativa no consumo industrial. Possível parada de equipamentos.',
    similarCases: 6,
    historicalData: [18000, 18500, 19200, 17800, 15200],
    urgencyReasons: ['Padrão industrial alterado', 'Qualidade de foto baixa']
  },
  {
    id: 'PND004',
    clientCode: '98765432',
    clientName: 'Maria Aparecida Costa',
    clientType: 'RESIDENTIAL',
    consumptionReading: 180,
    avgConsumption: 250,
    variation: -28.0,
    riskLevel: 'LOW',
    slaHours: 24,
    aiDecision: 'TO_ANALYST',
    confidence: 0.76,
    createdAt: '2024-09-25T06:20:00Z',
    region: 'Blumenau',
    address: 'Rua Harmonia, 789 - Vila Nova',
    meterSerial: 'MT456789123',
    lastReadingDate: '2024-08-25',
    photoQuality: 'GOOD',
    ocrAccuracy: 89,
    gpsAccuracy: 'HIGH',
    reasoning: 'Redução no consumo residencial. Cliente pode estar viajando.',
    similarCases: 15,
    historicalData: [240, 250, 265, 230, 180],
    urgencyReasons: ['Padrão sazonal atípico']
  },
  {
    id: 'PND005',
    clientCode: '11223344',
    clientName: 'Supermercado Central',
    clientType: 'COMMERCIAL',
    consumptionReading: 4200,
    avgConsumption: 3800,
    variation: 10.5,
    riskLevel: 'LOW',
    slaHours: 48,
    aiDecision: 'TO_ANALYST',
    confidence: 0.65,
    createdAt: '2024-09-24T22:30:00Z',
    region: 'Chapecó',
    address: 'Centro Comercial, Loja 12',
    meterSerial: 'MT789123456',
    lastReadingDate: '2024-08-25',
    photoQuality: 'GOOD',
    ocrAccuracy: 94,
    gpsAccuracy: 'HIGH',
    reasoning: 'Leve aumento no consumo comercial. Dentro da variação esperada.',
    similarCases: 22,
    historicalData: [3700, 3800, 3850, 3750, 4200],
    urgencyReasons: ['Baixa confiança IA', 'Necessita validação humana']
  }
];

// Enhanced AI resolved cases with more variety
const mockAIResolvedCases = [
  {
    id: '001-ai',
    clientCode: '45123901',
    clientName: 'Carlos Eduardo Lima',
    clientType: 'RESIDENTIAL',
    consumptionReading: 450,
    avgConsumption: 380,
    variation: 18.4,
    riskLevel: 'MEDIUM',
    aiDecision: 'AUTO_APPROVED',
    confidence: 0.92,
    resolvedAt: '2024-09-25T08:15:00Z',
    region: 'Florianópolis',
    reasoning: 'Consumo dentro do padrão sazonal (inverno). Histórico consistente.',
    autoActions: ['Foto validada por OCR', 'Geolocalização confirmada', 'Padrão sazonal identificado'],
    processingTime: '23s'
  },
  {
    id: '002-ai',
    clientCode: '78945612',
    clientName: 'Distribuidora ABC Ltda',
    clientType: 'COMMERCIAL',
    consumptionReading: 1250,
    avgConsumption: 1180,
    variation: 5.9,
    riskLevel: 'LOW',
    aiDecision: 'AUTO_APPROVED',
    confidence: 0.96,
    resolvedAt: '2024-09-25T07:32:00Z',
    region: 'São José',
    reasoning: 'Variação mínima. Cliente comercial com consumo estável.',
    autoActions: ['Perfil comercial identificado', 'Histórico validado', 'Medidor funcionando normalmente'],
    processingTime: '18s'
  },
  {
    id: '003-ai',
    clientCode: '32165498',
    clientName: 'Antônio Souza',
    clientType: 'RESIDENTIAL',
    consumptionReading: 89,
    avgConsumption: 320,
    variation: -72.2,
    riskLevel: 'HIGH',
    aiDecision: 'REQUEST_READING',
    confidence: 0.89,
    resolvedAt: '2024-09-25T06:45:00Z',
    region: 'Blumenau',
    reasoning: 'Queda acentuada no consumo. Possível problema no medidor.',
    autoActions: ['Solicitação de releitura gerada', 'Técnico notificado', 'Prioridade: Alta'],
    processingTime: '31s'
  },
  {
    id: '004-ai',
    clientCode: '55667788',
    clientName: 'Fábrica de Móveis SC',
    clientType: 'INDUSTRIAL',
    consumptionReading: 22500,
    avgConsumption: 21800,
    variation: 3.2,
    riskLevel: 'LOW',
    aiDecision: 'AUTO_APPROVED',
    confidence: 0.94,
    resolvedAt: '2024-09-25T05:20:00Z',
    region: 'Joinville',
    reasoning: 'Consumo industrial estável. Variação dentro da margem esperada.',
    autoActions: ['Perfil industrial validado', 'Equipamentos em operação normal', 'Faturamento aprovado'],
    processingTime: '15s'
  },
  {
    id: '005-ai',
    clientCode: '99887766',
    clientName: 'Hotel Vista Mar',
    clientType: 'COMMERCIAL',
    consumptionReading: 3200,
    avgConsumption: 2800,
    variation: 14.3,
    riskLevel: 'MEDIUM',
    aiDecision: 'AUTO_APPROVED',
    confidence: 0.88,
    resolvedAt: '2024-09-24T23:10:00Z',
    region: 'Florianópolis',
    reasoning: 'Aumento sazonal típico de hotel (alta temporada). Padrão reconhecido.',
    autoActions: ['Padrão sazonal hoteleiro identificado', 'Taxa de ocupação correlacionada', 'Aprovado automaticamente'],
    processingTime: '27s'
  }
];

// Complete historical data combining all cases
const generateHistoricalCases = () => {
  const allCases = [];

  // Add pending cases with analyst decisions
  mockPendingCases.forEach(pCase => {
    // Create multiple historical versions with different statuses
    const baseCase = { ...pCase };

    // Current pending
    allCases.push({
      ...baseCase,
      status: 'PENDING',
      finalDecision: null,
      analystName: null,
      resolvedAt: null
    });

    // Some resolved versions from previous months
    if (Math.random() > 0.3) {
      allCases.push({
        ...baseCase,
        id: baseCase.id + '-HIST1',
        status: 'APPROVED',
        finalDecision: 'APPROVED',
        analystName: 'Ana Costa',
        resolvedAt: '2024-08-15T14:30:00Z',
        createdAt: '2024-08-15T10:15:00Z',
        justification: 'Análise confirmou consumo sazonal válido'
      });
    }
  });

  // Add AI resolved cases
  mockAIResolvedCases.forEach(aiCase => {
    allCases.push({
      ...aiCase,
      status: 'AI_RESOLVED',
      finalDecision: aiCase.aiDecision === 'AUTO_APPROVED' ? 'APPROVED' : 'REQUEST_READING',
      analystName: 'IA Sistema',
      resolvedAt: aiCase.resolvedAt
    });
  });

  // Generate additional historical data
  for (let i = 0; i < 20; i++) {
    const clientTypes = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'];
    const regions = ['Florianópolis', 'São José', 'Blumenau', 'Joinville', 'Chapecó'];
    const statuses = ['APPROVED', 'REJECTED', 'REQUEST_READING', 'AI_RESOLVED'];
    const analysts = ['Ana Costa', 'Pedro Silva', 'Maria Santos', 'IA Sistema'];

    const randomDate = new Date(2024, Math.floor(Math.random() * 9), Math.floor(Math.random() * 28));

    allCases.push({
      id: `HIST${i + 100}`,
      clientCode: String(Math.floor(Math.random() * 90000000) + 10000000),
      clientName: `Cliente Histórico ${i + 1}`,
      clientType: clientTypes[Math.floor(Math.random() * clientTypes.length)],
      consumptionReading: Math.floor(Math.random() * 5000) + 100,
      avgConsumption: Math.floor(Math.random() * 4000) + 200,
      variation: (Math.random() - 0.5) * 100,
      riskLevel: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'][Math.floor(Math.random() * 4)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      finalDecision: statuses[Math.floor(Math.random() * 3)],
      analystName: analysts[Math.floor(Math.random() * analysts.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      createdAt: randomDate.toISOString(),
      resolvedAt: new Date(randomDate.getTime() + Math.random() * 86400000 * 2).toISOString(),
      confidence: Math.random() * 0.4 + 0.6,
      processingTime: `${Math.floor(Math.random() * 300) + 10}s`
    });
  }

  return allCases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const mockAISuggestion = {
  decision: 'TO_ANALYST',
  confidence: 0.84,
  reasoning: [
    'Leitura 23% acima da média histórica',
    'Foto com qualidade adequada (OCR 89%)',
    'Serial do medidor confere',
    'Consumo fora do padrão sazonal',
    'Cliente sem histórico de irregularidades'
  ],
  suggestedJustification: 'Variação significativa no consumo requer análise humana',
  similarCases: 5,
  previousDecisions: {
    approve: 60,
    reject: 20,
    requestReading: 20
  }
};

const mockAIStats = {
  totalProcessed: 1247,
  autoResolved: 1089,
  automationRate: 87.3,
  avgConfidence: 0.94,
  humanReviewRequired: 158,
  accuracy: 96.8
};

export default function AnalistaPage() {
  const { currentUser } = useAuthStore();
  const { activeInvoiceId, setActiveInvoice } = useUIStore();
  const [selectedTab, setSelectedTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [clientTypeFilter, setClientTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  // Modal states
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | 'reeval' | null;
    invoiceId: string | null;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: null,
    invoiceId: null,
    title: '',
    description: ''
  });

  // Loading states
  const [processingCases, setProcessingCases] = useState<Record<string, string>>({});
  const [reEvaluatingCases, setReEvaluatingCases] = useState<Record<string, boolean>>({});

  // Detail modal state
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    caseData: any;
  }>({
    isOpen: false,
    caseData: null
  });

  const allHistoricalCases = useMemo(() => generateHistoricalCases(), []);

  const filteredHistoricalCases = useMemo(() => {
    return allHistoricalCases.filter(case_ => {
      const matchesSearch =
        case_.clientCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.clientName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'pending' && case_.status === 'PENDING') ||
        (statusFilter === 'ai_resolved' && case_.status === 'AI_RESOLVED') ||
        (statusFilter === 'approved' && case_.finalDecision === 'APPROVED') ||
        (statusFilter === 'rejected' && case_.finalDecision === 'REJECTED') ||
        (statusFilter === 'request_reading' && case_.finalDecision === 'REQUEST_READING');

      const matchesRegion = regionFilter === 'all' || case_.region === regionFilter;
      const matchesClientType = clientTypeFilter === 'all' || case_.clientType === clientTypeFilter;
      const matchesRisk = riskFilter === 'all' || case_.riskLevel === riskFilter;

      const matchesDate = !dateFilter || case_.createdAt?.startsWith(dateFilter);

      return matchesSearch && matchesStatus && matchesRegion && matchesClientType && matchesRisk && matchesDate;
    });
  }, [allHistoricalCases, searchTerm, statusFilter, regionFilter, clientTypeFilter, riskFilter, dateFilter]);

  const handleResolve = async (invoiceId: string, decision: string, justification?: string) => {
    if (decision === 'REQUEST_READING') {
      // Handle re-evaluation with AI simulation
      setReEvaluatingCases(prev => ({ ...prev, [invoiceId]: true }));

      // Simulate AI re-evaluation process
      setTimeout(async () => {
        setReEvaluatingCases(prev => ({ ...prev, [invoiceId]: false }));
        setProcessingCases(prev => ({ ...prev, [invoiceId]: 'AI_RESOLVED' }));

        // Simulate showing AI result after processing
        setTimeout(() => {
          const aiDecisions = ['AUTO_APPROVED', 'NEEDS_MANUAL_REVIEW', 'REQUEST_ANOTHER_READING'];
          const randomDecision = aiDecisions[Math.floor(Math.random() * aiDecisions.length)];
          const confidence = (Math.random() * 0.3 + 0.7).toFixed(2); // 70-100% confidence

          setProcessingCases(prev => {
            const updated = { ...prev };
            updated[invoiceId] = `${randomDecision}_${confidence}`;
            return updated;
          });
        }, 1500);
      }, 3000);
      return;
    }

    // For approve/reject, set processing status
    setProcessingCases(prev => ({ ...prev, [invoiceId]: decision }));

    // Close modal
    setConfirmationModal({
      isOpen: false,
      type: null,
      invoiceId: null,
      title: '',
      description: ''
    });

    console.log('Resolving invoice:', invoiceId, decision, justification);
  };

  const openConfirmationModal = (type: 'approve' | 'reject' | 'reeval', invoiceId: string, caseData?: any) => {
    let title = '';
    let description = '';

    switch (type) {
      case 'approve':
        title = 'Confirmar Aprovação';
        description = `Tem certeza que deseja aprovar o caso ${invoiceId}?\nCliente: ${caseData?.clientName}\nConsumo: ${caseData?.consumptionReading} kWh`;
        break;
      case 'reject':
        title = 'Confirmar Rejeição';
        description = `Tem certeza que deseja rejeitar o caso ${invoiceId}?\nCliente: ${caseData?.clientName}\nEsta ação marcará a leitura como suspeita.`;
        break;
      case 'reeval':
        title = 'Solicitar Reavaliação da IA';
        description = `Deseja solicitar uma nova análise da IA para o caso ${invoiceId}?\nCliente: ${caseData?.clientName}\nA IA será executada novamente com dados atualizados.`;
        break;
    }

    setConfirmationModal({
      isOpen: true,
      type,
      invoiceId,
      title,
      description
    });
  };

  const handleModalConfirm = () => {
    if (confirmationModal.invoiceId && confirmationModal.type) {
      const decision = confirmationModal.type === 'approve' ? 'APPROVE' :
                     confirmationModal.type === 'reject' ? 'REJECT' : 'REQUEST_READING';
      handleResolve(confirmationModal.invoiceId, decision);
    }
  };

  const openDetailModal = (caseData: any) => {
    setDetailModal({
      isOpen: true,
      caseData
    });
  };

  const closeDetailModal = () => {
    setDetailModal({
      isOpen: false,
      caseData: null
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'REQUEST_READING': return 'bg-blue-100 text-blue-800';
      case 'AI_RESOLVED': return 'bg-purple-100 text-purple-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case 'RESIDENTIAL': return <HomeIcon className="w-4 h-4" />;
      case 'COMMERCIAL': return <BuildingIcon className="w-4 h-4" />;
      case 'INDUSTRIAL': return <FactoryIcon className="w-4 h-4" />;
      default: return <HomeIcon className="w-4 h-4" />;
    }
  };

  const getSlaUrgency = (hours: number) => {
    if (hours <= 2) return 'bg-red-100 text-red-800';
    if (hours <= 8) return 'bg-orange-100 text-orange-800';
    if (hours <= 24) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with AI Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BrainIcon className="h-6 w-6 text-purple-600" />
                  Workbench de Análise Inteligente
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  Sistema híbrido IA + Analista para críticas de faturamento
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800">
                  <SparklesIcon className="w-3 h-3 mr-1" />
                  IA Ativa
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  {mockAIStats.automationRate}% Automação
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{mockAIStats.autoResolved}</div>
              <div className="text-sm text-gray-600">Casos resolvidos pela IA hoje</div>
              <div className="text-xs text-green-600 mt-1">
                ↑ {mockAIStats.accuracy}% precisão
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CpuIcon className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{mockAIStats.autoResolved}</div>
                <div className="text-sm text-gray-600">Auto Resolvidos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserIcon className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{mockPendingCases.length}</div>
                <div className="text-sm text-gray-600">Análise Manual</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ZapIcon className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{mockAIStats.avgConfidence * 100}%</div>
                <div className="text-sm text-gray-600">Confiança Média</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{mockAIStats.accuracy}%</div>
                <div className="text-sm text-gray-600">Precisão IA</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertTriangleIcon className="w-4 h-4" />
            Análise Necessária ({mockPendingCases.length})
          </TabsTrigger>
          <TabsTrigger value="ai-resolved" className="flex items-center gap-2">
            <CpuIcon className="w-4 h-4" />
            Resolvidos pela IA ({mockAIResolvedCases.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileCheckIcon className="w-4 h-4" />
            Histórico ({allHistoricalCases.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-4">
            {mockPendingCases.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getClientTypeIcon(invoice.clientType)}
                          <div>
                            <h3 className="font-semibold text-lg">Cliente: {invoice.clientCode}</h3>
                            <p className="text-sm text-gray-600">{invoice.clientName}</p>
                            <p className="text-xs text-gray-500">{invoice.address} - {invoice.region}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(invoice.riskLevel)}>
                            {invoice.riskLevel}
                          </Badge>
                          <Badge className={getSlaUrgency(invoice.slaHours)}>
                            <ClockIcon className="w-3 h-3 mr-1" />
                            SLA: {invoice.slaHours}h
                          </Badge>
                        </div>
                      </div>

                      {/* Enhanced consumption info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{invoice.consumptionReading}</div>
                          <div className="text-xs text-gray-600">Leitura Atual</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-600">{invoice.avgConsumption}</div>
                          <div className="text-xs text-gray-600">Média Histórica</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${invoice.variation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {invoice.variation > 0 ? '+' : ''}{invoice.variation.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-600">Variação</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{invoice.ocrAccuracy}%</div>
                          <div className="text-xs text-gray-600">OCR</div>
                        </div>
                      </div>

                      {/* AI Suggestion Panel */}
                      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <BrainIcon className="w-5 h-5 text-purple-600 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-purple-800">Análise da IA</h4>
                                <Badge className="bg-purple-100 text-purple-800">
                                  {(invoice.confidence * 100).toFixed(0)}% confiança
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                <div className="text-sm">
                                  <strong>Recomendação:</strong> {invoice.reasoning}
                                </div>

                                <div className="text-sm">
                                  <strong>Urgência:</strong>
                                  {invoice.urgencyReasons.map((reason, idx) => (
                                    <span key={idx} className="ml-1 text-orange-700">
                                      {reason}{idx < invoice.urgencyReasons.length - 1 ? ', ' : ''}
                                    </span>
                                  ))}
                                </div>

                                <details className="text-sm">
                                  <summary className="cursor-pointer text-purple-600 hover:text-purple-800">
                                    Ver histórico de consumo
                                  </summary>
                                  <div className="mt-2 flex items-center gap-2">
                                    {invoice.historicalData.map((value, idx) => (
                                      <div key={idx} className={`px-2 py-1 rounded text-xs ${
                                        idx === invoice.historicalData.length - 1
                                          ? 'bg-red-100 text-red-800 font-bold'
                                          : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        {value}
                                      </div>
                                    ))}
                                  </div>
                                </details>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {/* Show status if case is processed */}
                      {processingCases[invoice.id] && !reEvaluatingCases[invoice.id] ? (
                        <div className="flex flex-col gap-2">
                          {processingCases[invoice.id] === 'APPROVE' && (
                            <Badge className="bg-green-100 text-green-800 justify-center py-2">
                              <CheckCircleIcon className="w-4 h-4 mr-2" />
                              Aprovado
                            </Badge>
                          )}
                          {processingCases[invoice.id] === 'REJECT' && (
                            <Badge className="bg-red-100 text-red-800 justify-center py-2">
                              <XCircleIcon className="w-4 h-4 mr-2" />
                              Rejeitado
                            </Badge>
                          )}
                          {processingCases[invoice.id] === 'AI_RESOLVED' && (
                            <Badge className="bg-purple-100 text-purple-800 justify-center py-2">
                              <CpuIcon className="w-4 h-4 mr-2" />
                              Processando IA...
                            </Badge>
                          )}
                          {processingCases[invoice.id]?.startsWith('AUTO_APPROVED') && (
                            <div className="space-y-1">
                              <Badge className="bg-green-100 text-green-800 justify-center py-2">
                                <SparklesIcon className="w-4 h-4 mr-2" />
                                IA: Aprovado
                              </Badge>
                              <p className="text-xs text-gray-600 text-center">
                                Confiança: {processingCases[invoice.id].split('_')[1]}%
                              </p>
                            </div>
                          )}
                          {processingCases[invoice.id]?.startsWith('NEEDS_MANUAL_REVIEW') && (
                            <div className="space-y-1">
                              <Badge className="bg-yellow-100 text-yellow-800 justify-center py-2">
                                <AlertTriangleIcon className="w-4 h-4 mr-2" />
                                IA: Revisar
                              </Badge>
                              <p className="text-xs text-gray-600 text-center">
                                Confiança: {processingCases[invoice.id].split('_')[1]}%
                              </p>
                            </div>
                          )}
                          {processingCases[invoice.id]?.startsWith('REQUEST_ANOTHER_READING') && (
                            <div className="space-y-1">
                              <Badge className="bg-blue-100 text-blue-800 justify-center py-2">
                                <RefreshCcwIcon className="w-4 h-4 mr-2" />
                                IA: Nova Leitura
                              </Badge>
                              <p className="text-xs text-gray-600 text-center">
                                Confiança: {processingCases[invoice.id].split('_')[1]}%
                              </p>
                            </div>
                          )}
                        </div>
                      ) : reEvaluatingCases[invoice.id] ? (
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled
                          >
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Reavaliando...
                          </Button>
                          <p className="text-xs text-gray-600 text-center">
                            A IA está analisando novamente...
                          </p>
                        </div>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => openConfirmationModal('approve', invoice.id, invoice)}
                          >
                            <ThumbsUpIcon className="w-4 h-4 mr-2" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openConfirmationModal('reject', invoice.id, invoice)}
                          >
                            <ThumbsDownIcon className="w-4 h-4 mr-2" />
                            Rejeitar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openConfirmationModal('reeval', invoice.id, invoice)}
                          >
                            <RotateCcwIcon className="w-4 h-4 mr-2" />
                            Releitura
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-resolved">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CpuIcon className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Casos Resolvidos Automaticamente pela IA</h3>
              <Badge className="bg-green-100 text-green-800">Últimas 24h</Badge>
            </div>

            {mockAIResolvedCases.map((aiCase) => (
              <Card key={aiCase.id} className="border-l-4 border-green-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getClientTypeIcon(aiCase.clientType)}
                          <div>
                            <h3 className="font-semibold text-lg">Cliente: {aiCase.clientCode}</h3>
                            <p className="text-sm text-gray-600">{aiCase.clientName}</p>
                            <p className="text-xs text-gray-500">{aiCase.region}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(aiCase.aiDecision)}>
                            {aiCase.aiDecision === 'AUTO_APPROVED' ? 'APROVADO' : 'RELEITURA'}
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800">
                            {(aiCase.confidence * 100).toFixed(0)}% confiança
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{aiCase.consumptionReading}</div>
                          <div className="text-xs text-gray-600">Leitura</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${aiCase.variation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {aiCase.variation > 0 ? '+' : ''}{aiCase.variation.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-600">Variação</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{aiCase.processingTime}</div>
                          <div className="text-xs text-gray-600">Processamento</div>
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-600 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-medium text-green-800 mb-1">Resolução Automática</h4>
                            <p className="text-sm text-green-700 mb-2">{aiCase.reasoning}</p>

                            <div className="space-y-1">
                              <div className="text-xs text-green-600 font-medium">Ações executadas:</div>
                              {aiCase.autoActions.map((action, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-green-700">
                                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                  <span>{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDetailModal(aiCase)}
                      >
                        <EyeIcon className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {/* Advanced Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="relative">
                    <SearchIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Buscar cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="approved">Aprovados</SelectItem>
                      <SelectItem value="rejected">Rejeitados</SelectItem>
                      <SelectItem value="request_reading">Releitura</SelectItem>
                      <SelectItem value="ai_resolved">IA Resolvidos</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Região" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Florianópolis">Florianópolis</SelectItem>
                      <SelectItem value="São José">São José</SelectItem>
                      <SelectItem value="Blumenau">Blumenau</SelectItem>
                      <SelectItem value="Joinville">Joinville</SelectItem>
                      <SelectItem value="Chapecó">Chapecó</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo Cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="RESIDENTIAL">Residencial</SelectItem>
                      <SelectItem value="COMMERCIAL">Comercial</SelectItem>
                      <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Risco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="LOW">Baixo</SelectItem>
                      <SelectItem value="MEDIUM">Médio</SelectItem>
                      <SelectItem value="HIGH">Alto</SelectItem>
                      <SelectItem value="URGENT">Urgente</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Historical Cases */}
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-4">
                Mostrando {filteredHistoricalCases.length} de {allHistoricalCases.length} casos
              </div>

              {filteredHistoricalCases.map((historicalCase) => (
                <Card key={historicalCase.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          {getClientTypeIcon(historicalCase.clientType)}
                          <div>
                            <div className="font-medium">{historicalCase.clientCode}</div>
                            <div className="text-sm text-gray-600">{historicalCase.clientName}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(historicalCase.status || historicalCase.finalDecision)}>
                            {historicalCase.status === 'AI_RESOLVED' ? 'IA' :
                             historicalCase.finalDecision === 'APPROVED' ? 'APROVADO' :
                             historicalCase.finalDecision === 'REJECTED' ? 'REJEITADO' :
                             historicalCase.finalDecision === 'REQUEST_READING' ? 'RELEITURA' :
                             'PENDENTE'}
                          </Badge>

                          <Badge variant="outline" className={getPriorityColor(historicalCase.riskLevel).replace('bg-', 'border-').replace('text-', 'text-')}>
                            {historicalCase.riskLevel}
                          </Badge>
                        </div>

                        <div className="text-sm text-gray-600">
                          <div>{historicalCase.region}</div>
                          <div className="text-xs">
                            {new Date(historicalCase.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className={`font-medium ${historicalCase.variation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {historicalCase.variation > 0 ? '+' : ''}{historicalCase.variation.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">Variação</div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <div className="font-medium">{historicalCase.analystName}</div>
                          <div className="text-xs">
                            {historicalCase.resolvedAt ?
                              new Date(historicalCase.resolvedAt).toLocaleDateString('pt-BR') :
                              'Pendente'
                            }
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDetailModal(historicalCase)}
                      >
                        <EyeIcon className="w-4 h-4 mr-2" />
                        Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleModalConfirm}
        title={confirmationModal.title}
        description={confirmationModal.description}
        confirmText={
          confirmationModal.type === 'approve' ? 'Aprovar' :
          confirmationModal.type === 'reject' ? 'Rejeitar' :
          confirmationModal.type === 'reeval' ? 'Solicitar Reavaliação' : 'Confirmar'
        }
        variant={
          confirmationModal.type === 'reject' ? 'destructive' :
          confirmationModal.type === 'approve' ? 'success' : 'default'
        }
      />

      {/* Case Detail Modal */}
      <CaseDetailModal
        isOpen={detailModal.isOpen}
        onClose={closeDetailModal}
        caseData={detailModal.caseData}
      />
    </div>
  );
}