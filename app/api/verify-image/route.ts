import { NextRequest, NextResponse } from "next/server";

type SerpApiVisualMatch = {
  link?: string;
  source?: string;
  title?: string;
};

type SerpApiLensResponse = {
  visual_matches?: SerpApiVisualMatch[];
  error?: string;
};

function isValidImageUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const { imageUrl } = await request.json().catch(() => ({ imageUrl: "" }));

  if (!isValidImageUrl(imageUrl)) {
    return NextResponse.json(
      { error: "A valid http or https image URL is required." },
      { status: 400 },
    );
  }

  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing SERPAPI_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
    engine: "google_lens",
    url: imageUrl,
    api_key: apiKey,
  });

  const serpApiResponse = await fetch(`https://serpapi.com/search.json?${params}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = (await serpApiResponse.json()) as SerpApiLensResponse;

  if (!serpApiResponse.ok || data.error) {
    return NextResponse.json(
      { error: data.error ?? "SerpApi could not analyze this image." },
      { status: serpApiResponse.status || 502 },
    );
  }

  const visualMatches = Array.isArray(data.visual_matches) ? data.visual_matches : [];
  const sources = Array.from(
    new Set(
      visualMatches
        .map((match) => match.link)
        .filter((link): link is string => Boolean(link)),
    ),
  );

  return NextResponse.json({
    imageUrl,
    usageCount: visualMatches.length,
    sources,
  });
}
