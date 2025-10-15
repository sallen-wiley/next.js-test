// API route for fetching potential reviewers
import { NextRequest, NextResponse } from "next/server";
import { reviewerDataService } from "@/services/dataService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const manuscriptId = searchParams.get("manuscriptId") || "ms-001";
    const sortBy = searchParams.get("sortBy") as
      | "match_score"
      | "availability"
      | "response_rate"
      | "quality_score"
      | undefined;
    const search = searchParams.get("search");
    const minMatchScore = searchParams.get("minMatchScore");
    const availability = searchParams.get("availability");
    const maxCurrentLoad = searchParams.get("maxCurrentLoad");

    const filterBy: {
      minMatchScore?: number;
      availability?: string[];
      maxCurrentLoad?: number;
    } = {};
    if (minMatchScore) filterBy.minMatchScore = parseInt(minMatchScore);
    if (availability) filterBy.availability = availability.split(",");
    if (maxCurrentLoad) filterBy.maxCurrentLoad = parseInt(maxCurrentLoad);

    const result = await reviewerDataService.getPotentialReviewers({
      manuscriptId,
      sortBy,
      filterBy: Object.keys(filterBy).length > 0 ? filterBy : undefined,
      search: search || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
