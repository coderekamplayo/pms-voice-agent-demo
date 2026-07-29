import { AppointmentSlot, mockAppointmentSlots, mockPatients, Patient } from './data';

/**
 * Mock Practice Management System (PMS) Service
 * Simulates Cliniko or similar medical PMS API endpoints.
 */
export class PMSService {
  private patients: Patient[];
  private slots: AppointmentSlot[];

  constructor() {
    // In-memory clones to allow state changes during runtime testing
    this.patients = [...mockPatients];
    this.slots = [...mockAppointmentSlots];
  }

  /**
   * Search patient database by full or partial name (case-insensitive)
   */
  public lookupPatientByName(name: string): Patient | undefined {
    if (!name || name.trim().length === 0) {
      return undefined;
    }
    const query = name.trim().toLowerCase();
    return this.patients.find((patient) =>
      patient.name.toLowerCase().includes(query)
    );
  }

  /**
   * Fetch available appointment slots, optionally filtered by date (YYYY-MM-DD)
   */
  public getAvailableSlots(date?: string): AppointmentSlot[] {
    return this.slots.filter((slot) => {
      const isAvailable = slot.status === 'available';
      if (date && date.trim().length > 0) {
        return isAvailable && slot.date === date.trim();
      }
      return isAvailable;
    });
  }

  /**
   * Book an available slot for a given patient
   */
  public bookSlot(
    slotId: string,
    patientId: string,
    reason: string = 'General Consultation'
  ): { success: boolean; slot?: AppointmentSlot; message: string } {
    const slotIndex = this.slots.findIndex((s) => s.id === slotId);

    if (slotIndex === -1) {
      return {
        success: false,
        message: `Appointment slot with ID '${slotId}' not found.`,
      };
    }

    const slot = this.slots[slotIndex];

    if (slot.status === 'booked') {
      return {
        success: false,
        slot,
        message: `Slot '${slotId}' on ${slot.date} at ${slot.time} is already booked.`,
      };
    }

    const patientExists = this.patients.some((p) => p.id === patientId);
    if (!patientExists) {
      return {
        success: false,
        message: `Patient with ID '${patientId}' does not exist in the PMS.`,
      };
    }

    // Update slot status and link patient
    const updatedSlot: AppointmentSlot = {
      ...slot,
      status: 'booked',
      patientId,
      reason,
    };

    this.slots[slotIndex] = updatedSlot;

    return {
      success: true,
      slot: updatedSlot,
      message: `Appointment successfully booked for slot '${slotId}'.`,
    };
  }
}

// Export singleton instance for global use across the server
export const pmsService = new PMSService();
