"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import FeedbackCard from "@/components/FeedbackCard";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/lib/api";
import { Feedback } from "@/types";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const ITEMS_PER_PAGE = 20;

export default function AdminPage() {
  const { isAuthenticated, isLoading: authIsLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(
    () => searchParams.get("search") || ""
  );
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || ""
  );
  const [filterStatus, setFilterStatus] = useState(
    () => searchParams.get("status") || "all"
  );
  const [currentPage, setCurrentPage] = useState(() =>
    parseInt(searchParams.get("page") || "1", 10)
  );

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

  const [grandTotalSubmissions, setGrandTotalSubmissions] = useState(0);
  const [totalReviewedGlobally, setTotalReviewedGlobally] = useState(0);
  const [totalPendingGlobally, setTotalPendingGlobally] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const totalPages = useMemo(
    () => Math.ceil(totalFeedbacks / ITEMS_PER_PAGE),
    [totalFeedbacks]
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    if (filterStatus && filterStatus !== "all") {
      params.set("status", filterStatus);
    }
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchTerm, filterStatus, currentPage, router, pathname]);
  // --- End Effect to update URL ---

  const loadFeedbacksForPage = useCallback(
    async (pageToFetch: number) => {
      if (!isAuthenticated || !user?.is_staff) return;

      setLoading(true);
      setError("");
      try {
        const apiParams: {
          page: number;
          search?: string;
          is_reviewed?: string;
        } = {
          page: pageToFetch,
        };
        if (searchTerm.trim()) apiParams.search = searchTerm.trim();
        if (filterStatus !== "all") apiParams.is_reviewed = filterStatus;

        const response = await adminApi.getAllFeedback(apiParams);
        setFeedbacks(response.results || []);
        setTotalFeedbacks(response.count || 0);
      } catch (err: any) {
        console.error("Failed to load feedback list:", err);
        setError(
          err.response?.data?.detail ||
            "Failed to load feedback. Ensure you have admin rights."
        );
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, user?.is_staff, searchTerm, filterStatus]
  );

  const loadGlobalStats = useCallback(async () => {
    // ... (no changes here)
    if (!isAuthenticated || !user?.is_staff) return;
    setStatsLoading(true);
    try {
      const [reviewedResponse, pendingResponse, allSubmissionsResponse] =
        await Promise.all([
          adminApi.getAllFeedback({ is_reviewed: "true", page: 1 }),
          adminApi.getAllFeedback({ is_reviewed: "false", page: 1 }),
          adminApi.getAllFeedback({ page: 1 }),
        ]);

      setTotalReviewedGlobally(reviewedResponse.count || 0);
      setTotalPendingGlobally(pendingResponse.count || 0);
      setGrandTotalSubmissions(allSubmissionsResponse.count || 0);
    } catch (err) {
      console.error("Failed to load global feedback stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [isAuthenticated, user?.is_staff]);

  useEffect(() => {
    if (!authIsLoading) {
      if (!isAuthenticated || !user?.is_staff) {
        router.push("/login");
      } else {
        loadGlobalStats();
      }
    }
  }, [isAuthenticated, user?.is_staff, authIsLoading, router, loadGlobalStats]);

  useEffect(() => {
    if (isAuthenticated && user?.is_staff && !authIsLoading) {
      loadFeedbacksForPage(currentPage);
    }
  }, [
    currentPage,
    loadFeedbacksForPage,
    isAuthenticated,
    user?.is_staff,
    authIsLoading,
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    if (currentPage !== 1) {
      const urlSearch = searchParams.get("search") || "";
      const urlStatus = searchParams.get("status") || "all";
      if (searchTerm !== urlSearch || filterStatus !== urlStatus) {
        setCurrentPage(1);
      }
    }
  }, [searchTerm, filterStatus, searchParams, currentPage]);

  const handleToggleReview = async (id: number, isReviewed: boolean) => {
    try {
      const updatedFeedback = await adminApi.updateFeedback(id, {
        is_reviewed: isReviewed,
      });
      setFeedbacks((currentFeedbacks) =>
        currentFeedbacks.map((fb) => (fb.id === id ? updatedFeedback : fb))
      );
      loadGlobalStats();

      const shouldDisappear =
        (filterStatus === "true" && !isReviewed) ||
        (filterStatus === "false" && isReviewed);
      if (shouldDisappear) {
        loadFeedbacksForPage(currentPage);
      }
    } catch (err) {
      setError("Failed to update feedback status");
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFilterButtonClick = (status: string) => {
    setFilterStatus(status);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  if (
    authIsLoading ||
    (isAuthenticated && loading && feedbacks.length === 0 && currentPage === 1)
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.is_staff) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Manage and moderate feedback. Total submissions:{" "}
            {statsLoading && grandTotalSubmissions === 0
              ? "Loading..."
              : grandTotalSubmissions}
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label
                htmlFor="search-feedback"
                className="block text-sm font-medium text-gray-700"
              >
                Search Feedback
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="search"
                  name="search-feedback"
                  id="search-feedback"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="Search by title or content..."
                  value={inputValue}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Status
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                {["all", "true", "false"].map((statusValue) => {
                  const label =
                    statusValue === "all"
                      ? "All"
                      : statusValue === "true"
                      ? "Reviewed"
                      : "Pending";
                  return (
                    <button
                      key={statusValue}
                      type="button"
                      onClick={() => handleFilterButtonClick(statusValue)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium
                        first:rounded-l-md last:rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        ${
                          filterStatus === statusValue
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-white text-gray-700"
                        }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-800">
              Total Submissions
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {statsLoading ? "..." : grandTotalSubmissions}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-800">
              Total Reviewed
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {statsLoading ? "..." : totalReviewedGlobally}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-800">Total Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {statsLoading ? "..." : totalPendingGlobally}
            </p>
          </div>
        </div>

        {/* Feedback List */}
        {loading && feedbacks.length === 0 && currentPage === 1 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading feedback...</p>
          </div>
        ) : !loading && feedbacks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-gray-400 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
              />
            </svg>
            <p className="mt-3 text-gray-600 font-medium">
              No feedback submissions match your criteria.
            </p>
            <p className="text-sm text-gray-500">
              Try adjusting your search or filter.
            </p>
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

        {loading && (feedbacks.length > 0 || currentPage > 1) && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading more...</p>
          </div>
        )}

        {/* Pagination Controls */}
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
              <span className="font-medium">{totalPages}</span> (
              <span className="font-medium">{totalFeedbacks}</span> items match
              current filter)
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
      </main>
    </div>
  );
}
