# 🎙️ PMS Voice Agent Demo (`pms-voice-agent-demo`)

Welcome to **PMS Voice Agent Demo**! This is a complete, beginner-friendly, and runnable portfolio project that demonstrates how an **AI Voice Receptionist** handles incoming patient phone calls, integrates with a Practice Management System (PMS like Cliniko), and triggers automated confirmation emails via Postmark.

---

## 🌟 Features

- **🤖 VAPI Voice AI Integration:** Express webhook listener ready to handle function calls triggered by VAPI during live voice calls.
- **🏥 Mock PMS Service:** Simulates medical scheduling software with patient lookups and appointment booking capabilities.
- **📧 Mock Email Factory:** Simulated Postmark email template generator and console logger for instant verification without needing API keys.
- **🚀 100% Mock Mode Out-of-the-Box:** Runs locally without internet access or real third-party credentials required.

---

## 📐 Architecture & System Flow

```
+------------------+         +------------------+         +-------------------------------+
|   Caller Phone   |  -----> |     VAPI.ai      |  -----> |    Express Webhook Server     |
| (Patient Voice)  |         | (Voice Assistant)|         |  (http://localhost:3000)      |
+------------------+         +------------------+         +-------------------------------+
                                                                          |
                                            +-----------------------------+-----------------------------+
                                            |                                                           |
                                            v                                                           v
                             +-----------------------------+                             +-----------------------------+
                             |       Mock PMS Service      |                             |     Mock Email Factory      |
                             |  (Cliniko API Simulator)    |                             |    (Postmark Dispatcher)    |
                             +-----------------------------+                             +-----------------------------+
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **npm**: v9+

### 2. Installation
Install the project dependencies:
```bash
npm install
```

### 3. Environment Configuration
Copy the sample environment file (preconfigured for Mock Mode):
```bash
cp .env.example .env
```

### 4. Running the Development Server
Launch the server in hot-reload development mode:
```bash
npm run dev
```

You should see output similar to:
```
==================================================
🚀 PMS Voice Agent Server running on port 3000
📡 Health Check: http://localhost:3000/health
🔗 VAPI Webhook: http://localhost:3000/api/vapi/webhook
⚙️  Mode: MOCK MODE (Offline Ready)
==================================================
```

---

## 🧪 Testing Locally with cURL

You can test the entire workflow right from your terminal without placing a phone call!

### 1. Health Check
Verify the server status:
```bash
curl http://localhost:3000/health
```
**Expected Response:**
```json
{
  "status": "ok",
  "service": "pms-voice-agent-demo",
  "mockMode": true,
  "timestamp": "2026-07-29T12:00:00.000Z"
}
```

---

### 2. Lookup Patient (`lookupPatient`)
Simulate VAPI asking the PMS if "Juan Dela Cruz" exists in the clinic system:
```bash
curl -X POST http://localhost:3000/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "type": "tool-calls",
      "toolCalls": [
        {
          "id": "call_lookup_101",
          "type": "function",
          "function": {
            "name": "lookupPatient",
            "arguments": {
              "name": "Juan Dela Cruz"
            }
          }
        }
      ]
    }
  }'
```
**Expected Response:**
```json
{
  "results": [
    {
      "toolCallId": "call_lookup_101",
      "result": {
        "found": true,
        "patient": {
          "id": "pat_101",
          "name": "Juan Dela Cruz",
          "dob": "1990-05-15",
          "email": "juan.delacruz@example.com"
        }
      }
    }
  ]
}
```

---

### 3. Check Open Slots (`checkAvailability`)
Search for available appointment slots:
```bash
curl -X POST http://localhost:3000/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "type": "tool-calls",
      "toolCalls": [
        {
          "id": "call_avail_201",
          "type": "function",
          "function": {
            "name": "checkAvailability",
            "arguments": {
              "date": "2026-07-30"
            }
          }
        }
      ]
    }
  }'
```

---

### 4. Book Appointment (`bookAppointment`)
Book slot `slot_201` for patient `pat_101` ("Juan Dela Cruz"). This will update the PMS state and automatically trigger an email confirmation log:
```bash
curl -X POST http://localhost:3000/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "type": "tool-calls",
      "toolCalls": [
        {
          "id": "call_book_301",
          "type": "function",
          "function": {
            "name": "bookAppointment",
            "arguments": {
              "slotId": "slot_201",
              "patientId": "pat_101",
              "reason": "Dental Checkup"
            }
          }
        }
      ]
    }
  }'
```

---

## 🐳 Docker Deployment

To build and run using Docker:
```bash
# Build Docker image
docker build -t pms-voice-agent-demo .

# Run container
docker run -p 3000:3000 pms-voice-agent-demo
```

---

## 📁 Directory Overview

```
pms-voice-agent-demo/
├── src/
│   ├── mocks/          # Mock patient data and Cliniko PMS API simulator
│   │   ├── data.ts
│   │   └── pms.ts
│   ├── email/          # Postmark email template generator and dispatcher
│   │   └── factory.ts
│   ├── vapi/           # VAPI Voice AI webhook tool handlers
│   │   └── tools.ts
│   └── server/         # Express server and webhook route configuration
│       └── index.ts
├── .env.example
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📄 License
ISC License. Built for educational and portfolio demonstration purposes.
