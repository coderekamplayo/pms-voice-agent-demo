import {
  buildConfirmationEmail,
  buildMissedCallEmail,
  buildReminderEmail,
  sendEmail,
} from '../src/email/factory';

describe('Email Factory Unit Tests', () => {
  describe('buildConfirmationEmail', () => {
    it('should return subject, text body, and HTML output containing patient and appointment details', () => {
      const patientName = 'Juan Dela Cruz';
      const date = '2026-07-30';
      const time = '09:00 AM';
      const doctor = 'Dr. Sarah Jenkins';

      const email = buildConfirmationEmail(patientName, date, time, doctor);

      expect(email.subject).toContain(doctor);
      expect(email.subject).toContain(date);

      expect(email.body).toContain(patientName);
      expect(email.body).toContain(doctor);
      expect(email.body).toContain(date);
      expect(email.body).toContain(time);

      expect(email.html).toContain(patientName);
      expect(email.html).toContain(doctor);
      expect(email.html).toContain(date);
      expect(email.html).toContain(time);
    });
  });

  describe('buildReminderEmail', () => {
    it('should return valid reminder email payload with date and time parameters', () => {
      const patientName = 'Maria Santos';
      const date = '2026-07-31';
      const time = '11:00 AM';

      const email = buildReminderEmail(patientName, date, time);

      expect(email.subject).toContain('Reminder');
      expect(email.subject).toContain(date);

      expect(email.body).toContain(patientName);
      expect(email.body).toContain(date);
      expect(email.body).toContain(time);

      expect(email.html).toContain(patientName);
      expect(email.html).toContain(date);
      expect(email.html).toContain(time);
    });
  });

  describe('buildMissedCallEmail', () => {
    it('should return valid missed call notification email payload containing caller phone', () => {
      const callerPhone = '+15551234567';

      const email = buildMissedCallEmail(callerPhone);

      expect(email.subject).toContain(callerPhone);
      expect(email.body).toContain(callerPhone);
      expect(email.html).toContain(callerPhone);
    });
  });

  describe('sendEmail', () => {
    it('should log mock email dispatch and return true', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const success = sendEmail('test@example.com', 'Test Subject', 'Test Body');

      expect(success).toBe(true);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
