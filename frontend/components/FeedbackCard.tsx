import React from "react";
import { Feedback } from "@/types";

interface FeedbackCardProps {
  feedback: Feedback;
  isAdmin?: boolean;
  onToggleReview?: (id: number, isReviewed: boolean) => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  isAdmin = false,
  onToggleReview,
}) => {
  const handleToggleReview = () => {
    if (onToggleReview) {
      onToggleReview(feedback.id, !feedback.is_reviewed);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
        feedback.is_reviewed ? "border-green-500" : "border-yellow-500"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {feedback.title}
        </h3>
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                feedback.is_reviewed
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {feedback.is_reviewed ? "Reviewed" : "Pending"}
            </span>
            <button
              onClick={handleToggleReview}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                feedback.is_reviewed
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              Mark as {feedback.is_reviewed ? "Unreviewed" : "Reviewed"}
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4">{feedback.content}</p>

      <div className="text-sm text-gray-500">
        <p>Submitted: {new Date(feedback.created_at).toLocaleDateString()}</p>
        {isAdmin && feedback.reviewed_at && (
          <p>Reviewed: {new Date(feedback.reviewed_at).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackCard;
