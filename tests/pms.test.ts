import { PMSService } from '../src/mocks/pms';

describe('PMSService Unit Tests', () => {
  let pms: PMSService;

  beforeEach(() => {
    // Instantiate fresh service instance before each test to maintain clean state
    pms = new PMSService();
  });

  describe('lookupPatientByName', () => {
    it('should return patient record when looking up existing patient "Juan Dela Cruz"', () => {
      const patient = pms.lookupPatientByName('Juan Dela Cruz');
      expect(patient).toBeDefined();
      expect(patient?.id).toBe('pat_101');
      expect(patient?.name).toBe('Juan Dela Cruz');
      expect(patient?.email).toBe('juan.delacruz@example.com');
    });

    it('should support case-insensitive and partial name lookup', () => {
      const patient = pms.lookupPatientByName('juan');
      expect(patient).toBeDefined();
      expect(patient?.name).toBe('Juan Dela Cruz');
    });

    it('should return undefined for non-existent patient query', () => {
      const patient = pms.lookupPatientByName('NonExistent Patient');
      expect(patient).toBeUndefined();
    });

    it('should return undefined when empty string is provided', () => {
      const patient = pms.lookupPatientByName('');
      expect(patient).toBeUndefined();
    });
  });

  describe('getAvailableSlots', () => {
    it('should return all available appointment slots when no date is specified', () => {
      const slots = pms.getAvailableSlots();
      expect(Array.isArray(slots)).toBe(true);
      expect(slots.length).toBeGreaterThan(0);
      slots.forEach((slot) => {
        expect(slot.status).toBe('available');
      });
    });

    it('should filter available slots by specific date', () => {
      const targetDate = '2026-07-30';
      const slots = pms.getAvailableSlots(targetDate);
      expect(slots.length).toBeGreaterThan(0);
      slots.forEach((slot) => {
        expect(slot.date).toBe(targetDate);
        expect(slot.status).toBe('available');
      });
    });
  });

  describe('bookSlot', () => {
    it('should successfully book an available slot and update its status to booked', () => {
      const slotId = 'slot_201';
      const patientId = 'pat_101';
      const reason = 'Routine Dental Checkup';

      const bookingResult = pms.bookSlot(slotId, patientId, reason);

      expect(bookingResult.success).toBe(true);
      expect(bookingResult.slot).toBeDefined();
      expect(bookingResult.slot?.id).toBe(slotId);
      expect(bookingResult.slot?.status).toBe('booked');
      expect(bookingResult.slot?.patientId).toBe(patientId);
      expect(bookingResult.slot?.reason).toBe(reason);

      // Verify that slot_201 is no longer returned in available slots
      const availableSlots = pms.getAvailableSlots('2026-07-30');
      const foundInAvailable = availableSlots.some((s) => s.id === slotId);
      expect(foundInAvailable).toBe(false);
    });

    it('should fail when attempting to book an already booked slot', () => {
      const slotId = 'slot_203'; // Pre-booked slot in mock data
      const patientId = 'pat_101';

      const bookingResult = pms.bookSlot(slotId, patientId, 'Dental Exam');

      expect(bookingResult.success).toBe(false);
      expect(bookingResult.message).toContain('already booked');
    });

    it('should fail when slot ID does not exist', () => {
      const bookingResult = pms.bookSlot('invalid_slot_id', 'pat_101', 'Checkup');

      expect(bookingResult.success).toBe(false);
      expect(bookingResult.message).toContain('not found');
    });

    it('should fail when patient ID does not exist', () => {
      const bookingResult = pms.bookSlot('slot_201', 'non_existent_pat', 'Checkup');

      expect(bookingResult.success).toBe(false);
      expect(bookingResult.message).toContain('does not exist');
    });
  });
});
