# ValidaDocs

[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router)](https://reactrouter.com)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Lucide React](https://img.shields.io/badge/Lucide-Icons-F72C5B?logo=lucide)](https://lucide.dev)

O **ValidaDocs** é uma plataforma para processamento, validação e conciliação de documentos e planilhas em larga escala. O sistema oferece uma experiência ágil e intuitiva para a gestão e cruzamento de grandes volumes de dados.

---

## ✨ Funcionalidades Principais

- **🔄 Conciliação de Dados:** Cruzamento de planilhas com documentos, garantindo operações seguras e consistentes (UPSERT/Delete) no banco de dados através de transações do Prisma.
- **📄 Processamento Inteligente de PDF:** Módulo dedicado à leitura e extração automatizada de dados em arquivos PDF, sincronizando as informações diretamente com a interface do usuário em tempo real.
- **⚙️ Filas Assíncronas (BullMQ):** Fila de processamento em background utilizando Redis para auto-save com debounce, processamento de documentos pesados e tarefas em lote, assegurando que a interface nunca fique bloqueada.
- **🎨 UI/UX Premium:** Design imersivo usando o padrão "Mono Blue", componentes *Glassmorphism* (cartões translúcidos com blur), e feedback visual de estados (sucesso, erro, processando).
- **📂 Sistema de Histórico e Lotes:** Controle de lotes e histórico de arquivos importados, com opções de exclusão em massa e pré-visualização de documentos diretamente no navegador via modais interativos.
- **☁️ Integração S3:** Armazenamento resiliente e seguro de ativos documentais em nuvem.

---

## 🛠️ Tech Stack

| Categoria | Tecnologia |
| :--- | :--- |
| **Framework** | React Router v7 (Framework Mode) |
| **Ambiente** | Node.js / Runtime compatível |
| **Linguagem** | TypeScript |
| **Banco de Dados** | PostgreSQL (pg) via Prisma ORM |
| **Background Jobs**| BullMQ & Redis (ioredis) |
| **Processamento**| xlsx (Planilhas) / pdf-lib & pdf-parse (Documentos) |
| **Ícones**| Lucide React |

---

## 📂 Estrutura Arquitetural

```text
├── app/
│   ├── components/        # Componentes UI reutilizáveis e modais
│   ├── domain/            # Lógica de domínio, regras de negócio e extratores de PDF/Excel
│   ├── routes/            # Configuração de rotas de página (Loaders/Actions da API)
│   ├── services/          # Serviços de infraestrutura, banco de dados e mensageria
│   ├── styles/            # Folhas de estilo modularizadas (Vanilla CSS - Mono Blue)
│   ├── views/             # Componentes visuais principais (Conciliacao, ComprovantesFAT)
│   ├── root.tsx           # Entrada principal da aplicação React Router v7
│   ├── routes.ts          # Registro e mapeamento de rotas da aplicação
│   └── types.ts           # Interfaces e definições de tipos TypeScript globais
├── prisma/                # Schema do banco de dados (PostgreSQL)
├── public/                # Ativos e imagens estáticas
└── Dockerfile             # Configuração para deploy conteinerizado em produção
```

---

## 🏁 Primeiros Passos

### Instalação e Execução

1. **Instale as dependências**
   ```bash
   bun i
   ```

2. **Configure o ambiente**
   ```bash
   cp .env.example .env
   ```
   Preencha `SESSION_SECRET` com o resultado de `openssl rand -hex 32`.

3. **Suba a infra local e o banco**
   *(Postgres, Redis e MinIO do `docker-compose.dev.yml`, presos a `127.0.0.1`)*
   ```bash
   bun run infra:up
   bun run db:push
   ```

4. **Crie seu usuário admin** (uma vez)
   ```bash
   bun run create-admin -- seu.nome@empresa.com.br --password suasenha
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   bun run dev
   ```
   Para parar a infra: `bun run infra:down`.

6. **Produção (Dokploy)**
   O `docker-compose.yml` sobe app, banco, Redis e MinIO sem publicar portas: o proxy do Dokploy alcança a app pela porta interna. `SESSION_SECRET` precisa estar no ambiente do Dokploy. Depois do primeiro deploy, crie os admins no terminal do container com `npm run create-admin -- email@empresa.com.br`.

---
