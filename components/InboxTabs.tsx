"use client";

import { useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import type { Lead } from "@/lib/types";
import { formatRelativeTime, formatDateTime } from "@/lib/utils/time";
import { getMessagePreview } from "@/lib/utils/inbox-client";
import StatusBadge from "@/components/StatusBadge";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface InboxTabsProps {
  messages: Lead[];
  pageNames: Record<string, string>;
}

export default function InboxTabs({ messages, pageNames }: InboxTabsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<Lead | null>(null);

  // Filter messages based on tab
  const allMessages = messages;
  const unreadMessages = messages.filter((m) => m.status === "new");
  const archivedMessages = messages.filter((m) => m.status === "closed");

  const tabs = [
    { name: "All", count: allMessages.length, messages: allMessages },
    { name: "Unread", count: unreadMessages.length, messages: unreadMessages },
    { name: "Archived", count: archivedMessages.length, messages: archivedMessages },
  ];

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      {/* Message List */}
      <div className={`${selectedMessage ? 'w-2/5' : 'w-full'} flex flex-col transition-all duration-300`}>
        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <TabList className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab, index) => (
          <Tab
            key={tab.name}
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
              ${
                selected
                  ? "bg-white text-blue-700 shadow"
                  : "text-gray-700 hover:bg-white/[0.5] hover:text-gray-900"
              }`
            }
          >
            {tab.name} {tab.count > 0 && `(${tab.count})`}
          </Tab>
        ))}
      </TabList>

      <TabPanels className="mt-6">
        {tabs.map((tab, idx) => (
          <TabPanel key={idx}>
            {tab.messages.length === 0 ? (
              <div className="bg-white rounded-lg shadow text-center py-12">
                <p className="text-sm text-gray-500">
                  {tab.name === "Unread" && "No unread messages"}
                  {tab.name === "Archived" && "No archived messages"}
                  {tab.name === "All" && "No messages yet"}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {tab.messages.map((message) => {
                    const isUnread = message.status === "new";
                    const contactName = message.responses?.name || "Anonymous";
                    const contactEmail = message.responses?.email || "No email";
                    const preview = getMessagePreview(message.responses || {});
                    const pageName = pageNames[message.page_id] || "Unknown Page";

                    return (
                      <li key={message.id}>
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className={`w-full text-left hover:bg-gray-50 transition-colors ${
                            isUnread ? "bg-blue-50" : ""
                          } ${selectedMessage?.id === message.id ? "bg-blue-100 border-l-4 border-blue-600" : ""}`}
                        >
                          <div className="px-6 py-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3">
                                  {isUnread && (
                                    <div className="flex-shrink-0">
                                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                    </div>
                                  )}
                                  <p
                                    className={`text-sm font-medium text-gray-900 truncate ${
                                      isUnread ? "font-semibold" : ""
                                    }`}
                                  >
                                    {contactName}
                                  </p>
                                  <StatusBadge status={message.status} />
                                </div>

                                <p className="mt-1 text-sm text-gray-500 truncate">
                                  {contactEmail}
                                </p>

                                <p
                                  className={`mt-1 text-sm text-gray-600 ${
                                    isUnread ? "font-medium" : ""
                                  }`}
                                >
                                  {preview}
                                </p>

                                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                  <span>from {pageName}</span>
                                  <span>•</span>
                                  <time dateTime={message.date_created}>
                                    {formatRelativeTime(message.date_created)}
                                  </time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </TabPanel>
        ))}
      </TabPanels>
        </TabGroup>
      </div>

      {/* Message Detail Panel */}
      {selectedMessage && (
        <div className="w-3/5 bg-white rounded-lg shadow flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedMessage.responses?.name || "Anonymous"}
                </h2>
                <StatusBadge status={selectedMessage.status} />
              </div>
              {selectedMessage.responses?.email && (
                <p className="mt-1 text-sm text-gray-600">{selectedMessage.responses.email}</p>
              )}
              {selectedMessage.responses?.phone && (
                <p className="mt-1 text-sm text-gray-600">{selectedMessage.responses.phone}</p>
              )}
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <span>from {pageNames[selectedMessage.page_id] || "Unknown Page"}</span>
                <span>•</span>
                <time dateTime={selectedMessage.date_created}>
                  {formatDateTime(selectedMessage.date_created)}
                </time>
              </div>
            </div>
            <button
              onClick={() => setSelectedMessage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Message Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Message</h3>
            {selectedMessage.responses?.message ? (
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-gray-900">
                  {selectedMessage.responses.message}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No message provided</p>
            )}

            {/* Other Form Fields */}
            {(() => {
              const commonFields = ["name", "email", "phone", "message"];
              const otherFields = Object.entries(selectedMessage.responses || {}).filter(
                ([key]) => !commonFields.includes(key)
              );

              return otherFields.length > 0 ? (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Additional Information
                  </h3>
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
              ) : null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
