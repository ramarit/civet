import request from 'supertest';
import app from '../server';

// Mock dependencies
jest.mock('../workflows/bug-submission');
jest.mock('../db/bug-tracking');

describe('Bug Loop API', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/bugs', () => {
    it('should accept valid bug submission', async () => {
      const bugData = {
        title: 'Test bug',
        description: 'This is a test bug',
        customerEmail: 'test@example.com',
        severity: 'medium',
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(202);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('bugId');
    });

    it('should reject bug submission without title', async () => {
      const bugData = {
        description: 'This is a test bug',
        customerEmail: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject bug submission without description', async () => {
      const bugData = {
        title: 'Test bug',
        customerEmail: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject bug submission without customer email', async () => {
      const bugData = {
        title: 'Test bug',
        description: 'This is a test bug',
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
