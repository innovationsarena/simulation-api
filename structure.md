# Simulator API Architecture

## Overview

The Simulator API follows a **layered architecture** with **domain-driven design** principles, organized for scalable AI-powered agent simulations.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                       │
├─────────────────────┬───────────────────────┬───────────────────┤
│      Routes         │     Controllers       │    Middleware     │
│   - Validation      │   - Request/Response  │   - Error Handler │
│   - Authentication  │   - Business Logic    │   - CORS/Helmet   │
└─────────────────────┴───────────────────────┴───────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Service Layer                           │
├─────────────┬───────────────┬─────────────┬───────────────────── │
│   Agents    │ Conversations │ Discussions │    Evaluations      │
│ ┌─────────┐ │ ┌───────────┐ │ ┌─────────┐ │ ┌─────────────────┐ │
│ │Operations│ │ │Operations │ │ │Operations│ │ │    BFI-2        │ │
│ │Generator │ │ │Workers    │ │ └─────────┘ │ │  Personality    │ │
│ │Parser    │ │ └───────────┘ │             │ │   Testing       │ │
│ │Actions   │ │               │             │ └─────────────────┘ │
│ └─────────┘ │               │             │                     │
└─────────────┴───────────────┴─────────────┴─────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Infrastructure Layer                       │
├─────────────────┬─────────────────┬─────────────────────────────┤
│      Core       │   External      │      Background Jobs        │
│ ┌─────────────┐ │ ┌─────────────┐ │ ┌─────────────────────────┐ │
│ │Types/Models │ │ │  Supabase   │ │ │     BullMQ + Redis      │ │
│ │Error Handler│ │ │   Client    │ │ │                         │ │
│ │Utilities    │ │ │             │ │ │ ┌─────────────────────┐ │ │
│ └─────────────┘ │ │ ┌─────────┐ │ │ │ │  Conversation       │ │ │
│                 │ │ │AI SDKs  │ │ │ │ │    Workers          │ │ │
│                 │ │ │- OpenAI │ │ │ │ │                     │ │ │
│                 │ │ │- Claude │ │ │ │ │ ┌─────────────────┐ │ │ │
│                 │ │ │- Google │ │ │ │ │ │   Evaluation    │ │ │ │
│                 │ │ └─────────┘ │ │ │ │   Workers       │ │ │ │
│                 │ └─────────────┘ │ │ └─────────────────┘ │ │ │
│                 │                 │ └─────────────────────────┘ │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

## Directory Structure

```
simulator-api/
│
├── src/
│   ├── controllers/           # 🎮 Request Handlers
│   │   ├── agent.controller.ts
│   │   ├── conversation.controller.ts
│   │   ├── discussion.controller.ts
│   │   ├── evalutation.controller.ts
│   │   └── simulation.controller.ts
│   │
│   ├── routes/                # 🛣️  API Routes & Validation
│   │   ├── agent.route.ts
│   │   ├── conversation.route.ts
│   │   ├── discussion.route.ts
│   │   ├── evaluation.route.ts
│   │   └── simulation.route.ts
│   │
│   ├── services/              # 🏗️  Business Logic Layer
│   │   ├── agents/            # 🤖 Agent Management
│   │   │   ├── index.ts
│   │   │   ├── operations/
│   │   │   ├── generator/
│   │   │   ├── parser/
│   │   │   └── actions/
│   │   │
│   │   ├── conversations/     # 💬 Conversation Handling
│   │   │   ├── index.ts
│   │   │   ├── operations/
│   │   │   └── workers/
│   │   │
│   │   ├── discussions/       # 🗣️  Group Discussions
│   │   │   └── operations/
│   │   │
│   │   ├── evaluations/       # 📊 Personality Testing
│   │   │   ├── bfi2.ts
│   │   │   └── workers/
│   │   │
│   │   ├── messages/          # 📝 Message Operations
│   │   │   └── operations/
│   │   │
│   │   ├── simulations/       # 🎯 Simulation Orchestration
│   │   │   └── operations/
│   │   │
│   │   └── tools/             # 🔧 AI-Powered Tools
│   │
│   ├── core/                  # 🏛️  Shared Infrastructure
│   │   ├── types/             # 📋 Type Definitions
│   │   ├── utils/             # 🛠️  Utilities & Error Handling
│   │   └── supabase/          # 🗄️  Database Client
│   │
│   └── docs/                  # 📚 API Documentation
│
├── docker-compose.yml         # 🐳 Container Orchestration
├── Dockerfile                 # 📦 Container Definition
└── package.json              # 📋 Dependencies & Scripts
```

## Service Layer Analysis

### 🔍 **Current Service Organization**

```
Services Consistency Analysis:

agents/          ████████████████ (Complex)
├── operations/  ✓
├── generator/   ✓
├── parser/      ✓
└── actions/     ✓

conversations/   ████████ (Standard)
├── operations/  ✓
└── workers/     ✓

discussions/     ████ (Simple)
└── operations/  ✓

evaluations/     ██████ (Specialized)
├── bfi2.ts      ✓
└── workers/     ✓

messages/        ████ (Simple)
└── operations/  ✓

simulations/     ████ (Simple)
└── operations/  ✓
```

### ✅ **Consistent Patterns**

- All services export through `index.ts`
- Operations layer always present
- Workers used for async processing
- Error handling follows `asyncHandler` pattern

### ⚠️ **Inconsistencies Found**

- **Agent service**: 4 sub-modules vs others with 1-2
- **File naming**: Some use plural, others singular
- **Worker patterns**: Only conversations and evaluations use workers

## Data Flow Diagrams

### 🔄 **Conversation Processing Flow**

```
┌─────────────┐    HTTP POST     ┌──────────────────┐
│   Client    │ ───────────────► │  Route Handler   │
└─────────────┘                  │  (Validation)    │
                                 └──────────────────┘
                                          │
                                          ▼
                                 ┌──────────────────┐
                                 │   Controller     │
                                 │ ┌──────────────┐ │
                                 │ │ createConv   │ │
                                 │ │ Controller() │ │
                                 │ └──────────────┘ │
                                 └──────────────────┘
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
                          ▼               ▼               ▼
                 ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
                 │   Agent     │  │Simulation   │  │Conversation │
                 │  Service    │  │  Service    │  │   Service   │
                 └─────────────┘  └─────────────┘  └─────────────┘
                          │               │               │
                          └───────────────┼───────────────┘
                                          │
                                          ▼
                                ┌──────────────────┐
                                │   Queue Job      │
                                │ ┌──────────────┐ │
                                │ │ conversationId│ │
                                │ │ participants │ │
                                │ └──────────────┘ │
                                └──────────────────┘
                                          │
                                          ▼
                      ┌──────────────────────────────────────┐
                      │           Background Worker          │
                      │ ┌──────────────────────────────────┐ │
                      │ │  1. Parse Agent Prompts         │ │
                      │ │  2. Generate AI Response        │ │
                      │ │  3. Create Message               │ │
                      │ │  4. Update Conversation State   │ │
                      │ └──────────────────────────────────┘ │
                      └──────────────────────────────────────┘
                                          │
                                          ▼
                               ┌──────────────────┐
                               │    Supabase      │
                               │   Database       │
                               └──────────────────┘
```

### 🧠 **AI Integration Flow**

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│    Agent    │────▶│    Parser    │────▶│  AI Model   │
│ Personality │     │   Service    │     │  (OpenAI/   │
│   Profile   │     │              │     │  Claude/    │
└─────────────┘     └──────────────┘     │  Google)    │
                            │            └─────────────┘
                            ▼                    │
                   ┌──────────────┐              │
                   │ System Prompt│◄─────────────┘
                   │  Generation  │
                   └──────────────┘
                            │
                            ▼
                   ┌──────────────┐
                   │   Response   │
                   │  Processing  │
                   └──────────────┘
                            │
                            ▼
                   ┌──────────────┐
                   │   Message    │
                   │   Storage    │
                   └──────────────┘
```

### 📊 **Evaluation Processing Flow**

```
┌─────────────┐                    ┌──────────────────┐
│  API Call   │───── Queue Job ───▶│  Evaluation      │
│ /evaluate   │                    │    Worker        │
└─────────────┘                    └──────────────────┘
                                            │
                                            ▼
                                   ┌──────────────────┐
                                   │  BFI-2 Prompt    │
                                   │   Generation     │
                                   └──────────────────┘
                                            │
                                            ▼
                                   ┌──────────────────┐
                                   │   AI Provider    │
                                   │  (Agent Model)   │
                                   └──────────────────┘
                                            │
                                            ▼
                                   ┌──────────────────┐
                                   │   Score         │
                                   │ Calculation     │
                                   └──────────────────┘
                                            │
                                            ▼
                                   ┌──────────────────┐
                                   │  Result Storage  │
                                   │  (Agent Update)  │
                                   └──────────────────┘
```

## Technology Integration

### 🗄️ **Database Layer (Supabase)**

```
┌─────────────────────────────────────────────────────────────────┐
│                        Supabase Tables                          │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   simulations   │    agents       │       conversations         │
│ ┌─────────────┐ │ ┌─────────────┐ │ ┌─────────────────────────┐ │
│ │ - id        │ │ │ - id        │ │ │ - id                    │ │
│ │ - name      │ │ │ - name      │ │ │ - simulationId          │ │
│ │ - topic     │ │ │ - personality│ │ │ - participants[]        │ │
│ │ - state     │ │ │ - objectives│ │ │ - active                │ │
│ └─────────────┘ │ │ - state     │ │ │ - activeSpeakerId      │ │
│                 │ └─────────────┘ │ └─────────────────────────┘ │
├─────────────────┼─────────────────┼─────────────────────────────┤
│   discussions   │    messages     │         bfi_results         │
│ ┌─────────────┐ │ ┌─────────────┐ │ ┌─────────────────────────┐ │
│ │ - id        │ │ │ - id        │ │ │ - email (agentId)       │ │
│ │ - topic     │ │ │ - content   │ │ │ - answers[]             │ │
│ │ - minRounds │ │ │ - senderId  │ │ │ - score                 │ │
│ │ - active    │ │ │ - parentId  │ │ └─────────────────────────┘ │
│ └─────────────┘ │ │ - parentType│ │                             │
│                 │ └─────────────┘ │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

### ⚡ **Queue System (BullMQ + Redis)**

```
┌─────────────────────────────────────────────────────────────────┐
│                       Queue Architecture                        │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │  Conversation   │    │   Evaluation    │    │    Redis    │  │
│  │     Queues      │    │     Queue       │    │   Storage   │  │
│  │                 │    │                 │    │             │  │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────┐ │  │
│  │ │Dynamic Queue│ │    │ │Static Queue │ │    │ │Job Data │ │  │
│  │ │per Convo ID │ │    │ │"evaluations"│ │    │ │Results  │ │  │
│  │ └─────────────┘ │    │ └─────────────┘ │    │ │Config   │ │  │
│  │                 │    │                 │    │ └─────────┘ │  │
│  └─────────────────┘    └─────────────────┘    └─────────────┘  │
│           │                       │                     │       │
│           ▼                       ▼                     ▼       │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │  Conversation   │    │   Evaluation    │    │   Health    │  │
│  │    Workers      │    │    Workers      │    │  Monitoring │  │
│  │                 │    │                 │    │             │  │
│  │ • Auto-scale    │    │ • BFI-2 Tests   │    │ • Job Stats │  │
│  │ • Message Gen   │    │ • Score Calc    │    │ • Failed    │  │
│  │ • State Update  │    │ • Agent Update  │    │ • Retries   │  │
│  └─────────────────┘    └─────────────────┘    └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 🤖 **AI Provider Integration**

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI Provider Abstraction                     │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                    Agent Configuration                      │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │ │
│ │ │ provider:   │ │ model:      │ │ settings:               │ │ │
│ │ │ "openai"    │ │ "gpt-4o"    │ │ - temperature: 0.5      │ │ │
│ │ └─────────────┘ └─────────────┘ │ - messageToken: 500     │ │ │
│ │                                 │ - systemPrompt: dynamic │ │ │
│ │                                 └─────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                 │                               │
│                                 ▼                               │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                  AI SDK Routing                             │ │
│ │                                                             │ │
│ │   openai() ────┬──── @ai-sdk/openai ──── OpenAI API       │ │
│ │                │                                            │ │
│ │   anthropic()──┼──── @ai-sdk/anthropic ── Anthropic API   │ │
│ │                │                                            │ │
│ │   google() ────┴──── @ai-sdk/google ──── Google AI API    │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                 │                               │
│                                 ▼                               │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │              Response Processing                            │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │ │
│ │ │ Text        │ │ Token Usage │ │ Error Handling          │ │ │
│ │ │ Generation  │ │ Tracking    │ │ & Retries               │ │ │
│ │ └─────────────┘ └─────────────┘ └─────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Recommended Architecture Improvements

### 1. 🏗️ **Standardize Service Structure**

```
services/[domain]/
├── index.ts              # Export gateway
├── operations/           # CRUD & business logic
│   ├── create.ts
│   ├── read.ts
│   ├── update.ts
│   └── delete.ts
├── workers/             # Background processing (if needed)
│   └── processor.ts
├── types/               # Domain-specific types
│   └── index.ts
└── utils/               # Domain utilities
    └── helpers.ts
```

### 2. 🗄️ **Repository Pattern Implementation**

```
core/
├── database/
│   ├── repositories/
│   │   ├── AgentRepository.ts
│   │   ├── SimulationRepository.ts
│   │   └── ConversationRepository.ts
│   ├── migrations/
│   └── types/
```

### 3. ⚙️ **Configuration Management**

```
core/
├── config/
│   ├── database.ts      # Supabase configuration
│   ├── ai-providers.ts  # AI SDK configurations
│   ├── redis.ts         # Queue configuration
│   ├── server.ts        # Fastify configuration
│   └── index.ts         # Unified config export
```

### 4. 📊 **Event-Driven Architecture**

```
core/
├── events/
│   ├── emitter.ts       # Event emitter setup
│   ├── handlers/        # Event handlers
│   └── types.ts         # Event type definitions
```

## Security & Deployment

### 🔐 **Security Measures**

- **Helmet**: Security headers
- **CORS**: Cross-origin configuration
- **Environment Variables**: Sensitive data protection
- **Input Validation**: Zod schema validation
- **Error Sanitization**: Secure error responses

### 🐳 **Containerization**

- **Docker**: Multi-stage build optimization
- **Docker Compose**: Development environment
- **Redis**: Persistent queue storage
- **Health Checks**: Service dependency management

## Performance Considerations

### ⚡ **Async Processing**

- Background workers for long-running tasks
- Queue-based message processing
- Non-blocking AI integrations

### 📈 **Scalability**

- Stateless service design
- Horizontal worker scaling
- Redis-based state management
- Database connection pooling

---

**Architecture Score: B+ (Good with room for improvement)**

**Strengths:**

- Clear layer separation
- Effective async processing
- Comprehensive AI integration
- Strong type safety

**Areas for Improvement:**

- Service structure standardization
- Repository pattern implementation
- Event-driven capabilities
- Testing infrastructure
