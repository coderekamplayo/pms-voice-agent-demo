# 🎙️ PMS Voice Agent Demo (`pms-voice-agent-demo`)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v20-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-lightgrey.svg)](https://expressjs.com/)
[![Jest](https://img.shields.io/badge/Jest-30.0-red.svg)](https://jestjs.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

> **Portfolio & Demonstration Project:** A standalone, beginner-friendly simulation of an **AI Receptionist Voice Agent** integrating a **Practice Management System (PMS like Cliniko)**, **VAPI Voice AI Webhooks**, and **Postmark Mock Email Delivery**.

---

## 📌 Project Overview

`pms-voice-agent-demo` demonstrates how real-world **Voice AI Assistants** (such as VAPI.ai) communicate with clinic software to handle patient phone inquiries, query schedule availability, and perform end-to-end appointment bookings.

### Key Capabilities:
- **🤖 VAPI Voice Webhook Router:** Receives incoming function call requests (`lookupPatient`, `checkAvailability`, `bookAppointment`) triggered live during voice calls.
- **🏥 Mock Cliniko PMS Service:** Simulates medical practice management data layer with patient lookups, slot filtering, and double-booking prevention.
- **📧 Postmark Mock Email Factory:** Generates HTML & plain-text confirmation templates and logs email dispatches directly to the console.
- **⚡ 100% Offline / Mock Ready:** Runs cleanly on any developer laptop out-of-the-box without external API keys or live third-party service dependencies.
- **🧪 Comprehensive Automated Testing:** Includes 100% passing unit & integration test coverage powered by **Jest** and **Supertest**.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Language** | **TypeScript 5.7** | Strongly typed, safe server-side development |
| **Runtime & Server** | **Node.js v20 + Express 5** | RESTful HTTP application server & webhook router |
| **Execution** | **tsx** | Zero-config TypeScript execution engine for dev mode |
| **Testing** | **Jest + Supertest** | Unit testing & HTTP webhook integration testing |
| **Voice AI Contract** | **VAPI.ai Webhook Standard** | JSON payload specifications for Voice AI function calling |
| **Containerization** | **Docker** | Multi-stage production container setup |

---

## 📐 Architecture & Directory Structure

```text
                                       SYSTEM ARCHITECTURE

+-------------------+         +-------------------+         +----------------------------------+
|   Caller Phone    |  -----> |     VAPI.ai       |  -----> |      Express Webhook Server      |
|  (Patient Voice)  |         | (Voice Assistant) |         |      (http://localhost:3000)     |
+-------------------+         +-------------------+         +----------------------------------+
                                                                             |
                                              +------------------------------+------------------------------+
                                              |                                                             |
                                              v                                                             v
                               +------------------------------+                              +------------------------------+
                               |       Mock PMS Service       |                              |      Mock Email Factory      |
                               |   (Cliniko API Simulator)    |                              |     (Postmark Dispatcher)    |
                               +------------------------------+                              +------------------------------+
```

### Directory Tree Overview

```text
pms-voice-agent-demo/
├── src/
│   ├── mocks/             # Mock patient data and Cliniko PMS service simulator
│   │   ├── data.ts        # Interfaces and sample patient/slot records
│   │   └── pms.ts         # PMSService class (lookupPatientByName, getAvailableSlots, bookSlot)
│   ├── email/             # Postmark email template generator and dispatcher
│   │   └── factory.ts     # Confirmation, reminder, and missed-call email builders
│   ├── vapi/              # VAPI Voice AI function call handlers
│   │   └── tools.ts       # Webhook tool execution router
│   └── server/            # Express web application & routing
│       └── index.ts       # Health routes & POST /api/vapi/webhook listener
├── tests/                 # Automated Jest & Supertest suites
│   ├── pms.test.ts        # Unit tests for PMS logic & booking validation
│   ├── email.test.ts      # Unit tests for email template generation
│   └── webhook.test.ts    # Integration tests for Express endpoints & VAPI payloads
├── .env.example           # Pre-configured environment settings
├── Dockerfile             # Multi-stage production Docker configuration
├── jest.config.js         # Jest TypeScript configuration
├── package.json           # Scripts & package dependencies
├── tsconfig.json          # TypeScript compiler configuration
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Recommended: Node 20 LTS)
- **npm**: `v9.0.0` or higher
- **Git**: Installed on your terminal

### Step-by-Step Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/coderekamplayo/pms-voice-agent-demo.git
   cd pms-voice-agent-demo
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create local `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

   **Console Startup Confirmation:**
   ```text
   ==================================================
   🚀 PMS Voice Agent Server running on port 3000
   📡 Health Check: http://localhost:3000/health
   🔗 VAPI Webhook: http://localhost:3000/api/vapi/webhook
   ⚙️  Mode: MOCK MODE (Offline Ready)
   ==================================================
   ```

---

## 🧪 Automated Testing

The project contains automated unit and integration tests using **Jest** and **Supertest**.

Run all test suites:
```bash
npm test
```

### Expected Output:
```text
PASS tests/email.test.ts
PASS tests/pms.test.ts
PASS tests/webhook.test.ts

Test Suites: 3 passed, 3 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        ~10 s
```

---

## 📡 Testing Webhooks with cURL

You can test the server endpoints locally in terminal without needing an actual phone call:

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Patient Lookup (`lookupPatient`)
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

### 3. Appointment Slot Query (`checkAvailability`)
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

### 4. Appointment Booking & Email Dispatch (`bookAppointment`)
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
              "reason": "General Dental Examination"
            }
          }
        }
      ]
    }
  }'
```

---

## 🐳 Container Deployment with Docker

Build and run using Docker:
```bash
# Build multi-stage Docker image
docker build -t pms-voice-agent-demo .

# Launch container on port 3000
docker run -p 3000:3000 pms-voice-agent-demo
```

---

## 💼 Portfolio & Developer Context

This project was built to demonstrate:
- Clean modular TypeScript architecture for AI Voice Webhooks.
- Handling Voice AI function calling payloads (VAPI tool call schemas).
- Building offline-friendly mock services for practice management systems and email dispatchers.
- Automated testing discipline with 100% test coverage using Jest & Supertest.

---

## 📄 License

Distributed under the **ISC License**. Created for educational, portfolio, and demonstration purposes.
