// TODO: Fetch husbandry_tasks for current org
// TODO: Filter by status, frequency, location, assigned user
// TODO: Support create/edit/complete/skip actions

const MOCK_TASKS = [
  { id: "1", title: "Daily feed — Rack 1", frequency: "Daily", dueAt: "Today, 9:00 AM", assignedTo: "All techs", status: "completed" },
  { id: "2", title: "Daily feed — Rack 2", frequency: "Daily", dueAt: "Today, 9:00 AM", assignedTo: "All techs", status: "pending" },
  { id: "3", title: "Daily feed — GP Tanks", frequency: "Daily", dueAt: "Today, 5:00 PM", assignedTo: "All techs", status: "pending" },
  { id: "4", title: "Recovery check — recently used bins", frequency: "Daily", dueAt: "Today, 10:00 AM", assignedTo: "Jane Smith", status: "pending" },
  { id: "5", title: "pH/conductivity check — Room A", frequency: "Weekly", dueAt: "Today, 11:00 AM", assignedTo: "Tom Chen", status: "pending" },
  { id: "6", title: "Filter inspection — Room A", frequency: "Monthly", dueAt: "May 15", assignedTo: "Tom Chen", status: "pending" },
  { id: "7", title: "Density check — Rack 2 / Bin 3", frequency: "Weekly", dueAt: "May 4 (overdue)", assignedTo: "Jane Smith", status: "overdue" },
  { id: "8", title: "Post-shipment acclimation check", frequency: "Custom", dueAt: "N/A", assignedTo: "Receiving tech", status: "completed" },
  { id: "9", title: "Check resting bins", frequency: "Weekly", dueAt: "Monday", assignedTo: "All techs", status: "pending" },
  { id: "10", title: "Review overdue bins", frequency: "Weekly", dueAt: "Monday", assignedTo: "Manager", status: "pending" },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  skipped: "bg-gray-100 text-gray-500",
};

export default function TasksPage() {
  const overdue = MOCK_TASKS.filter((t) => t.status === "overdue");
  const pending = MOCK_TASKS.filter((t) => t.status === "pending");
  const completed = MOCK_TASKS.filter((t) => t.status === "completed");

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Husbandry Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Recurring care tasks, assignments, and completion tracking.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            + Add Task
          </button>
          <a href="/husbandry" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Husbandry
          </a>
        </div>
      </div>

      {/* Overdue */}
      {overdue.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-red-600">
            Overdue ({overdue.length})
          </h2>
          <div className="mt-2 space-y-2">
            {overdue.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {/* Pending */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Pending ({pending.length})
        </h2>
        <div className="mt-3 space-y-2">
          {pending.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      </section>

      {/* Completed */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Completed Today ({completed.length})
        </h2>
        <div className="mt-3 space-y-2">
          {completed.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TaskRow({ task }: { task: typeof MOCK_TASKS[number] }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}>
          {task.status}
        </span>
        <div>
          <p className="text-sm font-medium text-gray-900">{task.title}</p>
          <p className="text-xs text-gray-400">
            {task.frequency} · {task.assignedTo}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">{task.dueAt}</span>
        {task.status === "pending" && (
          <button className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50">
            Complete
          </button>
        )}
        {task.status === "overdue" && (
          <button className="rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
            Complete
          </button>
        )}
      </div>
    </div>
  );
}
