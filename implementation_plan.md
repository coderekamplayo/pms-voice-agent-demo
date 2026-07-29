# Implementation Plan - PMS Voice Agent Demo (`pms-voice-agent-demo`)

Build a standalone, beginner-friendly Node.js + TypeScript portfolio project simulating an AI Receptionist voice agent integrating Practice Management System (PMS), VAPI Voice AI webhooks, and Postmark mock email delivery.

## User Review Required

> [!NOTE]
> All services run in **Mock Mode** by default. No external API keys or live network connections are required to run or test the project locally.

> [!IMPORTANT]
> The VAPI tool handler and Express webhook endpoints adhere strictly to standard VAPI tool call webhook payload formats to ensure drop-in compatibility with live VAPI voice assistants.

## Proposed Changes

### Setup & Project Configuration

#### [MODIFY] [package.json](file:///c:/Users/DEREK/pms-voice-agent-demo/package.json)
- Add `nodemon` as a development dependency.
- Add scripts for development (`npm run dev`), production compilation (`npm run build`), and execution (`npm start`).

#### [NEW] [tsconfig.json](file:///c:/Users/DEREK/pms-voice-agent-demo/tsconfig.json)
- Create Node 20 / modern ES2022 TypeScript configuration with strict mode and output mapping to `./dist`.

#### [NEW] [.env.example](file:///c:/Users/DEREK/pms-voice-agent-demo/.env.example)
- Define default configuration variables: `PORT=3000`, `NODE_ENV=development`, `MOCK_MODE=true`.

---

### Core Data & Mock Services

#### [NEW] [data.ts](file:///c:/Users/DEREK/pms-voice-agent-demo/src/mocks/data.ts)
- Define TypeScript interfaces: `Patient`, `AppointmentSlot`.
- Export initial fake patients (e.g. Juan Dela Cruz, Maria Santos, Alex Rivera).
- Export initial mock appointment slots with status (`available` / `booked`).

#### [NEW] [pms.ts](file:///c:/Users/DEREK/pms-voice-agent-demo/src/mocks/pms.ts)
- Build `PMSService` class simulating Cliniko API endpoints:
  - `lookupPatientByName(name: string)`
  - `getAvailableSlots(date?: string)`
  - `bookSlot(slotId: string, patientId: string, reason: string)`

---

### Email Factory & Dispatcher

#### [NEW] [factory.ts](file:///c:/Users/DEREK/pms-voice-agent-demo/src/email/factory.ts)
- Implement email template builder functions:
  - `buildConfirmationEmail(patientName, date, time, doctor)`
  - `buildReminderEmail(patientName, date, time)`
  - `buildMissedCallEmail(callerPhone)`
- Implement mock `sendEmail(to, subject, body)` logging formatted Postmark dispatch messages to console.

---

### VAPI Voice AI Integration & Express Server

#### [NEW] [tools.ts](file:///c:/Users/DEREK/pms-voice-agent-demo/src/vapi/tools.ts)
- Implement VAPI Tool Call Handlers:
  - `handleLookupPatient`: Searches PMS patients by name.
  - `handleCheckAvailability`: Returns open slot list.
  - `handleBookAppointment`: Books slot, updates PMS state, and triggers email confirmation.
- Format responses according to VAPI webhook contract specifications.

#### [NEW] [index.ts](file:///c:/Users/DEREK/pms-voice-agent-demo/src/server/index.ts)
- Initialize Express app listening on `process.env.PORT || 3000`.
- Include `express.json()` and `cors()` middleware.
- Define `GET /health` health check endpoint.
- Define `POST /api/vapi/webhook` to route VAPI `tool-calls` events to proper handlers.

---

### Containerization & Documentation

#### [NEW] [Dockerfile](file:///c:/Users/DEREK/pms-voice-agent-demo/Dockerfile)
- Multi-stage Docker build targeting Node 20 Alpine for optimized production container deployment.

#### [NEW] [README.md](file:///c:/Users/DEREK/pms-voice-agent-demo/README.md)
- Complete documentation including project overview, ASCII architecture flow diagram, setup guide, and ready-to-use `curl` testing scripts.

---

## Verification Plan

### Automated Build & Compilation
- Run `npm install --save-dev nodemon`
- Run `npx tsc --noEmit` to ensure zero TypeScript compilation errors.

### Manual & Endpoint Verification
- Start dev server using `npm run dev` (or `ts-node src/server/index.ts`).
- Execute `curl http://localhost:3000/health` to confirm server health status.
- Test `POST /api/vapi/webhook` with `curl` payloads for:
  1. `lookupPatient` ("Juan Dela Cruz")
  2. `checkAvailability`
  3. `bookAppointment` (verify PMS state change and email console output)
