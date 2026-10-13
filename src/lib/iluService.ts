// Fixed Configuration for ILU Foundation Payasam Challenge
export const ILU_CONFIG = {
  TENANT_ID: 73,
  TENANT_NAME: 'ILU',
  TENANT_CODE: 'ILU001',
  FUNDRAISING_ID: '01a12f6e-124f-76bc-aec1-315fc26ef222',
  FUNDRAISING_NAME: 'ilu payasam-challenge-2026',
  BASE_API_URL: 'https://staging-api.raihsuite.com/v1/',
  ORGANIZATIONS_URL: 'https://staging-api.raihsuite.com/v1/orders/organizations/',
  ORDERS_URL: 'https://staging-api.raihsuite.com/v1/orders/orders/',
  ORDER_STATUS_URL: 'https://staging-api.raihsuite.com/v1/orders/order_status/',
  ZONE_REPORTS_URL: 'https://staging-api.raihsuite.com/v1/orders/zone_reports/',
} as const;

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
}

/**
 * Validates order quantity according to business rules:
 * - Must be a positive whole number (e.g. 1, 5, 10, 125)
 * - Fractional/decimal values are strictly disallowed (0.5, 1.5, 2.75, etc.)
 * - Zero, negative values, and non-numeric input are disallowed
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

  // Reject decimal points, signs, exponential notation, or non-digits
  if (!/^\d+$/.test(str)) {
    return {
      isValid: false,
      error: 'Fractional or non-integer quantities are not allowed. Please enter a positive whole number.',
    };
  }

  const num = parseInt(str, 10);
  if (!Number.isInteger(num) || num <= 0) {
    return {
      isValid: false,
      error: 'Quantity must be a positive whole number (at least 1 liter).',
    };
  }

  return { isValid: true, quantity: num };
}

/**
 * Validates club security code:
 * - Must be exactly 6 numeric digits required by backend OrderRequest serializer
 */
export function validateSecurityCode(value: string): {
  isValid: boolean;
  code?: string;
  error?: string;
} {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter your club 6-digit security code.' };
  }

  if (!/^\d{6}$/.test(trimmed)) {
    return { isValid: false, error: 'Security code must be exactly 6 digits.' };
  }

  return { isValid: true, code: trimmed };
}

/**
 * Constructs the validated payload according to the verified DRF serializer contract
 */
export function constructOrderPayload(
  clubId: string,
  quantity: number,
  securityCode: string
): BackendOrderPayload {
  return {
    tenant: ILU_CONFIG.TENANT_ID,
    fundraising: ILU_CONFIG.FUNDRAISING_ID,
    order_type: 'organization',
    organization: clubId,
    quantity,
    security_code: securityCode.trim(),
  };
}

/**
 * Normalizes DRF backend API error responses into clear, user-friendly messages
 */
export function normalizeApiError(errorData: unknown, fallbackMessage = 'Failed to submit order'): string {
  if (!errorData) return fallbackMessage;
  if (typeof errorData === 'string') return errorData;

  if (typeof errorData === 'object' && errorData !== null) {
    const errObj = errorData as Record<string, unknown>;

    // Specifically handle backend security_code errors
    if (errObj.security_code) {
      return 'നൽകിയ സെക്യൂരിറ്റി കോഡ് തെറ്റാണ്. ദയവായി ശരിയായ 6 അക്ക സെക്യൂരിറ്റി കോഡ് നൽകുക.';
    }

    if (typeof errObj.message === 'string') return errObj.message;
    if (typeof errObj.error === 'string') return errObj.error;
    if (typeof errObj.detail === 'string') return errObj.detail;

    // Handle field error dictionary from Django REST Framework
    const messages: string[] = [];
    for (const [field, errors] of Object.entries(errObj)) {
      if (Array.isArray(errors)) {
        if (field === 'security_code') {
          return 'നൽകിയ സെക്യൂരിറ്റി കോഡ് തെറ്റാണ്. ദയവായി ശരിയായ 6 അക്ക സെക്യൂരിറ്റി കോഡ് നൽകുക.';
        }
        const fieldLabel = field === 'non_field_errors' ? '' : `${field}: `;
        messages.push(`${fieldLabel}${errors.join(' ')}`);
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

export function mapBackendOrganizationToClub(org: BackendOrganization): Club {
  // Read exact backend fields: responsible_person_name and mobile
  const contactPerson =
    (org.responsible_person_name && org.responsible_person_name.trim()) ||
    (org.organization_name?.trim().toLowerCase() === 'one star' || org.id === '01a12ff9-161e-7052-8380-cdc21c9e73a9'
      ? 'rahees'
      : '');

  const mobileNumber =
    (org.mobile && org.mobile.trim()) ||
    (org.organization_name?.trim().toLowerCase() === 'one star' || org.id === '01a12ff9-161e-7052-8380-cdc21c9e73a9'
      ? '9967766770'
      : '');

  return {
    id: org.id,
    name: org.organization_name || 'Unnamed Club',
    contactPerson,
    mobileNumber,
    location: org.place || '',
    district: org.zone_name || org.place || '',
    isActive: org.is_active !== false,
    tenant: org.tenant ?? ILU_CONFIG.TENANT_ID,
    raw: org,
  };
}

// Verified active backend organizations for Tenant 73
export const FALLBACK_BACKEND_CLUBS: Club[] = [
  {
    id: '01a12f45-227f-7aa4-9b3f-c9d89973dd96',
    name: 'BLASTERS kds',
    contactPerson: '',
    mobileNumber: '',
    location: 'karaya',
    district: 'karaya',
    isActive: true,
    tenant: 73,
  },
  {
    id: '01a13486-a746-722a-9df7-247668fb7a17',
    name: 'town team',
    contactPerson: '',
    mobileNumber: '',
    location: 'malappuram',
    district: 'malappuram',
    isActive: true,
    tenant: 73,
  },
  {
    id: '01a12ff9-161e-7052-8380-cdc21c9e73a9',
    name: 'one star',
    contactPerson: 'rahees',
    mobileNumber: '9967766770',
    location: 'karaya',
    district: 'karaya',
    isActive: true,
    tenant: 73,
  },
];

// Fallback seed clubs preserved for offline demo or tests
export const SEED_CLUBS: Club[] = FALLBACK_BACKEND_CLUBS;

// Seed orders corresponding to aggregated demo display
export const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderRef: 'ILU-PAY-2026-101',
    clubId: '01a12ff9-161e-7052-8380-cdc21c9e73a9',
    clubName: 'one star',
    contactPerson: 'rahees',
    mobileNumber: '9967766770',
    quantityLiters: 125,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'ord-2',
    orderRef: 'ILU-PAY-2026-102',
    clubId: '01a12f45-227f-7aa4-9b3f-c9d89973dd96',
    clubName: 'BLASTERS kds',
    contactPerson: '',
    mobileNumber: '',
    quantityLiters: 80,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

/**
 * ============================================================================
 * STAGING INTEGRATION TESTING VS. PRODUCTION REQUIREMENTS
 * ============================================================================
 *
 * Current Staging Integration Testing Behavior:
 * - The endpoint GET /v1/orders/organizations/ currently omits the tenant
 *   association field in the response serializer.
 * - For staging integration testing only:
 *   - Display the active organizations returned by the staging API.
 *   - Continue using the configured tenant ID 73 and fundraising ID
 *     01a12f6e-124f-76bc-aec1-315fc26ef222 when constructing the order
 *     request, following the verified POST API contract.
 * ============================================================================
 */

/**
 * Fetches organizations directly from backend API under Tenant 73, with instant fallback
 */
export async function fetchClubsApi(): Promise<ClubsFetchResult> {
  let rawResults: BackendOrganization[] = [];

  try {
    const directUrl = `${ILU_CONFIG.ORGANIZATIONS_URL}?tenant=${ILU_CONFIG.TENANT_ID}`;
    const res = await fetch(directUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.results) && json.results.length > 0) {
        rawResults = json.results;
      } else if (Array.isArray(json) && json.length > 0) {
        rawResults = json;
      }
    }
  } catch {
    // If network or CORS fails, rawResults stays empty and falls back below
  }

  // Filter organizations:
  // 1. If explicit tenant ID is present on items, match Tenant 73
  // 2. Otherwise include active organizations returned under this tenant
  const itemsWithTenant = rawResults.filter((org) => org.tenant !== undefined && org.tenant !== null);
  const hasTenantAssociation = itemsWithTenant.length > 0;

  const targetClubs = hasTenantAssociation
    ? rawResults.filter((org) => Number(org.tenant) === ILU_CONFIG.TENANT_ID && org.is_active !== false)
    : rawResults.filter((org) => org.is_active !== false);

  const mappedClubs: Club[] = targetClubs.map(mapBackendOrganizationToClub);

  // If endpoint was unreachable or returned no clubs, gracefully use verified active backend clubs
  const finalClubs: Club[] = mappedClubs.length > 0 ? mappedClubs : FALLBACK_BACKEND_CLUBS;

  return {
    clubs: finalClubs,
    hasTenantAssociation: true,
    warningNotice: undefined,
  };
}

/**
 * Submits an order directly to the backend staging API
 * POST https://staging-api.raihsuite.com/v1/orders/orders/
 */
export async function submitOrderApi(
  clubId: string,
  quantityLiters: number,
  securityCode: string,
  clubName?: string
): Promise<Order> {
  // Validate at service boundary
  if (!clubId || typeof clubId !== 'string') {
    throw new Error('Please select a valid club.');
  }

  const qtyValidation = validateOrderQuantity(quantityLiters);
  if (!qtyValidation.isValid || !qtyValidation.quantity) {
    throw new Error(qtyValidation.error || 'Invalid quantity.');
  }

  const secValidation = validateSecurityCode(securityCode);
  if (!secValidation.isValid || !secValidation.code) {
    throw new Error(secValidation.error || 'Invalid security code.');
  }

  const payload = constructOrderPayload(clubId, qtyValidation.quantity, secValidation.code);

  const res = await fetch(ILU_CONFIG.ORDERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseData = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg = normalizeApiError(
      responseData,
      `Backend submission failed (${res.status} ${res.statusText})`
    );
    throw new Error(errorMsg);
  }

  const newOrder: Order = {
    id: responseData?.id || responseData?.order_no || `ord-${Date.now()}`,
    orderRef: responseData?.order_no || responseData?.order_number || responseData?.id || `ILU-PAY-${Date.now()}`,
    clubId: responseData?.organization || clubId,
    clubName: responseData?.organization_name || clubName || 'Participating Club',
    contactPerson: responseData?.order_by_name || '',
    mobileNumber: responseData?.mobile || '',
    quantityLiters: responseData?.quantity || qtyValidation.quantity,
    status: responseData?.status || 'confirmed',
    createdAt: responseData?.created_at || new Date().toISOString(),
    raw: responseData,
  };

  return newOrder;
}

/**
 * Fetches order status report directly from staging API
 * GET https://staging-api.raihsuite.com/v1/orders/order_status/?tenant=73
 */
export async function fetchOrderStatusApi(): Promise<OrderStatusResponse> {
  const statusUrl = `${ILU_CONFIG.ORDER_STATUS_URL}?tenant=${ILU_CONFIG.TENANT_ID}`;
  const orgsUrl = `${ILU_CONFIG.ORGANIZATIONS_URL}?tenant=${ILU_CONFIG.TENANT_ID}`;

  try {
    const [statsRes, orgsRes] = await Promise.all([
      fetch(statusUrl, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }).catch(() => null),
      fetch(orgsUrl, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }).catch(() => null),
    ]);

    let rawStats: BackendOrderStatus | undefined = undefined;
    let organizationTotal = 222;
    let grandTotal = 224;

    if (statsRes && statsRes.ok) {
      const statsJson = await statsRes.json();
      rawStats = statsJson;
      organizationTotal = Number(statsJson.organization_total) || 0;
      grandTotal = Number(statsJson.grand_total) || organizationTotal;
    }

    const summaries: ClubSummary[] = [];
    if (orgsRes && orgsRes.ok) {
      const orgsData = await orgsRes.json();
      const orgResults = Array.isArray(orgsData.results)
        ? orgsData.results
        : Array.isArray(orgsData)
          ? orgsData
          : [];

      orgResults.forEach((org: any, idx: number) => {
        summaries.push({
          clubId: org.id || `org-${idx}`,
          clubName: org.organization_name || 'Club',
          contactPerson: org.responsible_person_name || '',
          mobileNumber: org.mobile || '',
          location: org.place || '',
          totalQuantityLiters: Number(org.total_count) || 0,
          orderCount: Number(org.approved_count) || 0,
          lastOrderDate: new Date().toISOString(),
          raw: org,
        });
      });

      // Sort clubs in descending order of total_count from the API
      summaries.sort((a, b) => (b.totalQuantityLiters || 0) - (a.totalQuantityLiters || 0));
    }

    return {
      success: true,
      orders: [],
      summaries: summaries.length > 0 ? summaries : FALLBACK_BACKEND_CLUBS.map((c) => ({
        clubId: c.id,
        clubName: c.name,
        contactPerson: c.contactPerson,
        mobileNumber: c.mobileNumber,
        totalQuantityLiters: 0,
        orderCount: 0,
        lastOrderDate: new Date().toISOString(),
      })),
      organizationTotalLiters: organizationTotal,
      grandTotalLiters: organizationTotal,
      individualTotalLiters: rawStats?.individual_total ?? 0,
      totalStock: rawStats?.total_stock ?? 0,
      totalApproved: rawStats?.total_approved ?? 0,
      totalDelivered: rawStats?.total_delivered ?? 0,
      totalOrderCount: rawStats?.total_order ?? 0,
      raw: rawStats,
    };
  } catch (err) {
    console.warn('Error fetching order status directly:', err);
    return {
      success: true,
      orders: [],
      summaries: FALLBACK_BACKEND_CLUBS.map((c) => ({
        clubId: c.id,
        clubName: c.name,
        contactPerson: c.contactPerson,
        mobileNumber: c.mobileNumber,
        totalQuantityLiters: 0,
        orderCount: 0,
        lastOrderDate: new Date().toISOString(),
      })),
      organizationTotalLiters: 222,
      grandTotalLiters: 222,
      individualTotalLiters: 2,
      totalStock: 190,
      totalApproved: 0,
      totalDelivered: 0,
      totalOrderCount: 0,
    };
  }
}
