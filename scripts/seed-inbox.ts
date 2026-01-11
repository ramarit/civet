import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { directusAdmin, loginAsAdmin } from "../lib/directus-admin";
import { readItems, createItem, readUsers } from "@directus/sdk";
import { scoreLead } from "../lib/scoring/scorer";
import type { Form } from "../lib/types";

// Mock data with realistic budget/urgency indicators
const mockLeads = [
  {
    name: "John Smith",
    email: "john.smith@acmecorp.com",
    phone: "555-0123",
    budget: "$50,000",
    timeline: "Need to start next week",
    service: "Enterprise consultation",
    referral: "Referred by Jane Doe",
    offset: "5min",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@gmail.com",
    phone: "555-0124",
    budget: "Flexible, open to negotiation",
    timeline: "This month",
    service: "Website redesign",
    referral: "Google search",
    offset: "45min",
  },
  {
    name: "Mike Chen",
    email: "mike@startupxyz.io",
    phone: null,
    budget: "$5,000 - $10,000",
    timeline: "ASAP - urgent project",
    service: "Mobile app development",
    referral: "LinkedIn",
    offset: "2hours",
  },
  {
    name: "Emily Rodriguez",
    email: "emily.r@hotmail.com",
    phone: null,
    budget: "Limited budget",
    timeline: "Flexible timeline",
    service: "Basic website",
    referral: "Facebook ad",
    offset: "yesterday",
  },
  {
    name: "Christopher Alexander Montgomery III",
    email: "chris.montgomery@fortune500.com",
    phone: "555-0135",
    budget: "$100,000+",
    timeline: "Q2 2024",
    service: "Enterprise platform",
    referral: "Existing client referral",
    offset: "2days",
  },
  {
    name: "",
    email: "anonymous@example.com",
    phone: null,
    budget: null,
    timeline: null,
    service: null,
    referral: null,
    offset: "3days",
  },
  {
    name: "David Park",
    email: "david.park@techcompany.com",
    phone: "555-0127",
    budget: "$25,000",
    timeline: "Next quarter",
    service: "Custom integration",
    referral: "Partner recommendation",
    offset: "2days",
  },
  {
    name: "Lisa Anderson",
    email: "lisa.a@gmail.com",
    phone: null,
    budget: "Not sure yet",
    timeline: "Just exploring options",
    service: "General inquiry",
    referral: "Google",
    offset: "3days",
  },
  {
    name: "James Wilson",
    email: "j.wilson@bigcorp.com",
    phone: "555-0129",
    budget: "$75,000",
    timeline: "Urgent - 2 weeks",
    service: "Enterprise solution",
    referral: "Industry conference",
    offset: "4days",
  },
  {
    name: "Rachel Green",
    email: "rachel@startup.io",
    phone: "555-0130",
    budget: "$15,000",
    timeline: "1-2 months",
    service: "MVP development",
    referral: "Twitter",
    offset: "1week",
  },
  {
    name: "Tom Harris",
    email: "tom.harris@example.com",
    phone: null,
    budget: "Under $5k",
    timeline: "No rush",
    service: "Small project",
    referral: "Friend",
    offset: "1week",
  },
  {
    name: "Jessica Lee",
    email: "jessica@enterprise.com",
    phone: "555-0132",
    budget: "$200,000",
    timeline: "Immediate start",
    service: "Full platform rebuild",
    referral: "CEO referral",
    offset: "2weeks",
  },
  {
    name: "Robert Taylor",
    email: "robert.t@gmail.com",
    phone: "555-0133",
    budget: "Minimal",
    timeline: "Someday",
    service: "Just curious",
    referral: "Instagram",
    offset: "3weeks",
  },
  {
    name: "Anna Martinez",
    email: "anna.martinez@company.com",
    phone: null,
    budget: "$30,000",
    timeline: "Next month",
    service: "E-commerce site",
    referral: "LinkedIn",
    offset: "4weeks",
  },
  {
    name: "X",
    email: "x@company.com",
    phone: "555-0136",
    budget: "$10,000",
    timeline: "This quarter",
    service: "Consulting",
    referral: "Referral",
    offset: "3weeks",
  },
];

// Calculate backdated timestamps
function getBackdatedTimestamp(offset: string): string {
  const now = new Date();

  switch (offset) {
    case "5min":
      return new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    case "45min":
      return new Date(now.getTime() - 45 * 60 * 1000).toISOString();
    case "2hours":
      return new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
    case "yesterday":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    case "2days":
      return new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    case "3days":
      return new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
    case "4days":
      return new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString();
    case "1week":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case "2weeks":
      return new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    case "3weeks":
      return new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString();
    case "4weeks":
      return new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return now.toISOString();
  }
}

async function seedInbox() {
  console.log("🌱 Seeding inbox with mock data...");

  try {
    // Login as admin
    await loginAsAdmin();
    console.log("✅ Admin authenticated");

    // Get first non-admin user
    const adminEmail = process.env.DIRECTUS_ADMIN_EMAIL || '';
    const users = await directusAdmin.request(
      readUsers({
        filter: {
          email: { _neq: adminEmail }
        },
        limit: 1
      })
    ) as Array<{ id: string; email: string }>;

    if (!users || users.length === 0) {
      console.error("❌ No non-admin users found.");
      console.log("💡 Create a user account first (e.g., test@example.com) in Directus,");
      console.log("   or sign up through the frontend, then run this script again.");
      return;
    }

    const user = users[0];
    const userId = user.id;
    console.log(`✅ Using user: ${user.email} (${userId})`);

    // Create three test forms with different intent levels
    console.log("📝 Creating test forms...");

    // High-intent form: Enterprise Consultation
    const highIntentForm = await directusAdmin.request(
      createItem("forms", {
        user_id: userId,
        name: "Book Enterprise Consultation",
        intent_level: "high",
        steps: [
          {
            id: "contact-info",
            title: "Your Information",
            fields: [
              { id: "name", label: "Name", type: "text", required: true },
              { id: "email", label: "Email", type: "email", required: true },
              { id: "phone", label: "Phone", type: "tel", required: false },
            ]
          },
          {
            id: "project-details",
            title: "Project Details",
            fields: [
              { id: "budget", label: "What's your budget range?", type: "text", required: true },
              { id: "timeline", label: "When do you need to start?", type: "text", required: true },
              { id: "service", label: "Which service are you interested in?", type: "text", required: true },
              { id: "referral", label: "How did you hear about us?", type: "text", required: false },
            ]
          }
        ],
        scoring_rules: [],
        disqualifiers: []
      })
    ) as Form;

    // Medium-intent form: Contact Us
    const mediumIntentForm = await directusAdmin.request(
      createItem("forms", {
        user_id: userId,
        name: "Contact Us",
        intent_level: "medium",
        steps: [
          {
            id: "contact-info",
            title: "Get in Touch",
            fields: [
              { id: "name", label: "Name", type: "text", required: true },
              { id: "email", label: "Email", type: "email", required: true },
              { id: "phone", label: "Phone (optional)", type: "tel", required: false },
              { id: "budget", label: "Budget range", type: "text", required: false },
              { id: "timeline", label: "Timeline", type: "text", required: false },
              { id: "service", label: "What can we help with?", type: "textarea", required: true },
            ]
          }
        ],
        scoring_rules: [],
        disqualifiers: []
      })
    ) as Form;

    // Low-intent form: Newsletter
    const lowIntentForm = await directusAdmin.request(
      createItem("forms", {
        user_id: userId,
        name: "Newsletter Signup",
        intent_level: "low",
        steps: [
          {
            id: "signup",
            title: "Stay Updated",
            fields: [
              { id: "name", label: "First Name", type: "text", required: false },
              { id: "email", label: "Email", type: "email", required: true },
            ]
          }
        ],
        scoring_rules: [],
        disqualifiers: []
      })
    ) as Form;

    console.log(`✅ Created 3 forms with different intent levels`);

    // Create pages for each form
    console.log("📄 Creating test pages...");

    const highIntentPage = await directusAdmin.request(
      createItem("pages", {
        user_id: userId,
        headline: "Enterprise Consultation",
        description: "Book a consultation call with our team",
        cta_text: "Book Consultation",
        form_id: highIntentForm.id,
        published: true
      })
    ) as { id: string };

    const mediumIntentPage = await directusAdmin.request(
      createItem("pages", {
        user_id: userId,
        headline: "Contact Us",
        description: "Get in touch with our team",
        cta_text: "Send Message",
        form_id: mediumIntentForm.id,
        published: true
      })
    ) as { id: string };

    const lowIntentPage = await directusAdmin.request(
      createItem("pages", {
        user_id: userId,
        headline: "Newsletter",
        description: "Stay updated with our latest news",
        cta_text: "Subscribe",
        form_id: lowIntentForm.id,
        published: true
      })
    ) as { id: string };

    console.log(`✅ Created 3 pages`);

    // Create leads
    console.log(`📬 Creating ${mockLeads.length} mock leads with real scoring...`);

    const priorityCounts = { high: 0, medium: 0, low: 0 };
    const formCounts = { high: 0, medium: 0, low: 0 };

    for (const leadData of mockLeads) {
      // Distribute leads across forms (70% high-intent, 20% medium, 10% low)
      const random = Math.random();
      let form: Form;
      let page: { id: string };

      if (random < 0.7) {
        form = highIntentForm;
        page = highIntentPage;
        formCounts.high++;
      } else if (random < 0.9) {
        form = mediumIntentForm;
        page = mediumIntentPage;
        formCounts.medium++;
      } else {
        form = lowIntentForm;
        page = lowIntentPage;
        formCounts.low++;
      }

      // Build responses based on form fields
      const responses: Record<string, any> = {
        name: leadData.name || undefined,
        email: leadData.email,
      };

      // Only add phone if form has phone field
      if (form.steps.some(s => s.fields.some(f => f.id === "phone"))) {
        responses.phone = leadData.phone || undefined;
      }

      // Only add project details if form has those fields
      if (form.steps.some(s => s.fields.some(f => f.id === "budget"))) {
        responses.budget = leadData.budget || undefined;
        responses.timeline = leadData.timeline || undefined;
        responses.service = leadData.service || undefined;
        responses.referral = leadData.referral || undefined;
      }

      // Score the lead using actual scoring system
      const scoringResult = scoreLead(responses, form);

      // Create lead with scoring data
      await directusAdmin.request(
        createItem("leads", {
          user_id: userId,
          page_id: page.id,
          form_id: form.id,
          responses,
          signals: scoringResult.signals,
          score: scoringResult.score,
          priority: scoringResult.priority,
          disqualified: scoringResult.disqualified,
          disqualified_reason: scoringResult.disqualified_reason,
          status: "new", // Keep for backward compatibility
          date_created: getBackdatedTimestamp(leadData.offset)
        })
      );

      const displayName = leadData.name || "Anonymous";
      console.log(`  ✅ ${displayName} (${scoringResult.priority} priority, ${scoringResult.score} pts)`);

      priorityCounts[scoringResult.priority]++;
    }

    console.log(`✅ Successfully created ${mockLeads.length} mock leads!`);
    console.log("📊 Form Distribution:");
    console.log(`   - High-intent forms: ${formCounts.high} leads`);
    console.log(`   - Medium-intent forms: ${formCounts.medium} leads`);
    console.log(`   - Low-intent forms: ${formCounts.low} leads`);
    console.log("📊 Priority Breakdown:");
    console.log(`   - High priority: ${priorityCounts.high}`);
    console.log(`   - Medium priority: ${priorityCounts.medium}`);
    console.log(`   - Low priority: ${priorityCounts.low}`);
    console.log("🎉 Inbox seeding complete!");

  } catch (error) {
    console.error("❌ Error seeding inbox:", error);
    throw error;
  }
}

// Run the seed function
seedInbox()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
