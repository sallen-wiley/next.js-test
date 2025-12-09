// API route for fetching articles (supports both mock and real data)
import { NextRequest, NextResponse } from "next/server";
import { mockArticles } from "@/services/dataService";
import { createClient } from "@/utils/supabase/server";
import { canWrite, canDelete } from "@/utils/auth/server";

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

// CREATE new article
export async function POST(request: NextRequest) {
  try {
    // Check if user has write permissions (admin or designer)
    const { authorized, user } = await canWrite();

    if (!authorized) {
      return NextResponse.json(
        {
          error: user
            ? "Insufficient permissions. Only admin and designer roles can create articles."
            : "Authentication required. Please log in.",
        },
        { status: user ? 403 : 401 }
      );
    }

    const body = await request.json();

    if (USE_MOCK_DATA) {
      // Mock: Add to in-memory array (for demo)
      const newArticle = {
        ...body,
        id: crypto.randomUUID(),
        publication_date: new Date().toISOString(),
        submission_date: new Date().toISOString(),
        citation_count: 0,
        open_access: false,
      };
      mockArticles.push(newArticle);
      return NextResponse.json(newArticle);
    } else {
      // Real: Insert into Supabase manuscripts table
      const supabase = await createClient();

      // Map the article data to manuscript fields
      const manuscriptData = {
        title: body.title,
        authors: body.authors,
        journal: body.journal,
        abstract: body.abstract,
        keywords: body.keywords || [],
        subject_area: body.subject_area || "General",
        status: body.status || "submitted",
      };

      const { data, error } = await supabase
        .from("manuscripts")
        .insert(manuscriptData)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      const created = data?.[0];

      // Best-effort: assign the creating user as editor via user_manuscripts
      if (created && user?.id) {
        const { error: assignmentError } = await supabase
          .from("user_manuscripts")
          .insert({
            user_id: user.id,
            manuscript_id: created.id,
            role: "editor",
            assigned_date: new Date().toISOString(),
            is_active: true,
          });

        if (assignmentError) {
          console.error("Failed to assign creator as editor:", assignmentError);
        }
      }

      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE existing article
export async function PUT(request: NextRequest) {
  try {
    // Check if user has write permissions (admin or designer)
    const { authorized, user } = await canWrite();

    if (!authorized) {
      return NextResponse.json(
        {
          error: user
            ? "Insufficient permissions. Only admin and designer roles can update articles."
            : "Authentication required. Please log in.",
        },
        { status: user ? 403 : 401 }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (USE_MOCK_DATA) {
      // Mock: Update in array
      const index = mockArticles.findIndex((a) => a.id === id);
      if (index !== -1) {
        mockArticles[index] = { ...mockArticles[index], ...updates };
        return NextResponse.json(mockArticles[index]);
      } else {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }
    } else {
      // Real: Update in Supabase
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("manuscripts")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (!data || data.length === 0) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(data[0]);
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE article
export async function DELETE(request: NextRequest) {
  try {
    // Check if user has delete permissions (admin or designer)
    const { authorized, user } = await canDelete();

    if (!authorized) {
      return NextResponse.json(
        {
          error: user
            ? "Insufficient permissions. Only admin and designer roles can delete articles."
            : "Authentication required. Please log in.",
        },
        { status: user ? 403 : 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (USE_MOCK_DATA) {
      // Mock: Remove from array
      const index = mockArticles.findIndex((a) => a.id === id);
      if (index !== -1) {
        mockArticles.splice(index, 1);
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }
    } else {
      // Real: Delete from Supabase
      const supabase = await createClient();
      const { error } = await supabase
        .from("manuscripts")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
      const supabase = await createClient();
      let query = supabase
        .from("manuscripts")
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
