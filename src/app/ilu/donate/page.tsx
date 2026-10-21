import type { Metadata } from 'next';
import IluDonatePageClient from './IluDonatePageClient';

export const metadata: Metadata = {
  title: 'Make a Donation – Support ILU Foundation | Palada Challenge',
  description: 'Contribute directly to ILU Foundation initiatives. Every donation powers healthcare, child education, and humanitarian relief in our community.',
  openGraph: {
    title: 'Make a Donation – Support ILU Foundation',
    description: 'Contribute directly to ILU Foundation initiatives. Every donation powers healthcare, child education, and humanitarian relief.',
    images: ['https://media.raihsuite.com/RS0001/web/ilu/hero-banner.webp'],
  },
};

export default function IluDonatePage() {
  return <IluDonatePageClient />;
}
