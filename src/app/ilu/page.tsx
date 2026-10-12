import type { Metadata } from 'next';
import IluOrderPageClient from './IluOrderPageClient';

export const metadata: Metadata = {
  title: 'Join the Payasam Challenge! | ILU Foundation',
  description:
    'Be part of this special initiative by ILU Foundation. Place your club’s payasam order and join the challenge.',
  openGraph: {
    title: 'Join the Payasam Challenge! | ILU Foundation',
    description:
      'Be part of this special initiative by ILU Foundation. Place your club’s payasam order and join the challenge.',
    images: ['https://media.raihsuite.com/RS0001/web/ilu/payasam-img.png'],
  },
};

export default function IluOrderPage() {
  return <IluOrderPageClient />;
}
