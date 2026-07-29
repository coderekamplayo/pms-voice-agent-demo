import request from 'supertest';
import { app } from '../src/server/index';

describe('Express Server & VAPI Webhook Integration Tests', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('GET /health', () => {
    it('should return 200 OK with health status metadata', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'pms-voice-agent-demo');
      expect(response.body).toHaveProperty('mockMode');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/vapi/webhook - lookupPatient', () => {
    it('should handle VAPI lookupPatient tool call and return matching patient data', async () => {
      const vapiPayload = {
        message: {
          type: 'tool-calls',
          toolCalls: [
            {
              id: 'call_lookup_test_01',
              type: 'function',
              function: {
                name: 'lookupPatient',
                arguments: {
                  name: 'Juan Dela Cruz',
                },
              },
            },
          ],
        },
      };

      const response = await request(app)
        .post('/api/vapi/webhook')
        .send(vapiPayload)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBe(1);

      const resultItem = response.body.results[0];
      expect(resultItem.toolCallId).toBe('call_lookup_test_01');
      expect(resultItem.result.found).toBe(true);
      expect(resultItem.result.patient.name).toBe('Juan Dela Cruz');
      expect(resultItem.result.patient.id).toBe('pat_101');
    });
  });

  describe('POST /api/vapi/webhook - checkAvailability', () => {
    it('should handle VAPI checkAvailability tool call and return list of open slots', async () => {
      const vapiPayload = {
        message: {
          type: 'tool-calls',
          toolCalls: [
            {
              id: 'call_avail_test_02',
              type: 'function',
              function: {
                name: 'checkAvailability',
                arguments: {
                  date: '2026-07-30',
                },
              },
            },
          ],
        },
      };

      const response = await request(app)
        .post('/api/vapi/webhook')
        .send(vapiPayload)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);

      const resultItem = response.body.results[0];
      expect(resultItem.toolCallId).toBe('call_avail_test_02');
      expect(resultItem.result).toHaveProperty('count');
      expect(resultItem.result).toHaveProperty('availableSlots');
      expect(Array.isArray(resultItem.result.availableSlots)).toBe(true);
    });
  });

  describe('POST /api/vapi/webhook - bookAppointment', () => {
    it('should handle VAPI bookAppointment tool call, book slot, and dispatch confirmation email', async () => {
      const vapiPayload = {
        message: {
          type: 'tool-calls',
          toolCalls: [
            {
              id: 'call_book_test_03',
              type: 'function',
              function: {
                name: 'bookAppointment',
                arguments: {
                  slotId: 'slot_202',
                  patientId: 'pat_101',
                  reason: 'General Consultation',
                },
              },
            },
          ],
        },
      };

      const response = await request(app)
        .post('/api/vapi/webhook')
        .send(vapiPayload)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');

      const resultItem = response.body.results[0];
      expect(resultItem.toolCallId).toBe('call_book_test_03');
      expect(resultItem.result.success).toBe(true);
      expect(resultItem.result.appointment.slotId).toBe('slot_202');
      expect(resultItem.result.appointment.confirmationEmailSent).toBe(true);
    });
  });
});
