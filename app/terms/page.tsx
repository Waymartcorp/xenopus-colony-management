// TODO: Replace placeholder text with actual Terms of Service
// TODO: Version tracking — update terms_version when content changes
// Current version: 1.0

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">
        Version 1.0 · Effective May 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            1. Acceptance of Terms
          </h2>
          <p className="mt-2">
            By creating an account or using XenoTrack Colony Register
            (&quot;the Service&quot;), you agree to these Terms of Service. If
            you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            2. Description of Service
          </h2>
          <p className="mt-2">
            XenoTrack is a private colony management platform for Xenopus
            laboratories. The Service provides tools for tracking frog
            inventory, housing, events, performance, and related data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            3. User Accounts
          </h2>
          <p className="mt-2">
            You are responsible for maintaining the confidentiality of your
            account credentials. You must provide accurate information during
            registration.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            4. Data Ownership
          </h2>
          <p className="mt-2">
            You retain ownership of all data you enter into the Service. Your
            colony data is private to your organization unless you explicitly
            choose to share it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            5. Acceptable Use
          </h2>
          <p className="mt-2">
            You agree to use the Service only for lawful purposes related to
            Xenopus colony management. You will not attempt to access other
            organizations&apos; data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            6. Service Availability
          </h2>
          <p className="mt-2">
            We strive to maintain high availability but do not guarantee
            uninterrupted access. The Service may be temporarily unavailable
            for maintenance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            7. Termination
          </h2>
          <p className="mt-2">
            Either party may terminate this agreement at any time. Upon
            termination, you may request export of your data within a
            reasonable period.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            8. Changes to Terms
          </h2>
          <p className="mt-2">
            We may update these Terms. We will notify you of material changes
            and require re-acceptance for significant updates.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">9. Contact</h2>
          <p className="mt-2">
            For questions about these Terms, contact us at the email address
            provided in your account settings.
          </p>
        </section>
      </div>
    </div>
  );
}
