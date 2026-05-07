// TODO: Fetch active bottlenecks from bottlenecks table for current org

interface Bottleneck {
  id: string;
  severity: "low" | "medium" | "high";
  label: string;
  recommendedAction: string;
}

const MOCK_BOTTLENECKS: Bottleneck[] = [
  { id: "1", severity: "high", label: "Use rate exceeds rest recovery", recommendedAction: "Reduce to 12 frogs/week or repopulate 3 bins" },
  { id: "2", severity: "medium", label: "Overdue bin not being reused", recommendedAction: "Schedule Rack 3 / Bin 1 this week" },
  { id: "3", severity: "medium", label: "Bin below capacity (3/8)", recommendedAction: "Add 5 frogs from GP to Rack 2 / Bin 3" },
];

const SEVERITY_COLORS = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

export default function BottleneckPanel() {
  if (MOCK_BOTTLENECKS.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <h3 className="text-sm font-semibold text-green-700">No Bottlenecks</h3>
        <p className="mt-1 text-xs text-green-600">Colony rotation is healthy.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          Active Bottlenecks
        </h3>
        <span className="text-xs text-gray-400">{MOCK_BOTTLENECKS.length} issues</span>
      </div>
      <div className="mt-3 space-y-2">
        {MOCK_BOTTLENECKS.map((bn) => (
          <div key={bn.id} className="flex items-start gap-2">
            <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${SEVERITY_COLORS[bn.severity]}`} />
            <div>
              <p className="text-sm font-medium text-gray-800">{bn.label}</p>
              <p className="text-xs text-gray-500">→ {bn.recommendedAction}</p>
            </div>
          </div>
        ))}
      </div>
      <a href="/bottlenecks" className="mt-3 inline-block text-xs font-medium text-brand-600 hover:underline">
        View all bottlenecks →
      </a>
    </div>
  );
}
