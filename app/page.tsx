import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity="0.9"/><rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5"/><rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5"/><rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.9"/></svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">XenoTrack</span>
          </div>
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
        {/* Animated background particles — always visible */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${6 + (i % 4) * 3}px`,
                height: `${6 + (i % 4) * 3}px`,
                background: ["#0d9488", "#2563eb", "#d97706", "#16a34a", "#6366f1", "#0d9488"][i % 6],
                left: `${3 + (i * 5) % 94}%`,
                top: `${8 + (i * 7) % 80}%`,
                opacity: 0.15 + (i % 3) * 0.1,
                animation: `float-particle ${3 + (i % 5) * 0.8}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Radial glow */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-brand-100/50 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-14 text-center sm:py-16">
          <div className="animate-in">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Xenopus frog use workflow
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              XenoTrack is a colony register and tank-based handling system with rest timers
              that maintains system continuity and institutional knowledge.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-in" style={{ animationDelay: "0.1s" }}>
            <Link href="/signup" className="btn-primary px-7 py-3.5 text-base">
              Create Account
            </Link>
            <Link href="/login" className="btn-secondary px-7 py-3.5 text-base">
              Log In
            </Link>
          </div>

          {/* Animated bin movement — directly below buttons */}
          <div className="mt-10 animate-in" style={{ animationDelay: "0.15s" }}>
            <BinMovementGraphic />
          </div>
        </div>
      </section>

      {/* Visual workflow */}
      <section id="how" className="border-t border-gray-100 bg-gray-50/80 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            One loop, the entire colony
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-600">
            Set up once. Then repeat the use/rest cycle as long as you need.
          </p>

          {/* Circular flow graphic */}
          <div className="relative mt-14">
            {/* Connecting path — visible on sm+ */}
            <div className="absolute left-0 right-0 top-[2.25rem] hidden h-0.5 sm:block">
              <div className="mx-auto h-full max-w-3xl bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
            </div>

            <div className="relative grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
              <WorkflowStep step={1} label="Define bins" icon={<BinIcon />} />
              <WorkflowStep step={2} label="Add frogs" icon={<FrogIcon />} />
              <WorkflowStep step={3} label="Log use" icon={<UseIcon />} />
              <WorkflowStep step={4} label="Move to rest" icon={<RestIcon />} />
              <WorkflowStep step={5} label="Start timer" icon={<TimerIcon />} />
              <WorkflowStep step={6} label="Notify team" icon={<NotifyIcon />} />
              <WorkflowStep step={7} label="Ready again" icon={<ReadyIcon />} active />
            </div>

            {/* Return arrow */}
            <div className="mx-auto mt-6 hidden max-w-3xl sm:block">
              <div className="flex items-center justify-center gap-2 text-xs text-brand-500">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 8H2M2 8L6 4M2 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-medium">Return to rotation</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180"><path d="M14 8H2M2 8L6 4M2 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            See what&apos;s actually happening in your colony
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500">
            No more guessing how many frogs are available, which bins are resting, or when you need to reorder.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              color="brand"
              title="Know what actually happened to each bin"
              description="Every use, transfer, and rest period is recorded with dates. See the full history of any bin instantly."
            />
            <FeatureCard
              color="blue"
              title="Know where used frogs went"
              description="Log use and the system recommends a destination bin. Source and destination are permanently linked."
            />
            <FeatureCard
              color="green"
              title="Know which frogs are really rested"
              description="Rest timers are calculated from actual use dates. No guessing — the system tells you what's ready."
            />
            <FeatureCard
              color="purple"
              title="Know how many frogs are actually available"
              description="Real-time stock counts from actual records. See active, resting, ready, and overdue at a glance."
            />
            <FeatureCard
              color="amber"
              title="Know when your colony will run short"
              description="Colony calculator uses your real usage data to predict shortage dates and safe ordering capacity."
            />
            <FeatureCard
              color="teal"
              title="Take the guesswork out of rest-bin placement"
              description="XenoTrack recommends which bin to place used frogs in. Confirms placement. Tracks the rest cohort."
            />
          </div>
        </div>
      </section>

      {/* Status showcase */}
      <section className="border-t border-gray-100 bg-gray-50/80 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Always know where you stand
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-600">
            Each bin has a live status. Know what&apos;s ready, what&apos;s resting, and what needs attention.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <StatusChip label="Ready for use" color="green" />
            <StatusChip label="Resting (day 42/90)" color="blue" />
            <StatusChip label="Open — receiving" color="emerald" />
            <StatusChip label="Occupied" color="gray" />
            <StatusChip label="Overdue" color="red" />
            <StatusChip label="GP Source" color="purple" />
            <StatusChip label="Needs repopulation" color="amber" />
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            Build years of searchable colony history. Preserve knowledge
            across technicians, lab managers, and projects.
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

/* Workflow step with icon */
function WorkflowStep({ step, label, icon, active }: { step: number; label: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <div className="group flex flex-col items-center gap-2 text-center">
      <div className={`relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${active ? "border-brand-400 bg-brand-50 shadow-sm" : "border-gray-200 bg-white"}`}>
        <div className={`${active ? "text-brand-600" : "text-gray-500 group-hover:text-brand-600"} transition-colors`}>
          {icon}
        </div>
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
          {step}
        </span>
      </div>
      <p className="text-xs font-medium text-gray-700">{label}</p>
    </div>
  );
}

function FeatureCard({ title, description, color }: { title: string; description: string; color: string }) {
  const colors: Record<string, string> = {
    brand: "border-l-brand-400",
    blue: "border-l-blue-400",
    green: "border-l-green-400",
    purple: "border-l-purple-400",
    amber: "border-l-amber-400",
    teal: "border-l-teal-400",
  };
  return (
    <div className={`card-flat border-l-4 p-5 transition-shadow hover:shadow-card-hover ${colors[color] ?? colors.brand}`}>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}

function StatusChip({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    green: "bg-green-100 text-green-700 border-green-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
    red: "bg-red-100 text-red-700 border-red-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${colors[color] ?? colors.gray}`}>
      {label}
    </span>
  );
}

/* SVG icons for workflow steps */
function BinIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="12" y1="4" x2="12" y2="10"/></svg>;
}
function FrogIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M9 14c1.5 1.5 4.5 1.5 6 0"/></svg>;
}
function UseIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/><circle cx="12" cy="12" r="9"/></svg>;
}
function RestIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
}
function TimerIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><line x1="12" y1="2" x2="12" y2="4"/></svg>;
}
function NotifyIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
}
function ReadyIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>;
}

function BinMovementGraphic() {
  return (
    <div className="relative mx-auto max-w-2xl rounded-2xl border border-gray-200/60 bg-white/70 px-6 py-8 shadow-lg backdrop-blur-sm">
      {/* Floating particles across the whole graphic */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + (i % 3) * 2}px`,
              height: `${4 + (i % 3) * 2}px`,
              background: ["#0d9488", "#2563eb", "#d97706", "#16a34a", "#0d9488", "#6366f1"][i % 6],
              left: `${5 + i * 8}%`,
              top: `${20 + Math.sin(i * 0.9) * 30}%`,
              opacity: 0.5,
              animation: `float-particle ${2.5 + i * 0.3}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      {/* Bins row with arrows */}
      <div className="relative flex items-center justify-between gap-2">
        <AnimatedBin label="Populated" color="brand" dotCount={6} dotColor="bg-brand-500" />
        <FlowArrowAnimated color="#0d9488" />
        <AnimatedBin label="In Use" color="blue" dotCount={2} dotColor="bg-blue-500" pulsing />
        <FlowArrowAnimated color="#2563eb" />
        <AnimatedBin label="Resting" color="amber" dotCount={4} dotColor="bg-amber-500" />
        <FlowArrowAnimated color="#16a34a" />
        <AnimatedBin label="Ready" color="green" dotCount={5} dotColor="bg-green-500" />
      </div>

      {/* Return cycle indicator */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin-slow">
            <path d="M7 1a6 6 0 105.2 3" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12.2 1v3h-3" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs font-medium text-brand-700">Continuous rotation cycle</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand-500" />population</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />use event</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" />rest cycle</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" />ready</span>
      </div>
    </div>
  );
}

function FlowArrowAnimated({ color }: { color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
        <path d="M0 6h24M20 2l6 4-6 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 2" className="animate-dash" opacity="0.7" />
      </svg>
      {/* Moving dot along arrow */}
      <div
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: color,
          animation: "dot-travel 1.8s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function AnimatedBin({ label, color, dotCount, dotColor, pulsing }: {
  label: string;
  color: "brand" | "blue" | "amber" | "green";
  dotCount: number;
  dotColor: string;
  pulsing?: boolean;
}) {
  const borderColors = {
    brand: "border-brand-300 bg-gradient-to-b from-brand-50 to-brand-100/60",
    blue: "border-blue-300 bg-gradient-to-b from-blue-50 to-blue-100/60",
    amber: "border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100/60",
    green: "border-green-300 bg-gradient-to-b from-green-50 to-green-100/60",
  };
  return (
    <div className="relative flex flex-col items-center">
      <div className={`relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 shadow-sm ${borderColors[color]} ${pulsing ? "animate-pulse-soft" : ""} transition-transform hover:scale-110`}>
        <div className="grid grid-cols-3 gap-1 p-2">
          {Array.from({ length: dotCount }).map((_, i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${dotColor} shadow-sm`}
              style={{
                animation: `dot-bob ${1.2 + i * 0.15}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      </div>
      <span className="mt-2 text-xs font-semibold text-gray-600">{label}</span>
    </div>
  );
}
