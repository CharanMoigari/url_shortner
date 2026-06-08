// Type definitions for the application

export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface URL {
  id: string;
  user_id: string;
  short_code: string;
  original_url: string;
  click_count: number;
  created_at: Date;
  expires_at: Date | null;
}

export interface Analytics {
  id: string;
  url_id: string;
  browser: string | null;
  device: string | null;
  referrer: string | null;
  timestamp: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface CreateURLRequest {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: Date;
}

export interface URLResponse {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  clickCount: number;
  createdAt: Date;
  expiresAt: Date | null;
}

export interface PaginationQuery {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AnalyticsEvent {
  urlId: string;
  browser: string | null;
  device: string | null;
  referrer: string | null;
  timestamp: Date;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  services: {
    database: boolean;
    redis: boolean;
    rabbitmq: boolean;
  };
}
