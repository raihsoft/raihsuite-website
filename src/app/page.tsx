export default function HomePage() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome to the Raisuite Web Starter</h2>
      <p>
        This template provides a standardized Next.js + TypeScript + Tailwind setup with environment validation,
        a contact endpoint scaffold, and DevContainer configuration for consistent onboarding.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Convert static HTML templates into components under <code>src/components/</code>.</li>
        <li>Use the contact form (<code>/contact</code>) as a model for API interaction.</li>
        <li>Expand multi-tenant theming via CSS variables or Tailwind config.</li>
        <li>Integrate CMS (e.g., Contentful, Sanity) by creating data-fetching server actions or route handlers.</li>
      </ul>
    </section>
  );
}