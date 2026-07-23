export default function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-6 animate-fade-in-up rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-4 text-stone-600 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
        <div>
          <p className="font-medium text-stone-900">Generating your map</p>
          <p className="text-sm text-stone-600">
            Reading the repository and assembling the overview — usually
            under 90 seconds.
          </p>
        </div>
      </div>
      <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-stone-200">
        <div className="absolute inset-y-0 w-1/3 animate-indeterminate rounded-full bg-stone-900/80" />
      </div>
    </div>
  );
}
