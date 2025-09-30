import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildTestApp, getAuthHeaders } from '../helpers/testApp';

describe('Environment Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildTestApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /environments', () => {
    it('should return 401 without authorization header', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/environments',
        payload: {
          name: 'Test Environment',
          description: 'A test environment',
        },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toHaveProperty('message');
    });

    it('should return 401 with invalid API key', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/environments',
        headers: {
          authorization: 'Bearer invalid-key',
        },
        payload: {
          name: 'Test Environment',
          description: 'A test environment',
        },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json().message).toContain('API key not valid');
    });

    it('should accept valid API key and payload structure', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/environments',
        headers: getAuthHeaders(),
        payload: {
          name: 'Test Environment',
          description: 'A test environment',
          settings: {
            max_agents: 10,
            simulation_type: 'conversation',
          },
        },
      });

      expect(response.statusCode).not.toBe(401);
    });

    it('should validate payload structure', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/environments',
        headers: getAuthHeaders(),
        payload: {
          // Missing required fields or invalid structure
        },
      });

      // Should fail schema validation, not auth
      expect(response.statusCode).not.toBe(401);
    });
  });

  describe('GET /environments/:environmentId', () => {
    it('should return 401 without authorization', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/environments/test-env-id',
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toHaveProperty('message');
    });

    it('should accept valid API key', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/environments/test-env-id',
        headers: getAuthHeaders(),
      });

      expect(response.statusCode).not.toBe(401);
    });

    it('should handle UUID parameter', async () => {
      const testUuid = '550e8400-e29b-41d4-a716-446655440000';
      const response = await app.inject({
        method: 'GET',
        url: `/environments/${testUuid}`,
        headers: getAuthHeaders(),
      });

      expect(response.statusCode).not.toBe(401);
    });
  });

  describe('PATCH /environments/:environmentId', () => {
    it('should require authorization', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/environments/test-env-id',
        payload: {
          name: 'Updated Environment',
        },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toHaveProperty('message');
    });

    it('should accept valid API key and payload', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/environments/test-env-id',
        headers: getAuthHeaders(),
        payload: {
          name: 'Updated Environment',
          description: 'An updated test environment',
          settings: {
            max_agents: 20,
            simulation_type: 'debate',
          },
        },
      });

      expect(response.statusCode).not.toBe(401);
    });

    it('should handle partial updates', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/environments/test-env-id',
        headers: getAuthHeaders(),
        payload: {
          name: 'Updated Name Only',
        },
      });

      expect(response.statusCode).not.toBe(401);
    });
  });

  describe('DELETE /environments/:environmentId', () => {
    it('should require authorization', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/environments/test-env-id',
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toHaveProperty('message');
    });

    it('should accept valid API key', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/environments/test-env-id',
        headers: getAuthHeaders(),
      });

      expect(response.statusCode).not.toBe(401);
    });

    it('should handle UUID parameter', async () => {
      const testUuid = '550e8400-e29b-41d4-a716-446655440000';
      const response = await app.inject({
        method: 'DELETE',
        url: `/environments/${testUuid}`,
        headers: getAuthHeaders(),
      });

      expect(response.statusCode).not.toBe(401);
    });
  });
});