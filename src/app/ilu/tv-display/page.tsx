import type { Metadata } from 'next';

import TvDisplay from '@/components/ilu/tv/TvDisplay';

export const metadata: Metadata = {
  title: 'ILU Palada Challenge – Live TV Display',
  description: 'Live collection and delivery statistics of the ILU Foundation Palada Challenge.',
  robots: { index: false, follow: false },
};

export default function IluTvDisplayPage() {
  return <TvDisplay />;
}
