# Architecture Suggestions for Human Blueprint Model API

## Current Architecture Analysis

The project is a FastAPI-based simulation engine for multi-agent interactions with the following structure:

### Strengths

- ✅ Clear separation between routes, controllers, and services
- ✅ TypeScript with strict typing enabled
- ✅ Consistent error handling pattern
- ✅ Well-defined domain types
- ✅ Clean dependency injection pattern
- ✅ Supabase integration for data persistence

### Areas for Improvement

## 1. **Dependency Injection & Service Layer Architecture**

### Current Issues

- Services are directly imported in controllers, creating tight coupling
- Database operations mixed with business logic
- No clear abstraction layer for data access

### Recommendations

```typescript
// Create an interface-based service architecture
interface IAgentRepository {
  create(agent: Agent): Promise<Agent>;
  findById(id: string): Promise<Agent | null>;
  findBySimulation(simulationId: string): Promise<Agent[]>;
}

interface ISimulationService {
  createSimulation(input: CreateSimulationInput): Promise<Simulation>;
  startSimulation(id: string): Promise<void>;
}
```

**Benefits**: Better testability, easier to swap implementations, clearer separation of concerns

## 2. **Configuration Management**

### Current Issues

- Environment variables scattered throughout codebase
- No central configuration validation
- Table names and API URLs hardcoded as env vars in multiple places

### Recommendations

```typescript
// src/config/index.ts
export const config = {
  database: {
    url: process.env.SUPABASE_URL!,
    key: process.env.SUPABASE_KEY!,
    tables: {
      simulations: process.env.SIMULATIONS_TABLE_NAME!,
      agents: process.env.AGENTS_TABLE_NAME!,
      conversations: process.env.CONVERSATIONS_TABLE_NAME!,
      messages: process.env.MESSAGES_TABLE_NAME!,
    },
  },
  llm: {
    defaultModel: process.env.DEFAULT_LLM_MODEL!,
  },
  server: {
    port: Number(process.env.PORT) || 3000,
    apiUrl: process.env.API_URL!,
    apiKey: process.env.API_KEY!,
  },
};
```

## 3. **Domain-Driven Design Structure**

### Current Issues

- Business logic scattered across controllers and services
- No clear domain boundaries
- Mixed concerns in single files

### Recommendations

```
src/
├── domains/
│   ├── simulation/
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── controllers/
│   ├── agent/
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── controllers/
│   └── conversation/
└── shared/
    ├── database/
    ├── types/
    └── utils/
```

## 4. **Error Handling & Validation**

### Current Issues

- Inconsistent error responses
- No input validation layer
- Database errors exposed to client

### Recommendations

```typescript
// Use Zod for runtime validation
import { z } from "zod";

export const CreateSimulationSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(["discussion", "conversation", "survey"]),
  description: z.string().optional(),
});

// Middleware for validation
export const validateInput = <T>(schema: z.ZodSchema<T>) => {
  return (req: FastifyRequest, reply: FastifyReply, done: Function) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      reply.status(400).send({
        error: "Validation failed",
        details: result.error.errors,
      });
      return;
    }
    done();
  };
};
```

## 5. **Database Layer Abstraction**

### Current Issues

- Supabase client used directly in services
- No abstraction over database operations
- Difficult to test and swap database implementations

### Recommendations

```typescript
// Abstract repository pattern
abstract class BaseRepository<T> {
  protected abstract tableName: string;

  async create(entity: T): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(entity)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  }
}

class AgentRepository extends BaseRepository<Agent> {
  protected tableName = config.database.tables.agents;

  async findBySimulation(simulationId: string): Promise<Agent[]> {
    // Implementation
  }
}
```

## 6. **Event-Driven Architecture**

### Current Issues

- Tight coupling between simulation state changes and conversations
- Hardcoded webhook logic in service layer
- No event sourcing or audit trail

### How to Implement Event-Driven System

#### Step 1: Define Domain Events

```typescript
// src/shared/events/types.ts
export interface DomainEvent {
  id: string;
  type: string;
  timestamp: Date;
  aggregateId: string;
  version: number;
  data: any;
  metadata?: Record<string, any>;
}

// Define specific event types
export interface SimulationStartedEvent extends DomainEvent {
  type: "simulation.started";
  data: {
    simulationId: string;
    agentCount: number;
    type: "discussion" | "conversation" | "survey";
  };
}

export interface MessageSentEvent extends DomainEvent {
  type: "message.sent";
  data: {
    messageId: string;
    conversationId: string;
    senderId: string;
    content: string;
  };
}

export interface ConversationEndedEvent extends DomainEvent {
  type: "conversation.ended";
  data: {
    conversationId: string;
    participantIds: string[];
    messageCount: number;
  };
}
```

#### Step 2: Create Event Bus Infrastructure

```typescript
// src/shared/events/eventBus.ts
export interface EventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>;
}

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  private eventStore: EventStore;

  constructor(eventStore: EventStore) {
    this.eventStore = eventStore;
  }

  async publish(event: DomainEvent): Promise<void> {
    // Store event for audit trail
    await this.eventStore.save(event);

    // Get handlers for this event type
    const handlers = this.handlers.get(event.type) || [];

    // Execute handlers (consider parallel execution with error handling)
    await Promise.allSettled(handlers.map((handler) => handler.handle(event)));
  }

  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  // For development/debugging
  getSubscribedEvents(): string[] {
    return Array.from(this.handlers.keys());
  }
}
```

#### Step 3: Implement Event Store

```typescript
// src/shared/events/eventStore.ts
export interface EventStore {
  save(event: DomainEvent): Promise<void>;
  getEvents(aggregateId: string): Promise<DomainEvent[]>;
  getEventsByType(type: string): Promise<DomainEvent[]>;
}

export class SupabaseEventStore implements EventStore {
  constructor(private supabase: SupabaseClient) {}

  async save(event: DomainEvent): Promise<void> {
    const { error } = await this.supabase.from("domain_events").insert({
      id: event.id,
      type: event.type,
      aggregate_id: event.aggregateId,
      version: event.version,
      data: event.data,
      metadata: event.metadata,
      timestamp: event.timestamp.toISOString(),
    });

    if (error) throw new Error(`Failed to store event: ${error.message}`);
  }

  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    const { data, error } = await this.supabase
      .from("domain_events")
      .select("*")
      .eq("aggregate_id", aggregateId)
      .order("version", { ascending: true });

    if (error) throw new Error(`Failed to get events: ${error.message}`);
    return data.map(this.mapToDomainEvent);
  }
}
```

#### Step 4: Create Event Handlers

```typescript
// src/domains/simulation/handlers/simulationStartedHandler.ts
export class SimulationStartedHandler
  implements EventHandler<SimulationStartedEvent>
{
  constructor(
    private conversationService: ConversationService,
    private notificationService: NotificationService
  ) {}

  async handle(event: SimulationStartedEvent): Promise<void> {
    const { simulationId, agentCount } = event.data;

    // Start initial conversations
    await this.conversationService.initializeConversations(simulationId);

    // Send notification
    await this.notificationService.sendSimulationStarted(simulationId);

    // Log for monitoring
    console.log(`Simulation ${simulationId} started with ${agentCount} agents`);
  }
}

// src/domains/conversation/handlers/messageHandler.ts
export class MessageSentHandler implements EventHandler<MessageSentEvent> {
  constructor(
    private llmService: LLMService,
    private agentService: AgentService
  ) {}

  async handle(event: MessageSentEvent): Promise<void> {
    const { conversationId, senderId } = event.data;

    // Generate response from other participant
    const conversation = await this.conversationService.getById(conversationId);
    const otherAgent = conversation.participants.find((p) => p !== senderId);

    if (otherAgent) {
      // This will generate another MessageSentEvent, creating the conversation flow
      await this.conversationService.generateResponse(
        conversationId,
        otherAgent
      );
    }
  }
}
```

#### Step 5: Update Services to Emit Events

```typescript
// src/domains/simulation/services/simulationService.ts
export class SimulationService {
  constructor(
    private simulationRepo: SimulationRepository,
    private eventBus: EventBus
  ) {}

  async startSimulation(simulationId: string): Promise<void> {
    const simulation = await this.simulationRepo.findById(simulationId);

    // Update simulation state
    await this.simulationRepo.update(simulationId, { state: "running" });

    // Emit event instead of directly calling other services
    await this.eventBus.publish({
      id: generateId(),
      type: "simulation.started",
      timestamp: new Date(),
      aggregateId: simulationId,
      version: 1,
      data: {
        simulationId,
        agentCount: simulation.agentCount,
        type: simulation.type,
      },
    });
  }
}
```

#### Step 6: Setup Event Bus in Main Application

```typescript
// src/infrastructure/events/setup.ts
export function setupEventHandlers(eventBus: EventBus): void {
  // Simulation events
  eventBus.subscribe(
    "simulation.started",
    new SimulationStartedHandler(
      container.get(ConversationService),
      container.get(NotificationService)
    )
  );

  eventBus.subscribe(
    "simulation.ended",
    new SimulationEndedHandler(container.get(ReportService))
  );

  // Message events
  eventBus.subscribe(
    "message.sent",
    new MessageSentHandler(
      container.get(LLMService),
      container.get(AgentService)
    )
  );

  // Conversation events
  eventBus.subscribe(
    "conversation.ended",
    new ConversationEndedHandler(container.get(AnalyticsService))
  );
}

// src/index.ts
const eventStore = new SupabaseEventStore(supabase);
const eventBus = new EventBus(eventStore);

setupEventHandlers(eventBus);

// Make eventBus available through dependency injection
container.register("EventBus", eventBus);
```

#### Step 7: Database Schema for Event Store

```sql
-- Add to your Supabase migrations
CREATE TABLE domain_events (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  data JSONB NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_domain_events_aggregate ON domain_events(aggregate_id);
CREATE INDEX idx_domain_events_type ON domain_events(type);
CREATE INDEX idx_domain_events_timestamp ON domain_events(timestamp);
```

#### Step 8: Replace Current Coupling with Events

```typescript
// BEFORE: Tight coupling in simulation controller
export const startSimulation = async (req, reply) => {
  // ... update simulation state

  // Direct service calls - TIGHT COUPLING
  const agents = await listAgents(simulationId);
  for (const sender of senders) {
    const conversation = await createConversation(simulation, sender, receiver);
    const message = await generateInitialMessage(sender, simulation);
    await createMessage(message);
  }
};

// AFTER: Event-driven approach
export const startSimulation = async (req, reply) => {
  // ... update simulation state

  // Emit event - LOOSE COUPLING
  await eventBus.publish({
    type: "simulation.started",
    // ... event data
  });

  // Handlers will take care of the rest
};
```

#### Benefits of This Implementation:

1. **Decoupling**: Services don't need to know about each other
2. **Scalability**: Easy to add new event handlers without modifying existing code
3. **Audit Trail**: All events are stored for debugging and analytics
4. **Reliability**: Failed handlers don't affect other handlers
5. **Testing**: Easy to test event handlers in isolation
6. **Monitoring**: Can track event flow and processing times

#### Advanced Features to Consider:

- **Event Replay**: Rebuild system state from events
- **Event Versioning**: Handle schema evolution
- **Dead Letter Queue**: Handle failed events
- **Event Streaming**: Use external systems like Kafka for high throughput
- **Saga Pattern**: Handle complex distributed transactions

## 7. **Testing Strategy**

### Current Issues

- No visible test structure
- Difficult to test due to tight coupling
- No clear testing strategy

### Recommendations

```
tests/
├── unit/
│   ├── domains/
│   └── utils/
├── integration/
│   ├── api/
│   └── database/
└── e2e/
    └── scenarios/
```

## 8. **Monitoring & Observability**

### Current Issues

- Limited logging
- No metrics or monitoring
- Error tracking is basic

### Recommendations

```typescript
// Structured logging
import { logger } from "./shared/logger";

logger.info("Simulation started", {
  simulationId,
  agentCount,
  type: simulation.type,
});

// Metrics
class MetricsService {
  incrementCounter(metric: string, tags: Record<string, string>) {
    // Implementation
  }

  recordTiming(metric: string, duration: number) {
    // Implementation
  }
}
```

## 9. **API Versioning & Documentation**

### Current Issues

- No API versioning strategy
- Basic documentation setup

### Recommendations

```typescript
// Version routes
server.register(v1Routes, { prefix: "/v1" });
server.register(v2Routes, { prefix: "/v2" });

// Enhanced OpenAPI documentation
const swaggerOptions = {
  swagger: {
    info: {
      title: "Human Blueprint Model API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000", description: "Development" }],
  },
};
```

## 10. **Performance & Scalability**

### Current Issues

- No caching strategy
- Potential N+1 queries
- No rate limiting

### Recommendations

```typescript
// Caching layer
interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
}

// Rate limiting
server.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

// Database query optimization
const getSimulationWithAgents = async (id: string) => {
  return supabase
    .from("simulations")
    .select(
      `
      *,
      agents(*)
    `
    )
    .eq("id", id)
    .single();
};
```

## Implementation Priority

### High Priority (Immediate)

1. Configuration management
2. Input validation with Zod
3. Repository pattern for database access
4. Comprehensive error handling

### Medium Priority (Next Sprint)

1. Domain-driven structure refactor
2. Event-driven architecture
3. Testing framework setup
4. Enhanced logging

### Low Priority (Future)

1. Advanced caching
2. Performance monitoring
3. API versioning
4. Advanced observability

## Migration Strategy

1. **Phase 1**: Implement configuration management and validation
2. **Phase 2**: Refactor to repository pattern
3. **Phase 3**: Introduce domain boundaries
4. **Phase 4**: Add event system and testing
5. **Phase 5**: Performance and monitoring improvements

This approach ensures minimal disruption while systematically improving the architecture's scalability, maintainability, and testability.
