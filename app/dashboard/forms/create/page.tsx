"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateFormPage() {
  const router = useRouter();
  const [formName, setFormName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Create form in Directus with default structure
      const defaultForm = {
        name: formName,
        steps: [
          {
            id: "step-1",
            title: "Contact Information",
            fields: [
              {
                id: "name",
                type: "text",
                label: "Full Name",
                placeholder: "John Doe",
                required: true,
              },
              {
                id: "email",
                type: "email",
                label: "Email Address",
                placeholder: "you@example.com",
                required: true,
              },
            ],
          },
        ],
        scoring_rules: [],
      };

      console.log("Creating form:", defaultForm);

      // Redirect to forms list or edit
      router.push("/dashboard/forms");
    } catch (error) {
      console.error("Error creating form:", error);
      alert("Failed to create form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Form</h1>
        <p className="mt-2 text-gray-600">
          Create a new intake form for collecting lead information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
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
            placeholder="Personal Injury Intake Form"
          />
          <p className="mt-1 text-sm text-gray-500">
            Give your form a descriptive name
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            After creating the form, you'll be able to add custom fields, configure multi-step flow,
            and set up lead scoring rules.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Form"}
          </button>
        </div>
      </form>
    </div>
  );
}
