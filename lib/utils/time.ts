/**
 * Format relative time (e.g., "2 min ago", "Yesterday", "Jan 5")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins} min ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    // Format as "Jan 5" or "Jan 5, 2024" if different year
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };

    if (then.getFullYear() !== now.getFullYear()) {
      options.year = "numeric";
    }

    return then.toLocaleDateString("en-US", options);
  }
}

/**
 * Format full datetime (e.g., "January 8, 2025 at 2:30 PM")
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const dateStr = d.toLocaleDateString("en-US", dateOptions);
  const timeStr = d.toLocaleTimeString("en-US", timeOptions);

  return `${dateStr} at ${timeStr}`;
}
