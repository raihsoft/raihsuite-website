import type { Metadata } from 'next';
import IluDonatePageClient from './IluDonatePageClient';

export const metadata: Metadata = {
  title: 'ILU Foundation - Donate • Support Community Welfare Initiatives',
  description:
    'Contribute directly with cash or essential commodities to support ILU Foundation community welfare initiatives.',
  openGraph: {
    title: 'ILU Foundation - Donate • Support Community Welfare Initiatives',
    description:
      'Contribute directly with cash or essential commodities to support ILU Foundation community welfare initiatives.',
    images: ['https://media.raihsuite.com/RS0001/web/ilu/hero-banner.webp'],
  },
};

export default function IluDonatePage() {
  return <IluDonatePageClient />;
}

