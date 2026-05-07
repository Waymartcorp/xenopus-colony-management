export default function RotationPage() {
  // TODO: Fetch bin_cycle_status and frog_cycle_status for org
  // TODO: Show bins grouped by cycle state (ready, resting, overdue, needs repop)
  // TODO: Show rotation calendar with rest-complete dates
  // TODO: Show rest queue ordered by upcoming availability
  // TODO: Show overdue bins/frogs with urgency indicators
  // TODO: Show "Today's Colony Actions" card
  // TODO: Support bulk log use, bulk rest, bulk mark complete
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Rotation</h1>
      <p className="mt-2 text-gray-600">
        Manage bin and frog rotation cycles. Track rest periods, availability,
        and next-use recommendations.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Today&apos;s Colony Actions
        </h2>
        {/* TODO: TodayColonyActions component */}
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            No urgent actions today. All bins are within normal rotation
            parameters.
          </p>
        </div>
      </section>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CycleStatCard label="Ready for Use" value="—" color="green" />
        <CycleStatCard label="Resting" value="—" color="blue" />
        <CycleStatCard label="Overdue" value="—" color="red" />
        <CycleStatCard label="Needs Repopulation" value="—" color="yellow" />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Rest Queue</h2>
        {/* TODO: RestQueue component — bins ordered by rest_complete_at */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Bins completing rest will appear here, ordered by availability date.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Next Use Recommendations
        </h2>
        {/* TODO: RecommendationCard list for next-use bins */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Recommended bins for next use will appear here based on rotation
            rules, performance, and availability.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Bins by Cycle State
        </h2>
        {/* TODO: BinStatusCard grid or RotationPlanner component */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            All bins with their current rotation state will appear here.
          </p>
        </div>
      </section>
    </div>
  );
}

function CycleStatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    green: "border-green-200 bg-green-50 text-green-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    red: "border-red-200 bg-red-50 text-red-800",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-800",
  };
  return (
    <div className={`rounded-xl border p-6 ${colors[color]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
