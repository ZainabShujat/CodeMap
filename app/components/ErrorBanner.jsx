export default function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div className="mb-5 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-900 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-700">
          !
        </span>
        <p className="text-sm leading-6">{message}</p>
      </div>
    </div>
  );
}
