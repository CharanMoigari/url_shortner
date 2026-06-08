// Frontend type definitions

export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ShortURL {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  expiresAt: string | null;
}

export interface URLsResponse {
  data: ShortURL[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateURLRequest {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string;
}

export interface Analytics {
  browser: string;
  device: string;
  referrer: string;
  timestamp: string;
}

export interface AnalyticsStats {
  browserStats: Array<{ browser: string; count: number }>;
  deviceStats: Array<{ device: string; count: number }>;
  dailyStats: Array<{ date: string; count: number }>;
  totalClicks: number;
}
