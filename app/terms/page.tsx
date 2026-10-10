import PageMasthead from '../components/PageMasthead';

export const metadata = {
  title: 'Terms of Service | The Grind Chronicle',
};

export default function TermsPage() {
  return (
    <main className="w-full bg-[#FBFAF7] min-h-screen">
      <PageMasthead title="Terms of Service" tagline="Last updated September 2026" />

      <article className="max-w-3xl mx-auto px-4 py-12 text-gray-700 leading-relaxed flex flex-col gap-6">
        <p>
          By reading, commenting on, or otherwise using The Grind Chronicle, you agree
          to the terms below. If you don&apos;t agree, please don&apos;t use the site.
        </p>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            Content
          </h2>
          <p>
            Articles, images, and other original material published on this site are
            the property of The Grind Chronicle unless otherwise credited. You&apos;re
            welcome to share links to our stories. Please don&apos;t republish or
            reproduce full articles elsewhere without asking first, reach out via the
            Contact page.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            Comments
          </h2>
          <p>
            We welcome discussion under our stories. Comments are reviewed before they
            appear publicly. We reserve the right to decline or remove any comment
            that is abusive, spam, off-topic, or otherwise inappropriate, at our
            discretion, without notice.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            Accuracy of stories
          </h2>
          <p>
            Our stories focus on the human and emotional side of NBA figures&apos;
            lives. Not breaking news or transactional reporting. We do our best to
            represent these stories faithfully based on publicly available interviews
            and reporting, but some details may be dramatized or simplified for
            narrative flow. This site is not affiliated with the NBA or any team,
            player, or organization mentioned in our stories.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            No warranty
          </h2>
          <p>
            This site is provided as-is, without warranties of any kind. We don&apos;t
            guarantee the site will always be available, error-free, or uninterrupted.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            External links
          </h2>
          <p>
            Our stories and pages may link to external sites (social media, sources,
            etc.). We&apos;re not responsible for the content or practices of sites we
            don&apos;t control.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            Changes
          </h2>
          <p>
            These terms may be updated as the site evolves. Continued use of the site
            after changes are posted means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">
            Contact
          </h2>
          <p>
            Questions about these terms? Reach out via the{' '}
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