import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            ← XenoTrack
          </Link>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-gray-700">Terms of Service</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900">XenoTrack Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">
          Version: xenotrack-privacy-v1-early-access · Effective July 2026
        </p>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          This policy is provided for early-access testing and should be reviewed by counsel before broad commercial launch.
        </div>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Information We Collect</h2>
            <p className="mt-2">
              We collect information you provide directly when you use XenoTrack. This includes:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Account information (name, email address, encrypted password)</li>
              <li>Organization/lab workspace details you configure</li>
              <li>Colony management data entered by you and your authorized team members</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Account Information</h2>
            <p className="mt-2">
              When you create an account, we collect your name, email address, and an encrypted password. Account credentials are managed through Supabase Auth with industry-standard encryption. We do not store passwords in plain text.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Lab/Workspace Data</h2>
            <p className="mt-2">
              When you create a lab workspace, we store your organization name, lab mode configuration, and team member roles. This data is used solely to provide workspace functionality and access control.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Colony/Bin/Frog/Use/Rest Data</h2>
            <p className="mt-2">
              Colony data you enter — including bin configurations, frog records, use/rest events, transfer logs, performance notes, rest timers, environmental observations, and any other colony management records — is stored securely and is private to your organization by default. We do not analyze, mine, share, or use your colony records for purposes other than providing the Service to you and your workspace members.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Frog Photos and Uploaded Files</h2>
            <p className="mt-2">
              Photos and videos you upload are stored in private cloud storage buckets with access restricted to your organization&apos;s authenticated members. Uploaded media is not publicly accessible, not used for training purposes, not used for marketing, and not shared with any third party. Files are associated with your organization via row-level security policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. How We Use Information</h2>
            <p className="mt-2">
              We use your information solely to:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Provide, maintain, and improve the XenoTrack service</li>
              <li>Authenticate your identity and manage access to your workspace</li>
              <li>Send notifications you have configured (e.g., rest-complete alerts)</li>
              <li>Respond to support requests</li>
              <li>Ensure security and prevent abuse</li>
            </ul>
            <p className="mt-2">
              We do not sell your data. We do not use your colony data for advertising. We do not build user profiles for marketing purposes. We do not use your data to train machine learning models.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. How We Store Information</h2>
            <p className="mt-2">
              Data is stored in the XenoTrack database hosted on Supabase (PostgreSQL) with row-level security (RLS) policies that enforce organization-level isolation. All data is encrypted in transit (TLS) and at rest. Database backups are maintained by our infrastructure provider. Photos and files are stored in private cloud storage with access control.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Who Can Access Information</h2>
            <p className="mt-2">
              Your colony data is accessible only to authenticated members of your organization/workspace, according to the role-based permissions you configure (owner, admin, manager, technician, viewer). The XenoTrack administrator may access infrastructure for security, debugging, or support purposes but will not browse your colony data without your explicit request or a legal obligation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. Organization/Workspace Privacy</h2>
            <p className="mt-2">
              Each lab workspace is isolated. Users in one organization cannot see, query, or export data from another organization. Row-level security policies enforce this isolation at the database level.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">10. No Automatic Sharing with Frog Social or External Case Systems</h2>
            <p className="mt-2">
              Colony data is private to the user&apos;s organization/workspace by default. XenoTrack does not automatically share colony records, frog photos, husbandry notes, or performance data with Frog Social or any external case system. If optional integrations are offered in the future, they will require explicit user action and you will see a clear preview of any data before it leaves your workspace.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">11. Service Providers</h2>
            <p className="mt-2">
              We use the following third-party service providers to operate XenoTrack:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Supabase</strong> — database hosting, authentication, and file storage</li>
              <li><strong>Vercel</strong> — application hosting and deployment</li>
              <li><strong>Email/SMS providers</strong> — for delivering notifications you configure (if enabled)</li>
            </ul>
            <p className="mt-2">
              These providers process data only as necessary to provide their services and are bound by their own privacy and security obligations. We do not share your colony data with these providers for their own use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">12. Data Export</h2>
            <p className="mt-2">
              You may export your colony data at any time using the CSV export functionality available within the Service. Exported data is generated in your browser and downloaded directly — it does not pass through any third-party analytics or tracking service. You are responsible for the security of exported files once downloaded. XenoTrack is not intended to lock users into the system.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">13. Data Deletion / Account Closure</h2>
            <p className="mt-2">
              You may request deletion of your account and all associated data at any time by contacting us at <a href="mailto:rob@xenopus1.com" className="text-brand-600 hover:underline">rob@xenopus1.com</a>. Upon receiving a deletion request, we will permanently remove your account, colony data, uploaded files, and all associated records within 30 days. Some data may be retained in encrypted backups for a limited period as required by our infrastructure provider&apos;s retention policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">14. Security</h2>
            <p className="mt-2">
              We implement industry-standard security measures including:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Encryption in transit (TLS/HTTPS)</li>
              <li>Encryption at rest for stored data</li>
              <li>Row-level security policies for database isolation</li>
              <li>Role-based access controls within each workspace</li>
              <li>Secure password hashing (bcrypt via Supabase Auth)</li>
              <li>Regular security updates</li>
            </ul>
            <p className="mt-2">
              No system is perfectly secure. If you discover a security vulnerability, please report it immediately to <a href="mailto:rob@xenopus1.com" className="text-brand-600 hover:underline">rob@xenopus1.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">15. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notification. Continued use of the Service after notification constitutes acceptance of the updated policy. If you do not agree to the new policy, you may export your data and close your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">16. Contact</h2>
            <p className="mt-2">
              For privacy-related questions, data access requests, or deletion requests, contact us at:{" "}
              <a href="mailto:rob@xenopus1.com" className="text-brand-600 hover:underline">rob@xenopus1.com</a>
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} XenoTrack · <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link> · <a href="mailto:rob@xenopus1.com" className="hover:text-gray-600">rob@xenopus1.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
