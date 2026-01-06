import { NextRequest, NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { createItem, readItems } from "@directus/sdk";
import { calculateLeadScore } from "@/lib/utils";

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

    // TODO: Get user by subdomain
    // TODO: Get page and form by user_id
    // TODO: Calculate lead score based on form's scoring_rules
    // TODO: Create lead in Directus

    /*
    Example implementation:

    // 1. Find user by subdomain
    const users = await directus.request(
      readItems("users", {
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
    );

    // 4. Calculate lead score
    const score = calculateLeadScore(responses, form.scoring_rules || []);

    // 5. Create lead
    const lead = await directus.request(
      createItem("leads", {
        user_id: user.id,
        page_id: page.id,
        form_id: form.id,
        responses,
        score,
        status: "new",
      })
    );

    return NextResponse.json({ success: true, lead_id: lead.id });
    */

    // Placeholder response
    return NextResponse.json({ success: true, message: "Lead submitted successfully" });
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
    // TODO: Fetch leads for the user

    return NextResponse.json({ leads: [] });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
