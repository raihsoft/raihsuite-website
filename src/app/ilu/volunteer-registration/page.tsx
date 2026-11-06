import type { Metadata } from 'next';

import IluVolunteerRegistrationClient from './IluVolunteerRegistrationClient';

export const metadata: Metadata = {
  title: 'Volunteer Registration – ILU Palada Challenge 2026',
  description:
    'Register as a volunteer for the ILU Foundation Palada Challenge 2026 and download your official volunteer pass.',
};

export default function IluVolunteerRegistrationPage() {
  return <IluVolunteerRegistrationClient />;
}
