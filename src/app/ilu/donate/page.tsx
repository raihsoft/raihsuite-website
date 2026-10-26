import { redirect } from 'next/navigation';
// Note: Donation page temporarily hidden. Uncomment below when ready to restore.
// import IluDonatePageClient from './IluDonatePageClient';

export default function IluDonatePage() {
  redirect('/ilu');
  // return <IluDonatePageClient />;
}

