# Weight Tracker

Aplicação web para tracking de peso pessoal com múltiplos perfis.

## Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **SQLite** - Banco de dados local
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos
- **Bcrypt** - Criptografia de senhas

## Características

- ✅ Múltiplos perfis com login e senha
- ✅ Dashboard com histórico visual de peso
- ✅ Gráfico interativo de evolução
- ✅ Registro de peso por dia
- ✅ Estatísticas (peso atual, mínimo e máximo)
- ✅ Interface moderna e responsiva
- ✅ Banco de dados local SQLite

## Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## Uso

1. Na primeira vez, clique em "Registre-se" para criar uma conta
2. Faça login com seu username e senha
3. No dashboard, clique em "Adicionar Peso" para registrar seu peso
4. Acompanhe sua evolução pelo gráfico e estatísticas

## Estrutura

```
weight-tracker/
├── app/
│   ├── api/          # Rotas da API
│   ├── dashboard/    # Página do dashboard
│   ├── login/        # Página de login/registro
│   └── globals.css   # Estilos globais
├── components/       # Componentes reutilizáveis
├── lib/             # Utilitários e configurações
└── weight-tracker.db # Banco de dados SQLite
```

## Banco de Dados

O banco de dados SQLite é criado automaticamente na primeira execução com as seguintes tabelas:

- **users**: Armazena os perfis de usuário
- **weights**: Armazena os registros de peso

Cada usuário pode ter apenas um registro de peso por dia (constraint UNIQUE).
