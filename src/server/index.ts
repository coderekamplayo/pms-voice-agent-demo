import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { executeVapiToolCall, VapiToolCall, VapiToolResult } from '../vapi/tools';

// Load environment variables
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;
const MOCK_MODE = process.env.MOCK_MODE !== 'false';

// Enable JSON body parsing and CORS
app.use(cors());
app.use(express.json());

/**
 * Health Check Endpoint
 * GET /health
 */
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'pms-voice-agent-demo',
    mockMode: MOCK_MODE,
    timestamp: new Date().toISOString(),
  });
});

/**
 * VAPI Webhook Endpoint
 * POST /api/vapi/webhook
 * Handles incoming tool call requests triggered by Voice AI calls
 */
app.post('/api/vapi/webhook', (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (process.env.NODE_ENV !== 'test') {
      console.log('🤖 [VAPI WEBHOOK INCOMING]:', JSON.stringify(payload, null, 2));
    }

    // Determine VAPI message format
    let toolCalls: VapiToolCall[] = [];

    if (payload?.message?.type === 'tool-calls' && Array.isArray(payload.message.toolCalls)) {
      toolCalls = payload.message.toolCalls;
    } else if (Array.isArray(payload?.toolCalls)) {
      toolCalls = payload.toolCalls;
    } else if (payload?.function?.name) {
      // Single tool call direct payload support
      toolCalls = [
        {
          id: payload.id || `call_${Date.now()}`,
          type: 'function',
          function: {
            name: payload.function.name,
            arguments: payload.function.arguments || payload.arguments || {},
          },
        },
      ];
    }

    if (toolCalls.length === 0) {
      return res.status(200).json({
        message: 'Webhook received successfully. No tool calls to process.',
        receivedPayload: payload,
      });
    }

    // Execute each tool call and construct VAPI results array
    const results: VapiToolResult[] = toolCalls.map((call) => executeVapiToolCall(call));

    if (process.env.NODE_ENV !== 'test') {
      console.log('✅ [VAPI WEBHOOK RESPONSE]:', JSON.stringify(results, null, 2));
    }

    return res.status(200).json({ results });
  } catch (error: any) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('❌ [VAPI WEBHOOK ERROR]:', error);
    }
    return res.status(500).json({
      error: 'Internal server error while processing VAPI tool call.',
      details: error.message,
    });
  }
});

// Start Express Web Server if not running in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 PMS Voice Agent Server running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/health`);
    console.log(`🔗 VAPI Webhook: http://localhost:${PORT}/api/vapi/webhook`);
    console.log(`⚙️  Mode: ${MOCK_MODE ? 'MOCK MODE (Offline Ready)' : 'LIVE MODE'}`);
    console.log(`==================================================\n`);
  });
}
