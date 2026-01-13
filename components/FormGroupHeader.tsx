"use client";

import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import IntentBadge from "./IntentBadge";

interface FormGroupHeaderProps {
  formName: string;
  intentLevel: "high" | "medium" | "low";
  leadCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  priorityCounts: {
    high: number;
    medium: number;
    low: number;
  };
}

export default function FormGroupHeader({
  formName,
  intentLevel,
  leadCount,
  isExpanded,
  onToggle,
  priorityCounts,
}: FormGroupHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        {/* Expand/Collapse Icon */}
        {isExpanded ? (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 text-gray-500" />
        )}

        {/* Form Name */}
        <h3 className="text-lg font-semibold text-gray-900">{formName}</h3>

        {/* Intent Badge */}
        <IntentBadge intentLevel={intentLevel} />

        {/* Lead Count */}
        <span className="text-sm text-gray-600">
          {leadCount} {leadCount === 1 ? "lead" : "leads"}
        </span>
      </div>

      {/* Priority Breakdown */}
      <div className="flex items-center space-x-4 text-sm">
        {priorityCounts.high > 0 && (
          <span className="text-red-700 font-medium">
            {priorityCounts.high} high
          </span>
        )}
        {priorityCounts.medium > 0 && (
          <span className="text-yellow-700 font-medium">
            {priorityCounts.medium} medium
          </span>
        )}
        {priorityCounts.low > 0 && (
          <span className="text-gray-600">
            {priorityCounts.low} low
          </span>
        )}
      </div>
    </button>
  );
}
