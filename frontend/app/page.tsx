"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Navigation from "@/components/Navigation";
import FeedbackCard from "@/components/FeedbackCard";
import FeedbackForm from "@/components/FeedbackForm";
import { feedbackApi } from "@/lib/api";
import { Feedback } from "@/types";

const ITEMS_PER_PAGE = 20; // Must match backend's PAGE_SIZE

export default function HomePage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [listError, setListError] = useState("");
  const [formApiErrors, setFormApiErrors] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

  const totalPages = useMemo(
    () => Math.ceil(totalFeedbacks / ITEMS_PER_PAGE),
    [totalFeedbacks]
  );

  const loadFeedbacks = useCallback(async (pageToLoad: number) => {
    setLoading(true);
    setListError("");
    try {
      const response = await feedbackApi.getPublicFeedback(pageToLoad);
      setFeedbacks(response.results || []);
      setTotalFeedbacks(response.count || 0);
    } catch (err) {
      console.error("Failed to load feedback:", err);
      setListError("Failed to load feedback. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeedbacks(currentPage);
  }, [currentPage, loadFeedbacks]);

  const handleSubmitFeedback = async (feedbackData: {
    title: string;
    content: string;
  }) => {
    setSubmitting(true);
    setFormApiErrors(null);
    setSuccessMessage("");
    try {
      await feedbackApi.submitFeedback(feedbackData);
      setSuccessMessage(
        "Thank you for your feedback! It will be reviewed before being published."
      );
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      console.error("Submission error:", err);
      if (typeof err === "object" && err !== null) {
        setFormApiErrors(err);
      } else {
        setFormApiErrors({
          general: "Failed to submit feedback. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Public Feedback Board
          </h1>
          <p className="text-lg text-gray-600">
            Share your thoughts and ideas with us. All submissions are reviewed
            before publishing.
          </p>
        </div>

        {successMessage && (
          <div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow"
            role="alert"
          >
            <p className="font-medium">Success!</p>
            <p>{successMessage}</p>
          </div>
        )}

        {listError && !successMessage && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow"
            role="alert"
          >
            <p className="font-medium">Error</p>
            <p>{listError}</p>
          </div>
        )}

        <div className="mb-10">
          <FeedbackForm
            onSubmit={handleSubmitFeedback}
            isSubmitting={submitting}
            apiErrors={formApiErrors}
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Published Feedback (
            {totalFeedbacks > 0 ? `Page ${currentPage} of ${totalPages}` : ""})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-3 text-gray-600">Loading feedback...</p>
            </div>
          ) : listError ? null : feedbacks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 text-gray-400 mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.10098 12.3488L12.0003 14.5002L14.9004 12.3488M12.0003 3.49994L3.89961 8.99994L12.0003 14.5002L20.1002 8.99994L12.0003 3.49994Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.89961 15.5002V8.99994M20.1002 15.5002V8.99994M3.89961 15.5002L12.0003 21.0002L20.1002 15.5002"
                />
              </svg>
              <p className="mt-4 text-xl text-gray-600">
                No feedback has been published yet.
              </p>
              <p className="text-gray-500">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))}
            </div>
          )}

          {/* Pagination Controls for Public Page */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-between items-center bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-b-lg shadow">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
