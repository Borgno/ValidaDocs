🏗️ Master Architecture Blueprint (validaDocs)
[SYSTEM DIRECTIVE PARA O AGENTE GERADOR DE CÓDIGO (IA)]: Este é o Documento de Arquitetura de Software e System Design do projeto "validaDocs". Você DEVE atuar como um Desenvolvedor Sênior e seguir ESTRITAMENTE as regras de Design Patterns, separação de responsabilidades (SRP) e Bounded Contexts aqui descritos. Nenhuma decisão arquitetural deve divergir deste documento. O foco é resiliência, alta disponibilidade no processamento assíncrono e tipagem forte.

## 1. 🛠️ Tech Stack & Infrastructure
O sistema opera sob o paradigma de arquitetura Orientada a Eventos (Event-Driven) no contexto de background jobs, utilizando Server-Side Rendering (SSR) para a camada de visualização.

Core Framework: React Router v7 (Framework Mode / Node.js).

Linguagem: TypeScript (Strict mode habilitado, tipagem end-to-end).

Relational Database & ORM: PostgreSQL com Prisma ORM (Exclusivo para persistência de metadados e controle de estado transacional).

Object Storage (Blob): MinIO (S3-Compatible API) interagindo via @aws-sdk/client-s3.

Message Broker / Job Queue: Redis acoplado ao BullMQ (Gerenciamento de fila assíncrona, retry policies e fallback).

Data Extraction & Manipulation: pdf-lib (PDF split/merge), pdf-parse (OCR/Text Extraction), xlsx (Excel parser), fuse.js (Fuzzy matching engine).

Authentication: HttpOnly Cookies (React Router Session Storage).

## 2. 📂 Advanced Directory Structure (Separation of Concerns)
O design system exige um isolamento drástico entre a camada HTTP (Rotas), a camada de Serviço (Infra/I/O) e a camada de Domínio (Regras de Negócio).

Plaintext
app/
├── components/     # Dumb components (Stateless), UI elements puros.
├── domain/         # CORE BUSINESS LOGIC. Funções puras, sem dependência de I/O, Node ou Framework.
│   ├── conciliacao/  # Regras específicas do fluxo "Comprovantes e Excel FAT".
│   └── comprovantes/ # Regras específicas do fluxo "Comprovantes FAT".
├── hooks/          # Custom React Hooks (State management da UI).
├── jobs/           # Definição das Filas (Queues) do BullMQ e Job Producers.
├── workers/        # Job Consumers (Daemons do BullMQ que processam a lógica pesada isolados da UI).
├── routes/         # Controllers HTTP (loaders/actions). Não devem conter regras de negócio.
├── services/       # Adaptadores de Infraestrutura (Prisma Client, MinIO S3 Client, Auth).
├── types/          # DTOs, Interfaces e tipagens globais do TypeScript.
├── utils/          # Parsers genéricos (ex: formatadores de string, sanitização de arquivos).
├── views/          # Smart components (Pages) injetadas pelos routes.
├── root.tsx        # React Router Root.
└── routes.ts       # Router Config Mapping.
## 3. 🗄️ Database Schema Design (Prisma)
A modelagem prioriza a rastreabilidade (Audit Trail) dos documentos e o ciclo de vida no Object Storage.

Snippet de código
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String     @id @default(uuid()) @db.VarChar(255)
  username     String     @unique @db.VarChar(255)
  password     String     @db.VarChar(255) // Bcrypt Hash
  documents    Document[] 

  @@map("users")
}

enum DocumentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

enum AutomationType {
  CONCILIACAO_CTE
  COMPROVANTE_FAT
}

model Document {
  id                  String         @id @default(uuid()) @db.VarChar(255)
  userId              String         @map("user_id") @db.VarChar(255)
  
  // Rastreabilidade do Arquivo
  originalName        String         @map("original_name") @db.VarChar(255)
  processedName       String?        @map("processed_name") @db.VarChar(255) 
  originalStorageKey  String         @map("original_storage_key") @db.VarChar(500)
  processedStorageKey String?        @map("processed_storage_key") @db.VarChar(500)
  
  // Metadados do Job
  status              DocumentStatus @default(PENDING)
  automationType      AutomationType @map("automation_type")
  extractedData       Json?          @map("extracted_data") // Payload dinâmico (Match Fuse.js, CTE, Valores)
  errorMessage        String?        @map("error_message") @db.Text
  
  // Timestamps para TTL/Lifecycle Policy (MinIO purge tracking)
  createdAt           DateTime       @default(now()) @map("created_at")
  processedAt         DateTime?      @map("processed_at")
  
  user                User           @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, status])
  @@map("documents")
}
## 4. ⚙️ Domain & Business Logic (Bounded Contexts)
A IA deve implementar os seguintes fluxos nos Workers/Domínio de forma estrita.

### Fluxo 1: CONCILIACAO_CTE (PDF Múltiplo + Excel)
Objetivo: Fatiar um PDF unificado, extrair texto via pdf-parse, ler dados da planilha via xlsx, cruzar ambos e renomear com o CTE correspondente.

Mecanismo de Match (Engine): Utilizar fuse.js para fuzzy matching na coluna Nome da planilha versus o nome extraído do Regex no PDF. Aplicar Threshold rigoroso (ex: 0.3) e validação estrita do Valor_Pago (Match exato de Float).

Regex Core (PDF): Nome Destinatário:\s*(.+)/i e Valor Total \(R\$\):\s*([\d\.,]+)/i.

Output: Gerar novos PDFs fatiados via pdf-lib no formato comprovante pag CTE {CTE}.pdf (ou Fallback para "Nao encontrado"). Upload imediato no MinIO path /processed.

Fluxo 2: COMPROVANTE_FAT (PDF Simples)
Objetivo: Extração direta e sanitização simples.

Mecanismo: Baixar PDF -> Extrair texto bruto via pdf-parse -> Fazer split por nova linha \n.

Lógica Core: O nome final do arquivo é exatamente o índice [1] (segunda linha) do array resultante do split, após o uso do método .trim().

Output: Upload no MinIO e atualização de status.

## 5. 🧩 Padrões de Implementação (Code Blueprints)
### 5.1. A Camada de Rota (I/O e Delegação)
A action da rota NUNCA processa dados. Apenas persiste o binário (Idempotência) e enfileira (Producer).

TypeScript
// Exemplo: app/routes/conciliacao.tsx
import { uploadToMinIO } from "../services/storage.server";
import { enqueueJob } from "../jobs/queue.server";

export async function action({ request }: { request: Request }) {
  // ... extração de form-data (PDF + Excel)
  const pdfKey = await uploadToMinIO(pdfFile, `raw/pdf-${id}.pdf`);
  const excelKey = await uploadToMinIO(excelFile, `raw/xls-${id}.xlsx`);
  
  const docRecord = await createDocumentRecord({ 
     automationType: "CONCILIACAO_CTE", 
     originalStorageKey: pdfKey, 
     /* ... */ 
  });
  
  // Producer aciona o Message Broker
  await enqueueJob("process-conciliacao", { documentId: docRecord.id, excelKey });
  return { success: true };
}

### 5.2. A Camada do Worker (BullMQ Consumer)
Garante resiliência e tratamento de falhas isolado.

TypeScript
// Exemplo: app/workers/conciliacaoWorker.server.ts
import { Worker, Job } from "bullmq";
import { redisConnection } from "../services/redis.server";
import { processConciliacaoLogic } from "../domain/conciliacao/engine";

export const conciliacaoWorker = new Worker(
  "DocumentQueue",
  async (job: Job) => {
    const { documentId, excelKey } = job.data;
    try {
      await updateStatus(documentId, "PROCESSING");
      // 1. Download File Streams from MinIO
      // 2. Passa Streams para a Função de Domínio Puro
      const result = await processConciliacaoLogic(pdfBuffer, excelBuffer);
      // 3. Upload novos artefatos para MinIO
      // 4. Update DB status to COMPLETED
    } catch (error) {
      await updateStatus(documentId, "FAILED", error.message);
    }
  },
  { connection: redisConnection, concurrency: 2 } // Limita a 2 jobs paralelos para não estourar RAM
);

### 5.3. A Camada de Domínio Puro (Sem side-effects)
TypeScript
// Exemplo: app/domain/comprovantes/extractor.ts
export function extractFatName(rawText: string): string {
  if (!rawText) throw new Error("Empty PDF text payload");
  
  const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error("Invalid format: Cannot read line index 1");

  const rawName = lines[1];
  return sanitizeFileName(`${rawName}.pdf`);
}