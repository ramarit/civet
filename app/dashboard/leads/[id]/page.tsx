"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEmailComposer, setShowEmailComposer] = useState(false);

  useEffect(() => {
    // TODO: Fetch lead, notes, and emails from Directus
    setLoading(false);
  }, [leadId]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      // TODO: Create note in Directus
      console.log("Adding note:", newNote);
      setNewNote("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      // TODO: Update lead status in Directus
      console.log("Updating status to:", newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!lead) {
    return <div className="text-center py-12">Lead not found</div>;
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to Leads
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Lead Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead info */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Contact Information
              </h2>
              <select
                onChange={(e) => handleStatusChange(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Name:</span>
                <p className="text-gray-900">John Doe</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email:</span>
                <p className="text-gray-900">john@example.com</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Lead Score:</span>
                <span className="ml-2 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                  0
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Submitted:</span>
                <p className="text-gray-900">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Form responses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Form Responses
            </h2>
            <div className="space-y-4">
              <p className="text-gray-500 text-center py-8">
                Form responses will appear here
              </p>
            </div>
          </div>

          {/* Email composer */}
          {showEmailComposer && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Send Email
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Your message..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Send Email
                  </button>
                  <button
                    onClick={() => setShowEmailComposer(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <button
              onClick={() => setShowEmailComposer(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-2"
            >
              Send Email
            </button>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
            <div className="space-y-4">
              <div>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Add a note..."
                />
                <button
                  onClick={handleAddNote}
                  className="mt-2 w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                >
                  Add Note
                </button>
              </div>

              {notes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No notes yet
                </p>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="border-b border-gray-200 pb-3">
                      <p className="text-sm text-gray-900">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(note.date_created).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Email history */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Email History
            </h2>
            {emails.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No emails sent yet
              </p>
            ) : (
              <div className="space-y-3">
                {emails.map((email) => (
                  <div key={email.id} className="border-b border-gray-200 pb-3">
                    <p className="text-sm font-medium text-gray-900">
                      {email.subject}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Sent {new Date(email.sent_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
