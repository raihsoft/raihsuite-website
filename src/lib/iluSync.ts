/** Cross-tab synchronization for ILU order updates. */

const CHANNEL_NAME = 'raihsuite_ilu_order_sync';
const STORAGE_KEY = 'raihsuite_ilu_order_sync_event';
const EVENT_TYPE = 'ORDER_PLACED';
const TAB_ID = typeof crypto !== 'undefined' && 'randomUUID' in crypto
  ? crypto.randomUUID()
  : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

type OrderEvent = { type: typeof EVENT_TYPE; id: string; source: string; timestamp: number };

export function broadcastOrderPlaced(): void {
  if (typeof window === 'undefined') return;

  const event: OrderEvent = {
    type: EVENT_TYPE,
    id: `${TAB_ID}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    source: TAB_ID,
    timestamp: Date.now(),
  };

  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(event);
      channel.close();
    } catch {
      // localStorage remains available as a fallback.
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(event));
  } catch {
    // Cross-tab sync is best-effort when browser storage is restricted.
  }
}

export function subscribeToOrderEvents(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const seen = new Map<string, number>();
  const receive = (event: Partial<OrderEvent> | null | undefined) => {
    if (event?.type !== EVENT_TYPE || !event.id || event.source === TAB_ID) return;

    const now = Date.now();
    for (const [id, receivedAt] of seen) {
      if (now - receivedAt > 60_000) seen.delete(id);
    }
    if (seen.has(event.id)) return;
    seen.set(event.id, now);
    callback();
  };

  let channel: BroadcastChannel | null = null;
  if ('BroadcastChannel' in window) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (message: MessageEvent<Partial<OrderEvent>>) => receive(message.data);
    } catch {
      channel = null;
    }
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      receive(JSON.parse(event.newValue) as Partial<OrderEvent>);
    } catch {
      // Ignore malformed storage events.
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => {
    channel?.close();
    window.removeEventListener('storage', handleStorage);
  };
}
