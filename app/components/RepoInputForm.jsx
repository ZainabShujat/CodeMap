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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder="https://github.com/owner/repo"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 disabled:text-gray-400"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:bg-gray-400"
        >
          {disabled ? "Generating..." : "Generate"}
        </button>
      </div>
      <p className="mt-3 text-sm text-gray-400">
        Works with public JavaScript &amp; Python repositories.
      </p>
    </form>
  );
}
