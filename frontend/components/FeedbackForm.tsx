import React, { useState, useEffect } from "react";

interface FeedbackFormProps {
  onSubmit: (feedback: { title: string; content: string }) => Promise<void>;
  isSubmitting?: boolean;
  apiErrors?: { [key: string]: string[] | string } | null;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  isSubmitting = false,
  apiErrors,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    general?: string;
  }>({});

  useEffect(() => {
    const newErrors: { title?: string; content?: string; general?: string } =
      {};
    if (apiErrors) {
      if (apiErrors.title)
        newErrors.title = Array.isArray(apiErrors.title)
          ? apiErrors.title.join(", ")
          : String(apiErrors.title);
      if (apiErrors.content)
        newErrors.content = Array.isArray(apiErrors.content)
          ? apiErrors.content.join(", ")
          : String(apiErrors.content);
      if (apiErrors.non_field_errors)
        newErrors.general = Array.isArray(apiErrors.non_field_errors)
          ? apiErrors.non_field_errors.join(", ")
          : String(apiErrors.non_field_errors);

      const otherKeys = Object.keys(apiErrors).filter(
        (k) => !["title", "content", "non_field_errors"].includes(k)
      );
      if (otherKeys.length > 0 && !newErrors.general) {
        newErrors.general = String(apiErrors[otherKeys[0]]);
      }
    }
    setErrors(newErrors);
  }, [apiErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentLocalErrors: { title?: string; content?: string } = {};
    if (!title.trim()) {
      currentLocalErrors.title = "Title is required.";
    }
    if (!content.trim()) {
      currentLocalErrors.content = "Content is required.";
    }

    if (Object.keys(currentLocalErrors).length > 0) {
      setErrors(currentLocalErrors);
      return;
    }

    setErrors({});

    try {
      await onSubmit({ title: title.trim(), content: content.trim() });
      setTitle("");
      setContent("");
    } catch (err) {
      if (!apiErrors) {
        setErrors({ general: "Failed to submit feedback. Please try again." });
      }
      console.error("Form submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Submit Feedback
      </h2>

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 border ${
            errors.title ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 ${
            errors.title ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:border-transparent`}
          placeholder="Enter a brief title for your feedback"
          disabled={isSubmitting}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border ${
            errors.content ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 ${
            errors.content ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:border-transparent`}
          placeholder="Share your detailed feedback here"
          disabled={isSubmitting}
          aria-invalid={!!errors.content}
          aria-describedby={errors.content ? "content-error" : undefined}
        />
        {errors.content && (
          <p id="content-error" className="mt-1 text-sm text-red-600">
            {errors.content}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
