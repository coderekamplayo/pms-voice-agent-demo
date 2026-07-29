/**
 * Mock Data Store for Practice Management System (PMS)
 * Contains interface definitions and sample patient and appointment slot datasets.
 */

export interface Patient {
  id: string;
  name: string;
  dob: string;
  email: string;
  phone: string;
}

export interface AppointmentSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "09:00 AM"
  doctor: string;
  status: 'available' | 'booked';
  patientId?: string;
  reason?: string;
}

/**
 * Initial fake patient database
 */
export const mockPatients: Patient[] = [
  {
    id: 'pat_101',
    name: 'Juan Dela Cruz',
    dob: '1990-05-15',
    email: 'juan.delacruz@example.com',
    phone: '+15551234567',
  },
  {
    id: 'pat_102',
    name: 'Maria Santos',
    dob: '1985-11-20',
    email: 'maria.santos@example.com',
    phone: '+15559876543',
  },
  {
    id: 'pat_103',
    name: 'Alex Rivera',
    dob: '1998-03-08',
    email: 'alex.rivera@example.com',
    phone: '+15554567890',
  },
];

/**
 * Initial mock appointment slots for clinic schedule
 */
export const mockAppointmentSlots: AppointmentSlot[] = [
  {
    id: 'slot_201',
    date: '2026-07-30',
    time: '09:00 AM',
    doctor: 'Dr. Sarah Jenkins',
    status: 'available',
  },
  {
    id: 'slot_202',
    date: '2026-07-30',
    time: '10:30 AM',
    doctor: 'Dr. Sarah Jenkins',
    status: 'available',
  },
  {
    id: 'slot_203',
    date: '2026-07-30',
    time: '02:00 PM',
    doctor: 'Dr. Michael Chen',
    status: 'booked',
    patientId: 'pat_102',
    reason: 'Routine Dental Checkup',
  },
  {
    id: 'slot_204',
    date: '2026-07-31',
    time: '11:00 AM',
    doctor: 'Dr. Michael Chen',
    status: 'available',
  },
  {
    id: 'slot_205',
    date: '2026-07-31',
    time: '03:30 PM',
    doctor: 'Dr. Sarah Jenkins',
    status: 'available',
  },
];
