# CELESC IA - Sistema de Críticas

Preview navegável de um sistema web para tratamento de **faturas em crítica** integrado ao contexto SAP S/4HANA IS-U (simulado), com perfis de acesso, telas-chave, dados mockados e interações reais de UI.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para visualizar a aplicação.

## 📱 Demo & Funcionalidades

### Perfis Implementados

1. **🔵 Leiturista (Carlos Silva - Norte)**
   - Interface mobile-first
   - Rota do dia com coletas pendentes
   - Sistema de releituras com priorização
   - Simulação de modo offline com fila de sincronização

2. **🟢 Analista de Críticas (Pedro Oliveira - Norte)**
   - Workbench completo em uma tela
   - Fila de críticas com filtros avançados
   - Painel de caso com 4 abas: Resumo, Fotos & OCR, Histórico, Cadastro
   - Sugestões da IA com nível de confiança
   - Actions panel: Liberar, Solicitar Releitura, Ajuste Cadastral, Escalar

3. **🟣 Administrador (Roberto Admin)**
   - Gestão de usuários e permissões (mockado)
   - Configuração de regras de decisão
   - Auditoria de eventos
   - Status de integrações (SAP, OCR, MLOps)

4. **🟡 Gestor/Comercial (Helena Gestora)**
   - Dashboard executivo com KPIs
   - Gráficos de tendência histórica
   - Performance dos analistas
   - Alertas e notificações

### 🧠 "Cérebro de Críticas" (Decision Engine)

Sistema de sugestões automáticas baseado em regras:

- **Foto de baixa qualidade** → Solicitar releitura
- **Serial não confere** → Ajuste cadastral
- **Alto risco (>0.8)** → Análise humana
- **SLA vencido** → Prioridade máxima
- **Consumo padrão** → Liberação automática

## 🏗️ Arquitetura Técnica

### Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** TailwindCSS + shadcn/ui + Lucide React
- **Charts:** Recharts (implementação mockada)
- **State:** React Query (mock APIs) + Zustand (UI state)
- **Design:** Dark mode, responsivo, mobile-first

### Estrutura do Projeto

```
app/
├── _types/          # TypeScript definitions
├── _mocks/          # Dados simulados (75 faturas)
├── _services/       # APIs mockadas com React Query
├── _state/          # Estado global (auth + UI)
├── leiturista/      # Páginas do Leiturista
├── analista/        # Workbench do Analista
├── admin/           # Painel administrativo
├── gestor/          # Dashboard executivo
└── globals.css      # Estilos TailwindCSS

components/
├── ui/              # shadcn/ui components
└── layout/          # Layout e navegação
```

### 📊 Dados Mockados

- **75 faturas** com distribuição por região e status
- **Evidências de leitura** com validações OCR/Geo
- **6 usuários** com diferentes papéis
- **5 regras** de decisão ativas
- **150 eventos** de auditoria
- **KPIs e métricas** históricas

## 🎯 Principais Features Implementadas

### ✅ Sistema de Perfis
- Seletor visual de perfil
- Menu adaptativo por papel
- Controle de acesso baseado em roles

### ✅ Leiturista Mobile-First
- Lista de rota com status e priorização
- Interface de coleta com simulação OCR
- Modo offline com fila de sincronização
- Releituras com análise de SLA

### ✅ Workbench do Analista
- Fila de críticas com filtros avançados
- Painel de caso com abas de informação
- Sugestões da IA com reasoning
- Actions panel para tomada de decisão

### ✅ Dashboard do Gestor
- KPIs executivos com variações
- Gráficos de tendência histórica
- Performance individual dos analistas
- Sistema de alertas

### ✅ UX & Design
- Dark mode funcional
- Sidebar colapsável
- Design system consistente
- Responsividade completa
- Loading states e empty states

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run start    # Servidor produção
npm run lint     # Linting
```

## 🎨 Customização

### Temas
O sistema suporta dark mode através do TailwindCSS. O tema pode ser alternado através do switch no header.

### Dados Mock
Para customizar os dados, edite os arquivos em `app/_mocks/`:
- `invoices.ts` - Faturas e críticas
- `users.ts` - Usuários e perfis
- `kpi.ts` - Métricas e KPIs

### Regras de Decisão
As regras podem ser editadas em `app/_services/decision-engine.ts` para simular diferentes comportamentos da IA.

## 📝 Notas de Implementação

- **Sem backend real**: Todas as APIs são simuladas com React Query
- **Sem integrações externas**: SAP, OCR e mapas são mockados
- **Foco em UX**: Prioriza demonstração de fluxo e usabilidade
- **Dados realistas**: Baseados no contexto SAP IS-U da CELESC

## 🚧 Próximos Passos (Não Implementados)

- [ ] Admin: CRUD completo de usuários e regras
- [ ] Integração real com APIs
- [ ] Testes automatizados
- [ ] PWA para leituristas
- [ ] Relatórios em PDF
- [ ] Notificações push

---

**Desenvolvido como preview demonstrativo do sistema CELESC IA**