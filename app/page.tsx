"use client";

import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ImageIcon,
  Link2,
  Loader2,
  Search,
  ShieldCheck,
} from "lucide-react";        
import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

type VerifyImageResponse = {
  imageUrl: string;
  usageCount: number;
  sources: string[];
};

const exampleUrls = [
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
];

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState<VerifyImageResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sourceCountLabel = useMemo(() => {
    // Fixed: Added optional chaining to prevent crash if result is null
    if (!result || !result.sources) return "sources";
    return result.sources.length === 1 ? "source" : "sources";
  }, [result]);

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    const trimmedUrl = imageUrl.trim();
    if (!trimmedUrl) {
      setError("Enter an image URL before analyzing.");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setError("Use a complete image URL that starts with http:// or https://.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/verify-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: trimmedUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to verify this image.");
      }

      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while analyzing the image.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col justify-center gap-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-sky-800 shadow-sm">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Google Lens powered reverse image tracking
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
                Image Usage Tracker
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Paste an image URL from Google, Pinterest, or any public image host
                to estimate how often it appears across visual search results.
              </p>
            </div>

            <form
              onSubmit={handleAnalyze}
              className="rounded-lg border border-slate-200 bg-white p-3 shadow-soft"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">Image URL</span>
                  <Link2
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="h-14 w-full rounded-md border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                </label>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-slate-950 px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Search className="h-5 w-5" aria-hidden="true" />
                  )}
                  Analyze
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {exampleUrls.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setImageUrl(url)}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:border-sky-300 hover:text-sky-700"
                  >
                    Try sample
                  </button>
                ))}
              </div>
            </form>

            {error ? (
              <div className="flex items-start gap-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
                <p>{error}</p>
              </div>
            ) : null}
          </div>

          <ResultsPanel
            imageUrl={imageUrl}
            isLoading={isLoading}
            result={result}
            sourceCountLabel={sourceCountLabel}
          />
        </section>
      </div>
    </main>
  );
}

function ResultsPanel({
  imageUrl,
  isLoading,
  result,
  sourceCountLabel,
}: {
  imageUrl: string;
  isLoading: boolean;
  result: VerifyImageResponse | null;
  sourceCountLabel: string;
}) {
  if (!result && !isLoading) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white/86 p-6 shadow-soft backdrop-blur">
        <div className="flex min-h-[30rem] flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-sky-100 text-sky-700">
            <ImageIcon className="h-8 w-8" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-950">Results appear here</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            Search an image to see a preview, total visual matches, and the pages
            where the image was discovered.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-100">
          <div className="relative aspect-[4/3] w-full">
            {isLoading ? (
              <div className="absolute inset-0 grid place-items-center text-slate-500">
                <Loader2 className="h-9 w-9 animate-spin" aria-hidden="true" />
              </div>
            ) : (
              /* Fixed: Prioritize pasted link for preview calibration and added unoptimized */
              (result?.imageUrl || imageUrl) ? (
                <div className="relative h-full w-full bg-slate-50 flex items-center justify-center">
                  {imageUrl && !imageUrl.match(/\.(jpeg|jpg|gif|png|webp|avif)$/i) && !result?.imageUrl ? (
                    <div className="flex flex-col items-center gap-3 p-6 text-center">
                      <div className="p-3 bg-sky-100 rounded-full">
                        <Link2 className="h-8 w-8 text-sky-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">Web Page Link</p>
                        <p className="text-[10px] text-slate-500">Analyzer will extract image after you click Analyze</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={imageUrl || result?.imageUrl || ""}
                      alt="Analyzed image preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Processing+Link...";
                      }}
                    />
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Analysis complete
            </div>
            <p className="mt-3 text-sm text-slate-500">Usage Count</p>
            <p className="mt-1 text-6xl font-semibold tracking-normal text-slate-950">
              {isLoading ? "--" : result?.usageCount ?? 0}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {isLoading
                ? "Checking Google Lens visual matches..."
                : `Found across ${result?.sources?.length ?? 0} ${sourceCountLabel}.`}
            </p>
          </div>

          <div className="min-h-0 rounded-md border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Source URLs
              </h2>
              <Link2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {isLoading ? (
                <SourceSkeleton />
              ) : result?.sources?.length ? (
                <ul className="space-y-2">
                  {result.sources.map((source, index) => (
                    <li key={`${source}-${index}`}>
                      <a
                        href={source}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex min-w-0 items-center justify-between gap-3 rounded-md px-3 py-3 text-sm text-slate-700 transition hover:bg-sky-50 hover:text-sky-800"
                      >
                        <span className="truncate">{source}</span>
                        <ArrowUpRight
                          className="h-4 w-4 flex-none text-slate-400 transition group-hover:text-sky-700"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-8 text-center text-sm text-slate-500">
                  No source URLs were returned for this image.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SourceSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="h-11 animate-pulse rounded-md bg-slate-100" />
      ))}
    </div>
  );
}