interface IntentBadgeProps {
  intentLevel: "high" | "medium" | "low";
}

const intentConfig = {
  high: {
    label: "HIGH INTENT",
    className: "bg-purple-100 text-purple-800",
  },
  medium: {
    label: "MEDIUM INTENT",
    className: "bg-blue-100 text-blue-800",
  },
  low: {
    label: "LOW INTENT",
    className: "bg-gray-100 text-gray-600",
  },
};

export default function IntentBadge({ intentLevel }: IntentBadgeProps) {
  const config = intentConfig[intentLevel];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
