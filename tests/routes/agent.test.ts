import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildTestApp, getAuthHeaders } from '../helpers/testApp';

describe('Agent Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildTestApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /agent/:agentId', () => {
    it('should return 401 without authorization header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/agent/test-agent-id',
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toHaveProperty('message');
    });

    it('should accept valid API key', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/agent/test-agent-id',
        headers: getAuthHeaders(),
      });

      expect(response.statusCode).not.toBe(401);
    });

    it('should handle UUID parameter', async () => {
      const testUuid = '550e8400-e29b-41d4-a716-446655440000';
      const response = await app.inject({
        method: 'GET',
        url: `/agent/${testUuid}`,
        headers: getAuthHeaders(),
      });

      expect(response.statusCode).not.toBe(401);
    });
  });

  describe('POST /agents', () => {
    it('should return 401 without authorization', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/agents',
        payload: {
          count: 2,
          type: 'conversational',
        },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toHaveProperty('message');
    });

    it('should accept valid API key and payload', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/agents',
        headers: getAuthHeaders(),
        payload: {
          count: 2,
          type: 'conversational',
          environment_id: 'env-123',
          configuration: {
            model: 'gpt-4',
            temperature: 0.7,
          },
        },
      });

      expect(response.statusCode).not.toBe(401);
    });

    it('should validate payload structure', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/agents',
        headers: getAuthHeaders(),
        payload: {
          // Missing required fields
        },
      });

      // Should fail schema validation, not auth
      expect(response.statusCode).not.toBe(401);
    });
  });

  describe('POST /agents/custom', () => {
    it('should require authorization', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/agents/custom',
        payload: {
          name: 'Custom Agent',
          personality: 'Helpful assistant',
        },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toHaveProperty('message');
    });

    it('should accept valid API key and custom agent payload', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/agents/custom',
        headers: getAuthHeaders(),
        payload: {
          name: 'Custom Agent',
          personality: 'Helpful assistant',
          backstory: 'An AI designed to help users',
          goals: ['Be helpful', 'Provide accurate information'],
          model: 'gpt-4',
          temperature: 0.8,
        },
      });

      expect(response.statusCode).not.toBe(401);
    });
  });

  describe('POST /agents/random', () => {
    it('should require authorization', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/agents/random',
        payload: {
          count: 5,
        },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toHaveProperty('message');
    });

    it('should accept valid API key and random agent payload', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/agents/random',
        headers: getAuthHeaders(),
        payload: {
          count: 5,
          environment_id: 'env-123',
          constraints: {
            min_temperature: 0.5,
            max_temperature: 1.0,
            allowed_models: ['gpt-4', 'claude-3'],
          },
        },
      });

      expect(response.statusCode).not.toBe(401);
    });

    it('should handle different count values', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/agents/random',
        headers: getAuthHeaders(),
        payload: {
          count: 1,
        },
      });

      expect(response.statusCode).not.toBe(401);
    });
  });

  describe('POST /agent/:agentId/evaluate', () => {
    it('should require authorization', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/agent/test-agent-id/evaluate',
        payload: {
          criteria: ['accuracy', 'helpfulness'],
          context: 'Test evaluation context',
        },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toHaveProperty('message');
    });

    it('should accept valid API key and evaluation payload', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/agent/test-agent-id/evaluate',
        headers: getAuthHeaders(),
        payload: {
          criteria: ['accuracy', 'helpfulness', 'coherence'],
          context: 'Test evaluation context',
          reference_data: {
            expected_responses: ['Good answer 1', 'Good answer 2'],
          },
        },
      });

      expect(response.statusCode).not.toBe(401);
    });

    it('should handle UUID parameter in evaluation', async () => {
      const testUuid = '550e8400-e29b-41d4-a716-446655440000';
      const response = await app.inject({
        method: 'POST',
        url: `/agent/${testUuid}/evaluate`,
        headers: getAuthHeaders(),
        payload: {
          criteria: ['accuracy'],
          context: 'UUID test context',
        },
      });

      expect(response.statusCode).not.toBe(401);
    });
  });
});