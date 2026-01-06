"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function PublicLandingPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // TODO: Fetch page and form data from Directus based on subdomain
  const page = {
    headline: "Get a Free Legal Consultation",
    description: "We respond within 24 hours and offer free consultations for all potential clients.",
    cta_text: "Get Started",
  };

  const formSteps = [
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
        {
          id: "phone",
          type: "tel",
          label: "Phone Number",
          placeholder: "(555) 123-4567",
          required: false,
        },
      ],
    },
    {
      id: "step-2",
      title: "Tell Us About Your Case",
      fields: [
        {
          id: "case_type",
          type: "select",
          label: "Type of Case",
          options: ["Personal Injury", "Family Law", "Estate Planning", "Other"],
          required: true,
        },
        {
          id: "description",
          type: "textarea",
          label: "Tell us about your situation",
          placeholder: "Provide as much detail as possible...",
          required: true,
        },
      ],
    },
  ];

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value });
  };

  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Submit to API route
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain,
          responses: formData,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepData = formSteps[currentStep];
  const isLastStep = currentStep === formSteps.length - 1;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We've received your information and will get back to you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {page.headline}
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          {page.description}
        </p>

        {/* Multi-step form */}
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {formSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 ${index !== formSteps.length - 1 ? "mr-2" : ""}`}
                >
                  <div
                    className={`h-2 rounded-full ${
                      index <= currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Step {currentStep + 1} of {formSteps.length}
            </p>
          </div>

          {/* Form step */}
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {currentStepData.title}
            </h2>

            <div className="space-y-4 mb-8">
              {currentStepData.fields.map((field) => (
                <div key={field.id} className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      required={field.required}
                      rows={4}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder={field.placeholder}
                    />
                  ) : field.type === "select" ? (
                    <select
                      required={field.required}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    >
                      <option value="">Select an option...</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      required={field.required}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>

              {isLastStep ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : page.cta_text}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next →
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-sm text-gray-500">
          Powered by <span className="font-semibold">Civet</span>
        </p>
      </div>
    </div>
  );
}
