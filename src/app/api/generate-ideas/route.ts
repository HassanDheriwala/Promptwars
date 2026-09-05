import { NextRequest, NextResponse } from "next/server";
import { studentProfileSchema } from "@/lib/schemas";
import { generateProjectBlueprints } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. IP extraction & Rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateCheck = checkRateLimit(`gen-${clientIp}`, {
      intervalMs: 60000,
      maxRequests: 15,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a moment before generating more project ideas.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateCheck.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // 2. Parse & Validate request body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    const validation = studentProfileSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      return NextResponse.json(
        { success: false, error: `Validation error: ${errorMsg}` },
        { status: 400 }
      );
    }

    // 3. Execute Blueprint Generation (with prompt shielding and graceful fallback)
    const result = await generateProjectBlueprints(validation.data);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-RateLimit-Remaining": rateCheck.remaining.toString(),
      },
    });
  } catch (err: unknown) {
    // Sanitize error: never leak internal stack traces or environment variables
    console.error("[POST /api/generate-ideas error]:", err instanceof Error ? err.message : err);

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred while generating project blueprints. Please try again.",
      },
      { status: 500 }
    );
  }
}
