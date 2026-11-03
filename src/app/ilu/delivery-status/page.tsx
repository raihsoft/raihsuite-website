import type { Metadata } from 'next';
import IluDeliveryStatusPageClient from './IluDeliveryStatusPageClient';

export const metadata: Metadata = {
  title: 'ILU Foundation Palada Challenge Delivery Status Portal - Powered By raihsoft.',
  description:
    'Track total palada quantity delivered by organization in the ILU Foundation Palada Challenge.',
  openGraph: {
    title: 'ILU Foundation Palada Challenge Delivery Status Portal - Powered By raihsoft.',
    description:
      'Track total palada quantity delivered by organization in the ILU Foundation Palada Challenge.',
    images: ['https://media.raihsuite.com/RS0001/web/ilu/orderstatus-page-banner.jpeg'],
  },
};

export default function IluDeliveryStatusPage() {
  return <IluDeliveryStatusPageClient />;
}

