import type { Metadata } from 'next';

import IluVolunteerRegistrationClient from './IluVolunteerRegistrationClient';

export const metadata: Metadata = {
  title: 'Volunteer Registration – ILU Palada Challenge 2026',
  description:
    'Register as a volunteer for the ILU Foundation Palada Challenge 2026 and download your official volunteer pass.',
  openGraph: {
    title: 'Volunteer Registration – ILU Palada Challenge 2026',
    description:
      'Register as a volunteer for the ILU Foundation Palada Challenge 2026 and download your official volunteer pass.',
    url: 'https://www.raihsuite.com/ilu/volunteer-registration',
    siteName: 'ILU Foundation - RaihSuite',
    images: [
      {
        url: 'https://media.raihsuite.com/RS0001/web/ilu/volunteer-reg.webp',
        width: 1200,
        height: 630,
        alt: 'Volunteer Registration – ILU Palada Challenge 2026',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Volunteer Registration – ILU Palada Challenge 2026',
    description:
      'Register as a volunteer for the ILU Foundation Palada Challenge 2026 and download your official volunteer pass.',
    images: ['https://media.raihsuite.com/RS0001/web/ilu/volunteer-reg.webp'],
  },
};

export default function IluVolunteerRegistrationPage() {
  return <IluVolunteerRegistrationClient />;
}
