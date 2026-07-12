import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            ← XenoTrack
          </Link>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900">XenoTrack Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">
          Version: xenotrack-terms-v1-early-access · Effective July 2026
        </p>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          These terms are provided for early-access testing and should be reviewed by counsel before broad commercial launch.
        </div>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By creating an account or using XenoTrack (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not access or use the Service. These Terms constitute a legally binding agreement between you and XenoTrack.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Description of Service</h2>
            <p className="mt-2">
              XenoTrack is a hosted colony recordkeeping and workflow-support tool designed for Xenopus laboratories. The Service provides a private lab workspace for tracking frog inventory by bin/tank, recording use and rest events, managing rest timers, logging performance observations, organizing photos and video, and maintaining long-term colony records.
            </p>
            <p className="mt-2">
              The Service is hosted at xenopuscolony.com. Colony data is stored in the XenoTrack database and is private to each user&apos;s organization/workspace. Users can export their records as CSV files at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Early Access / Prototype Status</h2>
            <p className="mt-2">
              The Service is currently in early-access testing. Features may change, be added, or be removed without prior notice. Data formats and APIs are not guaranteed to remain stable. While we make reasonable efforts to protect your data, you acknowledge that early-access software may contain bugs, errors, or interruptions. We strongly recommend maintaining independent backups of critical colony records during this period. CSV export tools are available for this purpose.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. User Accounts</h2>
            <p className="mt-2">
              You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You must notify us immediately of any unauthorized use. Early access is currently limited to university-affiliated users with .edu email addresses, or approved collaborators.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Lab and Colony Data</h2>
            <p className="mt-2">
              You retain full ownership of all colony data you enter into the Service, including bin configurations, frog records, use/rest events, transfer logs, performance notes, photos, videos, and environmental observations. Your data is private to your organization/workspace by default. We do not claim any intellectual property rights over your data. You grant us only the limited license necessary to store, process, and display your data back to you and your authorized team members.
            </p>
            <p className="mt-2">
              Users should maintain any official records required by their institution. XenoTrack provides CSV export tools so users can download and retain copies of their colony records at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. User Responsibility for Data Entry</h2>
            <p className="mt-2">
              You are solely responsible for the accuracy, completeness, and timeliness of data entered into the Service. XenoTrack displays and calculates information based on user-entered records. The Service does not independently verify frog counts, rest periods, bin statuses, or any other colony information. Outputs such as rest timers, availability estimates, and colony forecasts are only as reliable as the data you provide.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. No Veterinary or Medical Advice</h2>
            <p className="mt-2">
              XenoTrack is a colony recordkeeping and workflow-support tool. It does not provide veterinary diagnosis, medical advice, treatment recommendations, animal health assessments, animal care mandates, regulatory approval, or institutional protocol approval. Rest timers, colony forecasts, and capacity calculations are operational tools — not medical or veterinary directives. Users remain responsible for animal care decisions, institutional compliance, record accuracy, and protocol adherence. Always consult qualified veterinary professionals for animal health decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. No Substitute for Institutional Protocols, IACUC, Veterinary, or Animal Care Oversight</h2>
            <p className="mt-2">
              The Service does not replace, override, or constitute compliance with institutional animal care protocols, IACUC requirements, veterinary directives, regulatory mandates, or any institutional or governmental oversight body. Users remain fully responsible for animal care decisions, institutional compliance, IACUC protocol adherence, record accuracy, and all obligations under applicable animal welfare regulations. XenoTrack does not provide regulatory approval, institutional protocol approval, or compliance certification of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. Data Export and Backups</h2>
            <p className="mt-2">
              You may export your colony data at any time using the CSV export functionality provided in the Service. We recommend maintaining regular backups of important records. XenoTrack is not intended to lock users into the system — your lab can export its records at any time. While we implement reasonable data protection measures, we do not guarantee against data loss and are not liable for any data loss that may occur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">10. Acceptable Use</h2>
            <p className="mt-2">
              You agree to use the Service only for lawful purposes related to Xenopus colony management and related laboratory recordkeeping. You will not: (a) attempt to access other organizations&apos; data; (b) interfere with or disrupt the Service; (c) reverse-engineer or attempt to extract source code; (d) use the Service to store content unrelated to colony management; or (e) violate any applicable laws or regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">11. Privacy</h2>
            <p className="mt-2">
              Your use of the Service is also governed by our <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>, which describes how we collect, use, and protect your information. By using the Service, you consent to the practices described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">12. Service Availability</h2>
            <p className="mt-2">
              We strive to maintain high availability but do not guarantee uninterrupted or error-free access. The Service may be temporarily unavailable for maintenance, updates, or due to circumstances beyond our control. We will make reasonable efforts to provide advance notice of planned downtime.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">13. Limitation of Liability</h2>
            <p className="mt-2">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, XENOTRACK AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF ANIMALS, LOSS OF PROFITS, OR INTERRUPTION OF RESEARCH, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE. Our total liability for any claim arising from the Service shall not exceed the amount you paid for the Service in the twelve months preceding the claim, or $100, whichever is greater.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">14. Changes to Terms</h2>
            <p className="mt-2">
              We may update these Terms from time to time. We will notify you of material changes via email or in-app notification and will require re-acceptance for significant updates. Your continued use of the Service after notification constitutes acceptance of the revised Terms. If you do not agree to the new Terms, you must stop using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">15. Contact</h2>
            <p className="mt-2">
              For questions about these Terms, contact us at:{" "}
              <a href="mailto:rob@xenopus1.com" className="text-brand-600 hover:underline">rob@xenopus1.com</a>
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} XenoTrack · <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link> · <a href="mailto:rob@xenopus1.com" className="hover:text-gray-600">rob@xenopus1.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
