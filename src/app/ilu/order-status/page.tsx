import type { Metadata } from 'next';
import IluOrderStatusPageClient from './IluOrderStatusPageClient';

export const metadata: Metadata = {
  title: 'ILU Foundation Palada Challenge Order Status Portal - Powered By raihsoft.',
  description: 'Track the total palada quantity ordered by each club in the ILU Foundation Palada Challenge.',
  openGraph: {
    title: 'ILU Foundation Palada Challenge Order Status Portal - Powered By raihsoft.',
    description: 'Track the total palada quantity ordered by each club in the ILU Foundation Palada Challenge.',
    images: ['https://media.raihsuite.com/RS0001/web/ilu/order-status-banner.webp'],
  },
};

export default function IluOrderStatusPage() {
  return <IluOrderStatusPageClient />;
}
