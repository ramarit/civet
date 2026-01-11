interface StatusBadgeProps {
  status: "new" | "contacted" | "qualified" | "closed";
}

const statusConfig = {
  new: {
    label: "Unread",
    className: "bg-blue-100 text-blue-800",
  },
  contacted: {
    label: "Read",
    className: "bg-yellow-100 text-yellow-800",
  },
  qualified: {
    label: "Qualified",
    className: "bg-green-100 text-green-800",
  },
  closed: {
    label: "Archived",
    className: "bg-gray-100 text-gray-800",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
