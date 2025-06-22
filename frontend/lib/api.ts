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
  if (config.method !== "get") {
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
  getPublicFeedback: async (): Promise<ApiResponse<Feedback>> => {
    const response = await api.get("/feedback/");
    return response.data;
  },

  submitFeedback: async (feedback: {
    title: string;
    content: string;
  }): Promise<Feedback> => {
    const response = await api.post("/feedback/", feedback);
    return response.data;
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
  getAllFeedback: async (): Promise<ApiResponse<Feedback>> => {
    const response = await api.get("/admin/feedback/");
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
