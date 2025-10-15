// API route for fetching articles (supports both mock and real data)
import { NextRequest, NextResponse } from "next/server";
import { mockArticles } from "@/services/dataService";
import { supabase } from "@/lib/supabase";

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    if (USE_MOCK_DATA) {
      // Use mock data
      let filteredArticles = [...mockArticles];

      // Apply filters
      if (status) {
        filteredArticles = filteredArticles.filter(
          (article) => article.status === status
        );
      }

      if (search) {
        const searchTerm = search.toLowerCase();
        filteredArticles = filteredArticles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchTerm) ||
            article.abstract.toLowerCase().includes(searchTerm)
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

      return NextResponse.json({
        data: paginatedArticles,
        pagination: {
          page,
          limit,
          total: filteredArticles.length,
          totalPages: Math.ceil(filteredArticles.length / limit),
        },
      });
    } else {
      // Use real Supabase data
      let query = supabase
        .from("articles")
        .select("*", { count: "exact" })
        .range((page - 1) * limit, page * limit - 1);

      // Add filters
      if (status) {
        query = query.eq("status", status);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%, abstract.ilike.%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
