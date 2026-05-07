"use client";

import { useState } from "react";

// TODO: Wire each step to Supabase inserts (organizations, locations, frogs, rotation_settings, notification_rules)
// TODO: Redirect to /dashboard on completion
// TODO: Gate access — only show if organization setup is incomplete

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Set up your colony</h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete these steps to start tracking your frogs and bins.
        </p>

        {/* Progress */}
        <div className="mt-6 flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${step >= s ? "bg-brand-500" : "bg-gray-200"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">Step {step} of 6</p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          {step === 1 && <StepWorkspace />}
          {step === 2 && <StepHousing />}
          {step === 3 && <StepFrogs />}
          {step === 4 && <StepPhotos />}
          {step === 5 && <StepRotation />}
          {step === 6 && <StepNotifications />}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
            disabled={step === 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30"
          >
            Back
          </button>
          {step < 6 ? (
            <button
              onClick={() => setStep((s) => Math.min(6, s + 1) as Step)}
              className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={() => {
                // TODO: Save all settings and redirect
                window.location.href = "/dashboard";
              }}
              className="rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Finish Setup
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          You can always change these settings later in Workspace.
        </p>
      </div>
    </div>
  );
}

function StepWorkspace() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        1. Create your lab workspace
      </h2>
      <p className="text-sm text-gray-600">
        This is your private colony register. Only people you invite will have access.
      </p>
      <div className="space-y-3">
        <Field label="Lab / workspace name" placeholder="e.g. Smith Lab, Building 4 Colony" />
        <div>
          <label className="block text-sm font-medium text-gray-700">Primary lab mode</label>
          <select className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
            <option value="research">Research (oocytes, extracts, embryos)</option>
            <option value="teaching">Teaching</option>
            <option value="breeding">Breeding / husbandry</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <Field label="Contact email" placeholder="lab-manager@institution.edu" type="email" />
        <Field label="Phone (optional)" placeholder="+1 555 000 0000" type="tel" />
      </div>
    </div>
  );
}

function StepHousing() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        2. Set up your housing structure
      </h2>
      <p className="text-sm text-gray-600">
        How is your colony physically organized? Bins are the primary operating
        unit in XenoTrack.
      </p>
      <div className="space-y-3">
        <Field label="Number of bins / tanks / tubs" placeholder="e.g. 24" type="number" />
        <div>
          <label className="block text-sm font-medium text-gray-700">Naming convention</label>
          <select className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
            <option value="rack_bin">Rack + Bin (e.g. Rack 1 / Bin 3)</option>
            <option value="room_rack_bin">Room + Rack + Bin</option>
            <option value="numbered">Simple numbered (Bin 1, Bin 2...)</option>
            <option value="custom">Custom labels</option>
          </select>
        </div>
        <Field label="Target frogs per bin" placeholder="e.g. 8" type="number" />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Room/rack grouping
          </label>
          <p className="text-xs text-gray-500">Optional. You can add more later.</p>
          <input
            type="text"
            placeholder="e.g. Room A, Room B"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

function StepFrogs() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        3. Add your first frogs
      </h2>
      <p className="text-sm text-gray-600">
        Populate your colony register. You can always add more frogs later.
      </p>
      <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <FrogOption
          title="Add frogs manually"
          description="Enter individual frog details one at a time."
        />
        <FrogOption
          title="Bulk add by count"
          description="Quickly add a batch (e.g. 8 females in Bin 3) without individual details."
        />
        <FrogOption
          title="Import from CSV"
          description="Upload a spreadsheet of frog records."
        />
        <FrogOption
          title="Assign frogs to bins"
          description="Move existing frogs into your housing structure."
        />
      </div>
      <p className="text-xs text-gray-400">
        TODO: Wire each option to actual input forms and Supabase inserts
      </p>
    </div>
  );
}

function StepPhotos() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        4. Upload photos
      </h2>
      <p className="text-sm text-gray-600">
        Build your colony photo archive. Photos are stored with your frog and
        bin records — searchable and permanent.
      </p>
      <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <FrogOption
          title="Individual frog photo"
          description="Attach a photo to a specific frog record."
        />
        <FrogOption
          title="Bin photo"
          description="Take a photo of a whole bin/tank."
        />
        <FrogOption
          title="Bin photo set"
          description="Upload multiple photos for a bin at once."
        />
        <FrogOption
          title="Colony photo archive"
          description="Batch upload photos to organize later."
        />
      </div>
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
        Upload photos now to build your colony archive. Future photo-ID tools
        may use these records to help match individual frogs.
      </div>
      <p className="text-xs text-gray-400">
        TODO: Wire to Supabase Storage upload (frog-photos bucket)
      </p>
    </div>
  );
}

function StepRotation() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        5. Set rest and use rules
      </h2>
      <p className="text-sm text-gray-600">
        XenoTrack tracks when bins are resting, ready, or overdue. Configure
        your defaults.
      </p>
      <div className="space-y-3">
        <Field label="Minimum rest days" placeholder="e.g. 90" type="number" />
        <Field label="Target rest days" placeholder="e.g. 120" type="number" />
        <Field label="Overdue after (days)" placeholder="e.g. 180" type="number" />
        <Field label="Expected uses per month (colony-wide)" placeholder="e.g. 4" type="number" />
      </div>
      <p className="text-xs text-gray-500">
        These values drive forecasting, recommendations, and overdue alerts.
        You can change them anytime.
      </p>
    </div>
  );
}

function StepNotifications() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        6. Notification preferences
      </h2>
      <p className="text-sm text-gray-600">
        Choose how XenoTrack should alert you about your colony.
      </p>
      <div className="space-y-3">
        <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300" />
          <div>
            <p className="text-sm font-medium text-gray-700">Email notifications</p>
            <p className="text-xs text-gray-500">Bin ready, overdue, repopulation needed</p>
          </div>
        </label>
        <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
          <div>
            <p className="text-sm font-medium text-gray-700">SMS notifications</p>
            <p className="text-xs text-gray-500">Coming soon — urgent alerts only</p>
          </div>
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700">Summary frequency</label>
          <select className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
            <option value="daily">Daily summary</option>
            <option value="weekly">Weekly summary</option>
            <option value="monthly">Monthly summary</option>
            <option value="none">No summaries</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
      />
    </div>
  );
}

function FrogOption({ title, description }: { title: string; description: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50">
      <input type="radio" name="frog_option" className="mt-0.5 h-4 w-4" />
      <div>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </label>
  );
}
