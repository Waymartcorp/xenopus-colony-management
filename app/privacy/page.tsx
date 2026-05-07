// TODO: Replace placeholder text with actual Privacy Policy
// TODO: Version tracking — update privacy_version when content changes
// Current version: 1.0

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">
        Version 1.0 · Effective May 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            1. Information We Collect
          </h2>
          <p className="mt-2">
            We collect information you provide directly: name, email, phone
            number, organization details, and colony management data (frog
            records, events, photos, environmental observations).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            2. How We Use Your Information
          </h2>
          <p className="mt-2">
            We use your information to provide the XenoTrack Colony Register
            service, send notifications you configure, and improve the
            platform. We do not sell your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            3. Data Privacy
          </h2>
          <p className="mt-2">
            Your colony data is private by default. It is only accessible to
            members of your organization. We do not share your data with third
            parties without your explicit consent.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            4. Data Storage
          </h2>
          <p className="mt-2">
            Data is stored securely using Supabase (PostgreSQL) with row-level
            security. Photos are stored in private cloud storage buckets
            accessible only to your organization members.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            5. Communications
          </h2>
          <p className="mt-2">
            We may send you email or SMS notifications based on your
            preferences. You can disable any notification channel at any time
            from your account settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            6. Data Sharing
          </h2>
          <p className="mt-2">
            Nothing is shared with external services (including Frog Social)
            unless you explicitly initiate sharing. Before any data leaves
            your workspace, you will see a preview of what will be shared.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            7. Data Retention and Deletion
          </h2>
          <p className="mt-2">
            You can request deletion of your account and data at any time.
            Upon account deletion, your data will be permanently removed after
            a 30-day grace period.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            8. Security
          </h2>
          <p className="mt-2">
            We implement industry-standard security measures including
            encryption in transit, row-level security policies, and
            role-based access controls.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            9. Changes to This Policy
          </h2>
          <p className="mt-2">
            We may update this Privacy Policy. We will notify you of material
            changes and may require re-acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            10. Contact
          </h2>
          <p className="mt-2">
            For privacy-related questions or data requests, contact us at the
            email address provided in your account settings.
          </p>
        </section>
      </div>
    </div>
  );
}
