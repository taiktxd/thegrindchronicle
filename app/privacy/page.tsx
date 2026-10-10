import PageMasthead from '../components/PageMasthead';

export const metadata = {
  title: 'Privacy Policy | The Grind Chronicle',
};

export default function PrivacyPage() {
  return (
    <main className="w-full bg-[#FBFAF7] min-h-screen">
      <PageMasthead title="Privacy Policy" tagline="Last updated September 2026" />

      <article className="max-w-3xl mx-auto px-4 py-12 text-gray-700 leading-relaxed flex flex-col gap-6">
        <p>
          The Grind Chronicle is an independent publication. This page explains what
          information we collect when you use this site, and how it&apos;s used.
        </p>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            What we collect
          </h2>
          <p>
            <strong>Comments.</strong> When you post a comment, we store your name,
            your message, and the time you posted it. Comments are held for manual
            review before appearing publicly, to filter out spam.
          </p>
          <p className="mt-2">
            <strong>Contact form.</strong> When you use the Contact page, your name,
            email address, and message are sent directly to our inbox by email. This
            information is not stored in any database, it exists only as an email.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            What we don&apos;t collect
          </h2>
          <p>
            We don&apos;t require accounts, passwords, or logins to read or comment on
            this site. We don&apos;t run advertising trackers, and we don&apos;t sell
            or share your information with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            Third-party services
          </h2>
          <p>
            This site is hosted on Vercel, comments are stored using Supabase, and
            contact form emails are delivered using Resend. Each of these services
            processes data only as needed to provide their function to this site —
            we encourage you to review their own privacy policies if you&apos;d like
            more detail on how they handle data in transit.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            Your rights
          </h2>
          <p>
            You can ask us to remove a comment you&apos;ve posted at any time by
            reaching out through the Contact page. Since we don&apos;t maintain user
            accounts, there&apos;s no profile or history tied to you beyond the
            individual comments you choose to leave.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            Changes to this policy
          </h2>
          <p>
            As the site grows, this policy may be updated to reflect new features
            (like analytics or newsletter tools). Any changes will be reflected on
            this page with an updated date at the top.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            Questions
          </h2>
          <p>
            Reach out anytime via the{' '}
            <a href="/contact" className="text-amber-600 underline hover:text-amber-700">
              Contact page
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}