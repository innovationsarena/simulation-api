# Transparency & Traceability Logging Strategy

## Overview

A comprehensive logging strategy for the Simulator API to ensure full transparency, traceability, and observability across all AI agent interactions, conversations, and system operations.

## Current State Analysis

### ✅ **Existing Logging Points**
- Console logs in AI tools (`conversation.ts`)
- Basic error handling in controllers
- Queue job processing logs

### ❌ **Missing Critical Logging**
- AI model requests/responses
- Agent decision-making processes
- Conversation flow tracking
- Performance metrics
- User actions and system state changes

## Recommended Logging Architecture

### 1. 🏗️ **Structured Logging Framework**

```typescript
// core/logging/logger.ts
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

export interface LogContext {
  requestId?: string;
  userId?: string;
  agentId?: string;
  simulationId?: string;
  conversationId?: string;
  sessionId?: string;
  operation?: string;
  component?: string;
}

export class TransparencyLogger {
  private logger: winston.Logger;
  
  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.colorize({ all: true })
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/transparency.log' }),
        new winston.transports.Console()
      ]
    });
  }

  // Core logging methods with context
  info(message: string, context: LogContext = {}) {
    this.logger.info(message, { ...context, timestamp: new Date().toISOString() });
  }

  error(message: string, error: Error, context: LogContext = {}) {
    this.logger.error(message, { 
      ...context, 
      error: error.message, 
      stack: error.stack,
      timestamp: new Date().toISOString() 
    });
  }

  // Specialized logging methods
  aiRequest(context: LogContext, request: any) {
    this.logger.info('AI_REQUEST', {
      ...context,
      type: 'AI_REQUEST',
      request: this.sanitizeAIRequest(request),
      timestamp: new Date().toISOString()
    });
  }

  aiResponse(context: LogContext, response: any, metadata: any = {}) {
    this.logger.info('AI_RESPONSE', {
      ...context,
      type: 'AI_RESPONSE',
      response: this.sanitizeAIResponse(response),
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  agentAction(context: LogContext, action: string, details: any = {}) {
    this.logger.info('AGENT_ACTION', {
      ...context,
      type: 'AGENT_ACTION',
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }

  conversationEvent(context: LogContext, event: string, details: any = {}) {
    this.logger.info('CONVERSATION_EVENT', {
      ...context,
      type: 'CONVERSATION_EVENT',
      event,
      details,
      timestamp: new Date().toISOString()
    });
  }

  queueJob(context: LogContext, jobType: string, jobData: any, status: 'STARTED' | 'COMPLETED' | 'FAILED') {
    this.logger.info('QUEUE_JOB', {
      ...context,
      type: 'QUEUE_JOB',
      jobType,
      jobData: this.sanitizeJobData(jobData),
      status,
      timestamp: new Date().toISOString()
    });
  }

  private sanitizeAIRequest(request: any) {
    // Remove sensitive data, keep structure
    return {
      provider: request.provider,
      model: request.model,
      messageCount: request.messages?.length || 0,
      temperature: request.temperature,
      maxTokens: request.maxTokens
    };
  }

  private sanitizeAIResponse(response: any) {
    return {
      content: response.content?.substring(0, 200) + '...',
      tokenUsage: response.usage,
      finishReason: response.finishReason,
      responseTime: response.responseTime
    };
  }

  private sanitizeJobData(jobData: any) {
    // Remove sensitive information but keep identifiers
    return {
      ...jobData,
      sensitive: '[SANITIZED]'
    };
  }
}

export const transparencyLogger = new TransparencyLogger();
```

### 2. 🎯 **Request Tracing Middleware**

```typescript
// core/middleware/tracing.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { transparencyLogger } from '../logging/logger';

export async function tracingMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const requestId = uuidv4();
  const sessionId = request.headers['session-id'] as string || uuidv4();
  
  // Add to request context
  request.context = {
    ...request.context,
    requestId,
    sessionId,
    startTime: Date.now()
  };

  transparencyLogger.info('REQUEST_START', {
    requestId,
    sessionId,
    method: request.method,
    url: request.url,
    userAgent: request.headers['user-agent'],
    ip: request.ip
  });

  // Log response
  reply.addHook('onSend', async (request, reply, payload) => {
    const duration = Date.now() - request.context.startTime;
    
    transparencyLogger.info('REQUEST_END', {
      requestId: request.context.requestId,
      sessionId: request.context.sessionId,
      statusCode: reply.statusCode,
      duration,
      responseSize: payload ? payload.length : 0
    });
  });
}
```

### 3. 🤖 **AI Tool Logging Integration**

```typescript
// services/agents/tools/conversation.ts (Enhanced)
import { transparencyLogger } from '../../../core/logging/logger';

export const findConversationPartnerTool: Tool<any, { recieverId: string }> = {
  description: "Find a free partner to conversate.",
  parameters: z.object({
    senderId: z.string(),
    simulationId: z.string(),
  }),
  execute: async (args: { senderId: string; simulationId: string }) => {
    const context = {
      agentId: args.senderId,
      simulationId: args.simulationId,
      operation: 'find_conversation_partner',
      component: 'agent_tools'
    };

    transparencyLogger.agentAction(context, 'TOOL_EXECUTE_START', {
      tool: 'findConversationPartnerTool',
      parameters: args
    });

    try {
      const idleAgent = await getIdleAgent(args.simulationId);
      
      transparencyLogger.agentAction(context, 'PARTNER_FOUND', {
        partnerId: idleAgent?.id,
        available: !!idleAgent
      });

      return { recieverId: idleAgent?.id || "No idle agent found." };
    } catch (error) {
      transparencyLogger.error('TOOL_EXECUTION_ERROR', error as Error, context);
      throw error;
    }
  },
};
```

### 4. 📊 **Queue Job Traceability**

```typescript
// services/conversations/workers/index.ts (Enhanced)
import { Job } from 'bullmq';
import { transparencyLogger } from '../../../core/logging/logger';

export async function processConversation(job: Job) {
  const context = {
    conversationId: job.data.conversationId,
    jobId: job.id,
    component: 'conversation_worker'
  };

  transparencyLogger.queueJob(context, 'conversation_processing', job.data, 'STARTED');

  try {
    // Process conversation logic here
    const result = await handleConversationLogic(job.data);
    
    transparencyLogger.queueJob(context, 'conversation_processing', { result }, 'COMPLETED');
    
    return result;
  } catch (error) {
    transparencyLogger.queueJob(context, 'conversation_processing', { error: error.message }, 'FAILED');
    transparencyLogger.error('CONVERSATION_PROCESSING_FAILED', error as Error, context);
    throw error;
  }
}
```

### 5. 🗄️ **Database Operation Logging**

```typescript
// core/supabase/index.ts (Enhanced)
import { transparencyLogger } from '../logging/logger';

export class TrackedSupabaseClient {
  constructor(private supabase: any) {}

  async create(table: string, data: any, context: any = {}) {
    transparencyLogger.info('DB_OPERATION_START', {
      ...context,
      operation: 'CREATE',
      table,
      component: 'database'
    });

    try {
      const result = await this.supabase.from(table).insert(data).select();
      
      transparencyLogger.info('DB_OPERATION_SUCCESS', {
        ...context,
        operation: 'CREATE',
        table,
        recordCount: result.data?.length || 0
      });

      return result;
    } catch (error) {
      transparencyLogger.error('DB_OPERATION_ERROR', error as Error, {
        ...context,
        operation: 'CREATE',
        table
      });
      throw error;
    }
  }

  // Similar methods for read, update, delete...
}
```

## Log Categories & Levels

### 🔍 **Log Categories**

```typescript
export enum LogCategory {
  // User Actions
  USER_REQUEST = 'USER_REQUEST',
  USER_ACTION = 'USER_ACTION',
  
  // AI Operations
  AI_REQUEST = 'AI_REQUEST',
  AI_RESPONSE = 'AI_RESPONSE',
  AI_TOOL_EXECUTION = 'AI_TOOL_EXECUTION',
  
  // Agent Behavior
  AGENT_CREATED = 'AGENT_CREATED',
  AGENT_ACTION = 'AGENT_ACTION',
  AGENT_STATE_CHANGE = 'AGENT_STATE_CHANGE',
  
  // Conversations
  CONVERSATION_START = 'CONVERSATION_START',
  CONVERSATION_MESSAGE = 'CONVERSATION_MESSAGE',
  CONVERSATION_END = 'CONVERSATION_END',
  
  // System Operations
  QUEUE_JOB = 'QUEUE_JOB',
  DB_OPERATION = 'DB_OPERATION',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  PERFORMANCE = 'PERFORMANCE'
}
```

### 📈 **Log Levels**

- **ERROR**: System errors, failed operations
- **WARN**: Performance issues, unexpected behavior
- **INFO**: Normal operations, state changes, user actions
- **DEBUG**: Detailed execution flow, variable states
- **TRACE**: Ultra-detailed debugging information

## Storage & Retention Strategy

### 1. 🗄️ **Log Storage Options**

```yaml
# Option A: File-based with rotation
logs/
├── transparency/
│   ├── requests/         # HTTP request logs
│   ├── agents/          # Agent behavior logs  
│   ├── conversations/   # Conversation flow logs
│   ├── ai-interactions/ # AI model interactions
│   └── system/         # System operation logs

# Option B: Database storage (Recommended)
supabase:
  tables:
    - transparency_logs
    - ai_interaction_logs
    - agent_behavior_logs
    - conversation_traces

# Option C: External service
external:
  - DataDog
  - New Relic
  - ElasticSearch + Kibana
```

### 2. 📅 **Retention Policy**

```typescript
// core/logging/retention.ts
export const RETENTION_POLICY = {
  ERROR_LOGS: '1_YEAR',
  AI_INTERACTIONS: '6_MONTHS',
  USER_ACTIONS: '3_MONTHS',
  SYSTEM_OPERATIONS: '1_MONTH',
  DEBUG_LOGS: '1_WEEK'
};
```

## Implementation Plan

### Phase 1: Foundation (Week 1)
- [ ] Set up Winston logger with structured format
- [ ] Implement tracing middleware
- [ ] Create base logging utilities

### Phase 2: Core Integration (Week 2)  
- [ ] Add logging to all AI tool executions
- [ ] Implement queue job traceability
- [ ] Add database operation logging

### Phase 3: Enhanced Visibility (Week 3)
- [ ] Agent behavior logging
- [ ] Conversation flow tracing
- [ ] Performance monitoring integration

### Phase 4: Analysis & Dashboards (Week 4)
- [ ] Log analysis tools
- [ ] Transparency dashboard
- [ ] Alert system for anomalies

## Compliance & Privacy

### 🔐 **Data Sanitization**
- Remove API keys and secrets from logs
- Truncate large AI responses
- Hash personally identifiable information
- Implement log encryption for sensitive data

### 📋 **Compliance Features**
- GDPR: Right to delete user logs
- SOC2: Audit trail integrity
- Data retention policy enforcement
- Access control for log viewing

## Monitoring & Alerting

### 🚨 **Alert Triggers**
- High error rates (>5% in 5 minutes)
- AI model failures
- Queue job failures
- Unusual agent behavior patterns
- Performance degradation

### 📊 **Metrics Dashboard**
- Request volume and response times
- AI model usage and costs
- Agent conversation success rates
- Queue job processing times
- System health indicators

## Benefits

### ✅ **Transparency Benefits**
- Full audit trail of AI decisions
- Complete conversation history
- System behavior analysis
- Performance optimization insights
- Debugging and troubleshooting

### 🎯 **Business Value**
- Trust and accountability
- Compliance readiness
- Performance insights
- Cost optimization
- Quality assurance

---

**Next Steps:**
1. Choose logging infrastructure (File vs Database vs External)
2. Implement Phase 1 foundation
3. Integrate with existing error handling
4. Create transparency dashboard
5. Set up monitoring and alerts

This comprehensive logging strategy will provide complete transparency and traceability across your AI simulator API.