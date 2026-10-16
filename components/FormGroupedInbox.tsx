"use client";

import { useState, useMemo } from "react";
import type { Lead, Form } from "@/lib/types";
import { formatRelativeTime, formatDateTime } from "@/lib/utils/time";
import { getMessagePreview } from "@/lib/utils/inbox-client";
import PriorityBadge from "@/components/PriorityBadge";
import IntentBadge from "@/components/IntentBadge";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface LeadWithForm extends Lead {
  form: Form;
}

interface FormGroupedInboxProps {
  leads: LeadWithForm[];
  pageNames: Record<string, string>;
}

export default function FormGroupedInbox({ leads, pageNames }: FormGroupedInboxProps) {
  const [selectedLead, setSelectedLead] = useState<LeadWithForm | null>(null);
  const [selectedFormFilter, setSelectedFormFilter] = useState<string | "all">("all");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string | "all">("all");

  // Get unique forms for filter
  const forms = useMemo(() => {
    const formMap = new Map<string, { id: string; name: string; intentLevel: string }>();
    leads.forEach((lead) => {
      if (!formMap.has(lead.form_id) && lead.form && typeof lead.form === 'object') {
        formMap.set(lead.form_id, {
          id: lead.form_id,
          name: lead.form.name || "Unknown Form",
          intentLevel: lead.form.intent_level || "medium",
        });
      }
    });
    return Array.from(formMap.values());
  }, [leads]);

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let filtered = [...leads];

    // Apply form filter
    if (selectedFormFilter !== "all") {
      filtered = filtered.filter((lead) => lead.form_id === selectedFormFilter);
    }

    // Apply priority filter
    if (selectedPriorityFilter !== "all") {
      filtered = filtered.filter((lead) => lead.priority === selectedPriorityFilter);
    }

    // Sort by priority (high → medium → low), then by recency
    return filtered.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
    });
  }, [leads, selectedFormFilter, selectedPriorityFilter]);

  // Count leads by priority for current filter
  const priorityCounts = useMemo(() => {
    let filtered = [...leads];
    if (selectedFormFilter !== "all") {
      filtered = filtered.filter((lead) => lead.form_id === selectedFormFilter);
    }

    return filtered.reduce(
      (acc, lead) => {
        acc[lead.priority]++;
        return acc;
      },
      { high: 0, medium: 0, low: 0 }
    );
  }, [leads, selectedFormFilter]);

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow text-center py-12">
        <p className="text-sm text-gray-500">No leads yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-6">
          {/* Form Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Form:</label>
            <select
              value={selectedFormFilter}
              onChange={(e) => setSelectedFormFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Forms ({leads.length})</option>
              {forms.map((form, formIdx) => {
                const count = leads.filter((l) => l.form_id === form.id).length;
                const formKey = typeof form.id === 'string' ? form.id : `form-${formIdx}`;
                return (
                  <option key={formKey} value={form.id}>
                    {form.name} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Priority:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPriorityFilter("all")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedPriorityFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({priorityCounts.high + priorityCounts.medium + priorityCounts.low})
              </button>
              <button
                onClick={() => setSelectedPriorityFilter("high")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedPriorityFilter === "high"
                    ? "bg-red-600 text-white"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                High ({priorityCounts.high})
              </button>
              <button
                onClick={() => setSelectedPriorityFilter("medium")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedPriorityFilter === "medium"
                    ? "bg-yellow-600 text-white"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                }`}
              >
                Medium ({priorityCounts.medium})
              </button>
              <button
                onClick={() => setSelectedPriorityFilter("low")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedPriorityFilter === "low"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Low ({priorityCounts.low})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lead List */}
      <div className="flex gap-6 h-[calc(100vh-18rem)]">
        {/* Left: Lead List */}
        <div className={`${selectedLead ? 'w-2/5' : 'w-full'} flex flex-col transition-all duration-300`}>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No leads match the selected filters</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredLeads.map((lead, leadIdx) => {
                  const contactName = lead.responses?.name || "Anonymous";
                  const contactEmail = lead.responses?.email || "No email";
                  const preview = getMessagePreview(lead.responses || {});
                  const pageName = pageNames[lead.page_id] || "Unknown Page";

                  const isHighPriority = lead.priority === "high";

                  // Ensure lead.id is a string, not an object
                  const leadKey = typeof lead.id === 'string' ? lead.id : `lead-${leadIdx}`;

                  return (
                    <li key={leadKey}>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className={`w-full text-left hover:bg-gray-50 transition-colors ${
                          isHighPriority ? "bg-red-50" : ""
                        } ${selectedLead?.id === lead.id ? "bg-blue-100 border-l-4 border-blue-600" : ""}`}
                      >
                        <div className="px-6 py-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3">
                                <PriorityBadge priority={lead.priority} />
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {contactName}
                                </p>
                                {lead.score !== undefined && (
                                  <span className="text-xs text-gray-500">
                                    {lead.score} pts
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-sm text-gray-500 truncate">
                                {contactEmail}
                              </p>

                              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                {preview}
                              </p>

                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                <span>{lead.form?.name || "Unknown Form"}</span>
                                <span>•</span>
                                <span>from {pageName}</span>
                                <span>•</span>
                                <time dateTime={lead.date_created}>
                                  {formatRelativeTime(lead.date_created)}
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
            )}
          </div>
        </div>

        {/* Right: Lead Detail Panel */}
        {selectedLead && (
          <div className="w-3/5 bg-white rounded-lg shadow flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedLead.responses?.name || "Anonymous"}
                  </h2>
                  <PriorityBadge priority={selectedLead.priority} size="md" />
                  {selectedLead.score !== undefined && (
                    <span className="text-sm text-gray-600">
                      {selectedLead.score} points
                    </span>
                  )}
                </div>
                {selectedLead.responses?.email && (
                  <p className="mt-1 text-sm text-gray-600">{selectedLead.responses.email}</p>
                )}
                {selectedLead.responses?.phone && (
                  <p className="mt-1 text-sm text-gray-600">{selectedLead.responses.phone}</p>
                )}
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>from {pageNames[selectedLead.page_id] || "Unknown Page"}</span>
                  <span>•</span>
                  <time dateTime={selectedLead.date_created}>
                    {formatDateTime(selectedLead.date_created)}
                  </time>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Scoring Breakdown */}
              {selectedLead.signals && Array.isArray(selectedLead.signals) && selectedLead.signals.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Score Breakdown
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {selectedLead.signals.map((signal, idx) => (
                      <div key={`signal-${idx}-${signal.type}`} className="flex items-start space-x-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{signal.description}</p>
                          {signal.field && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              from field: "{signal.field}"
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          +{signal.weight} pts
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-right">
                    <span className="text-sm font-bold text-gray-900">
                      Total Score: {selectedLead.score} points
                    </span>
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Message</h3>
                {selectedLead.responses?.message ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-gray-900">
                      {selectedLead.responses.message}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No message provided</p>
                )}
              </div>

              {/* Other Form Fields */}
              {(() => {
                const commonFields = ["name", "email", "phone", "message"];
                const otherFields = Object.entries(selectedLead.responses || {}).filter(
                  ([key, value]) => !commonFields.includes(key) && value !== null && value !== undefined
                );

                return otherFields.length > 0 ? (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Additional Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {otherFields.map(([key, value], idx) => (
                        <div key={`field-${key}-${idx}`}>
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

              {/* Form Context */}
              <div className="mt-6 border-t border-gray-200 pt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Form Context</h3>
                <p className="text-sm text-gray-600">
                  This lead came from <span className="font-semibold">{selectedLead.form?.name || "Unknown Form"}</span>{" "}
                  ({selectedLead.form?.intent_level?.toUpperCase() || "MEDIUM"} INTENT)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
