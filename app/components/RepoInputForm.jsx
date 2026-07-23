"use client";

import { useState } from "react";

const GITHUB_URL_PATTERN =
  /^(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9](?:[a-zA-Z0-9-]){0,38}\/[a-zA-Z0-9._-]+/i;

export default function RepoInputForm({
  onSubmit,
  disabled,
  recentAnalyses = [],
  onOpenRecentAnalysis,
}) {
  const [value, setValue] = useState("");
  const [formError, setFormError] = useState("");

  function handleChange(e) {
    setValue(e.target.value);
    if (formError) setFormError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();

    if (!trimmed || disabled) return;

    // Quick client-side shape check — avoids a wasted network round-trip
    // for obviously malformed input. The server (lib/validate.js) remains
    // the real source of truth and re-validates regardless.
    if (!GITHUB_URL_PATTERN.test(trimmed)) {
      setFormError(
        "That doesn't look like a GitHub repository URL. It should look like https://github.com/owner/repo."
      );
      return;
    }

    onSubmit(trimmed);
  }

  function handlePickRecent(analysis) {
    if (disabled) return;
    onOpenRecentAnalysis?.(analysis);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
          Map a repository
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Paste a public GitHub URL and get a readable breakdown of what lives
          where.
        </p>
      </div>

      {recentAnalyses.length > 0 && (
        <div
          role="group"
          aria-label="Recently analyzed repositories"
          className="mb-5 rounded-2xl border border-stone-200 bg-stone-50/90 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              Recent in this session
            </h3>
            <span className="text-xs text-stone-400">
              Saved locally in your browser
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {recentAnalyses.map((analysis) => (
              <button
                key={`${analysis.repo.owner}/${analysis.repo.name}`}
                type="button"
                onClick={() => handlePickRecent(analysis)}
                disabled={disabled}
                className="max-w-full rounded-full border border-stone-300 bg-white px-3 py-2 text-left text-xs text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-950/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="block max-w-[220px] truncate font-semibold text-stone-900">
                  {analysis.repo.owner}/{analysis.repo.name}
                </span>
                <span className="block text-[11px] text-stone-500">
                  {analysis.repo.primaryLanguage}
                  {analysis.repo.supportedLanguage
                    ? " · supported"
                    : " · partial support"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {formError && (
        <div
          role="alert"
          className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
        >
          {formError}
        </div>
      )}

      <label htmlFor="repoUrl" className="sr-only">
        GitHub repository URL
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="repoUrl"
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="https://github.com/owner/repo"
          className="flex-1 rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-base text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-4 focus:ring-stone-950/8 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-2xl bg-stone-950 px-6 py-3.5 font-semibold text-white shadow-[0_12px_30px_rgba(17,17,17,0.18)] transition hover:-translate-y-0.5 hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-950/20 disabled:translate-y-0 disabled:bg-stone-400"
        >
          {disabled ? "Generating..." : "Generate"}
        </button>
      </div>
      <p className="mt-3 text-sm text-stone-500">
        Works best with public JavaScript and Python repositories.
      </p>
    </form>
  );
}
