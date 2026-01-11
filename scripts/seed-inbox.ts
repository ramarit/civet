import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { directusAdmin, loginAsAdmin } from "../lib/directus-admin";
import { readItems, createItem, readUsers } from "@directus/sdk";

// Mock data
const mockNames = [
  "John Smith",
  "Sarah Johnson",
  "Mike Chen",
  "Emily Rodriguez",
  "David Park",
  "Lisa Anderson",
  "James Wilson",
  "Rachel Green",
  "Tom Harris",
  "Jessica Lee",
  "Robert Taylor",
  "Anna Martinez",
  "Christopher Alexander Montgomery III", // Edge case - very long name
  "X", // Edge case - single letter
  "", // Edge case - no name
];

const mockMessages = [
  "Hi! I'm interested in your services and would like to learn more about pricing options.",
  "Could you provide more information about your availability for next month?",
  "I saw your landing page and I'm impressed! Let's discuss a potential partnership.",
  "Quick question - do you offer payment plans?",
  "I'm looking for someone to help with a project. Are you available for consultation?",
  "Your work looks great! I'd love to schedule a call to discuss my needs in detail.",
  "Do you have any case studies or examples of previous work you could share?",
  "I have a tight deadline. Can you take on a project starting next week?",
  "Following up on my previous inquiry about your services. Please let me know your thoughts when you have a chance.",
  "I'm interested in your premium package. What's included and what are the deliverables?",
  "Can we set up a meeting to discuss this further? I'm available most afternoons.",
  "This is exactly what I've been looking for! How do we get started?",
  "I have a few questions about the process and timeline. Would you be available for a brief call?",
  "Hi",
  "I'm reaching out because I need help with a comprehensive project that involves multiple phases. I've reviewed your portfolio and I think you'd be a perfect fit for what we're trying to accomplish. The project would start in early February and run for approximately 3-4 months. We have a budget allocated and are looking for someone who can commit to the full timeline. Would love to discuss this opportunity with you in detail and see if it aligns with your availability and expertise.", // Edge case - very long message
];

const mockPhones = [
  "555-0123",
  "555-0124",
  "555-0125",
  null,
  "555-0127",
  null,
  "555-0129",
  "555-0130",
  null,
  "555-0132",
  "555-0133",
  null,
  "555-0135",
  "555-0136",
  null,
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

// Message configurations
const messageConfigs = [
  // 6 Unread (new)
  { status: "new", offset: "5min", nameIndex: 0, messageIndex: 0 },
  { status: "new", offset: "45min", nameIndex: 1, messageIndex: 1 },
  { status: "new", offset: "2hours", nameIndex: 2, messageIndex: 2 },
  { status: "new", offset: "yesterday", nameIndex: 3, messageIndex: 3 },
  { status: "new", offset: "2days", nameIndex: 12, messageIndex: 4 }, // Long name
  { status: "new", offset: "3days", nameIndex: 14, messageIndex: 13 }, // No name, short message

  // 3 Contacted (replied)
  { status: "contacted", offset: "2days", nameIndex: 4, messageIndex: 5 },
  { status: "contacted", offset: "3days", nameIndex: 5, messageIndex: 6 },
  { status: "contacted", offset: "4days", nameIndex: 6, messageIndex: 7 },

  // 2 Qualified (hot)
  { status: "qualified", offset: "1week", nameIndex: 7, messageIndex: 8 },
  { status: "qualified", offset: "1week", nameIndex: 8, messageIndex: 9 },

  // 4 Archived (closed)
  { status: "closed", offset: "2weeks", nameIndex: 9, messageIndex: 10 },
  { status: "closed", offset: "3weeks", nameIndex: 10, messageIndex: 11 },
  { status: "closed", offset: "4weeks", nameIndex: 11, messageIndex: 12 },
  { status: "closed", offset: "3weeks", nameIndex: 13, messageIndex: 14 }, // Single letter name, long message
];

async function seedInbox() {
  console.log("🌱 Seeding inbox with mock data...");

  try {
    // Login as admin
    await loginAsAdmin();
    console.log("✅ Admin authenticated");

    // Get first non-admin user
    // This allows test data to be created for an actual user in Directus
    const adminEmail = process.env.DIRECTUS_ADMIN_EMAIL || '';
    const users = await directusAdmin.request(
      readUsers({
        filter: {
          email: { _neq: adminEmail }
        },
        limit: 1
      })
    );

    if (!users || users.length === 0) {
      console.error("❌ No non-admin users found.");
      console.log("💡 Create a user account first (e.g., test@example.com) in Directus,");
      console.log("   or sign up through the frontend, then run this script again.");
      return;
    }

    const user = users[0];
    const userId = user.id;
    console.log(`✅ Using user: ${user.email} (${userId})`);

    // Check if test user has pages
    let pages = await directusAdmin.request(
      readItems("pages", {
        filter: {
          user_id: { _eq: userId }
        },
        limit: 1
      })
    );

    let page;
    let form;

    if (!pages || pages.length === 0) {
      console.log("📄 No pages found, creating test page...");

      // Create test form first
      form = await directusAdmin.request(
        createItem("forms", {
          user_id: userId,
          name: "Contact Form",
          steps: [
            {
              id: "contact-info",
              title: "Contact Information",
              fields: [
                {
                  id: "name",
                  label: "Name",
                  type: "text",
                  required: true
                },
                {
                  id: "email",
                  label: "Email",
                  type: "email",
                  required: true
                },
                {
                  id: "phone",
                  label: "Phone",
                  type: "tel",
                  required: false
                },
                {
                  id: "message",
                  label: "Message",
                  type: "textarea",
                  required: true
                }
              ]
            }
          ],
          scoring_rules: []
        })
      );

      // Create test page (without subdomain - it's not in the actual Directus schema)
      page = await directusAdmin.request(
        createItem("pages", {
          user_id: userId,
          headline: "Test Landing Page",
          description: "This is a test page for inbox seeding",
          cta_text: "Get Started",
          form_id: form.id,
          published: true
        })
      );

      console.log(`✅ Created test page: ${page.headline}`);
    } else {
      page = pages[0];
      console.log(`✅ Using existing page: ${page.headline}`);

      // Get form for this page
      if (page.form_id) {
        const forms = await directusAdmin.request(
          readItems("forms", {
            filter: {
              id: { _eq: page.form_id }
            },
            limit: 1
          })
        );
        form = forms[0];
      }

      // Create a form if page doesn't have one
      if (!form) {
        form = await directusAdmin.request(
          createItem("forms", {
            user_id: userId,
            name: "Contact Form",
            steps: [
              {
                id: "contact-info",
                title: "Contact Information",
                fields: [
                  {
                    id: "name",
                    label: "Name",
                    type: "text",
                    required: true
                  },
                  {
                    id: "email",
                    label: "Email",
                    type: "email",
                    required: true
                  },
                  {
                    id: "phone",
                    label: "Phone",
                    type: "tel",
                    required: false
                  },
                  {
                    id: "message",
                    label: "Message",
                    type: "textarea",
                    required: true
                  }
                ]
              }
            ],
            scoring_rules: []
          })
        );
      }
    }

    // Create messages
    console.log(`📬 Creating ${messageConfigs.length} mock messages...`);

    const statusCounts = {
      new: 0,
      contacted: 0,
      qualified: 0,
      closed: 0
    };

    for (const config of messageConfigs) {
      const name = mockNames[config.nameIndex];
      const email = name
        ? `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`
        : "anonymous@example.com";

      const message = {
        user_id: userId,
        page_id: page.id,
        form_id: form.id,
        responses: {
          name: name || undefined,
          email: email,
          phone: mockPhones[config.nameIndex] || undefined,
          message: mockMessages[config.messageIndex]
        },
        status: config.status,
        score: 0,
        date_created: getBackdatedTimestamp(config.offset)
      };

      await directusAdmin.request(createItem("leads", message));

      const displayName = name || "Anonymous";
      console.log(`  ✅ ${displayName} (${config.status})`);

      statusCounts[config.status as keyof typeof statusCounts]++;
    }

    console.log(`✅ Successfully created ${messageConfigs.length} mock messages!`);
    console.log("📊 Breakdown:");
    console.log(`   - Unread: ${statusCounts.new}`);
    console.log(`   - Contacted: ${statusCounts.contacted}`);
    console.log(`   - Qualified: ${statusCounts.qualified}`);
    console.log(`   - Archived: ${statusCounts.closed}`);
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
