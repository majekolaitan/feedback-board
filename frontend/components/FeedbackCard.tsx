import React from "react";
import { Feedback } from "@/types";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

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
        <h3 className="text-lg font-semibold text-gray-800 break-words">
          {feedback.title}
        </h3>
        {isAdmin && (
          <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                feedback.is_reviewed
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {feedback.is_reviewed ? (
                <CheckCircleIcon className="h-4 w-4 mr-1" />
              ) : (
                <ClockIcon className="h-4 w-4 mr-1" />
              )}
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

      <p className="text-gray-600 mb-4 whitespace-pre-wrap break-words">
        {feedback.content}
      </p>

      <div className="text-sm text-gray-500">
        <p>Submitted: {new Date(feedback.created_at).toLocaleDateString()}</p>
        {isAdmin && feedback.is_reviewed && feedback.reviewed_at && (
          <p>Reviewed: {new Date(feedback.reviewed_at).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackCard;
