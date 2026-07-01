import { getEnv } from './env';

const API_BASE = 'https://staging-api.raihsuite.com/v1/events';

export interface Event {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Participant {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Ticket {
  id: string;
  event: string;
  participant: string;
  participant_name: string;
  token: string;
  status: string;
  issued_at: string;
  [key: string]: any;
}

async function getHeaders() {
  const env = getEnv();
  return {
    Authorization: `Bearer ${env.RAISUITE_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchEvents(): Promise<Event[]> {
  const headers = await getHeaders();
  const response = await fetch(`${API_BASE}/events/`, {
    headers,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results || data;
}

export async function fetchParticipants(eventId: string): Promise<Participant[]> {
  const headers = await getHeaders();
  const response = await fetch(`${API_BASE}/participants/?event=${eventId}`, {
    headers,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch participants: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results || data;
}

export async function generateTicket(eventId: string, participantId: string): Promise<Ticket> {
  const headers = await getHeaders();
  const response = await fetch(`${API_BASE}/tickets/`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      event: eventId,
      participant: participantId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate ticket: ${response.statusText}`);
  }

  return await response.json();
}
