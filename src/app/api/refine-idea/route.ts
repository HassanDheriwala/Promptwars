import { NextRequest, NextResponse } from "next/server";
import { refineIdeaRequestSchema } from "@/lib/schemas";
import { refineCapstoneBlueprint } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateCheck = checkRateLimit(`refine-${clientIp}`, {
      intervalMs: 60000,
      maxRequests: 20,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please wait a moment before refining again." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    const validation = refineIdeaRequestSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      return NextResponse.json(
        { success: false, error: `Validation error: ${errorMsg}` },
        { status: 400 }
      );
    }

    const result = await refineCapstoneBlueprint(
      validation.data.blueprint,
      validation.data.refinementPrompt,
      validation.data.quickPreset
    );

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    console.error("[POST /api/refine-idea error]:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to refine project blueprint. Please try again.",
      },
      { status: 500 }
    );
  }
}
