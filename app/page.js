"use client";

import { useState } from "react";
import RepoInputForm from "./components/RepoInputForm";
import LoadingState from "./components/LoadingState";
import ErrorBanner from "./components/ErrorBanner";
import ReportView from "./components/ReportView";

export default function Home() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);

  async function handleGenerate(repoUrl) {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        setErrorMessage(
          data.message || "Something went wrong. Please try again."
        );
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("success");
    } catch {
      setErrorMessage(
        "Couldn't reach the server. Check your connection and try again."
      );
      setStatus("error");
    }
  }

  function handleReset() {
    setStatus("idle");
    setErrorMessage("");
    setResult(null);
  }

  if (status === "success" && result) {
    return (
      <main className="flex min-h-screen flex-col items-center px-6 py-16">
        <ReportView
          repo={result.repo}
          sections={result.sections}
          onReset={handleReset}
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <h1 className="text-4xl font-bold">CodeMap</h1>
      <p className="mt-3 text-lg text-gray-500">
        Paste a repo. Understand it in under two minutes.
      </p>

      <div className="mt-10 w-full max-w-2xl">
        {status === "error" && <ErrorBanner message={errorMessage} />}
        <RepoInputForm
          onSubmit={handleGenerate}
          disabled={status === "loading"}
        />
        {status === "loading" && <LoadingState />}
      </div>
    </main>
  );
}