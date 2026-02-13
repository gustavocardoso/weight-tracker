# 🏋️ Weight Tracker - Guia de Início

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação:**
   Abra seu navegador em: `http://localhost:3000`

## 📱 Primeiro Acesso

1. Clique em **"Não tem conta? Registre-se"**
2. Preencha:
   - Nome (ex: João Silva)
   - Username (ex: joao)
   - Senha
3. Clique em **"Criar Conta"**
4. Você será redirecionado para o dashboard

## 📊 Como Usar o Dashboard

### Adicionar Peso
1. Clique no botão **"Adicionar Peso"**
2. Selecione a data
3. Digite seu peso em kg (ex: 75.5)
4. Adicione notas opcionais
5. Clique em **"Salvar"**

### Visualizar Histórico
- **Gráfico**: Mostra a evolução do peso ao longo do tempo
- **Cards de Estatísticas**:
  - Peso Atual (com comparação ao anterior)
  - Peso Mínimo registrado
  - Peso Máximo registrado
- **Lista de Registros**: Todos os pesos registrados com opção de excluir

### Múltiplos Usuários
- Cada usuário tem seu próprio perfil e dados
- Para trocar de usuário, clique em **"Sair"** e faça login com outra conta
- Os dados são completamente separados por usuário

## 🎨 Recursos

✅ Interface moderna e responsiva (funciona em mobile)
✅ Gráfico interativo com Recharts
✅ Autenticação segura com bcrypt
✅ Banco de dados SQLite local
✅ Sistema de múltiplos perfis
✅ Proteção de rotas com middleware
✅ Design com Tailwind CSS
✅ TypeScript para segurança de tipos

## 🗄️ Banco de Dados

O arquivo `weight-tracker.db` será criado automaticamente na raiz do projeto.
Ele contém todas as contas de usuários e registros de peso.

## 🔒 Segurança

- Senhas são criptografadas com bcrypt
- Sessões são armazenadas em cookies HTTP-only
- Rotas protegidas por middleware
- Validação de dados no backend

## 📦 Build para Produção

```bash
npm run build
npm start
```

A aplicação estará disponível em modo produção em `http://localhost:3000`
