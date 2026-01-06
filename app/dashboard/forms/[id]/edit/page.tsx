"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [formName, setFormName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // TODO: Fetch form from Directus
    setLoading(false);
  }, [formId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Update form in Directus
      console.log("Updating form:", { formId, formName });

      router.push("/dashboard/forms");
    } catch (error) {
      console.error("Error updating form:", error);
      alert("Failed to update form");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Form</h1>
        <p className="mt-2 text-gray-600">
          Customize your intake form
        </p>
      </div>

      <div className="space-y-6">
        {/* Form name */}
        <div className="bg-white rounded-lg shadow p-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Form Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        {/* Form builder placeholder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Form Steps</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-500">
              Form builder will go here. You'll be able to:
            </p>
            <ul className="mt-4 text-sm text-gray-600 space-y-2">
              <li>Add/remove form steps</li>
              <li>Add fields (text, email, select, textarea, etc.)</li>
              <li>Configure field validation</li>
              <li>Reorder fields via drag-and-drop</li>
            </ul>
          </div>
        </div>

        {/* Scoring rules placeholder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Scoring Rules</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-500">
              Lead scoring builder will go here. You'll be able to:
            </p>
            <ul className="mt-4 text-sm text-gray-600 space-y-2">
              <li>Add scoring rules based on form responses</li>
              <li>Set point values for different answers</li>
              <li>Use operators (equals, contains, greater than, etc.)</li>
            </ul>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
