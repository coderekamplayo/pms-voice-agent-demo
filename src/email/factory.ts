/**
 * Simulated Postmark Email Delivery & Template Factory
 */

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  html: string;
}

/**
 * 1. Build appointment booking confirmation email template
 */
export function buildConfirmationEmail(
  patientName: string,
  date: string,
  time: string,
  doctor: string
): { subject: string; body: string; html: string } {
  const subject = `Appointment Confirmed with ${doctor} - ${date}`;
  const body = `Hello ${patientName},\n\nYour appointment with ${doctor} has been successfully scheduled for ${date} at ${time}.\n\nThank you for choosing our clinic!`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2c3e50;">Appointment Confirmation</h2>
      <p>Dear <strong>${patientName}</strong>,</p>
      <p>Your appointment has been confirmed with the following details:</p>
      <ul>
        <li><strong>Doctor:</strong> ${doctor}</li>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
      </ul>
      <p>We look forward to seeing you!</p>
    </div>
  `;

  return { subject, body, html };
}

/**
 * 2. Build appointment reminder email template
 */
export function buildReminderEmail(
  patientName: string,
  date: string,
  time: string
): { subject: string; body: string; html: string } {
  const subject = `Reminder: Upcoming Appointment on ${date}`;
  const body = `Hi ${patientName},\n\nThis is a friendly reminder for your upcoming appointment scheduled for ${date} at ${time}.\n\nPlease call us if you need to reschedule.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2980b9;">Appointment Reminder</h2>
      <p>Hi <strong>${patientName}</strong>,</p>
      <p>This is a quick reminder about your scheduled clinic visit on <strong>${date} at ${time}</strong>.</p>
      <p>If you need to reschedule or cancel, please contact reception.</p>
    </div>
  `;

  return { subject, body, html };
}

/**
 * 3. Build missed call email template
 */
export function buildMissedCallEmail(
  callerPhone: string
): { subject: string; body: string; html: string } {
  const subject = `Missed Call Notification from ${callerPhone}`;
  const body = `Notification: A call from ${callerPhone} was received by the AI Receptionist system. Follow up may be required.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #c0392b;">Missed Call Alert</h2>
      <p>An incoming call was logged from <strong>${callerPhone}</strong>.</p>
      <p>Please review patient records to initiate a follow-up call.</p>
    </div>
  `;

  return { subject, body, html };
}

/**
 * Mock Postmark send email dispatcher
 */
export function sendEmail(to: string, subject: string, body: string): boolean {
  console.log('\n==================================================');
  console.log('📧 [MOCK EMAIL DISPATCHER - POSTMARK SIMULATOR]');
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('--------------------------------------------------');
  console.log(body);
  console.log('==================================================\n');
  return true;
}
