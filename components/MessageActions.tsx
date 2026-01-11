"use client";

import { useState } from "react";
import { markAsRead, markAsUnread, updateMessageStatus } from "@/lib/utils/inbox";
import { useRouter } from "next/navigation";
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

interface MessageActionsProps {
  messageId: string;
  currentStatus: "new" | "contacted" | "qualified" | "closed";
}

export default function MessageActions({
  messageId,
  currentStatus,
}: MessageActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleMarkAsRead = async () => {
    setLoading("read");
    try {
      await markAsRead(messageId);
      router.refresh();
    } catch (error) {
      console.error("Failed to mark as read:", error);
      alert("Failed to mark as read. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleMarkAsUnread = async () => {
    setLoading("unread");
    try {
      await markAsUnread(messageId);
      router.refresh();
    } catch (error) {
      console.error("Failed to mark as unread:", error);
      alert("Failed to mark as unread. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleArchive = async () => {
    setLoading("archive");
    try {
      await updateMessageStatus(messageId, "closed");
      router.push("/dashboard/inbox");
      router.refresh();
    } catch (error) {
      console.error("Failed to archive:", error);
      alert("Failed to archive. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const isUnread = currentStatus === "new";

  return (
    <div className="flex items-center space-x-2">
      {isUnread ? (
        <button
          onClick={handleMarkAsRead}
          disabled={loading !== null}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          title="Mark as Read"
        >
          <EnvelopeOpenIcon className="h-4 w-4 mr-1.5" />
          {loading === "read" ? "Marking..." : "Mark Read"}
        </button>
      ) : (
        <button
          onClick={handleMarkAsUnread}
          disabled={loading !== null}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          title="Mark as Unread"
        >
          <EnvelopeIcon className="h-4 w-4 mr-1.5" />
          {loading === "unread" ? "Marking..." : "Mark Unread"}
        </button>
      )}

      <button
        onClick={handleArchive}
        disabled={loading !== null}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        title="Archive"
      >
        <ArchiveBoxIcon className="h-4 w-4 mr-1.5" />
        {loading === "archive" ? "Archiving..." : "Archive"}
      </button>
    </div>
  );
}
