import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold text-brand-700">XenoTrack</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Your private Xenopus colony register
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Track bins, frogs, use/rest cycles, performance, and future
          availability — all in one place. Build years of searchable colony
          history and never lose institutional knowledge.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Log In
          </Link>
          <a
            href="#features"
            className="rounded-lg px-6 py-3 text-sm font-semibold text-brand-600 hover:text-brand-800"
          >
            Learn More ↓
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            What XenoTrack does
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-gray-600">
            A bin-centered colony register built for Xenopus labs. Simple by
            default, powerful when you need it.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Track bins and frogs"
              description="Organize your colony by bins. Every frog lives in a bin with a clear status: available, resting, or ready."
            />
            <FeatureCard
              title="Log use and move to rest"
              description="Record which frogs were used, from which bin, and move them to a rest bin with an automatic timer."
            />
            <FeatureCard
              title="Get notified when rest is complete"
              description="The system tells you which bins are ready, how many frogs are available, and what to do next."
            />
            <FeatureCard
              title="Upload frog photos"
              description="Build a photo archive for your colony. Attach photos to bins, frogs, or events."
            />
            <FeatureCard
              title="Track performance over time"
              description="Log oocyte quality, extract yield, and use counts. See which bins perform best."
            />
            <FeatureCard
              title="Forecast and avoid bottlenecks"
              description="Know when you'll run short. Capacity planning and repopulation guidance built in."
            />
          </div>
        </div>
      </section>

      {/* Colony history */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Build years of searchable colony history
          </h2>
          <p className="mt-4 text-gray-600">
            Keep every bin and frog record in one place. See what happened, what
            is ready, and what is coming next. Preserve knowledge across
            technicians, lab managers, and projects.
          </p>
        </div>
      </section>

      {/* Future add-ons section removed — will announce when ready */}

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Start tracking your colony today
        </h2>
        <p className="mt-2 text-gray-600">
          Free to set up. No credit card required.
        </p>
        <div className="mt-6">
          <Link
            href="/signup"
            className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        <div className="flex justify-center gap-4">
          <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
        </div>
        <p className="mt-2">© {new Date().getFullYear()} XenoTrack</p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

