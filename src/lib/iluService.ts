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

const DEFAULT_FUNDRAISING_CODE =
  process.env.NEXT_PUBLIC_ILU_FUNDRAISING_CODE ||
  process.env.NEXT_PUBLIC_FUNDRAISING_CODE ||
  DEFAULT_TENANT_CODE ||
  'ILU001';

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
  FUNDRAISING_CODE: string;
  BASE_API_URL: string;
  ORGANIZATIONS_URL: string;
  ORDER_BY_ORGANIZATION_URL: string;
  ORDERS_URL: string;
  ORDER_STATUS_URL: string;
  ZONE_REPORTS_URL: string;
  FUNDRAISING_ITEMS_URL: string;
  DONATIONS_URL: string;
}

export const ILU_CONFIG: ILUConfig = {
  TENANT_ID: DEFAULT_TENANT_ID,
  TENANT_NAME: DEFAULT_TENANT_NAME,
  TENANT_CODE: DEFAULT_TENANT_CODE,
  FUNDRAISING_ID: DEFAULT_FUNDRAISING_ID,
  FUNDRAISING_NAME: DEFAULT_FUNDRAISING_NAME,
  FUNDRAISING_CODE: DEFAULT_FUNDRAISING_CODE,
  BASE_API_URL: API_URL,
  ORGANIZATIONS_URL: `${API_URL}orders/organizations/`,
  ORDER_BY_ORGANIZATION_URL: `${API_URL}orders/order_by_organization/`,
  ORDERS_URL: `${API_URL}orders/orders/`,
  ORDER_STATUS_URL: `${API_URL}orders/order_status/`,
  ZONE_REPORTS_URL: `${API_URL}orders/zone_reports/`,
  FUNDRAISING_ITEMS_URL: `${API_URL}orders/fundraising_items/`,
  DONATIONS_URL: `${API_URL}orders/donations/`,
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

/**
 * Returns configuration for ILU services based on environment and defaults.
 */
export function getILUConfig(): Promise<ILUConfig> {
  return Promise.resolve(ILU_CONFIG);
}

export interface BackendOrderByOrganization {
  organization_id: string;
  organization_name: string;
  last_ordered_at?: string | null;
  total_order?: number;
  total_order_quantity?: string | number;
  total_approved?: string | number;
  total_delivered?: string | number;
  total_cancelled?: string | number;
  total_initiated?: string | number;
  orders?: Array<{
    order_by_name?: string;
    order_number?: string;
    quantity?: number;
    status?: string;
    order_date?: string;
  }>;
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

  const fundraisingParam =
    config.FUNDRAISING_CODE ||
    config.TENANT_CODE ||
    config.FUNDRAISING_ID ||
    'ILU001';

  const statusUrl = `${config.ORDER_STATUS_URL}?tenant=${encodeURIComponent(
    String(config.TENANT_ID)
  )}&fundraising=${encodeURIComponent(fundraisingParam)}`;

  const orderByOrgUrl = `${config.ORDER_BY_ORGANIZATION_URL}?tenant=${encodeURIComponent(
    String(config.TENANT_ID)
  )}&fundraising=${encodeURIComponent(fundraisingParam)}&limit=500&offset=0`;

  const [statusResponse, organizationsResponse] = await Promise.all([
    fetch(statusUrl, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    }),
    fetch(orderByOrgUrl, {
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
      `Failed to load organization orders (${organizationsResponse.status} ${organizationsResponse.statusText}).`
    );
  }

  const rawStats = (await statusResponse.json()) as BackendOrderStatus;
  const rawOrgData = await organizationsResponse.json();
  const orgResults = getResults<BackendOrderByOrganization>(rawOrgData);

  const summaries: ClubSummary[] = orgResults
    .map((org) => ({
      clubId: String(org.organization_id || (org as any).id || ''),
      clubName: String(org.organization_name || (org as any).name || ''),
      contactPerson: String(org.orders?.[0]?.order_by_name?.trim() ?? ''),
      mobileNumber: '',
      location: (org as any).place || (org as any).location || '',
      totalQuantityLiters: Number(org.total_approved ?? org.total_order_quantity ?? 0),
      orderCount: Number(org.total_order ?? org.orders?.length ?? 0),
      lastOrderDate: String(org.last_ordered_at || org.orders?.[0]?.order_date || ''),
      raw: org as any,
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

export interface FundraisingItem {
  id: string;
  name: string;
  tenant?: number | null;
  fundraising?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DonationPayload {
  tenant: number;
  fundraising: string;
  donor_type?: 'INDIVIDUAL' | 'ORGANIZATION';
  organization?: string | null;
  donation_type: 'CASH' | 'COMMODITY';
  donor_name: string;
  mobile: string;
  donation_date?: string;
  amount: string | null;
  fundraising_item: string | null;
  quantity: string | number | null;
  notes: string;
  security_code?: string | null;
}

export interface DonationResponse {
  id: string;
  tenant: number;
  fundraising: string;
  donor_type?: 'INDIVIDUAL' | 'ORGANIZATION';
  organization?: string | null;
  donation_type: 'CASH' | 'COMMODITY';
  donor_name: string;
  mobile: string;
  donation_date: string;
  amount: string | null;
  fundraising_item: string | null;
  quantity: string | number | null;
  notes: string;
  created_at?: string;
}

/**
 * Fetches fundraising items from the backend for commodity donations.
 */
export async function fetchFundraisingItemsApi(): Promise<FundraisingItem[]> {
  const config = await getILUConfig();
  const tenantUrl = `${config.FUNDRAISING_ITEMS_URL}?tenant=${encodeURIComponent(
    String(config.TENANT_ID)
  )}&limit=100`;

  const response = await fetch(tenantUrl, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  }).catch(() => null);

  if (response && response.ok) {
    const data = await response.json().catch(() => null);
    const items = getResults<FundraisingItem>(data);
    if (items.length > 0) {
      return items;
    }
  }

  // Fallback: fetch without tenant param in case tenant filter is omitted
  const fallbackResponse = await fetch(config.FUNDRAISING_ITEMS_URL, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  }).catch(() => null);

  if (fallbackResponse && fallbackResponse.ok) {
    const fallbackData = await fallbackResponse.json().catch(() => null);
    return getResults<FundraisingItem>(fallbackData);
  }

  return [];
}

/**
 * Submits a new donation (CASH or COMMODITY) to the backend.
 */
export async function submitDonationApi(
  payload: Omit<DonationPayload, 'tenant' | 'fundraising'>
): Promise<DonationResponse> {
  const config = await getILUConfig();
  const fullPayload: DonationPayload = {
    ...payload,
    tenant: config.TENANT_ID,
    fundraising: config.FUNDRAISING_ID,
  };

  // If INDIVIDUAL, organization must be null and security_code must never be sent
  if (fullPayload.donor_type === 'INDIVIDUAL') {
    fullPayload.organization = null;
    delete fullPayload.security_code;
  }

  // If not an organization or security_code is null/empty/not provided, completely delete it from payload
  if (fullPayload.donor_type !== 'ORGANIZATION' || !fullPayload.security_code) {
    delete fullPayload.security_code;
  }

  const response = await fetch(config.DONATIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(fullPayload),
  });

  const responseData: any = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      normalizeApiError(
        responseData,
        `Donation submission failed (${response.status} ${response.statusText})`
      )
    );
  }

  return responseData as DonationResponse;
}
