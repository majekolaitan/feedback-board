export interface Feedback {
  id: number;
  title: string;
  content: string;
  created_at: string;
  is_reviewed?: boolean;
  reviewed_at?: string | null;
}

export interface User {
  id: number;
  username: string;
  is_staff: boolean;
}

export interface AuthResponse {
  authenticated: boolean;
  user?: User;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  results?: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}
