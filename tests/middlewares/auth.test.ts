import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import fastify from 'fastify';
import { validateKey } from '../../src/middlewares';

describe('Authentication Middleware', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify({ logger: false });

    // Register a test route with the validateKey middleware
    app.get('/test', {
      preValidation: [validateKey],
    }, async (request, reply) => {
      return { message: 'success' };
    });

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('validateKey middleware', () => {
    it('should reject requests without authorization header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test',
      });

      expect(response.statusCode).toBe(500);
      expect(response.json().message).toContain('API key not found');
    });

    it('should reject requests with malformed authorization header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test',
        headers: {
          authorization: 'malformed-header',
        },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json().message).toContain('API key not found');
    });

    it('should reject requests with invalid API key', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test',
        headers: {
          authorization: 'Bearer invalid-key',
        },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json().message).toContain('API key not valid');
    });

    it('should accept requests with valid API key', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test',
        headers: {
          authorization: `Bearer ${process.env.API_KEY}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ message: 'success' });
    });

    it('should handle Bearer token format correctly', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test',
        headers: {
          authorization: `Bearer ${process.env.API_KEY}`,
        },
      });

      expect(response.statusCode).toBe(200);
    });

    it('should reject empty Bearer token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test',
        headers: {
          authorization: 'Bearer ',
        },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json().message).toContain('API key not found');
    });
  });
});