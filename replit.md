# Vibe Drinks - Bebidas Premium & Drinks

## Visão Geral
Plataforma de e-commerce para bebidas premium com sistema de delivery, gerenciamento de pedidos e controle de estoque.

## Configuração Atual

### Banco de Dados
- **Tipo**: Supabase PostgreSQL
- **Versão**: PostgreSQL 15+
- **Conexão**: SUPABASE_DATABASE_URL (configurada nas variáveis de ambiente)
- **Status**: Sincronizado com Drizzle ORM ✅

### Schema do Banco de Dados
Tabelas implementadas:
- **users** - Gerenciamento de clientes (WhatsApp único)
- **addresses** - Endereços de entrega
- **categories** - Categorias de bebidas
- **products** - Catálogo de produtos
- **orders** - Pedidos com rastreamento
- **orderItems** - Itens dos pedidos
- **motoboys** - Gestão de entregadores
- **deliveryZones** - Zonas de entrega
- **neighborhoods** - Bairros/Regiões
- **stockLogs** - Auditoria de estoque
- **settings** - Configurações da loja
- **banners** - Promoções e banners
- **trendingProducts** - Produtos em destaque
- **shoppingLists** - Listas de compra
- **shoppingListItems** - Itens das listas de compra
- **passwordResetRequests** - Requisições de reset de senha

### Variáveis de Ambiente
Secrets configurados:
- `SUPABASE_DATABASE_URL` - Connection string do banco
- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de acesso do serviço
- `VITE_SUPABASE_ANON_KEY` - Chave anônima para frontend
- `DATABASE_URL` - Fallback (compatibilidade)
- `SESSION_SECRET` - Segurança de sessão
- `NODE_ENV` - Ambiente (development/production)

### Stack Tecnológico
- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Express.js
- **ORM**: Drizzle ORM
- **Banco**: PostgreSQL (Supabase)
- **Autenticação**: Passport.js + WhatsApp
- **Upload**: Multer + Sharp
- **Pagamentos**: PIX, Dinheiro, Cartão

### Arquitetura de Dados

#### Tipos de Dados
- IDs: varchar(36) com UUID (randomUUID())
- Preços: decimal(10,2) com precisão
- Timestamps: Rastreamento automático com defaultNow()
- Status: text (enums de aplicação)
- Dados complexos: JSONB (ex: openingHours)

#### Relacionamentos
- Users → Addresses (1:N, ON DELETE CASCADE)
- Categories → Products (1:N, ON DELETE CASCADE)
- Products → OrderItems (1:N)
- Orders → OrderItems (1:N, ON DELETE CASCADE)
- Orders → Users (N:1)
- Orders → Addresses (N:1)
- Orders → Motoboys (N:1)
- ShoppingLists → ShoppingListItems (1:N, ON DELETE CASCADE)
- TrendingProducts → Products (1:1 unique)

### Como Usar o Banco de Dados

#### Push de Schema
```bash
npm run db:push
```
Sincroniza automaticamente o schema Drizzle com o Supabase.

#### Verificação de Conexão
O servidor testa a conexão ao iniciar:
```bash
npm run dev
```
Log esperado: "Database connection initialized"

#### Queries de Exemplo
Todas as operações são feitas através de `server/storage.ts` que implementa `IStorage`.

### Troubleshooting

**Erro: SUPABASE_DATABASE_URL não encontrada**
- Verifique se a variável está configurada nas secrets
- Format correto: `postgresql://user:password@host:port/database`

**Erro: Conexão SSL recusada**
- A conexão já está configurada com `ssl: { rejectUnauthorized: false }`
- Compatível com Supabase connections

**Erro: Tabelas não criadas**
- Execute: `npm run db:push --force` para sincronização forçada

### Notas Importantes
- O banco é gerenciado através do Supabase Console
- Backups automáticos configurados no Supabase
- Drizzle Kit gerencia todas as migrações
- Compatibilidade total com Supabase Row-Level Security (se ativado)

## Próximos Passos
1. Inserir dados de categorias e produtos via API
2. Configurar permissões Row-Level Security no Supabase (opcional)
3. Testar fluxos de pedido end-to-end
4. Implementar webhooks para notificações
