// TODO: Fetch organization_module_trials for current org
// TODO: Show trial status if activated

export default function ModulesPage() {
  return (
    <div className="p-6 lg:p-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add-ons & Coming Soon</h1>
        <p className="mt-1 text-sm text-gray-500">
          XenoTrack starts simple — bins, frogs, rest/use tracking, performance,
          and forecasting. These optional add-ons extend your workspace when
          you&apos;re ready.
        </p>
      </div>

      {/* Base product */}
      <section className="mt-8">
        <div className="rounded-xl border-2 border-brand-200 bg-brand-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Base Colony Register
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Bins, frogs, use/rest rotation, repopulation planning,
                performance tracking, photo archive, capacity forecasting,
                bottleneck detection, past/future views, and notifications.
              </p>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Included
            </span>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800">Future Add-ons</h2>
        <p className="mt-1 text-sm text-gray-500">
          These features are in development. They will be available as optional
          upgrades when ready.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <AddonCard
            title="Photo-ID & Imaging"
            status="Coming soon"
            description="Phone-guided frog photo capture, image quality scoring, photo fingerprinting, and photo-to-frog matching. Use your existing photo archive to identify individuals."
            features={[
              "Cellphone-guided photo capture",
              "Photo quality scoring",
              "Image fingerprinting",
              "Photo-to-frog matching",
              "Pre-cataloged shipment records (Xenopus 1)",
            ]}
          />
          <AddonCard
            title="Frog Sentinel"
            status="Coming soon"
            description="Husbandry companion for labs that want deeper colony care tracking alongside their standard rotation workflow."
            features={[
              "Feeding schedules and logs",
              "Husbandry checkpoints",
              "Environmental notes (temperature, pH, water quality)",
              "Care alerts and recovery tracking",
              "Performance/husbandry correlations",
            ]}
          />
          <AddonCard
            title="Frog Social Case Support"
            status="Future"
            description="Optionally share selected XenoTrack records with Frog Social for expert case consultation. Your data stays private unless you explicitly create a case packet."
            features={[
              "User-controlled case packets only",
              "Preview before sharing",
              "De-identification options",
              "Resolution returned to your private record",
              "No automatic sharing — ever",
            ]}
          />
          <AddonCard
            title="Visual Analytics"
            status="Future"
            description="Charts, seasonality trends, and visual dashboards for colony performance and capacity over time."
            features={[
              "Performance trend charts",
              "Seasonal patterns",
              "Capacity/use visual forecasting",
              "Exportable reports",
            ]}
          />
        </div>
      </section>

      <p className="mt-10 text-xs text-gray-400">
        Add-on availability and pricing will be announced when features launch.
        Your base colony register is unaffected by these add-ons.
      </p>
    </div>
  );
}

function AddonCard({
  title,
  status,
  description,
  features,
}: {
  title: string;
  status: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
          {status}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      <ul className="mt-3 space-y-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-gray-500">
            <span className="mt-0.5 text-gray-300">•</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
