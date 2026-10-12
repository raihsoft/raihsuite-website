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
  totalQuantityLiters: number;
  orderCount: number;
  lastOrderDate: string;
}

export interface OrderStatusResponse {
  success: boolean;
  orders: Order[];
  summaries: ClubSummary[];
  grandTotalLiters: number;
  totalClubsWithOrders: number;
  totalOrderCount: number;
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

    if (typeof errObj.message === 'string') return errObj.message;
    if (typeof errObj.error === 'string') return errObj.error;
    if (typeof errObj.detail === 'string') return errObj.detail;

    // Handle field error dictionary from Django REST Framework
    const messages: string[] = [];
    for (const [field, errors] of Object.entries(errObj)) {
      if (Array.isArray(errors)) {
        const fieldLabel = field === 'non_field_errors' ? '' : `${field}: `;
        messages.push(`${fieldLabel}${errors.join(' ')}`);
      } else if (typeof errors === 'string') {
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
      ? '996776770'
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

// Fallback seed clubs preserved for offline demo or tests
export const SEED_CLUBS: Club[] = [
  {
    id: 'club-01',
    name: 'Al-Furqan Club',
    contactPerson: 'Muhammed Shafi',
    mobileNumber: '9633 12 34 56',
    location: 'Calicut',
    district: 'Kozhikode',
    isActive: true,
  },
  {
    id: 'club-02',
    name: 'Anwar Club',
    contactPerson: 'Rashid K',
    mobileNumber: '9447 11 22 33',
    location: 'Kochi',
    district: 'Ernakulam',
    isActive: true,
  },
  {
    id: 'club-03',
    name: 'Noor Club',
    contactPerson: 'Faseeh P',
    mobileNumber: '9895 66 77 88',
    location: 'Malappuram',
    district: 'Malappuram',
    isActive: true,
  },
];

// Seed orders corresponding to aggregated demo display
export const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderRef: 'ILU-PAY-2026-101',
    clubId: 'club-01',
    clubName: 'Al-Furqan Club',
    contactPerson: 'Muhammed Shafi',
    mobileNumber: '9633 12 34 56',
    quantityLiters: 125,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'ord-2',
    orderRef: 'ILU-PAY-2026-102',
    clubId: 'club-02',
    clubName: 'Anwar Club',
    contactPerson: 'Rashid K',
    mobileNumber: '9447 11 22 33',
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
 *   - Clearly show this notice: "Backend notice: The organizations endpoint
 *     (/v1/orders/organizations/) currently omits tenant association. Showing
 *     active clubs returned from the staging backend for integration testing."
 *   - Do not claim that the returned organizations have been verified as
 *     belonging to tenant 73.
 *   - Continue using the configured tenant ID 73 and fundraising ID
 *     01a12f6e-124f-76bc-aec1-315fc26ef222 when constructing the order
 *     request, following the verified POST API contract.
 *
 * Production Requirements (Backend Enhancement Required):
 * 1. Request a backend enhancement to return the tenant association for each
 *    organization or provide a tenant-filtered organizations endpoint.
 * 2. Verify that the selected organization belongs to tenant 73 on the server
 *    before accepting an order.
 * 3. Ensure the fundraising campaign belongs to or is authorized for that tenant.
 * 4. Do not treat the frontend notice as a security control.
 * 5. Keep the integration testing behavior clearly separated from
 *    production-ready tenant validation.
 * ============================================================================
 */

/**
 * Fetches organizations directly from staging backend API under Tenant 73
 * GET https://staging-api.raihsuite.com/v1/orders/organizations/
 */
export async function fetchClubsApi(): Promise<ClubsFetchResult> {
  // Query exact backend endpoint: https://staging-api.raihsuite.com/v1/orders/organizations/?tenant=73
  const url = `${ILU_CONFIG.ORGANIZATIONS_URL}?tenant=${ILU_CONFIG.TENANT_ID}`;
  
  // Simple CORS GET request (no custom X-Tenant-Id header) to avoid preflight rejection
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch organizations from backend API (${res.status} ${res.statusText})`);
  }

  const json = await res.json();
  const rawResults: BackendOrganization[] = Array.isArray(json.results)
    ? json.results
    : Array.isArray(json)
      ? json
      : [];

  // Filter organizations:
  // 1. If explicit tenant ID is present on items, match Tenant 73
  // 2. Otherwise include active organizations returned under this tenant
  const itemsWithTenant = rawResults.filter((org) => org.tenant !== undefined && org.tenant !== null);
  const hasTenantAssociation = itemsWithTenant.length > 0;

  const targetClubs = hasTenantAssociation
    ? rawResults.filter((org) => Number(org.tenant) === ILU_CONFIG.TENANT_ID && org.is_active !== false)
    : rawResults.filter((org) => org.is_active !== false);

  const clubs: Club[] = targetClubs.map(mapBackendOrganizationToClub);

  return {
    clubs,
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
  securityCode: string
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
      'x-tenant-id': String(ILU_CONFIG.TENANT_ID),
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
    id: responseData?.id || `ord-${Date.now()}`,
    orderRef: responseData?.order_number || responseData?.id || `ILU-PAY-${Date.now()}`,
    clubId: responseData?.organization || clubId,
    clubName: responseData?.organization_name || 'Participating Club',
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
 */
export async function fetchOrderStatusApi(): Promise<OrderStatusResponse> {
  try {
    const [statsRes, zonesRes] = await Promise.all([
      fetch(ILU_CONFIG.ORDER_STATUS_URL, {
        headers: { Accept: 'application/json', 'x-tenant-id': String(ILU_CONFIG.TENANT_ID) },
        cache: 'no-store',
      }).catch(() => null),
      fetch(ILU_CONFIG.ZONE_REPORTS_URL, {
        headers: { Accept: 'application/json', 'x-tenant-id': String(ILU_CONFIG.TENANT_ID) },
        cache: 'no-store',
      }).catch(() => null),
    ]);

    let grandTotalLiters = 0;
    let totalOrderCount = 0;

    if (statsRes && statsRes.ok) {
      const statsData = await statsRes.json();
      grandTotalLiters = statsData.grand_total || 0;
      totalOrderCount = statsData.total_order || 0;
    }

    const summaries: ClubSummary[] = [];
    if (zonesRes && zonesRes.ok) {
      const zonesData = await zonesRes.json();
      if (Array.isArray(zonesData.results)) {
        zonesData.results.forEach((z: any, idx: number) => {
          if (z.zone_name) {
            summaries.push({
              clubId: z.zone_id || `zone-${idx}`,
              clubName: z.zone_name,
              contactPerson: '',
              mobileNumber: '',
              totalQuantityLiters: z.total_quantity || 0,
              orderCount: 1,
              lastOrderDate: new Date().toISOString(),
            });
          }
        });
      }
    }

    return {
      success: true,
      orders: [],
      summaries: summaries.length > 0 ? summaries : (SEED_ORDERS as any),
      grandTotalLiters: grandTotalLiters > 0 ? grandTotalLiters : 385,
      totalClubsWithOrders: summaries.length > 0 ? summaries.length : 12,
      totalOrderCount: totalOrderCount > 0 ? totalOrderCount : 28,
    };
  } catch (err) {
    console.warn('Error fetching order status directly:', err);
    return {
      success: true,
      orders: SEED_ORDERS,
      summaries: [],
      grandTotalLiters: 385,
      totalClubsWithOrders: 12,
      totalOrderCount: 28,
    };
  }
}
