// TODO: Fetch from forecast_settings for current org
// TODO: Allow inline editing with save to Supabase
// TODO: Auto-calculate from historical use data (future)

interface Assumptions {
  avgFrogsPerWeek: number;
  avgBinsPerWeek: number;
  minRestDays: number;
  targetRestDays: number;
  overdueAfterDays: number;
  readyFrogThreshold: number;
  readyBinThreshold: number;
  retirementRate: number;
  repopulationRate: number;
}

const MOCK: Assumptions = {
  avgFrogsPerWeek: 16,
  avgBinsPerWeek: 2,
  minRestDays: 90,
  targetRestDays: 120,
  overdueAfterDays: 135,
  readyFrogThreshold: 32,
  readyBinThreshold: 4,
  retirementRate: 2,
  repopulationRate: 8,
};

export default function ForecastAssumptions() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-700">
        Forecasting Assumptions
      </h3>
      <p className="mt-1 text-xs text-gray-400">
        These values drive capacity predictions. TODO: auto-calculate from
        historical data.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Item label="Use rate" value={`${MOCK.avgFrogsPerWeek} frogs/wk`} />
        <Item label="Bin use rate" value={`${MOCK.avgBinsPerWeek} bins/wk`} />
        <Item label="Rest period" value={`${MOCK.targetRestDays}d`} />
        <Item label="Min rest" value={`${MOCK.minRestDays}d`} />
        <Item label="Overdue" value={`${MOCK.overdueAfterDays}d`} />
        <Item label="Frog threshold" value={String(MOCK.readyFrogThreshold)} />
        <Item label="Bin threshold" value={String(MOCK.readyBinThreshold)} />
        <Item label="Retirements/mo" value={String(MOCK.retirementRate)} />
        <Item label="Repop rate/mo" value={String(MOCK.repopulationRate)} />
      </div>
      <a
        href="/workspace-profile"
        className="mt-3 inline-block text-xs font-medium text-brand-600 hover:underline"
      >
        Edit settings →
      </a>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
