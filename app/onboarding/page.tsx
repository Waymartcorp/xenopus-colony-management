"use client";

import { useState } from "react";

// TODO: Fetch current user and org from Supabase
// TODO: Save each step to the database
// TODO: Skip steps if already configured
// TODO: Redirect to /dashboard when complete

type Step = "profile" | "housing" | "frogs" | "rotation" | "notifications" | "done";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>("profile");

  const steps: { key: Step; label: string }[] = [
    { key: "profile", label: "Workspace Profile" },
    { key: "housing", label: "Housing Setup" },
    { key: "frogs", label: "Add Frogs" },
    { key: "rotation", label: "Rotation Settings" },
    { key: "notifications", label: "Notifications" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  function next() {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key);
    } else {
      setCurrentStep("done");
    }
  }

  function skip() {
    next();
  }

  if (currentStep === "done") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            You&apos;re all set!
          </h1>
          <p className="mt-2 text-gray-600">
            Your workspace is configured. You can always adjust settings
            later.
          </p>
          <a
            href="/dashboard"
            className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.key} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    idx <= currentIndex
                      ? "bg-brand-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`mx-1 h-0.5 w-8 ${
                      idx < currentIndex ? "bg-brand-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-sm font-medium text-gray-700">
            Step {currentIndex + 1}: {steps[currentIndex].label}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          {currentStep === "profile" && <ProfileStep />}
          {currentStep === "housing" && <HousingStep />}
          {currentStep === "frogs" && <FrogsStep />}
          {currentStep === "rotation" && <RotationStep />}
          {currentStep === "notifications" && <NotificationsStep />}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={skip}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Skip
          </button>
          <button
            onClick={next}
            className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {currentIndex === steps.length - 1 ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileStep() {
  // TODO: Let user confirm/edit lab mode and org name
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Workspace Profile</h2>
      <p className="text-sm text-gray-600">
        Confirm your lab mode. This customizes dashboards, event templates,
        and notifications.
      </p>
      <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm">
        <option value="general">General Colony</option>
        <option value="extract">Extract Lab</option>
        <option value="developmental">Developmental Lab</option>
        <option value="ovary_oocyte">Ovary &amp; Oocyte</option>
        <option value="transgenic">Transgenic / Embryo</option>
      </select>
    </div>
  );
}

function HousingStep() {
  // TODO: Let user define their housing terminology and create first locations
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Housing Setup</h2>
      <p className="text-sm text-gray-600">
        Define your housing structure. What do you call your containers?
      </p>
      <div className="grid grid-cols-2 gap-3">
        {["Bins", "Tanks", "Tubs", "Racks", "Rooms", "Cohorts"].map((t) => (
          <label key={t} className="flex items-center gap-2 rounded-lg border border-gray-200 p-3">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300" />
            <span className="text-sm text-gray-700">{t}</span>
          </label>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        You can add specific rooms, racks, and bins after onboarding.
      </p>
    </div>
  );
}

function FrogsStep() {
  // TODO: Let user add first frogs manually or upload CSV
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Add Frogs</h2>
      <p className="text-sm text-gray-600">
        Add your first frogs to the colony, or skip and add them later.
      </p>
      <div className="flex gap-3">
        <button className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Add Manually
        </button>
        <button className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Import CSV
        </button>
      </div>
      <p className="text-xs text-gray-400">
        You can always add more frogs from the Frogs page.
      </p>
    </div>
  );
}

function RotationStep() {
  // TODO: Let user configure rotation_settings
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Rotation Settings</h2>
      <p className="text-sm text-gray-600">
        Set your rest period defaults. These control when frogs and bins are
        marked as ready or overdue.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Min Rest (days)</label>
          <input type="number" defaultValue={90} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Target Rest (days)</label>
          <input type="number" defaultValue={120} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Overdue After (days)</label>
          <input type="number" defaultValue={135} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Bin Capacity</label>
          <input type="number" defaultValue={8} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
      </div>
    </div>
  );
}

function NotificationsStep() {
  // TODO: Let user configure notification preferences
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
      <p className="text-sm text-gray-600">
        Choose how you want to be notified about colony events.
      </p>
      <div className="space-y-3">
        <label className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
          <span className="text-sm text-gray-700">Email notifications</span>
          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300" />
        </label>
        <label className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
          <span className="text-sm text-gray-700">SMS notifications</span>
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
        </label>
        <label className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
          <span className="text-sm text-gray-700">Weekly summary</span>
          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300" />
        </label>
      </div>
    </div>
  );
}
