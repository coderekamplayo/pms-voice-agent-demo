import { buildConfirmationEmail, sendEmail } from '../email/factory';
import { pmsService } from '../mocks/pms';

export interface VapiToolCall {
  id: string;
  type?: string;
  function: {
    name: string;
    arguments: Record<string, any>;
  };
}

export interface VapiToolResult {
  toolCallId: string;
  result: any;
}

/**
 * 1. Handler: lookupPatient
 * Queries fake PMS patient database by name.
 */
export function handleLookupPatient(args: { name: string }): any {
  const patient = pmsService.lookupPatientByName(args.name);
  if (!patient) {
    return {
      found: false,
      message: `No patient found matching name '${args.name}'.`,
    };
  }
  return {
    found: true,
    patient: {
      id: patient.id,
      name: patient.name,
      dob: patient.dob,
      email: patient.email,
    },
  };
}

/**
 * 2. Handler: checkAvailability
 * Queries open appointment slots from fake PMS.
 */
export function handleCheckAvailability(args: { date?: string }): any {
  const slots = pmsService.getAvailableSlots(args.date);
  return {
    count: slots.length,
    dateFilter: args.date || 'all',
    availableSlots: slots.map((s) => ({
      slotId: s.id,
      date: s.date,
      time: s.time,
      doctor: s.doctor,
    })),
  };
}

/**
 * 3. Handler: bookAppointment
 * Books an appointment slot in PMS and automatically dispatches a Postmark email confirmation.
 */
export function handleBookAppointment(args: {
  slotId: string;
  patientId: string;
  reason?: string;
}): any {
  const bookingResult = pmsService.bookSlot(
    args.slotId,
    args.patientId,
    args.reason || 'General Consultation'
  );

  if (!bookingResult.success || !bookingResult.slot) {
    return {
      success: false,
      message: bookingResult.message,
    };
  }

  const slot = bookingResult.slot;
  const patient = pmsService.lookupPatientByName(args.patientId) || {
    id: args.patientId,
    name: 'Valued Patient',
    dob: '',
    email: 'patient@example.com',
    phone: '',
  };

  // Automatically trigger email dispatch via factory
  const emailData = buildConfirmationEmail(
    patient.name,
    slot.date,
    slot.time,
    slot.doctor
  );
  sendEmail(patient.email, emailData.subject, emailData.body);

  return {
    success: true,
    message: bookingResult.message,
    appointment: {
      slotId: slot.id,
      date: slot.date,
      time: slot.time,
      doctor: slot.doctor,
      patientName: patient.name,
      confirmationEmailSent: true,
    },
  };
}

/**
 * Main Tool Handler Router
 * Routes incoming VAPI tool calls to their respective functions.
 */
export function executeVapiToolCall(toolCall: VapiToolCall): VapiToolResult {
  const name = toolCall.function.name;
  const args = toolCall.function.arguments || {};
  let resultData: any;

  switch (name) {
    case 'lookupPatient':
    case 'handleLookupPatient':
      resultData = handleLookupPatient(args as { name: string });
      break;

    case 'checkAvailability':
    case 'handleCheckAvailability':
      resultData = handleCheckAvailability(args as { date?: string });
      break;

    case 'bookAppointment':
    case 'handleBookAppointment':
      resultData = handleBookAppointment(
        args as { slotId: string; patientId: string; reason?: string }
      );
      break;

    default:
      resultData = {
        error: `Unknown tool function name: '${name}'. Supported functions: lookupPatient, checkAvailability, bookAppointment.`,
      };
      break;
  }

  return {
    toolCallId: toolCall.id,
    result: resultData,
  };
}
