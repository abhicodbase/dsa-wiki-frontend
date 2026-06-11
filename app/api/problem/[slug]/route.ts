import { NextRequest, NextResponse } from "next/server";
import { fetchProblemDetails } from "@/lib/github";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const problem = await fetchProblemDetails(slug);
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }
  return NextResponse.json(problem);
}
