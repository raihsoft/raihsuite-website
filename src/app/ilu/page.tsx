import type { Metadata } from 'next';
import IluOrderPageClient from './IluOrderPageClient';

export const metadata: Metadata = {
  title: 'Join the Palada Challenge! | ILU Foundation',
  description:
    'Be part of this special initiative by ILU Foundation. Place your club’s palada order and join the challenge.',
  openGraph: {
    title: 'Join the Palada Challenge! | ILU Foundation',
    description:
      'Be part of this special initiative by ILU Foundation. Place your club’s palada order and join the challenge.',
    images: ['https://media.raihsuite.com/RS0001/web/ilu/hero-banner.webp'],
  },
};

export default function IluOrderPage() {
  return <IluOrderPageClient />;
}
