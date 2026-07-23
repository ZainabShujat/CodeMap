const SECTION_LABELS = [
  { key: "projectOverview", label: "Project Overview" },
  { key: "techStack", label: "Tech Stack" },
  { key: "folderStructure", label: "Folder Structure Explained" },
  { key: "whereToStart", label: "Where to Start Reading" },
  { key: "setupInstructions", label: "Setup Instructions" },
];

function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

export default function ReportView({ repo, sections, onReset }) {
  return (
    <div className="mx-auto w-full max-w-5xl animate-fade-in-up px-4 sm:px-0">
      <div className="mb-6 rounded-[2rem] border border-stone-300/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(82,64,40,0.12)] backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
              Repository map
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              {repo.owner}/{repo.name}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold text-white">
                {repo.primaryLanguage}
              </span>
              <span className="rounded-full border border-stone-300 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-600">
                {repo.supportedLanguage ? "Supported" : "Partial support"}
              </span>
            </div>
          </div>
          <button
            onClick={onReset}
            className="rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-950/15"
          >
            Map another repo
          </button>
        </div>

        {!repo.supportedLanguage && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            This repo's primary language isn't fully supported yet, so some
            sections may be less precise.
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["Project focus", sections.projectOverview],
            ["Stack summary", sections.techStack],
            ["Starter path", sections.whereToStart],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-stone-200 bg-stone-50/90 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                {label}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                {truncate(value, 140)}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-400">
          Quick-scan summary above — full detail in each section below.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {SECTION_LABELS.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-[1.75rem] border border-stone-300/70 bg-white/85 p-5 shadow-[0_14px_40px_rgba(82,64,40,0.08)]"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight text-stone-950">
                  {label}
                </h3>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-500">
                  {label === "Project Overview" ? "Summary" : "Details"}
                </span>
              </div>
              <p className="whitespace-pre-wrap leading-7 text-stone-700">
                {sections[key]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
