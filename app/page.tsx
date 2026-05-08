import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight text-brand-700">XenoTrack</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary">
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pattern-grid absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
          <div className="animate-in">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              Colony Register
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Track bins, frogs, and<br className="hidden sm:block" /> use/rest cycles in one place
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              XenoTrack is a private Xenopus colony register. Know what&apos;s ready,
              what&apos;s resting, and what needs attention — without losing
              institutional knowledge.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-in" style={{ animationDelay: "0.1s" }}>
            <Link href="/signup" className="btn-primary px-7 py-3.5 text-base">
              Create Account
            </Link>
            <Link href="/login" className="btn-secondary px-7 py-3.5 text-base">
              Log In
            </Link>
            <a href="#how" className="rounded-lg px-6 py-3.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-800">
              How it works ↓
            </a>
          </div>
        </div>
      </section>

      {/* Flow diagram */}
      <section id="how" className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            The bin-cycling loop
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-gray-600">
            One simple workflow, repeated across your colony.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-0">
            <FlowNode label="Set up bins" step={1} />
            <FlowArrow />
            <FlowNode label="Add frogs" step={2} />
            <FlowArrow />
            <FlowNode label="Log use" step={3} />
            <FlowArrow />
            <FlowNode label="Move to rest" step={4} />
            <FlowArrow />
            <FlowNode label="Get notified" step={5} />
            <FlowArrow />
            <FlowNode label="Return to rotation" step={6} last />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            What XenoTrack does
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-gray-600">
            A bin-centered colony register. Simple by default, powerful when you need it.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="◫"
              title="Track bins and frogs"
              description="Organize your colony by bins. Every frog lives in a bin with a clear status: available, resting, or ready."
            />
            <FeatureCard
              icon="↻"
              title="Log use and move to rest"
              description="Record which frogs were used, from which bin, and move them to a rest bin with an automatic timer."
            />
            <FeatureCard
              icon="◉"
              title="Get notified when ready"
              description="The system tells you which bins are ready, how many frogs are available, and what to do next."
            />
            <FeatureCard
              icon="◲"
              title="Upload frog photos"
              description="Build a photo archive for your colony. Attach photos to bins, frogs, or events."
            />
            <FeatureCard
              icon="◈"
              title="Track performance"
              description="Log oocyte quality, extract yield, and use counts. See which bins perform best over time."
            />
            <FeatureCard
              icon="⬡"
              title="Forecast capacity"
              description="Know when you'll run short. Capacity planning and repopulation guidance built in."
            />
          </div>
        </div>
      </section>

      {/* History */}
      <section className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Build years of searchable colony history
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Keep every bin and frog record in one place. Preserve knowledge
            across technicians, lab managers, and projects. See what happened,
            what is ready, and what is coming next.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-md">
          <h2 className="text-xl font-bold text-gray-900">
            Start tracking your colony
          </h2>
          <p className="mt-2 text-gray-600">
            Free to set up. No credit card required.
          </p>
          <div className="mt-8">
            <Link href="/signup" className="btn-primary px-8 py-3.5 text-base">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-10 text-center">
        <div className="flex justify-center gap-6 text-sm text-gray-500">
          <Link href="/terms" className="transition-colors hover:text-gray-700">Terms</Link>
          <Link href="/privacy" className="transition-colors hover:text-gray-700">Privacy</Link>
        </div>
        <p className="mt-3 text-xs text-gray-400">© {new Date().getFullYear()} XenoTrack</p>
      </footer>
    </div>
  );
}

function FlowNode({ label, step, last }: { label: string; step: number; last?: boolean }) {
  void last;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-300 bg-brand-50 text-sm font-bold text-brand-700">
        {step}
      </div>
      <p className="text-xs font-medium text-gray-700 whitespace-nowrap">{label}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden sm:flex items-center px-2">
      <div className="h-0.5 w-6 bg-brand-200" />
      <div className="h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-brand-300" />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="card p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-lg text-brand-600">
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}
