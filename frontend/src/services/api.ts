import axios, { AxiosInstance } from 'axios';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {
                refreshToken,
              });
              localStorage.setItem('accessToken', data.data.accessToken);
              localStorage.setItem('refreshToken', data.data.refreshToken);

              // Retry original request
              error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
              return this.client(error.config);
            } catch (refreshError) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string) {
    const { data } = await this.client.post('/auth/register', {
      email,
      password,
    });
    return data.data;
  }

  async login(email: string, password: string) {
    const { data } = await this.client.post('/auth/login', {
      email,
      password,
    });
    return data.data;
  }

  // URL endpoints
  async createURL(originalUrl: string, customAlias?: string, expiresAt?: string) {
    const { data } = await this.client.post('/urls', {
      originalUrl,
      customAlias,
      expiresAt,
    });
    return data.data;
  }

  async getURLs(page?: number, limit?: number, search?: string, sort?: string) {
    const { data } = await this.client.get('/urls', {
      params: { page, limit, search, sort },
    });
    return data.data;
  }

  async getURL(id: string) {
    const { data } = await this.client.get(`/urls/${id}`);
    return data.data;
  }

  async updateURL(id: string, originalUrl: string) {
    const { data } = await this.client.put(`/urls/${id}`, {
      originalUrl,
    });
    return data.data;
  }

  async deleteURL(id: string) {
    const { data } = await this.client.delete(`/urls/${id}`);
    return data;
  }

  // Analytics endpoints
  async getAnalytics(urlId: string, page?: number, limit?: number) {
    const { data } = await this.client.get(`/urls/${urlId}/analytics`, {
      params: { page, limit },
    });
    return data.data;
  }

  async getBrowserStats(urlId: string) {
    const { data } = await this.client.get(
      `/urls/${urlId}/analytics/browser`
    );
    return data.data;
  }

  async getDeviceStats(urlId: string) {
    const { data } = await this.client.get(`/urls/${urlId}/analytics/device`);
    return data.data;
  }

  async getDailyStats(urlId: string, days?: number) {
    const { data } = await this.client.get(`/urls/${urlId}/analytics/daily`, {
      params: { days },
    });
    return data.data;
  }

  async getTotalClicks(urlId: string) {
    const { data } = await this.client.get(`/urls/${urlId}/analytics/clicks`);
    return data.data;
  }

  async getReferrerStats(urlId: string) {
    const { data } = await this.client.get(`/urls/${urlId}/analytics/referrer`);
    return data.data;
  }
}

export const apiClient = new APIClient();
export default apiClient;
