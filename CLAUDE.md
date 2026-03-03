# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with hot reload (nodemon + tsconfig-paths)
npm run build        # Compile TypeScript and resolve path aliases (tsc && tsc-alias)
npm start            # Run compiled production build from dist/
npm test             # Run tests with vitest
npm run test:coverage  # Run tests with coverage
```

## Architecture

This is a **Fastify 5** REST API for running multi-agent simulations. Agents are LLM-powered personas with BigFive personality traits that participate in discussions, conversations, and surveys.

### Path Aliases

Configured in `tsconfig.json`, resolved at runtime by `tsconfig-paths` (dev) and `tsc-alias` (build):
- `@services/*` → `src/services/*`
- `@controllers/*` → `src/controllers/*`
- `@routes/*` → `src/routes/*`
- `@core/*` → `src/core/*`
- `@middlewares/*` → `src/middlewares/*`

### Request Flow

`Route` (schema validation via Zod) → `Controller` (request handling) → `Service` (business logic) → `Operations` (Supabase DB calls)

Routes are in `src/routes/*.route.ts`, controllers in `src/controllers/*.controller.ts`. Each route file defines Zod schemas for request/response validation using `fastify-type-provider-zod`.

### Domain Services (`src/services/`)

Each service follows the pattern: `operations/` for DB/external calls, `workers/` for async BullMQ job handlers.

- **agents/** — Generate and manage AI agents with BigFive personality models. `parser/` converts agent metadata into LLM system prompts. `generator/` creates random agent attributes.
- **interactions/** — Multi-agent conversations. Types: `discussion` (group, moderated by supervisor agent), `conversation` (paired), `survey`. Uses `@voltagent/core` Agent framework with sub-agents for each participant.
- **knowledge/** — RAG pipeline: upload → convert (Docling service) → chunk → embed (OpenAI text-embedding-3-small) → store vectors (Qdrant). `retriever.ts` extends `@voltagent/core` BaseRetriever.
- **simulations/** — Top-level orchestrator that creates agents and interactions.
- **evaluations/** — BigFive personality evaluation via LLM questionnaire.
- **messages/** — Persistence layer for interaction messages.
- **environments/** — Simulation context/constraints configuration.

### Async Processing

BullMQ queues backed by Redis handle long-running tasks:
- `interactionsQueue` — Discussion/conversation orchestration
- `ragQueue` — Knowledge pipeline steps (`knowledge.file.convert`, `knowledge.file.chunk`, `knowledge.file.embeddings`, `knowledge.file.vector`)
- `evaluationsQueue` — BigFive evaluation processing

### Data Layer

- **Supabase** (PostgreSQL) — Primary database via `@supabase/supabase-js`. Client initialized in `src/core/supabase/`. Table names are configured via environment variables.
- **Qdrant** — Vector database for RAG embeddings.
- **Redis** — BullMQ job queue backend.

### Type System

All domain models are Zod schemas in `src/core/types/index.ts` with inferred TypeScript types. Agents have: demographics, organization info, BigFive personality traits (1-10 scale each for openness, conscientiousness, extraversion, agreeableness, neuroticism), and per-agent LLM settings.

### LLM Integration

Uses Vercel AI SDK (`ai`) with provider packages (`@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/mistral`). Default provider/model configured via environment variables. Agent orchestration uses `@voltagent/core`.

### Authentication

Bearer token via `Authorization` header, validated by middleware in `src/middlewares/`. The API key is set via the `API_KEY` env variable.

### API Docs

OpenAPI spec at `src/docs/apispec.yml`, served via `@fastify/swagger-ui`.
