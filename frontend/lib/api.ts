import axios from "axios";
import { Feedback, LoginData, AuthResponse, ApiResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  if (config.method !== "get" && config.method !== "GET") {
    try {
      const tokenResponse = await axios.get(`${API_BASE_URL}/csrf/`, {
        withCredentials: true,
      });
      const csrfToken = tokenResponse.data.csrfToken;
      if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
      }
    } catch (error) {
      console.warn("Failed to get CSRF token:", error);
    }
  }
  return config;
});

export const feedbackApi = {
  getPublicFeedback: async (
    page: number = 1
  ): Promise<ApiResponse<Feedback>> => {
    const response = await api.get(`/feedback/?page=${page}`);
    return response.data;
  },

  submitFeedback: async (feedback: {
    title: string;
    content: string;
  }): Promise<Feedback> => {
    try {
      const response = await api.post("/feedback/", feedback);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw error;
    }
  },
};

export const authApi = {
  login: async (
    credentials: LoginData
  ): Promise<{ message: string; user: any }> => {
    const response = await api.post("/login/", credentials);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post("/logout/");
    return response.data;
  },

  checkAuth: async (): Promise<AuthResponse> => {
    const response = await api.get("/auth/check/");
    return response.data;
  },
};

export const adminApi = {
  getAllFeedback: async (
    params: {
      page?: number;
      search?: string;
      is_reviewed?: string | boolean;
    } = {}
  ): Promise<ApiResponse<Feedback>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);

    if (
      params.is_reviewed !== undefined &&
      params.is_reviewed !== null &&
      params.is_reviewed !== "all"
    ) {
      queryParams.append(
        "is_reviewed",
        String(params.is_reviewed === true || params.is_reviewed === "true")
      );
    }

    const response = await api.get(
      `/admin/feedback/?${queryParams.toString()}`
    );
    return response.data;
  },

  updateFeedback: async (
    id: number,
    data: { is_reviewed: boolean }
  ): Promise<Feedback> => {
    const response = await api.patch(`/admin/feedback/${id}/`, data);
    return response.data;
  },
};

export default api;
