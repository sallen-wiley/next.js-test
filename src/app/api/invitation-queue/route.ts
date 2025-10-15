// API route for fetching invitation queue
import { NextRequest, NextResponse } from "next/server";
import { reviewerDataService } from "@/services/dataService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const manuscriptId = searchParams.get("manuscriptId") || "ms-001";

    const result = await reviewerDataService.getInvitationQueue(manuscriptId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
