/**
 * XenoTrack logo system.
 * Mark: abstract 2×2 bin grid with cycle arc — represents colony rotation.
 * Wordmark: "XenoTrack" set in Inter bold.
 * Descriptor: "Xenopus Colony Register" — used on landing/auth pages.
 */

export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="XenoTrack"
    >
      {/* Background rounded square */}
      <rect width="32" height="32" rx="7" fill="currentColor" className="text-brand-600" />

      {/* 2×2 bin grid */}
      <rect x="6" y="6" width="8.5" height="8.5" rx="2" fill="white" opacity="0.95" />
      <rect x="17.5" y="6" width="8.5" height="8.5" rx="2" fill="white" opacity="0.5" />
      <rect x="6" y="17.5" width="8.5" height="8.5" rx="2" fill="white" opacity="0.5" />
      <rect x="17.5" y="17.5" width="8.5" height="8.5" rx="2" fill="white" opacity="0.95" />

      {/* Cycle arc — rotation indicator */}
      <path
        d="M22 10.5a6.5 6.5 0 01-12 3.4"
        stroke="#cfae45"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M10 21.5a6.5 6.5 0 0112-3.4"
        stroke="#cfae45"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function LogoWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[15px] font-bold tracking-tight text-gray-900 ${className}`}>
      Xeno<span className="text-brand-600">Track</span>
    </span>
  );
}

export function LogoLockup({ size = 28, showDescriptor = false, className = "" }: { size?: number; showDescriptor?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <div className="flex flex-col">
        <LogoWordmark />
        {showDescriptor && (
          <span className="text-[10px] font-medium tracking-wide text-gray-400">
            Xenopus Colony Register
          </span>
        )}
      </div>
    </div>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <LogoMark size={44} />
      <div className="text-center">
        <p className="text-xl font-bold tracking-tight text-gray-900">
          Xeno<span className="text-brand-600">Track</span>
        </p>
        <p className="mt-0.5 text-xs font-medium text-gray-400 tracking-wide">
          Xenopus Colony Register
        </p>
      </div>
    </div>
  );
}
