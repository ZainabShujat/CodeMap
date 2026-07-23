export default function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div className="mb-6 w-full max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      <span className="mr-2">⚠</span>
      {message}
    </div>
  );
}
