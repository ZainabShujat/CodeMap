"use client";

import { useState } from "react";

export default function RepoInputForm({ onSubmit, disabled }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
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

      <label htmlFor="repoUrl" className="sr-only">
        GitHub repository URL
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="repoUrl"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
