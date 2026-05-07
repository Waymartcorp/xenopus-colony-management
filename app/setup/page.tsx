"use client";

import { useState } from "react";

// TODO: Persist each step to Supabase (locations, frogs, rotation_settings, notification_rules)
// TODO: Check what already exists and skip completed steps
// TODO: Support CSV import for frogs

export default function SetupPage() {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Create Housing Structure", subtitle: "Rooms, racks, bins" },
    { title: "Add Frogs", subtitle: "Manual, bulk, or import" },
    { title: "Set Rotation Defaults", subtitle: "Rest periods and reuse windows" },
    { title: "Configure Notices", subtitle: "Email, SMS, and recipients" },
  ];

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Setup Guide</h1>
          <p className="mt-1 text-sm text-gray-500">
            Get your colony into XenoTrack step by step.
          </p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="mt-8 flex items-center gap-2">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setStep(idx)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
              idx === step
                ? "bg-brand-600 text-white"
                : idx < step
                ? "bg-brand-100 text-brand-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              {idx + 1}
            </span>
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        {step === 0 && <HousingStep />}
        {step === 1 && <FrogsStep />}
        {step === 2 && <RotationStep />}
        {step === 3 && <NoticesStep />}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30"
        >
          Back
        </button>
        <div className="flex gap-2">
          <a
            href="/dashboard"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Skip — go to dashboard
          </a>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Continue
            </button>
          ) : (
            <a
              href="/dashboard"
              className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Finish Setup
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function HousingStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Step 1: Create Housing Structure
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Define your rooms, racks, and bins. This is how XenoTrack organizes
          your colony — bins are the core operating unit.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Room Name
          </label>
          <input
            type="text"
            placeholder="e.g. Room A, Aquatics Suite 102"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rack / Section Name
          </label>
          <input
            type="text"
            placeholder="e.g. Rack 1, Left Wall Rack"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Bins in Rack
            </label>
            <input
              type="number"
              defaultValue={8}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target Frogs per Bin
            </label>
            <input
              type="number"
              defaultValue={8}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Housing Terminology
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Bins", "Tanks", "Tubs", "Racks", "Rooms", "Cohorts"].map((t) => (
              <label key={t} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2">
                <input type="checkbox" defaultChecked={t === "Bins" || t === "Racks" || t === "Rooms"} className="h-4 w-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">{t}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
        + Add Room &amp; Rack
      </button>

      <p className="text-xs text-gray-400">
        You can add more rooms and racks later from the Rooms &amp; Racks page.
      </p>
    </div>
  );
}

function FrogsStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Step 2: Add Frogs
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Add frogs to your bins. You can add them manually, in bulk, or import
          from a CSV file.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <button className="rounded-xl border-2 border-gray-200 p-6 text-center hover:border-brand-300 hover:bg-brand-50">
          <p className="text-sm font-semibold text-gray-800">Add Manually</p>
          <p className="mt-1 text-xs text-gray-500">One frog at a time</p>
        </button>
        <button className="rounded-xl border-2 border-gray-200 p-6 text-center hover:border-brand-300 hover:bg-brand-50">
          <p className="text-sm font-semibold text-gray-800">Bulk Add to Bin</p>
          <p className="mt-1 text-xs text-gray-500">Add N frogs to a bin</p>
        </button>
        <button className="rounded-xl border-2 border-gray-200 p-6 text-center hover:border-brand-300 hover:bg-brand-50">
          <p className="text-sm font-semibold text-gray-800">Import CSV</p>
          <p className="mt-1 text-xs text-gray-500">Upload spreadsheet</p>
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-700">Quick bulk add:</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500">Select Bin</label>
            <select className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option>Rack 1 / Bin 1</option>
              <option>Rack 1 / Bin 2</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Number of Frogs</label>
            <input type="number" defaultValue={8} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Sex</label>
            <select className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option>Female</option>
              <option>Male</option>
              <option>Mixed</option>
            </select>
          </div>
        </div>
        <button className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          Add Frogs to Bin
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Optionally upload photos after adding frogs. Photos help with
        individual identification (future feature).
      </p>
    </div>
  );
}

function RotationStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Step 3: Set Rotation Defaults
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          These values determine when bins are considered &quot;ready after rest,&quot;
          optimal for reuse, or overdue.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Minimum Rest (days)
          </label>
          <p className="text-xs text-gray-400">Earliest a bin can be reused</p>
          <input type="number" defaultValue={90} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target Rest (days)
          </label>
          <p className="text-xs text-gray-400">Ideal rest period before next use</p>
          <input type="number" defaultValue={120} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Overdue After (days)
          </label>
          <p className="text-xs text-gray-400">Flag bins past this threshold</p>
          <input type="number" defaultValue={135} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Default Bin Capacity
          </label>
          <p className="text-xs text-gray-400">Target number of frogs per bin</p>
          <input type="number" defaultValue={8} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        With these defaults, bins will be marked &quot;rest complete&quot; at 90
        days, recommended for use at 90–120 days, and flagged as overdue at 135+
        days.
      </div>
    </div>
  );
}

function NoticesStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Step 4: Configure Notices
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Choose how and when XenoTrack sends alerts about your colony.
        </p>
      </div>

      <div className="space-y-3">
        <NoticeOption label="Rest-complete alerts" description="When a bin finishes its rest period" defaultChecked />
        <NoticeOption label="Overdue rotation alerts" description="When bins remain unused past overdue threshold" defaultChecked />
        <NoticeOption label="Repopulation prompts" description="When bins drop below target capacity" defaultChecked />
        <NoticeOption label="Weekly colony summary" description="Overview of colony status every Monday" defaultChecked />
        <NoticeOption label="Next-use recommendations" description="Suggested bins for upcoming extractions" />
        <NoticeOption label="Missing performance reminders" description="Nudges to log results after use" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Channel
          </label>
          <select className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
            <option>Email</option>
            <option>SMS</option>
            <option>Email + SMS</option>
            <option>In-app only</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Recipients
          </label>
          <input
            type="text"
            placeholder="jane@lab.edu, tom@lab.edu"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

function NoticeOption({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-gray-300"
      />
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </label>
  );
}
