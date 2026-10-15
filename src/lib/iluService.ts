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

// Map tenant codes to numeric IDs by environment:
// Main branch (Production): 12 | Preview / Staging: 73
const TENANT_CODE_TO_ID: Record<string, { staging: number; production: number }> = {
  ILU001: {
    staging: 73,
    production: 12,
  },
};

const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  'https://staging-api.raihsuite.com/v1/';

const API_URL = `${RAW_BASE_URL.replace(/\/+$/, '')}/`;

const DEFAULT_TENANT_CODE =
  process.env.NEXT_PUBLIC_ILU_TENANT_CODE ||
  process.env.NEXT_PUBLIC_TENANT_CODE ||
  'ILU001';

const DEFAULT_FUNDRAISING_ID =
  process.env.NEXT_PUBLIC_ILU_FUNDRAISING_ID ||
  process.env.NEXT_PUBLIC_FUNDRAISING_ID ||
  '01a12f6e-124f-76bc-aec1-315fc26ef222';

const DEFAULT_TENANT_NAME =
  process.env.NEXT_PUBLIC_ILU_TENANT_NAME ||
  process.env.NEXT_PUBLIC_TENANT_NAME ||
  'ILU';

const DEFAULT_FUNDRAISING_NAME =
  process.env.NEXT_PUBLIC_ILU_FUNDRAISING_NAME ||
  process.env.NEXT_PUBLIC_FUNDRAISING_NAME ||
  'ilu payasam-challenge-2026';

const explicitTenantId = Number(
  process.env.NEXT_PUBLIC_ILU_TENANT_ID || process.env.NEXT_PUBLIC_TENANT_ID
);

const DEFAULT_TENANT_ID =
  !Number.isNaN(explicitTenantId) && explicitTenantId > 0
    ? explicitTenantId
    : isMainBranch
      ? TENANT_CODE_TO_ID[DEFAULT_TENANT_CODE]?.production ?? 12
      : TENANT_CODE_TO_ID[DEFAULT_TENANT_CODE]?.staging ?? 73;

export interface ILUConfig {
  TENANT_ID: number;
  TENANT_NAME: string;
  TENANT_CODE: string;
  FUNDRAISING_ID: string;
  FUNDRAISING_NAME: string;
  BASE_API_URL: string;
  ORGANIZATIONS_URL: string;
  ORDERS_URL: string;
  ORDER_STATUS_URL: string;
  ZONE_REPORTS_URL: string;
}

export const ILU_CONFIG: ILUConfig = {
  TENANT_ID: DEFAULT_TENANT_ID,
  TENANT_NAME: DEFAULT_TENANT_NAME,
  TENANT_CODE: DEFAULT_TENANT_CODE,
  FUNDRAISING_ID: DEFAULT_FUNDRAISING_ID,
  FUNDRAISING_NAME: DEFAULT_FUNDRAISING_NAME,
  BASE_API_URL: API_URL,
  ORGANIZATIONS_URL: `${API_URL}orders/organizations/`,
  ORDERS_URL: `${API_URL}orders/orders/`,
  ORDER_STATUS_URL: `${API_URL}orders/order_status/`,
  ZONE_REPORTS_URL: `${API_URL}orders/zone_reports/`,
};

export interface BackendTenant {
  id: number;
  name: string;
  code: string;
  address?: string | null;
}

export interface BackendFundraising {
  id: string;
  name: string;
  code: string;
  tenant: number | string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

function getResults<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (data && typeof data === 'object') {
    const obj = data as { results?: unknown; data?: unknown };

    if (Array.isArray(obj.results)) {
      return obj.results as T[];
    }

    if (Array.isArray(obj.data)) {
      return obj.data as T[];
    }
  }

  return [];
}

let configPromise: Promise<ILUConfig> | undefined;

/**
 * Loads tenant and fundraising details from the backend.
 * Falls back safely if backend metadata endpoints are restricted or unreachable.
 */
export function getILUConfig(): Promise<ILUConfig> {
  if (!configPromise) {
    configPromise = loadILUConfig().catch(() => ILU_CONFIG);
  }

  return configPromise;
}

async function loadILUConfig(): Promise<ILUConfig> {
  let resolvedTenantId = DEFAULT_TENANT_ID;
  let resolvedTenantName = DEFAULT_TENANT_NAME;
  let resolvedTenantCode = DEFAULT_TENANT_CODE;
  let resolvedFundraisingId = DEFAULT_FUNDRAISING_ID;
  let resolvedFundraisingName = DEFAULT_FUNDRAISING_NAME;

  try {
    const [tenantResponse, fundraisingResponse] = await Promise.all([
      fetch(`${API_URL}tenants/tenants/`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }).catch(() => null),
      fetch(`${API_URL}orders/fundraising/`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }).catch(() => null),
    ]);

    if (tenantResponse && tenantResponse.ok) {
      const tenants = getResults<BackendTenant>(await tenantResponse.json().catch(() => null));
      const matchedTenant = tenants.find(
        (item) => String(item.code).trim().toLowerCase() === DEFAULT_TENANT_CODE.trim().toLowerCase()
      );
      if (matchedTenant) {
        resolvedTenantId = matchedTenant.id;
        resolvedTenantName = matchedTenant.name;
        resolvedTenantCode = matchedTenant.code;
      }
    }

    if (fundraisingResponse && fundraisingResponse.ok) {
      const fundraisings = getResults<BackendFundraising>(
        await fundraisingResponse.json().catch(() => null)
      );
      const matchedFundraising = fundraisings.find(
        (item) => String(item.id) === DEFAULT_FUNDRAISING_ID
      );
      if (matchedFundraising) {
        resolvedFundraisingId = matchedFundraising.id;
        resolvedFundraisingName = matchedFundraising.name;
      }
    }
  } catch {
    // Graceful fallback to resolved defaults
  }

  return {
    TENANT_ID: resolvedTenantId,
    TENANT_NAME: resolvedTenantName,
    TENANT_CODE: resolvedTenantCode,
    FUNDRAISING_ID: resolvedFundraisingId,
    FUNDRAISING_NAME: resolvedFundraisingName,
    BASE_API_URL: API_URL,
    ORGANIZATIONS_URL: `${API_URL}orders/organizations/`,
    ORDERS_URL: `${API_URL}orders/orders/`,
    ORDER_STATUS_URL: `${API_URL}orders/order_status/`,
    ZONE_REPORTS_URL: `${API_URL}orders/zone_reports/`,
  };
}

export interface BackendOrganization {
  id: string;
  place: string;
  organization_name: string;
  zone_name?: string | null;
  zone?: string | null;
  total_count?: number;
  approved_count?: number;
  delivered_count?: number;
  is_active?: boolean;
  tenant?: number | string | null;
  responsible_person_name?: string | null;
  mobile?: string | null;
}

export interface Club {
  id: string;
  name: string;
  contactPerson: string;
  mobileNumber: string;
  location: string;
  district: string;
  isActive?: boolean;
  tenant?: number | string | null;
  raw?: BackendOrganization;
}

export interface ClubsFetchResult {
  clubs: Club[];
  hasTenantAssociation: boolean;
  warningNotice?: string;
}

export interface Order {
  id: string;
  orderRef: string;
  clubId: string;
  clubName: string;
  contactPerson: string;
  mobileNumber: string;
  quantityLiters: number;
  status: 'confirmed' | 'processing' | 'cancelled' | string;
  createdAt: string;
  raw?: unknown;
}

export interface ClubSummary {
  clubId: string;
  clubName: string;
  contactPerson: string;
  mobileNumber: string;
  location?: string;
  totalQuantityLiters: number;
  orderCount: number;
  lastOrderDate: string;
  raw?: BackendOrganization;
}

export interface BackendOrderStatus {
  grand_total: number;
  organization_total: number;
  individual_total: number;
  total_approved: number;
  total_delivered: number;
  total_cancelled: number;
  total_stock: number;
  total_order: number;
}

export interface OrderStatusResponse {
  success: boolean;
  orders: Order[];
  summaries: ClubSummary[];
  organizationTotalLiters: number;
  grandTotalLiters: number;
  individualTotalLiters?: number;
  totalStock?: number;
  totalApproved?: number;
  totalDelivered?: number;
  totalOrderCount?: number;
  raw?: BackendOrderStatus;
}

export interface BackendOrderPayload {
  tenant: number;
  fundraising: string;
  order_type: 'organization';
  organization: string;
  quantity: number;
  security_code: string;
  status: 'APPROVED' | 'INITIATED' | string;
}

// Empty compatibility exports: real clubs/orders must come from the backend.
// These preserve existing imports while avoiding hardcoded demo data.
export const FALLBACK_BACKEND_CLUBS: Club[] = [];
export const SEED_CLUBS: Club[] = [];
export const SEED_ORDERS: Order[] = [];

/**
 * Validates order quantity:
 * - Must be a positive whole number.
 * - Decimal, zero, negative, and non-numeric values are rejected.
 */
export function validateOrderQuantity(value: string | number): {
  isValid: boolean;
  quantity?: number;
  error?: string;
} {
  const str = String(value).trim();

  if (!str) {
    return { isValid: false, error: 'Please enter a quantity.' };
  }

  if (!/^\d+$/.test(str)) {
    return {
      isValid: false,
      error:
        'Fractional or non-integer quantities are not allowed. Please enter a positive whole number.',
    };
  }

  const quantity = Number(str);

  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    return {
      isValid: false,
      error: 'Quantity must be a positive whole number (at least 1 liter).',
    };
  }

  return { isValid: true, quantity };
}

/**
 * Validates the club security code: exactly six numeric digits.
 */
export function validateSecurityCode(value: string): {
  isValid: boolean;
  code?: string;
  error?: string;
} {
  const code = (value || '').trim();

  if (!code) {
    return {
      isValid: false,
      error: 'Please enter your club 6-digit security code.',
    };
  }

  if (!/^\d{6}$/.test(code)) {
    return {
      isValid: false,
      error: 'Security code must be exactly 6 digits.',
    };
  }

  return { isValid: true, code };
}

/**
 * Constructs the validated payload using tenant/fundraising data from the API.
 */
export async function constructOrderPayload(
  clubId: string,
  quantity: number,
  securityCode: string
): Promise<BackendOrderPayload> {
  const config = await getILUConfig();

  return {
    tenant: config.TENANT_ID,
    fundraising: config.FUNDRAISING_ID,
    order_type: 'organization',
    organization: clubId,
    quantity,
    security_code: securityCode.trim(),
    status: 'APPROVED',
  };
}

/**
 * Converts backend API errors into user-friendly messages.
 */
export function normalizeApiError(
  errorData: unknown,
  fallbackMessage = 'Failed to submit order'
): string {
  if (!errorData) return fallbackMessage;
  if (typeof errorData === 'string') return errorData;

  if (typeof errorData === 'object' && errorData !== null) {
    const errorObject = errorData as Record<string, unknown>;

    if (errorObject.security_code) {
      return 'നൽകിയ സെക്യൂരിറ്റി കോഡ് തെറ്റാണ്. ദയവായി ശരിയായ 6 അക്ക സെക്യൂരിറ്റി കോഡ് നൽകുക.';
    }

    if (typeof errorObject.message === 'string') return errorObject.message;
    if (typeof errorObject.error === 'string') return errorObject.error;
    if (typeof errorObject.detail === 'string') return errorObject.detail;

    const messages: string[] = [];

    for (const [field, errors] of Object.entries(errorObject)) {
      if (Array.isArray(errors)) {
        if (field === 'security_code') {
          return 'നൽകിയ സെക്യൂരിറ്റി കോഡ് തെറ്റാണ്. ദയവായി ശരിയായ 6 അക്ക സെക്യൂരിറ്റി കോഡ് നൽകുക.';
        }

        const label = field === 'non_field_errors' ? '' : `${field}: `;
        messages.push(`${label}${errors.map(String).join(' ')}`);
      } else if (typeof errors === 'string') {
        if (field === 'security_code') {
          return 'നൽകിയ സെക്യൂരിറ്റി കോഡ് തെറ്റാണ്. ദയവായി ശരിയായ 6 അക്ക സെക്യൂരിറ്റി കോഡ് നൽകുക.';
        }

        messages.push(`${field}: ${errors}`);
      }
    }

    if (messages.length > 0) {
      return messages.join(' | ');
    }
  }

  return fallbackMessage;
}

/**
 * Maps an organization returned by the backend into the UI's Club type.
 * Contact information is taken only from backend fields.
 */
export function mapBackendOrganizationToClub(
  org: BackendOrganization
): Club {
  return {
    id: org.id,
    name: org.organization_name,
    contactPerson: org.responsible_person_name?.trim() ?? '',
    mobileNumber: org.mobile?.trim() ?? '',
    location: org.place ?? '',
    district: org.zone_name || org.zone || org.place || '',
    isActive: org.is_active !== false,
    tenant: org.tenant ?? undefined,
    raw: org,
  };
}

function getOrganizationResults(data: unknown): BackendOrganization[] {
  return getResults<BackendOrganization>(data);
}

/**
 * Fetches organizations from the backend.
 * No demo/fallback clubs are returned if the API fails or has no results.
 */
export async function fetchClubsApi(): Promise<ClubsFetchResult> {
  const config = await getILUConfig();
  const url = `${config.ORGANIZATIONS_URL}?tenant=${encodeURIComponent(
    String(config.TENANT_ID)
  )}&limit=500&offset=0`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load organizations (${response.status} ${response.statusText}).`
    );
  }

  const organizations = getOrganizationResults(await response.json());
  const activeOrganizations = organizations.filter(
    (organization) => organization.is_active !== false
  );

  const organizationsWithTenant = activeOrganizations.filter(
    (organization) =>
      organization.tenant !== undefined && organization.tenant !== null
  );

  const hasTenantAssociation = organizationsWithTenant.length > 0;

  // If the API returns tenant IDs, verify each record. If it omits tenant,
  // this relies on the backend honoring the ?tenant= query parameter.
  const targetOrganizations = hasTenantAssociation
    ? activeOrganizations.filter(
      (organization) =>
        String(organization.tenant) === String(config.TENANT_ID)
    )
    : activeOrganizations;

  return {
    clubs: targetOrganizations.map(mapBackendOrganizationToClub),
    hasTenantAssociation,
    warningNotice: hasTenantAssociation
      ? undefined
      : 'The organizations API response does not include tenant association; results rely on backend tenant filtering.',
  };
}

export interface CreateOrganizationInput {
  organization_name: string;
  responsible_person_name: string;
  place: string;
  mobile: string;
}

/**
 * Creates a new organization/club on the backend.
 */
export async function createOrganizationApi(
  data: CreateOrganizationInput
): Promise<Club> {
  const orgName = data.organization_name.trim();
  const personName = data.responsible_person_name.trim();
  const place = data.place.trim();
  const mobile = data.mobile.trim();

  if (!orgName) {
    throw new Error('ക്ലബ്ബ് / കൂട്ടായ്മയുടെ പേര് നൽകുക.');
  }
  if (!personName) {
    throw new Error('ചുമതലയുള്ള വ്യക്തിയുടെ പേര് നൽകുക.');
  }
  if (!place) {
    throw new Error('സ്ഥലം നൽകുക.');
  }
  if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
    throw new Error('സാധുവായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക.');
  }

  const config = await getILUConfig();
  const url = `${config.ORGANIZATIONS_URL}?tenant=${encodeURIComponent(
    String(config.TENANT_ID)
  )}`;

  const payload = {
    organization_name: orgName,
    responsible_person_name: personName,
    place,
    mobile,
    tenant: config.TENANT_ID,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseData: any = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      normalizeApiError(
        responseData,
        `ക്ലബ് ചേർക്കുന്നതിൽ പിശക് സംഭവിച്ചു (${response.status} ${response.statusText}).`
      )
    );
  }

  return mapBackendOrganizationToClub({
    id: String(responseData?.id ?? ''),
    place: responseData?.place ?? place,
    organization_name: responseData?.organization_name ?? orgName,
    responsible_person_name: responseData?.responsible_person_name ?? personName,
    mobile: responseData?.mobile ?? mobile,
    is_active: true,
    tenant: responseData?.tenant ?? null,
  });
}

/**
 * Submits an organization order using the resolved backend configuration.
 */
export async function submitOrderApi(
  clubId: string,
  quantityLiters: number,
  securityCode: string,
  clubName?: string
): Promise<Order> {
  if (!clubId || typeof clubId !== 'string') {
    throw new Error('Please select a valid club.');
  }

  const quantityValidation = validateOrderQuantity(quantityLiters);

  if (!quantityValidation.isValid || quantityValidation.quantity === undefined) {
    throw new Error(quantityValidation.error || 'Invalid quantity.');
  }

  const securityValidation = validateSecurityCode(securityCode);

  if (!securityValidation.isValid || !securityValidation.code) {
    throw new Error(securityValidation.error || 'Invalid security code.');
  }

  const config = await getILUConfig();
  const payload = await constructOrderPayload(
    clubId,
    quantityValidation.quantity,
    securityValidation.code
  );

  const response = await fetch(config.ORDERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseData: any = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      normalizeApiError(
        responseData,
        `Backend submission failed (${response.status} ${response.statusText})`
      )
    );
  }

  return {
    id: String(responseData?.id ?? responseData?.order_no ?? ''),
    orderRef: String(
      responseData?.order_no ??
      responseData?.order_number ??
      responseData?.id ??
      ''
    ),
    clubId: String(responseData?.organization ?? clubId),
    clubName: String(
      responseData?.organization_name ?? clubName ?? ''
    ),
    contactPerson: String(responseData?.order_by_name ?? ''),
    mobileNumber: String(responseData?.mobile ?? ''),
    quantityLiters: Number(
      responseData?.quantity ?? quantityValidation.quantity
    ),
    status: String(responseData?.status ?? 'APPROVED'),
    createdAt: String(responseData?.created_at ?? ''),
    raw: responseData,
  };
}

/**
 * Fetches the order status report and organization summaries from the backend.
 * Errors are thrown instead of returning fabricated/demo totals.
 */
export async function fetchOrderStatusApi(): Promise<OrderStatusResponse> {
  const config = await getILUConfig();

  const statusUrl = `${config.ORDER_STATUS_URL}?tenant=${encodeURIComponent(
    String(config.TENANT_ID)
  )}`;
  const organizationsUrl = `${config.ORGANIZATIONS_URL}?tenant=${encodeURIComponent(
    String(config.TENANT_ID)
  )}&limit=500&offset=0`;

  const [statusResponse, organizationsResponse] = await Promise.all([
    fetch(statusUrl, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    }),
    fetch(organizationsUrl, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    }),
  ]);

  if (!statusResponse.ok) {
    throw new Error(
      `Failed to load order status (${statusResponse.status} ${statusResponse.statusText}).`
    );
  }

  if (!organizationsResponse.ok) {
    throw new Error(
      `Failed to load organizations (${organizationsResponse.status} ${organizationsResponse.statusText}).`
    );
  }

  const rawStats = (await statusResponse.json()) as BackendOrderStatus;
  const organizations = getOrganizationResults(
    await organizationsResponse.json()
  );

  const summaries: ClubSummary[] = organizations
    .filter((organization) => organization.is_active !== false)
    .filter((organization) => {
      if (organization.tenant === undefined || organization.tenant === null) {
        // The backend has already received the tenant query parameter.
        return true;
      }

      return String(organization.tenant) === String(config.TENANT_ID);
    })
    .map((organization) => ({
      clubId: organization.id,
      clubName: organization.organization_name,
      contactPerson: organization.responsible_person_name?.trim() ?? '',
      mobileNumber: organization.mobile?.trim() ?? '',
      location: organization.place ?? '',
      totalQuantityLiters: Number(organization.total_count || organization.approved_count || 0),
      orderCount: Number(organization.approved_count || organization.total_count || 0),
      lastOrderDate: '',
      raw: organization,
    }))
    .sort(
      (a, b) => b.totalQuantityLiters - a.totalQuantityLiters
    );

  const calculatedSum = summaries.reduce(
    (acc, item) => acc + (item.totalQuantityLiters || 0),
    0
  );

  const organizationTotal = Number(
    rawStats.organization_total ||
    rawStats.total_approved ||
    rawStats.total_order ||
    calculatedSum ||
    0
  );
  const grandTotal = Number(
    rawStats.grand_total ||
    rawStats.total_order ||
    organizationTotal
  );

  return {
    success: true,
    orders: [],
    summaries,
    organizationTotalLiters: organizationTotal,
    grandTotalLiters: grandTotal,
    individualTotalLiters: Number(rawStats.individual_total ?? 0),
    totalStock: Number(rawStats.total_stock ?? 0),
    totalApproved: Number(rawStats.total_approved ?? 0),
    totalDelivered: Number(rawStats.total_delivered ?? 0),
    totalOrderCount: Number(rawStats.total_order ?? 0),
    raw: rawStats,
  };
}
