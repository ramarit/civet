import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { directusAdmin, loginAsAdmin } from "../lib/directus-admin";
import { readItems, deleteItem, readUsers } from "@directus/sdk";
import * as readline from "readline";

async function confirmDeletion(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(
      "⚠️  Are you sure you want to delete ALL messages for the test user? (yes/no): ",
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "yes");
      }
    );
  });
}

async function cleanInbox() {
  console.log("🧹 Cleaning inbox data...");

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
      return;
    }

    const user = users[0];
    const userId = user.id;
    console.log(`✅ Using user: ${user.email} (${userId})`);

    // Get all messages for this user
    const messages = await directusAdmin.request(
      readItems("leads", {
        filter: {
          user_id: { _eq: userId }
        }
      })
    ) as Array<{ id: string }>;

    if (!messages || messages.length === 0) {
      console.log("ℹ️  No messages found to delete");
      return;
    }

    console.log(`📊 Found ${messages.length} messages`);

    // Confirm deletion
    const confirmed = await confirmDeletion();

    if (!confirmed) {
      console.log("❌ Deletion cancelled");
      return;
    }

    // Delete all messages
    console.log("🗑️  Deleting messages...");

    let deletedCount = 0;
    for (const message of messages) {
      try {
        await directusAdmin.request(deleteItem("leads", message.id));
        deletedCount++;
      } catch (error) {
        console.error(`❌ Failed to delete message ${message.id}:`, error);
      }
    }

    console.log(`✅ Successfully deleted ${deletedCount} message(s)`);
    console.log("🎉 Inbox cleanup complete!");

  } catch (error) {
    console.error("❌ Error cleaning inbox:", error);
    throw error;
  }
}

// Run the clean function
cleanInbox()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
