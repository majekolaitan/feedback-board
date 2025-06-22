"use client";

import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import FeedbackCard from "@/components/FeedbackCard";
import FeedbackForm from "@/components/FeedbackForm";
import { feedbackApi } from "@/lib/api";
import { Feedback } from "@/types";

export default function HomePage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await feedbackApi.getPublicFeedback();
      setFeedbacks(response.results || []);
    } catch (err) {
      console.error("Failed to load feedback:", err);
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (feedbackData: {
    title: string;
    content: string;
  }) => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await feedbackApi.submitFeedback(feedbackData);
      setSuccess(
        "Thank you for your feedback! It will be reviewed before being published."
      );
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Public Feedback Board
          </h1>
          <p className="text-gray-600">
            Share your anonymous feedback with us. All submissions are reviewed
            before being published.
          </p>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {error && !success && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <FeedbackForm
            onSubmit={handleSubmitFeedback}
            isSubmitting={submitting}
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Recent Feedback
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading feedback...</p>
            </div>
          ) : error ? null : feedbacks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No feedback has been published yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
