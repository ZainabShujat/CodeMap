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
      <main className="relative flex min-h-screen flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(191,131,72,0.22),transparent_65%)]" />
        <ReportView
          repo={result.repo}
          sections={result.sections}
          onReset={handleReset}
        />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="absolute inset-0 -z-10 opacity-70 [background-image:linear-gradient(rgba(120,95,64,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(120,95,64,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <section className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-3 py-1 text-xs font-medium tracking-[0.18em] text-stone-600 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              REPOSITORY MAPPING
            </div>
            <h1 className="mt-5 max-w-xl text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
              Understand a codebase without reading every file.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600 sm:text-xl">
              CodeMap turns a GitHub repo into a clear project map with stack,
              structure, setup notes, and where to start.
            </p>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                "Fast first-pass overview",
                "Structure explained plainly",
                "Actionable setup notes",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-stone-300/70 bg-white/70 px-4 py-3 text-sm text-stone-700 shadow-sm backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center lg:justify-end">
            <div className="w-full max-w-2xl rounded-[2rem] border border-stone-300/70 bg-white/80 p-5 shadow-[0_24px_80px_rgba(82,64,40,0.14)] backdrop-blur-xl sm:p-7">
              {status === "error" && <ErrorBanner message={errorMessage} />}
              <RepoInputForm
                onSubmit={handleGenerate}
                disabled={status === "loading"}
              />
              {status === "loading" && <LoadingState />}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}