import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute inset-0 -z-10 opacity-70 [background-image:linear-gradient(rgba(120,95,64,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(120,95,64,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="w-full max-w-md rounded-[2rem] border border-stone-300/70 bg-white/80 p-8 text-center shadow-[0_24px_80px_rgba(82,64,40,0.14)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          CodeMap only has one page — the repository mapper itself. Let&apos;s
          get you back there.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-2xl bg-stone-950 px-6 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(17,17,17,0.18)] transition hover:-translate-y-0.5 hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-950/20"
        >
          Back to CodeMap
        </Link>
      </div>
    </main>
  );
}
