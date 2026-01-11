import { NextRequest, NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { createItem, readItems, readItem } from "@directus/sdk";
import { scoreLead } from "@/lib/scoring/scorer";
import type { Form } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subdomain, responses } = body;

    if (!subdomain || !responses) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Find user by subdomain
    const users = await directus.request(
      readItems("directus_users", {
        filter: { subdomain: { _eq: subdomain } },
        limit: 1,
      })
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = users[0];

    // 2. Get user's published page
    const pages = await directus.request(
      readItems("pages", {
        filter: {
          user_id: { _eq: user.id },
          published: { _eq: true },
        },
        limit: 1,
      })
    );

    if (pages.length === 0) {
      return NextResponse.json(
        { error: "No published page found" },
        { status: 404 }
      );
    }

    const page = pages[0];

    // 3. Get the form
    const form = await directus.request(
      readItem("forms", page.form_id)
    ) as Form;

    // 4. Score the lead using new scoring system
    const scoringResult = scoreLead(responses, form);

    // 5. Create lead with scoring data
    const lead = await directus.request(
      createItem("leads", {
        user_id: user.id,
        page_id: page.id,
        form_id: form.id,
        responses,
        signals: scoringResult.signals,
        score: scoringResult.score,
        priority: scoringResult.priority,
        disqualified: scoringResult.disqualified,
        disqualified_reason: scoringResult.disqualified_reason,
        status: "new", // Keep for backward compatibility
      })
    );

    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      score: scoringResult.score,
      priority: scoringResult.priority,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // This would be used in the dashboard to fetch leads
  // Requires authentication
  try {
    // TODO: Get user from session
    // TODO: Fetch leads for the user with form grouping

    return NextResponse.json({ leads: [] });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
