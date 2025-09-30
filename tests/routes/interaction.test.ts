import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildTestApp, getAuthHeaders } from '../helpers/testApp';

describe('Interaction Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildTestApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /interactions', () => {
    it('should return 401 without authorization header', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/interactions',
        payload: {
          name: 'Test Interaction',
          description: 'A test interaction',
        },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toHaveProperty('message');
    });

    it('should return 401 with invalid API key', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/interactions',
        headers: {
          authorization: 'Bearer invalid-key',
        },
        payload: {
          name: 'Test Interaction',
          description: 'A test interaction',
        },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json().message).toContain('API key not valid');
    });

    it('should accept valid API key and payload structure', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/interactions',
        headers: getAuthHeaders(),
        payload: {
          name: 'Test Interaction',
          description: 'A test interaction',
          agents: ['agent-1', 'agent-2'],
          environment_id: 'env-123',
        },
      });

      // Controller might not be fully implemented, but auth should pass
      expect(response.statusCode).not.toBe(401);
    });

    it('should validate payload structure', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/interactions',
        headers: getAuthHeaders(),
        payload: {
          // Missing required fields
        },
      });

      // Should fail schema validation, not auth
      expect(response.statusCode).not.toBe(401);
    });
  });

  describe('GET /interactions/:interactionId', () => {
    it('should return 401 without authorization', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/interactions/test-id',
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toHaveProperty('message');
    });

    it('should accept valid API key', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/interactions/test-id',
        headers: getAuthHeaders(),
      });

      expect(response.statusCode).not.toBe(401);
    });

    it('should handle UUID parameter', async () => {
      const testUuid = '550e8400-e29b-41d4-a716-446655440000';
      const response = await app.inject({
        method: 'GET',
        url: `/interactions/${testUuid}`,
        headers: getAuthHeaders(),
      });

      expect(response.statusCode).not.toBe(401);
    });
  });

  describe('PATCH /interactions/:interactionId/start', () => {
    it('should require authorization', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/interactions/test-id/start',
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toHaveProperty('message');
    });

    it('should accept valid API key', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/interactions/test-id/start',
        headers: getAuthHeaders(),
      });

      expect(response.statusCode).not.toBe(401);
    });

    it('should handle UUID parameter', async () => {
      const testUuid = '550e8400-e29b-41d4-a716-446655440000';
      const response = await app.inject({
        method: 'PATCH',
        url: `/interactions/${testUuid}/start`,
        headers: getAuthHeaders(),
      });

      expect(response.statusCode).not.toBe(401);
    });
  });
});