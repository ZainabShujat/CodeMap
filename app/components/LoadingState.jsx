export default function LoadingState() {
  return (
    <div className="mt-6 flex items-center gap-3 text-gray-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-teal-600" />
      <span>
        Reading the repository and writing your map (usually under 90
        seconds)
      </span>
    </div>
  );
}
