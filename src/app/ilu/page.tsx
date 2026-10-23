import type { Metadata } from 'next';
import IluOrderPageClient from './IluOrderPageClient';

export const metadata: Metadata = {
  title: 'ILU Foundation Palada Challenge Order Portal - Powered By raihsoft.',
  description:
    'Be part of this special initiative by ILU Foundation. Place your club’s palada order and join the challenge.',
  openGraph: {
    title: 'ILU Foundation Palada Challenge Order Portal - Powered By raihsoft.',
    description:
      'Be part of this special initiative by ILU Foundation. Place your club’s palada order and join the challenge.',
    images: ['https://media.raihsuite.com/RS0001/web/ilu/hero-banner.webp'],
  },
};

export default function IluOrderPage() {
  return <IluOrderPageClient />;
}
