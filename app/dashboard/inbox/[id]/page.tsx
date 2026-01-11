import { getCurrentUser } from "@/lib/auth";
import { directus } from "@/lib/directus";
import { readItem } from "@directus/sdk";
import type { Lead } from "@/lib/types";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { formatDateTime } from "@/lib/utils/time";
import { getPageName } from "@/lib/utils/inbox";
import StatusBadge from "@/components/StatusBadge";
import StatusSelector from "@/components/StatusSelector";
import { notFound } from "next/navigation";
import MessageActions from "@/components/MessageActions";
import { cookies } from "next/headers";

export default async function MessageDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const userId = user.id;

  // Set the auth token for Directus requests
  const cookieStore = await cookies();
  const token = cookieStore.get("directus_token")?.value;
  if (token) {
    directus.setToken(token);
  }

  // Fetch message with error handling
  let message: Lead | null = null;

  try {
    message = (await directus.request(
      readItem("leads", params.id)
    )) as Lead;

    // Check if message belongs to current user
    if (message.user_id !== userId) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching message:", error);
    notFound();
  }

  const pageName = await getPageName(message.page_id);
  const responses = message.responses || {};

  // Extract common fields
  const contactName = responses.name || "Anonymous";
  const contactEmail = responses.email || null;
  const contactPhone = responses.phone || null;

  // Get all response fields except common ones
  const commonFields = ["name", "email", "phone", "message"];
  const otherFields = Object.entries(responses).filter(
    ([key]) => !commonFields.includes(key)
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/inbox"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to Inbox
      </Link>

      {/* Message Card */}
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {contactName}
                </h1>
                <StatusBadge status={message.status} />
              </div>
              {contactEmail && (
                <p className="mt-1 text-sm text-gray-600">{contactEmail}</p>
              )}
              {contactPhone && (
                <p className="mt-1 text-sm text-gray-600">{contactPhone}</p>
              )}
            </div>

            <MessageActions
              messageId={message.id}
              currentStatus={message.status}
            />
          </div>

          {/* Metadata */}
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <span>From {pageName}</span>
            <span>•</span>
            <time dateTime={message.date_created}>
              {formatDateTime(message.date_created)}
            </time>
          </div>
        </div>

        {/* Message Content */}
        <div className="px-6 py-6">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Message</h2>
          {responses.message ? (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-gray-900">
                {responses.message}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No message provided</p>
          )}

          {/* Other Form Fields */}
          {otherFields.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-sm font-medium text-gray-700 mb-3">
                Additional Information
              </h2>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {otherFields.map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Status Management */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <StatusSelector
            messageId={message.id}
            currentStatus={message.status}
          />
        </div>
      </div>
    </div>
  );
}
