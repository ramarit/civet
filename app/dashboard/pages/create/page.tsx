"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePagePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    headline: "",
    description: "",
    cta_text: "Get Started",
    form_id: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Create page in Directus
      console.log("Creating page:", formData);

      // Redirect to pages list
      router.push("/dashboard/pages");
    } catch (error) {
      console.error("Error creating page:", error);
      alert("Failed to create page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Landing Page</h1>
        <p className="mt-2 text-gray-600">
          Build a simple landing page for your professional services
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
            Headline
          </label>
          <input
            type="text"
            id="headline"
            required
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Get a Free Legal Consultation"
          />
          <p className="mt-1 text-sm text-gray-500">
            Main headline for your landing page
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="We respond within 24 hours and offer free consultations..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Supporting text that appears below the headline
          </p>
        </div>

        <div>
          <label htmlFor="cta_text" className="block text-sm font-medium text-gray-700">
            Call-to-Action Button Text
          </label>
          <input
            type="text"
            id="cta_text"
            required
            value={formData.cta_text}
            onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Get Started"
          />
        </div>

        <div>
          <label htmlFor="form_id" className="block text-sm font-medium text-gray-700">
            Select Form
          </label>
          <select
            id="form_id"
            required
            value={formData.form_id}
            onChange={(e) => setFormData({ ...formData, form_id: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Choose a form...</option>
            {/* TODO: Load forms from Directus */}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            The intake form that will be shown to visitors
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
            {loading ? "Creating..." : "Create Page"}
          </button>
        </div>
      </form>
    </div>
  );
}
