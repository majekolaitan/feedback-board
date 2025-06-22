import React from "react";
import { Feedback } from "@/types";

interface FeedbackCardProps {
  feedback: Feedback;
  isAdmin?: boolean;
  onToggleReview?: (id: number, isReviewed: boolean) => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  isAdmin,
  onToggleReview,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
        feedback.is_reviewed === undefined || feedback.is_reviewed
          ? "border-green-500"
          : "border-yellow-500"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {feedback.title}
        </h3>
        {isAdmin && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={feedback.is_reviewed || false} // Ensure it's a boolean
              onChange={() =>
                onToggleReview?.(feedback.id, !feedback.is_reviewed)
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Reviewed</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4">{feedback.content}</p>

      <div className="text-sm text-gray-500">
        <p>Submitted: {new Date(feedback.created_at).toLocaleDateString()}</p>
        {feedback.is_reviewed !== undefined && (
          <p>Status: {feedback.is_reviewed ? "Reviewed" : "Pending"}</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackCard;
