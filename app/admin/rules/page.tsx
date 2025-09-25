'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  BrainIcon,
  RulerIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  SettingsIcon
} from 'lucide-react';

interface AIRule {
  id: string;
  name: string;
  description: string;
  category: 'consumption' | 'photo' | 'geolocation' | 'historical' | 'fraud';
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
  confidence: number;
  trigger: string;
  action: 'auto_approve' | 'flag_review' | 'escalate' | 'reject';
  parameters: Record<string, any>;
  executionsToday: number;
  successRate: number;
  lastModified: string;
}

const mockRules: AIRule[] = [
  {
    id: '1',
    name: 'Consumo Dentro da Faixa Esperada',
    description: 'Libera automaticamente faturas com consumo dentro de ±15% da média histórica',
    category: 'consumption',
    priority: 'high',
    isActive: true,
    confidence: 92,
    trigger: 'consumption_variance <= 15%',
    action: 'auto_approve',
    parameters: { variance_threshold: 15, historical_months: 6 },
    executionsToday: 234,
    successRate: 98.2,
    lastModified: '2024-01-14 16:30:00'
  },
  {
    id: '2',
    name: 'Detecção de Foto Ilegível',
    description: 'Solicita releitura quando a qualidade da foto está baixa',
    category: 'photo',
    priority: 'medium',
    isActive: true,
    confidence: 87,
    trigger: 'photo_quality < 70% OR ocr_confidence < 80%',
    action: 'flag_review',
    parameters: { quality_threshold: 70, ocr_threshold: 80 },
    executionsToday: 45,
    successRate: 94.7,
    lastModified: '2024-01-12 14:20:00'
  },
  {
    id: '3',
    name: 'Consumo Anômalo Alto',
    description: 'Escala casos com consumo 300% acima da média histórica',
    category: 'consumption',
    priority: 'high',
    isActive: true,
    confidence: 95,
    trigger: 'consumption_increase >= 300%',
    action: 'escalate',
    parameters: { increase_threshold: 300, alert_level: 'critical' },
    executionsToday: 8,
    successRate: 100,
    lastModified: '2024-01-10 09:15:00'
  },
  {
    id: '4',
    name: 'Validação Geográfica',
    description: 'Verifica se a coleta foi feita na localização correta',
    category: 'geolocation',
    priority: 'medium',
    isActive: true,
    confidence: 89,
    trigger: 'distance_from_uc > 100m',
    action: 'flag_review',
    parameters: { max_distance: 100, gps_accuracy_required: 10 },
    executionsToday: 67,
    successRate: 91.8,
    lastModified: '2024-01-13 11:45:00'
  },
  {
    id: '5',
    name: 'Detecção de Fraude Padrão',
    description: 'Identifica padrões suspeitos de consumo que podem indicar fraude',
    category: 'fraud',
    priority: 'high',
    isActive: false,
    confidence: 78,
    trigger: 'consecutive_low_readings >= 3 AND consumption_drop > 50%',
    action: 'escalate',
    parameters: { consecutive_readings: 3, drop_threshold: 50 },
    executionsToday: 0,
    successRate: 85.3,
    lastModified: '2024-01-08 13:20:00'
  }
];

export default function RulesPage() {
  const [rules, setRules] = useState<AIRule[]>(mockRules);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [newRuleDialog, setNewRuleDialog] = useState(false);

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || rule.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleRuleStatus = (ruleId: string) => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'consumption': return <RulerIcon className="w-4 h-4" />;
      case 'photo': return <BrainIcon className="w-4 h-4" />;
      case 'geolocation': return <SettingsIcon className="w-4 h-4" />;
      case 'fraud': return <AlertTriangleIcon className="w-4 h-4" />;
      default: return <CheckCircleIcon className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'consumption': return 'bg-blue-500';
      case 'photo': return 'bg-green-500';
      case 'geolocation': return 'bg-yellow-500';
      case 'fraud': return 'bg-red-500';
      case 'historical': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'auto_approve': return 'Liberar Automaticamente';
      case 'flag_review': return 'Marcar para Revisão';
      case 'escalate': return 'Escalar';
      case 'reject': return 'Rejeitar';
      default: return action;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Regras de IA</h1>
          <p className="text-muted-foreground">
            Configure e gerencie as regras do sistema de decisão automática
          </p>
        </div>
        <Dialog open={newRuleDialog} onOpenChange={setNewRuleDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Nova Regra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Regra de IA</DialogTitle>
              <DialogDescription>
                Configure uma nova regra para o sistema de decisão automática.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-name">Nome da Regra</Label>
                  <Input id="rule-name" placeholder="Digite o nome da regra" />
                </div>
                <div>
                  <Label htmlFor="rule-category">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consumption">Consumo</SelectItem>
                      <SelectItem value="photo">Foto/OCR</SelectItem>
                      <SelectItem value="geolocation">Geolocalização</SelectItem>
                      <SelectItem value="fraud">Fraude</SelectItem>
                      <SelectItem value="historical">Histórico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="rule-description">Descrição</Label>
                <Textarea
                  id="rule-description"
                  placeholder="Descreva o que esta regra faz..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-priority">Prioridade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rule-action">Ação</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a ação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto_approve">Liberar Automaticamente</SelectItem>
                      <SelectItem value="flag_review">Marcar para Revisão</SelectItem>
                      <SelectItem value="escalate">Escalar</SelectItem>
                      <SelectItem value="reject">Rejeitar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="rule-trigger">Condição de Ativação</Label>
                <Input
                  id="rule-trigger"
                  placeholder="Ex: consumption_variance <= 15%"
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewRuleDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setNewRuleDialog(false)}>
                  Criar Regra
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Regras</CardTitle>
            <BrainIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
            <p className="text-xs text-muted-foreground">
              4 ativas, 1 inativa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execuções Hoje</CardTitle>
            <PlayIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">354</div>
            <p className="text-xs text-muted-foreground">
              +12% vs. ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">96.8%</div>
            <p className="text-xs text-muted-foreground">
              Média geral
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regras Inativas</CardTitle>
            <PauseIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar regras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="consumption">Consumo</SelectItem>
                <SelectItem value="photo">Foto/OCR</SelectItem>
                <SelectItem value="geolocation">Geolocalização</SelectItem>
                <SelectItem value="fraud">Fraude</SelectItem>
                <SelectItem value="historical">Histórico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${getCategoryColor(rule.category)} rounded-lg flex items-center justify-center`}>
                    {getCategoryIcon(rule.category)}
                    <span className="sr-only">{rule.category}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <CardDescription>{rule.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getPriorityColor(rule.priority)}>
                    {rule.priority === 'high' ? 'Alta' : rule.priority === 'medium' ? 'Média' : 'Baixa'}
                  </Badge>
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => toggleRuleStatus(rule.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Confiança</p>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${rule.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{rule.confidence}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Execuções Hoje</p>
                  <p className="text-xl font-bold">{rule.executionsToday}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-xl font-bold text-green-600">{rule.successRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ação</p>
                  <Badge variant="outline">{getActionLabel(rule.action)}</Badge>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <p className="text-sm text-muted-foreground mb-1">Condição de Ativação:</p>
                <code className="text-sm font-mono">{rule.trigger}</code>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Última modificação: {rule.lastModified}
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <EditIcon className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}