import { beforeAll, afterAll } from 'vitest';

// Set test environment variables before importing any modules
process.env.NODE_ENV = 'test';
process.env.API_KEY = 'test-api-key';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_KEY = 'test-supabase-key';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.REDIS_PORT = '6379';

beforeAll(async () => {
  // Additional setup if needed
});

afterAll(async () => {
  // Cleanup after all tests
});