// TODO: Fetch all bins and frogs grouped by room/rack from Supabase
// TODO: Add filters by status, location, lab mode, date, performance
// TODO: Add visual rack/bin layout view (future)

const MOCK_COLONY = {
  totalFrogs: 187,
  totalBins: 24,
  rooms: [
    {
      name: "Room A",
      racks: [
        {
          name: "Rack 1",
          bins: [
            { label: "Bin 1", status: "resting", frogs: 8, target: 8, days: 67 },
            { label: "Bin 2", status: "resting", frogs: 8, target: 8, days: 45 },
            { label: "Bin 3", status: "resting", frogs: 8, target: 8, days: 78 },
            { label: "Bin 4", status: "resting", frogs: 7, target: 8, days: 55 },
            { label: "Bin 5", status: "recently_used", frogs: 8, target: 8, days: 2 },
            { label: "Bin 6", status: "rest_complete", frogs: 8, target: 8, days: 112 },
            { label: "Bin 7", status: "resting", frogs: 8, target: 8, days: 41 },
            { label: "Bin 8", status: "rest_complete", frogs: 7, target: 8, days: 107 },
          ],
        },
        {
          name: "Rack 2",
          bins: [
            { label: "Bin 1", status: "resting", frogs: 8, target: 8, days: 88 },
            { label: "Bin 2", status: "resting", frogs: 8, target: 8, days: 72 },
            { label: "Bin 3", status: "needs_repopulation", frogs: 3, target: 8, days: null },
            { label: "Bin 4", status: "resting", frogs: 8, target: 8, days: 36 },
            { label: "Bin 5", status: "resting", frogs: 8, target: 8, days: 59 },
            { label: "Bin 6", status: "resting", frogs: 8, target: 8, days: 64 },
            { label: "Bin 7", status: "resting", frogs: 8, target: 8, days: 53 },
            { label: "Bin 8", status: "resting", frogs: 8, target: 8, days: 48 },
          ],
        },
      ],
    },
    {
      name: "Room B",
      racks: [
        {
          name: "Rack 3",
          bins: [
            { label: "Bin 1", status: "overdue", frogs: 8, target: 8, days: 142 },
            { label: "Bin 2", status: "resting", frogs: 8, target: 8, days: 81 },
            { label: "Bin 3", status: "resting", frogs: 8, target: 8, days: 60 },
            { label: "Bin 4", status: "resting", frogs: 7, target: 8, days: 44 },
          ],
        },
        {
          name: "Rack 4",
          bins: [
            { label: "Bin 1", status: "resting", frogs: 8, target: 8, days: 70 },
            { label: "Bin 2", status: "rest_complete", frogs: 8, target: 8, days: 105 },
            { label: "Bin 3", status: "resting", frogs: 8, target: 8, days: 55 },
            { label: "Bin 4", status: "resting", frogs: 8, target: 8, days: 32 },
          ],
        },
      ],
    },
    {
      name: "Room C",
      racks: [
        {
          name: "GP Tank",
          bins: [
            { label: "Tank 1", status: "general_population", frogs: 45, target: 50, days: null },
            { label: "Tank 2", status: "general_population", frogs: 38, target: 50, days: null },
          ],
        },
      ],
    },
  ],
  statusSummary: {
    rest_complete: 3,
    overdue: 1,
    needs_repopulation: 1,
    resting: 15,
    recently_used: 1,
    general_population: 2,
    scheduled_next: 1,
  },
};

const STATUS_COLORS: Record<string, string> = {
  rest_complete: "bg-green-500",
  overdue: "bg-red-500",
  needs_repopulation: "bg-yellow-500",
  resting: "bg-blue-400",
  recently_used: "bg-blue-300",
  general_population: "bg-gray-400",
  scheduled_next: "bg-brand-500",
};

const STATUS_LABELS: Record<string, string> = {
  rest_complete: "Rest Complete",
  overdue: "Overdue",
  needs_repopulation: "Needs Repopulation",
  resting: "Resting",
  recently_used: "Recently Used",
  general_population: "General Population",
  scheduled_next: "Scheduled Next",
};

export default function ColonyPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Whole Colony</h1>
          <p className="mt-1 text-sm text-gray-500">
            All bins grouped by room and rack. {MOCK_COLONY.totalFrogs} frogs
            across {MOCK_COLONY.totalBins} bins.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/bins"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Table View
          </a>
        </div>
      </div>

      {/* Status legend */}
      <div className="mt-6 flex flex-wrap gap-3">
        {Object.entries(MOCK_COLONY.statusSummary).map(([status, count]) => (
          <span key={status} className="inline-flex items-center gap-1.5 text-xs text-gray-600">
            <span className={`inline-block h-3 w-3 rounded-sm ${STATUS_COLORS[status] ?? "bg-gray-300"}`} />
            {STATUS_LABELS[status] ?? status} ({count})
          </span>
        ))}
      </div>

      {/* TODO: Add filters: status, room, performance, date */}

      {/* Room / Rack / Bin grid */}
      <div className="mt-8 space-y-8">
        {MOCK_COLONY.rooms.map((room) => (
          <section key={room.name}>
            <h2 className="text-lg font-semibold text-gray-800">{room.name}</h2>
            <div className="mt-3 space-y-4">
              {room.racks.map((rack) => (
                <div key={rack.name} className="rounded-xl border border-gray-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-gray-700">{rack.name}</h3>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
                    {rack.bins.map((bin) => (
                      <a
                        key={bin.label}
                        href="/bins"
                        className="group rounded-lg border border-gray-100 p-2 text-center hover:border-brand-300 hover:bg-brand-50"
                      >
                        <div className={`mx-auto h-2 w-full rounded-full ${STATUS_COLORS[bin.status] ?? "bg-gray-300"}`} />
                        <p className="mt-1.5 text-xs font-semibold text-gray-700 group-hover:text-brand-700">
                          {bin.label}
                        </p>
                        <p className="text-xs text-gray-400">
                          {bin.frogs}/{bin.target}
                        </p>
                        {bin.days != null && (
                          <p className="text-xs text-gray-400">{bin.days}d</p>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Quick actions */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-700">Quick Summary</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-900">Next bins to use</p>
            <p>Rack 1 / Bin 6 (112d), Rack 1 / Bin 8 (107d), Rack 4 / Bin 2 (105d)</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Need repopulation</p>
            <p>Rack 2 / Bin 3 (3/8 frogs)</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">General population</p>
            <p>GP Tank 1 (45 frogs), GP Tank 2 (38 frogs)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
