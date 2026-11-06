/**
 * Service for ILU Volunteer Registration.
 * Submits participants to the official Raihsuite programs API.
 */

const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  'https://staging-api.raihsuite.com/v1/';

export const ILU_VOLUNTEER_PROGRAM_ID =
  process.env.NEXT_PUBLIC_ILU_VOLUNTEER_PROGRAM_ID ||
  '01a1b00a-394f-7991-bd86-342648b14fcc';

export const ILU_VOLUNTEER_PROGRAM_CODE =
  process.env.NEXT_PUBLIC_ILU_VOLUNTEER_PROGRAM_CODE ||
  'ILUV001';

export const VOLUNTEER_API_URL =
  process.env.NEXT_PUBLIC_ILU_VOLUNTEER_API_URL ||
  `${RAW_BASE_URL.replace(/\/+$/, '')}/programs/participants/`;

export interface VolunteerFormData {
  name: string;
  mobile: string;
  clubName?: string;
  place: string;
}

export interface VolunteerParticipant {
  id: string;
  tenant: number;
  program: string;
  program_name: string;
  code?: string;
  first_name: string;
  last_name: string;
  participant_name: string;
  number?: number;
  email: string | null;
  phone: string;
  place: string;
  custom_data: {
    club_name?: string;
    [key: string]: unknown;
  };
  custom_values: unknown[];
  created_at: string;
  updated_at: string;
}

/**
 * Validates 10-digit Indian mobile number.
 */
export function validateMobileNumber(mobile: string): {
  isValid: boolean;
  cleanNumber: string;
  error?: string;
} {
  const cleanNumber = mobile.replace(/[^0-9]/g, '');

  if (!cleanNumber) {
    return {
      isValid: false,
      cleanNumber: '',
      error: 'Enter WhatsApp number.',
    };
  }

  if (cleanNumber.length !== 10) {
    return {
      isValid: false,
      cleanNumber,
      error: 'Enter a valid 10-digit WhatsApp number.',
    };
  }

  if (!/^[6-9]/.test(cleanNumber)) {
    return {
      isValid: false,
      cleanNumber,
      error: 'WhatsApp number must start with 6, 7, 8, or 9.',
    };
  }

  return { isValid: true, cleanNumber };
}

/**
 * Retrieves or formats the official volunteer pass code.
 * Directly uses the backend `code` field if present, otherwise
 * formats the numeric sequence into ILUV-0001.
 */
export function formatVolunteerPassId(
  input: { code?: string; number?: number } | number | null | undefined
): string {
  if (!input) return 'ILUV-0001';

  if (typeof input === 'number') {
    const padded = String(input).padStart(4, '0');
    return `ILUV-${padded}`;
  }

  if (input.code && typeof input.code === 'string' && input.code.trim()) {
    return input.code.trim();
  }

  if (typeof input.number === 'number' && !Number.isNaN(input.number)) {
    const padded = String(input.number).padStart(4, '0');
    return `ILUV-${padded}`;
  }

  return 'ILUV-0001';
}

/**
 * Submits the volunteer registration form to the backend.
 */
export async function registerVolunteer(
  data: VolunteerFormData
): Promise<VolunteerParticipant> {
  const trimmedName = data.name.trim();
  const trimmedClub = (data.clubName || '').trim();
  const trimmedPlace = data.place.trim();
  const mobileValidation = validateMobileNumber(data.mobile);

  if (!trimmedName) {
    throw new Error('Please enter full name.');
  }

  if (!mobileValidation.isValid) {
    throw new Error(mobileValidation.error || 'Please enter a valid WhatsApp number.');
  }

  if (!trimmedPlace) {
    throw new Error('Please enter place.');
  }

  const payload = {
    program: ILU_VOLUNTEER_PROGRAM_ID,
    first_name: trimmedName,
    phone: mobileValidation.cleanNumber,
    place: trimmedPlace,
    custom_data: trimmedClub ? { club_name: trimmedClub } : {},
  };

  const response = await fetch(VOLUNTEER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    if (responseData && responseData.phone) {
      const phoneErrors = Array.isArray(responseData.phone)
        ? responseData.phone.join(' ')
        : String(responseData.phone);

      if (phoneErrors.toLowerCase().includes('already registered')) {
        throw new Error(
          `This WhatsApp number (+91 ${mobileValidation.cleanNumber}) is already registered for this program.`
        );
      }
      throw new Error(phoneErrors);
    }

    if (responseData && typeof responseData === 'object') {
      const messages = Object.entries(responseData)
        .map(([field, err]) => `${field}: ${Array.isArray(err) ? err.join(', ') : err}`)
        .join('; ');
      throw new Error(messages || 'Registration failed. Please check your inputs.');
    }

    throw new Error(
      `Registration failed (Status: ${response.status}). Please try again.`
    );
  }

  return responseData as VolunteerParticipant;
}
