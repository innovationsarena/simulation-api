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
└── tools/       ✓  [UPDATED: renamed from actions]

conversations/   ████████ (Standard)  
├── operations/  ✓
└── workers/     ✓  [ACTIVE: conversationQueue implemented]

discussions/     ████ (Simple)
└── operations/  ✓

evaluations/     ██████ (Specialized)
├── bfi2.ts      ✓  
└── workers/     ✓  [ACTIVE: evaluationsQueue with 50 concurrency]

simulations/     ████ (Standard)
└── operations/  ✓  [ENHANCED: now includes conversation orchestration]
```

### ✅ **Consistent Patterns** [UPDATED]

- All services export through `index.ts`
- Operations layer always present
- Workers implemented for async processing (conversations, evaluations)
- Error handling follows `asyncHandler` pattern
- Queue system standardized with BullMQ + Redis

### ⚠️ **Remaining Inconsistencies**

- **Agent service**: Still has 4 sub-modules vs others with 1-2
- **Worker implementation**: Conversation worker partially implemented (placeholder logic)
- **Queue naming**: "CUEUE_NAME" typo in conversation worker
- **Service exports**: Some services removed from main export (messages, queuesystem)

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
│  │ │Single Queue │ │    │ │Static Queue │ │    │ │Job Data │ │  │
│  │ │"conversationQueue"│ │ │"evaluationsQueue"│ │ │Results  │ │  │
│  │ └─────────────┘ │    │ └─────────────┘ │    │ │Config   │ │  │
│  │ [UPDATED]       │    │ [ACTIVE: 50    │    │ └─────────┘ │  │
│  └─────────────────┘    │  concurrency]  │    └─────────────┘  │
│           │              └─────────────────┘            │       │
│           ▼                       ▼                     ▼       │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │  Conversation   │    │   Evaluation    │    │   Redis     │  │
│  │    Workers      │    │    Workers      │    │ Connection  │  │
│  │                 │    │                 │    │             │  │
│  │ • [TODO] Logic  │    │ • BFI-2 Tests   │    │ • localhost │  │
│  │ • Placeholder   │    │ • Score Calc    │    │ • Port 6379 │  │
│  │ • In Progress   │    │ • Agent Update  │    │ • Health    │  │
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

## Recent Architecture Improvements [UPDATED]

### ✅ **Completed Updates**

1. **Queue System Implementation**
   - `evaluationsQueue`: Fully operational with 50 worker concurrency
   - `conversationQueue`: Infrastructure setup complete
   - Redis connection standardized across workers

2. **Service Organization**
   - Agent service: `actions/` renamed to `tools/` for consistency
   - Simulation service: Enhanced with conversation orchestration logic
   - Service exports streamlined in main index

3. **Error Handling Standardization**
   - All controllers now use `asyncHandler` wrapper
   - Consistent error throwing instead of direct reply handling
   - Centralized error response formatting

### 🔄 **In Progress**

1. **Conversation Worker Logic**
   - Queue infrastructure complete
   - Worker logic placeholder implemented
   - Needs conversation processing implementation

2. **Service Export Cleanup**
   - Messages and queuesystem services removed from exports
   - Core functionality consolidated into main services

### 🐛 **Technical Debt Identified**

- **Queue naming typo**: "CUEUE_NAME" in conversation worker
- **Conversation worker**: Incomplete implementation with TODO comments
- **Service consistency**: Agent service still more complex than others

---

**Architecture Score: B+ → A- (Improving with recent updates)**

**Updated Strengths:**

- Clear layer separation
- **[NEW]** Fully operational queue system for evaluations
- **[ENHANCED]** Comprehensive AI integration with better error handling
- **[IMPROVED]** Standardized async processing patterns
- Strong type safety

**Remaining Areas for Improvement:**

- Complete conversation worker implementation
- Service structure final standardization  
- Repository pattern implementation
- Event-driven capabilities
- Testing infrastructure
