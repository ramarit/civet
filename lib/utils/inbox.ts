"use server";

import { directus } from "@/lib/directus";
import { readItem, readItems, updateItem } from "@directus/sdk";
import type { Lead, Page } from "@/lib/types";

/**
 * Get page name by ID
 */
export async function getPageName(pageId: string): Promise<string> {
  try {
    const page = await directus.request(
      readItem("pages", pageId, {
        fields: ["headline"],
      })
    ) as Page;

    return page.headline || "Unknown Page";
  } catch (error) {
    console.error("Error fetching page name:", error);
    return "Unknown Page";
  }
}

/**
 * Get unread count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const messages = await directus.request(
      readItems("leads", {
        filter: {
          user_id: { _eq: userId },
          status: { _eq: "new" },
        },
        aggregate: { count: "*" },
      })
    );

    return (messages as any)[0]?.count || 0;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
}

/**
 * Mark message as read (changes status from 'new' to 'contacted')
 */
export async function markAsRead(messageId: string): Promise<void> {
  try {
    await directus.request(
      updateItem("leads", messageId, {
        status: "contacted",
      })
    );
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
}

/**
 * Mark message as unread (changes status back to 'new')
 */
export async function markAsUnread(messageId: string): Promise<void> {
  try {
    await directus.request(
      updateItem("leads", messageId, {
        status: "new",
      })
    );
  } catch (error) {
    console.error("Error marking message as unread:", error);
    throw error;
  }
}

/**
 * Update message status
 */
export async function updateMessageStatus(
  messageId: string,
  status: "new" | "contacted" | "qualified" | "closed"
): Promise<void> {
  try {
    await directus.request(
      updateItem("leads", messageId, {
        status,
      })
    );
  } catch (error) {
    console.error("Error updating message status:", error);
    throw error;
  }
}
