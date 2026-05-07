export default function ReportsPage() {
  // TODO: VisualReports component
  // TODO: Report type selection (colony summary, performance, seasonal, rotation, export)
  // TODO: CSV export for underlying data tables
  // TODO: Printable summary reports
  // TODO: Seasonal report export
  // TODO: Performance report export
  // TODO: Future: PDF export with charts
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      <p className="mt-2 text-gray-600">
        Generate and export colony reports. CSV data exports, printable
        summaries, and visual report views.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Available Reports
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ReportCard
            title="Colony Summary"
            description="Current colony state: frogs, bins, cycle states, recent activity"
            format="CSV / Print"
          />
          <ReportCard
            title="Rotation Report"
            description="Bins by state, rest queue, overdue list, forecast"
            format="CSV / Print"
          />
          <ReportCard
            title="Performance Report"
            description="Per-frog and per-bin performance, trends, rankings"
            format="CSV / Print"
          />
          <ReportCard
            title="Seasonal Report"
            description="Monthly and seasonal performance averages, comparisons"
            format="CSV / Print"
          />
          <ReportCard
            title="Environmental Report"
            description="Environmental observations timeline and correlations"
            format="CSV"
          />
          <ReportCard
            title="Event History"
            description="Full event log export with filters"
            format="CSV"
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800">Quick Export</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <ExportButton label="Export Frogs (CSV)" />
          <ExportButton label="Export Events (CSV)" />
          <ExportButton label="Export Bins (CSV)" />
          <ExportButton label="Export Performance (CSV)" />
          <ExportButton label="Export Environment (CSV)" />
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Future: PDF &amp; Chart Export
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          PDF export with embedded charts and visual summaries is planned for a
          future release.
        </p>
      </section>
    </div>
  );
}

function ReportCard({
  title,
  description,
  format,
}: {
  title: string;
  description: string;
  format: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">{format}</span>
        <button className="rounded-md bg-brand-600 px-3 py-1 text-xs font-medium text-white hover:bg-brand-700">
          Generate
        </button>
      </div>
    </div>
  );
}

function ExportButton({ label }: { label: string }) {
  return (
    <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
      {label}
    </button>
  );
}
