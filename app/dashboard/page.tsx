import { getCurrentUser } from "@/lib/auth";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import type { Page, Lead } from "@/lib/types";
import Link from "next/link";
import {
  DocumentTextIcon,
  InboxIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // For testing: use the actual test user UUID (test@example.com)
  const userId = user?.id || "79e65236-7315-4535-8ba3-1ea0a41a50d6";

  // Fetch user's pages with error handling
  let pages: Page[] = [];
  let leads: Lead[] = [];

  try {
    pages = await directus.request(
      readItems("pages", {
        filter: { user_id: { _eq: userId } },
        sort: ["-date_created"],
      })
    ) as Page[];
  } catch (error) {
    console.error("Error fetching pages:", error);
    // Continue with empty array
  }

  try {
    leads = await directus.request(
      readItems("leads", {
        filter: { user_id: { _eq: userId } },
        limit: 10,
        sort: ["-date_created"],
      })
    ) as Lead[];
  } catch (error) {
    console.error("Error fetching leads:", error);
    // Continue with empty array
  }

  const publishedPages = pages.filter((p) => p.published);
  const newMessages = leads.filter((l) => l.status === "new");

  const statusStyles = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    qualified: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your landing pages and messages
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/pages"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Pages
                </dt>
                <dd className="text-3xl font-bold text-gray-900">
                  {pages.length}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View all →
            </span>
          </div>
        </Link>

        <Link
          href="/dashboard/inbox"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <InboxIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  New Messages
                </dt>
                <dd className="text-3xl font-bold text-gray-900">
                  {newMessages.length}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View inbox →
            </span>
          </div>
        </Link>

        <Link
          href="/dashboard/pages"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Published Pages
                </dt>
                <dd className="text-3xl font-bold text-gray-900">
                  {publishedPages.length}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View all →
            </span>
          </div>
        </Link>
      </div>

      {/* Recent messages */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-12">
            <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
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
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => {
                  const page = pages.find((p) => p.id === lead.page_id);
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {lead.responses?.name || "Anonymous"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead.responses?.email || "No email"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page?.headline || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            statusStyles[lead.status as keyof typeof statusStyles]
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.date_created).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {leads.length > 0 && (
              <div className="bg-gray-50 px-6 py-3">
                <Link
                  href="/dashboard/inbox"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View all messages →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick actions - only show if no data */}
      {pages.length === 0 && leads.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Get Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/pages/create"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-2xl mr-3">📄</span>
              <div>
                <h3 className="font-medium text-gray-900">Create Page</h3>
                <p className="text-sm text-gray-500">Build a landing page</p>
              </div>
            </Link>

            <Link
              href="/dashboard/forms/create"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-2xl mr-3">📝</span>
              <div>
                <h3 className="font-medium text-gray-900">Create Form</h3>
                <p className="text-sm text-gray-500">Build an intake form</p>
              </div>
            </Link>

            <Link
              href="/dashboard/inbox"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-2xl mr-3">📬</span>
              <div>
                <h3 className="font-medium text-gray-900">View Inbox</h3>
                <p className="text-sm text-gray-500">Manage your messages</p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
