"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import FeedbackCard from "@/components/FeedbackCard";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/lib/api";
import { Feedback } from "@/types";

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (isAuthenticated) {
      loadAllFeedbacks();
    }
  }, [isAuthenticated, isLoading, router]);

  const loadAllFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllFeedback();
      setFeedbacks(response.results || []);
    } catch (err) {
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReview = async (id: number, isReviewed: boolean) => {
    try {
      await adminApi.updateFeedback(id, { is_reviewed: isReviewed });
      setFeedbacks(
        feedbacks.map((feedback) =>
          feedback.id === id
            ? {
                ...feedback,
                is_reviewed: isReviewed,
                reviewed_at: isReviewed ? new Date().toISOString() : null,
              }
            : feedback
        )
      );
    } catch (err) {
      setError("Failed to update feedback status");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Manage and moderate all feedback submissions.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-800">
              Total Feedback
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {feedbacks.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-800">Reviewed</h3>
            <p className="text-3xl font-bold text-green-600">
              {feedbacks.filter((f) => f.is_reviewed).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-800">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {feedbacks.filter((f) => !f.is_reviewed).length}
            </p>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading feedback...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No feedback submissions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  isAdmin={true}
                  onToggleReview={handleToggleReview}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
