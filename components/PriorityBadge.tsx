interface PriorityBadgeProps {
  priority: "high" | "medium" | "low";
  size?: "sm" | "md";
}

const priorityConfig = {
  high: {
    label: "HIGH",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  medium: {
    label: "MED",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  low: {
    label: "LOW",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

export default function PriorityBadge({ priority, size = "sm" }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  const sizeClasses = size === "md"
    ? "px-3 py-1 text-xs font-bold"
    : "px-2 py-0.5 text-xs font-semibold";

  return (
    <span
      className={`inline-flex items-center rounded border ${sizeClasses} ${config.className}`}
    >
      {config.label}
    </span>
  );
}
