# Weight Tracker - Features Roadmap

> Mantendo a simplicidade como base do projeto

## ✅ Features Implementadas

- [x] Múltiplos perfis com login e senha
- [x] Dashboard com histórico visual de peso
- [x] Gráfico interativo de evolução
- [x] Registro de peso por dia
- [x] Estatísticas (peso atual, mínimo e máximo)
- [x] Interface moderna e responsiva
- [x] Banco de dados local SQLite

---

## 📋 Features Planejadas

### 🎯 Quick Wins (Alta prioridade)

- [x] **Meta de peso** - Definir objetivo e ver % de progresso
  - ✅ Adicionado campo "goal_weight" na tabela users
  - ✅ Mostrado indicador visual no dashboard
  - ✅ Calculado e exibido % de progresso
  - ✅ Card com formulário de definição de meta
  - ✅ Barra de progresso com cores purple/pink
  - ✅ Mensagem de parabéns ao atingir meta

- [x] **Editar/Deletar registros** - Corrigir ou remover pesos registrados
  - ✅ Adicionados botões de edição/exclusão nos registros
  - ✅ API endpoints para UPDATE (PUT) e DELETE
  - ✅ Confirmação antes de deletar
  - ✅ Edição inline com formulário compacto
  - ✅ Botões aparecem ao hover

- [x] **Filtro de período** - Visualizar diferentes períodos no gráfico
  - ✅ Botões: 7 dias, 30 dias, 90 dias, Tudo
  - ✅ Filtrar dados do gráfico dinamicamente
  - ✅ Ajustar estatísticas conforme período
  - ✅ Indicador de quantidade de registros no período

### 📊 Visualização & Análise

- [ ] **Média móvel** - Linha de tendência no gráfico
  - Calcular média dos últimos 7 dias
  - Adicionar linha tracejada no gráfico
  - Toggle para mostrar/ocultar

- [ ] **Comparação de períodos** - Esta semana vs semana passada
  - Card com comparação de períodos
  - Indicador de ganho/perda
  - Percentual de variação

- [ ] **Gráfico de variação** - Mostrar ganho/perda diária
  - Gráfico de barras com diferença entre dias
  - Cores: verde (perda), vermelho (ganho)

### 📝 Registro de Dados

- [ ] **Notas em registros** - Adicionar contexto aos registros
  - Campo opcional "note" na tabela weights
  - Input de texto ao registrar peso
  - Exibir notas nos cards de histórico

- [ ] **Medidas corporais** - Tracking adicional opcional
  - Tabela "measurements" (cintura, braço, etc)
  - Interface para registrar medidas
  - Gráficos separados por medida

- [ ] **Horário do registro** - Registrar hora além da data
  - Adicionar timestamp completo
  - Útil para ver padrões (manhã vs noite)

### 🎯 Motivação & Gamificação

- [ ] **Streak counter** - Dias consecutivos registrando
  - Calcular sequência de dias com registro
  - Badge visual no dashboard
  - Mensagem motivacional

- [ ] **Conquistas simples** - Marcos de progresso
  - Primeira semana completa
  - 30 dias de registro
  - Meta atingida
  - Maior perda de peso

- [ ] **Resumo semanal/mensal** - Insights automáticos
  - Card com resumo do período
  - Total perdido/ganho
  - Dias registrados
  - Média do período

### 🎨 Experiência do Usuário

- [ ] **Modo dark/light** - Tema alternável
  - Toggle no header
  - Persistir preferência (localStorage)
  - Usar lucide-react icons

- [ ] **Unidade de medida** - kg ou lbs
  - Configuração por usuário
  - Conversão automática
  - Adicionar campo "unit" na tabela users

- [ ] **Primeira vez UX** - Onboarding suave
  - Tela de boas-vindas
  - Tutorial rápido (opcional)
  - Sugestão de definir meta

### 📤 Dados & Exportação

- [ ] **Export CSV** - Baixar histórico completo
  - Botão "Exportar dados"
  - Gerar CSV com todos os registros
  - Nome do arquivo: username_weights_YYYY-MM-DD.csv

- [ ] **Import CSV** - Importar dados externos
  - Upload de arquivo CSV
  - Validação de formato
  - Preview antes de importar

- [ ] **Backup/Restore** - Segurança dos dados
  - Download do banco completo
  - Restaurar de backup

### 🔔 Notificações & Lembretes

- [ ] **Lembrete de pesagem** - Notificação browser
  - Configurar horário preferido
  - Usar Notification API
  - Toggle on/off por usuário

- [ ] **Lembrete de inatividade** - Se não registrar há X dias
  - Notificação/email (futuro)
  - Mensagem motivacional

### 📱 Melhorias Mobile

- [ ] **PWA** - Instalável como app
  - Manifest.json
  - Service Worker
  - Ícones e splash screen

- [ ] **Offline mode** - Funcionar sem internet
  - Cache de assets
  - Sincronizar quando online

---

## 🚀 Próximos Passos

1. Começar com **Quick Wins** (meta, editar/deletar, filtros)
2. Implementar features de **Motivação**
3. Adicionar **Export/Import** de dados
4. Melhorar **UX** (dark mode, onboarding)
5. Transformar em **PWA**

---

## 📝 Notas de Desenvolvimento

### Princípios
- Manter código simples e legível
- Uma feature por vez
- Testar antes de mergear
- Documentar mudanças no README

### Tecnologias Atuais
- Next.js 15
- TypeScript
- SQLite (better-sqlite3)
- Tailwind CSS
- Recharts
- Lucide React (icons)

---

**Última atualização:** 2026-02-13

## 📝 Changelog

### 2026-02-13 - Quick Wins Completos ✅
- ✅ Implementada feature de **Meta de Peso** com card dedicado, barra de progresso e indicador visual
- ✅ Implementada feature de **Editar/Deletar Registros** com edição inline e confirmação de exclusão
- ✅ Implementada feature de **Filtro de Período** (7, 30, 90 dias, Tudo) com atualização dinâmica de gráfico e estatísticas
