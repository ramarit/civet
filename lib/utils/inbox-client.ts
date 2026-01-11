/**
 * Client-side inbox utility functions
 * These functions run in the browser and don't require server actions
 */

/**
 * Get message preview text from responses
 */
export function getMessagePreview(responses: Record<string, any>): string {
  // Try to get message field, or first text-like field
  const message =
    responses.message ||
    responses.comments ||
    responses.inquiry ||
    responses.details ||
    Object.values(responses).find((v) => typeof v === "string" && v.length > 0);

  if (!message || typeof message !== "string") {
    return "No message";
  }

  // Truncate to 60 characters
  if (message.length > 60) {
    return message.substring(0, 60) + "...";
  }

  return message;
}
