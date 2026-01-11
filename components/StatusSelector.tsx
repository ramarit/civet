"use client";

import { useState } from "react";
import { updateMessageStatus } from "@/lib/utils/inbox";
import { useRouter } from "next/navigation";

interface StatusSelectorProps {
  messageId: string;
  currentStatus: "new" | "contacted" | "qualified" | "closed";
}

const statusOptions = [
  { value: "new", label: "Unread" },
  { value: "contacted", label: "Read" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Archived" },
] as const;

export default function StatusSelector({
  messageId,
  currentStatus,
}: StatusSelectorProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (
    newStatus: "new" | "contacted" | "qualified" | "closed"
  ) => {
    setLoading(true);
    try {
      await updateMessageStatus(messageId, newStatus);
      setStatus(newStatus);
      router.refresh(); // Refresh server component data
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="status" className="text-sm font-medium text-gray-700">
        Status:
      </label>
      <select
        id="status"
        value={status}
        onChange={(e) =>
          handleStatusChange(
            e.target.value as "new" | "contacted" | "qualified" | "closed"
          )
        }
        disabled={loading}
        className="block rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {loading && (
        <span className="text-sm text-gray-500">Updating...</span>
      )}
    </div>
  );
}
