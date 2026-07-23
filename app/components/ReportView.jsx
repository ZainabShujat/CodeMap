const SECTION_LABELS = [
  { key: "projectOverview", label: "Project Overview" },
  { key: "techStack", label: "Tech Stack" },
  { key: "folderStructure", label: "Folder Structure Explained" },
  { key: "whereToStart", label: "Where to Start Reading" },
  { key: "setupInstructions", label: "Setup Instructions" },
];

export default function ReportView({ repo, sections, onReset }) {
  return (
    <div className="w-full max-w-3xl">
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-bold">
            {repo.owner}/{repo.name}
          </h2>
          <p className="text-sm text-gray-400">{repo.primaryLanguage}</p>
        </div>
        <button
          onClick={onReset}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Map another repo
        </button>
      </div>

      {!repo.supportedLanguage && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          This repo's primary language isn't fully supported yet — results
          may be less reliable.
        </div>
      )}

      <div className="space-y-8">
        {SECTION_LABELS.map(({ key, label }) => (
          <div key={key}>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {label}
            </h3>
            <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
              {sections[key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
