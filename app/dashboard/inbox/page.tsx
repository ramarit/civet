import { getCurrentUser } from "@/lib/auth";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import type { Lead, Page } from "@/lib/types";
import Link from "next/link";
import { InboxIcon } from "@heroicons/react/24/outline";
import InboxTabs from "@/components/InboxTabs";
import { cookies } from "next/headers";

export default async function InboxPage() {
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login if not authenticated
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Please log in</h1>
          <p className="mt-2 text-gray-600">You need to be logged in to view your inbox.</p>
          <Link href="/login" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const userId = user.id;

  // Set the auth token for Directus requests
  const cookieStore = await cookies();
  const token = cookieStore.get("directus_token")?.value;
  if (token) {
    directus.setToken(token);
  }

  // Fetch messages with error handling
  let messages: Lead[] = [];
  let pages: Page[] = [];

  try {
    messages = (await directus.request(
      readItems("leads", {
        filter: { user_id: { _eq: userId } },
        sort: ["-date_created"],
      })
    )) as Lead[];
  } catch (error) {
    console.error("Error fetching messages:", error);
  }

  try {
    pages = (await directus.request(
      readItems("pages", {
        filter: { user_id: { _eq: userId } },
      })
    )) as Page[];
  } catch (error) {
    console.error("Error fetching pages:", error);
  }

  // Create a page lookup map and convert to plain object for client component
  const pageNames: Record<string, string> = {};
  pages.forEach((page) => {
    pageNames[page.id] = page.headline || "Unknown Page";
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
          <p className="mt-2 text-gray-600">
            Manage inquiries from your landing pages
          </p>
        </div>
      </div>

      {/* Messages List with Tabs */}
      {messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow text-center py-12">
          <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No messages yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create a page to start receiving inquiries!
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/pages/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Your First Page
            </Link>
          </div>
        </div>
      ) : (
        <InboxTabs messages={messages} pageNames={pageNames} />
      )}
    </div>
  );
}
