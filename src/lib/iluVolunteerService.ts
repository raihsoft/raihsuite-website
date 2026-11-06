/**
 * Service for ILU Volunteer Registration.
 * Submits participants to the official Raihsuite programs API.
 */

// Detect Main (Production) branch or production API
const isMainBranch =
  process.env.CF_PAGES_BRANCH === 'main' ||
  process.env.NEXT_PUBLIC_CF_PAGES_BRANCH === 'main' ||
  process.env.CF_PAGES_ENVIRONMENT === 'production' ||
  process.env.NEXT_PUBLIC_CF_PAGES_ENVIRONMENT === 'production' ||
  Boolean(
    process.env.NEXT_PUBLIC_BASE_API_URL &&
      !process.env.NEXT_PUBLIC_BASE_API_URL.includes('staging') &&
      !process.env.NEXT_PUBLIC_BASE_API_URL.includes('localhost')
  );

export const DEFAULT_PROD_PROGRAM_ID = '01a1b175-994c-7a30-98ec-fbe198b971de';
export const DEFAULT_STAGING_PROGRAM_ID = '01a1b00a-394f-7991-bd86-342648b14fcc';

const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  (isMainBranch
    ? 'https://api.raihsuite.com/v1/'
    : 'https://staging-api.raihsuite.com/v1/');

const rawProgramId =
  process.env.NEXT_PUBLIC_ILU_VOLUNTEER_PROGRAM_ID ||
  (isMainBranch ? DEFAULT_PROD_PROGRAM_ID : DEFAULT_STAGING_PROGRAM_ID);

export const ILU_VOLUNTEER_PROGRAM_ID = rawProgramId.trim().replace(/\/+$/, '');

export const ILU_VOLUNTEER_PROGRAM_CODE =
  process.env.NEXT_PUBLIC_ILU_VOLUNTEER_PROGRAM_CODE ||
  'ILUV001';

export const PROGRAMS_API_URL =
  process.env.NEXT_PUBLIC_ILU_PROGRAMS_API_URL ||
  `${RAW_BASE_URL.replace(/\/+$/, '')}/programs/programs/`;

export const VOLUNTEER_API_URL =
  process.env.NEXT_PUBLIC_ILU_VOLUNTEER_API_URL ||
  `${RAW_BASE_URL.replace(/\/+$/, '')}/programs/participants/`;

export interface BackendProgram {
  id: string;
  name: string;
  code: string;
  description?: string;
  tenant?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  is_public?: boolean;
  participants_count?: number;
}

export interface VolunteerFormData {
  name: string;
  mobile: string;
  clubName?: string;
  place: string;
  programCode?: string;
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

const programCache: Record<string, BackendProgram> = {};
const programIdCache: Record<string, string> = {};

/**
 * Fetches program details from the backend using the program code (e.g. 'ILUV001').
 */
export async function fetchProgramByCode(
  code: string = ILU_VOLUNTEER_PROGRAM_CODE
): Promise<BackendProgram | null> {
  const trimmedCode = (code || '').trim() || ILU_VOLUNTEER_PROGRAM_CODE;

  if (programCache[trimmedCode]) {
    return programCache[trimmedCode];
  }

  try {
    const url = `${PROGRAMS_API_URL}?code=${encodeURIComponent(trimmedCode)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const results: BackendProgram[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : data?.id
            ? [data]
            : [];

      const match =
        results.find(
          (p) => p.code?.toUpperCase() === trimmedCode.toUpperCase()
        ) || results[0];

      if (match?.id) {
        programCache[trimmedCode] = match;
        programIdCache[trimmedCode] = match.id;
        return match;
      }
    }
  } catch (err) {
    console.warn(
      `[iluVolunteerService] Failed to fetch program by code ${trimmedCode}:`,
      err
    );
  }

  return null;
}

/**
 * Resolves the program ID using its code.
 * Queries /v1/programs/programs/?code=<code> and returns the program UUID.
 * Falls back to ILU_VOLUNTEER_PROGRAM_ID if not found.
 */
export async function resolveProgramIdByCode(
  code: string = ILU_VOLUNTEER_PROGRAM_CODE
): Promise<string> {
  const trimmedCode = (code || '').trim() || ILU_VOLUNTEER_PROGRAM_CODE;

  if (programIdCache[trimmedCode]) {
    return programIdCache[trimmedCode];
  }

  const program = await fetchProgramByCode(trimmedCode);
  if (program?.id) {
    return program.id;
  }

  return ILU_VOLUNTEER_PROGRAM_ID;
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
  const targetCode = data.programCode?.trim() || ILU_VOLUNTEER_PROGRAM_CODE;
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

  // Resolve program ID dynamically using the program code
  const programId = await resolveProgramIdByCode(targetCode);

  const payload = {
    program: programId,
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
