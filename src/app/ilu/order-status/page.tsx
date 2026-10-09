import type { Metadata } from 'next';
import IluOrderStatusPageClient from './IluOrderStatusPageClient';

export const metadata: Metadata = {
  title: 'Payasam Challenge – Order Status | ILU Foundation',
  description: 'Track the total payasam quantity ordered by each club in the ILU Foundation Payasam Challenge.',
  openGraph: {
    title: 'Payasam Challenge – Order Status | ILU Foundation',
    description: 'Track the total payasam quantity ordered by each club in the ILU Foundation Payasam Challenge.',
    images: ['https://media.raihsuite.com/RS0001/web/ilu/payasam-img.png'],
  },
};

export default function IluOrderStatusPage() {
  return <IluOrderStatusPageClient />;
}
