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
│   │   │   └── tools/         # [UPDATED: AI conversation tools]
│   │   │
│   │   ├── conversations/     # 💬 Conversation Handling
│   │   │   ├── index.ts
│   │   │   ├── operations/
│   │   │   └── workers/
│   │   │
│   │   ├── discussions/       # 🗣️  Group Discussions
│   │   │   ├── operations/
│   │   │   └── workers/
│   │   │
│   │   ├── evaluations/       # 📊 Personality Testing
│   │   │   ├── operations/
│   │   │   └── workers/
│   │   │
│   │   ├── messages/          # 📝 Message Operations
│   │   │   ├── operations/
│   │   │   └── workers/
│   │   │
│   │   └── simulations/       # 🎯 Simulation Orchestration
│   │   │   ├── operations/
│   │   │   └── workers/
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
└── tools/       ✓  [UPDATED: AI conversation tools with 4 main functions]

conversations/   ████████ (Standard)  
├── operations/  ✓
└── workers/     ✓  [ACTIVE: conversationQueue + 50 concurrency]

discussions/     ████ (Simple)
├── operations/  ✓
└── workers/     ✓  [PLACEHOLDER: basic structure]

evaluations/     ██████ (Specialized)
├── operations/  ✓
└── workers/     ✓  [ACTIVE: evaluationsQueue with 50 concurrency]

messages/        ████ (Support)
├── operations/  ✓
└── workers/     ✓  [PLACEHOLDER: basic structure]

simulations/     ████ (Standard)
├── operations/  ✓
└── workers/     ✓  [NEW: added worker support]
```

### ✅ **Consistent Patterns** [UPDATED]

- All services export through `index.ts`
- Operations layer always present
- Workers implemented for async processing (conversations, evaluations)
- Error handling follows `asyncHandler` pattern
- Queue system standardized with BullMQ + Redis

### ⚠️ **Remaining Inconsistencies**

- **Agent service**: Still has 4 sub-modules vs others with 2-3
- **Worker implementation**: Some workers have placeholder/basic logic 
- **Service structure**: All services now follow operations + workers pattern

### ✅ **Recently Fixed**

- **AI Tools Enhancement**: Agent tools now include 4 conversation functions:
  - `findConversationPartnerTool`: Find available conversation partners
  - `startConversationTool`: Initialize new conversations
  - `conversateTool`: Continue ongoing conversations
  - `endConversationTool`: Terminate conversations
- **Service structure**: All services now standardized with operations + workers pattern
- **Worker infrastructure**: All services have workers directory (some placeholder)

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
│  │ [ACTIVE: 50     │    │ [ACTIVE: 50    │    │ └─────────┘ │  │
│  │  concurrency]   │    │  concurrency]  │    └─────────────┘  │
│  └─────────────────┘    └─────────────────┘                    │
│           │              └─────────────────┘            │       │
│           ▼                       ▼                     ▼       │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │  Conversation   │    │   Evaluation    │    │   Redis     │  │
│  │    Workers      │    │    Workers      │    │ Connection  │  │
│  │                 │    │                 │    │             │  │
│  │ • [TODO] Logic  │    │ • BFI-2 Tests   │    │ • localhost │  │
│  │ • Placeholder   │    │ • Score Calc    │    │ • Port 6379 │  │
│  │ • 50 Workers    │    │ • Agent Update  │    │ • Health    │  │
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
   - `conversationQueue`: Infrastructure complete with 50 worker concurrency
   - Redis connection standardized across workers

2. **Service Organization**
   - Agent service: `actions/` renamed to `tools/` for consistency
   - Evaluations service: Restructured with `operations/` + `workers/` pattern
   - Conversations service: Now follows standard `operations/` + `workers/` structure
   - Service exports streamlined in main index

3. **Error Handling Standardization**
   - All controllers now use `asyncHandler` wrapper
   - Consistent error throwing instead of direct reply handling
   - Centralized error response formatting

### 🔄 **In Progress**

1. **AI Tool Integration**
   - Agent tools fully implemented with conversation capabilities
   - Tools integrate with queue system for async processing
   - Enhanced agent-to-agent communication workflow

2. **Worker Implementation**
   - All services now have worker infrastructure
   - Some workers have basic/placeholder implementations
   - Queue system operational for conversations and evaluations

### 🐛 **Technical Debt Identified**

- **Worker logic**: Some services have placeholder worker implementations
- **Service consistency**: Agent service architecture more complex than others
- **Tool naming**: Tool functions renamed with "Tool" suffix for clarity

---

**Architecture Score: A- → A (Significant improvements with AI tools and standardization)**

**Current Strengths:**

- **[ENHANCED]** Complete AI tool integration with 4 conversation functions
- **[NEW]** All services follow standardized operations + workers pattern  
- **[IMPROVED]** Queue system operational for async processing
- **[ENHANCED]** Agent-to-agent communication capabilities
- Strong type safety and error handling
- Clear layer separation and service organization

**Remaining Areas for Improvement:**

- Implement placeholder worker logic in discussions, messages, simulations
- Complete repository pattern implementation
- Add event-driven capabilities  
- Comprehensive testing infrastructure
- Performance monitoring and metrics
