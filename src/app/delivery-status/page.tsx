import type { Metadata } from 'next';
import IluDeliveryStatusPageClient from '@/app/ilu/delivery-status/IluDeliveryStatusPageClient';

export const metadata: Metadata = {
  title: 'ILU Foundation Palada Challenge Delivery Status Portal - Powered By raihsoft.',
  description:
    'Track total palada quantity delivered by organization in the ILU Foundation Palada Challenge.',
};

export default function DeliveryStatusPage() {
  return <IluDeliveryStatusPageClient />;
}

