const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

interface RequestConfig extends RequestInit {
  skipAuth?: boolean
  skipRefresh?: boolean
}

interface ApiError {
  message: string
  status: number
  data?: unknown
}

type TokenGetter = () => string | null
type OnUnauthorized = () => void
type OnTokenRefreshed = (accessToken: string) => void

class ApiClient {
  private baseUrl: string
  private getToken: TokenGetter | null = null
  private onUnauthorized: OnUnauthorized | null = null
  private onTokenRefreshed: OnTokenRefreshed | null = null
  private isRefreshing = false
  private refreshPromise: Promise<boolean> | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setTokenGetter(getter: TokenGetter) {
    this.getToken = getter
  }

  setOnUnauthorized(callback: OnUnauthorized) {
    this.onUnauthorized = callback
  }

  setOnTokenRefreshed(callback: OnTokenRefreshed) {
    this.onTokenRefreshed = callback
  }

  private async refreshToken(): Promise<boolean> {
    // If already refreshing, wait for the existing refresh to complete
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.doRefreshToken()

    try {
      return await this.refreshPromise
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  private async doRefreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Include httpOnly cookie
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()

      if (data.accessToken && this.onTokenRefreshed) {
        this.onTokenRefreshed(data.accessToken)
        return true
      }

      return false
    } catch {
      return false
    }
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { skipAuth = false, skipRefresh = false, ...fetchConfig } = config

    const headers = new Headers(fetchConfig.headers)

    // Set default content type for JSON
    if (!headers.has('Content-Type') && fetchConfig.body) {
      headers.set('Content-Type', 'application/json')
    }

    // Attach auth token if available
    if (!skipAuth && this.getToken) {
      const token = this.getToken()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
    }

    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...fetchConfig,
      headers,
      credentials: 'include', // Always include cookies for httpOnly refresh token
    })

    // Handle 401 - attempt token refresh
    if (response.status === 401 && !skipAuth && !skipRefresh) {
      const refreshed = await this.refreshToken()

      if (refreshed) {
        // Retry the original request with new token
        return this.request<T>(endpoint, { ...config, skipRefresh: true })
      } else {
        // Refresh failed - trigger logout
        if (this.onUnauthorized) {
          this.onUnauthorized()
        }

        const error: ApiError = {
          message: 'Session expired. Please log in again.',
          status: 401,
        }
        throw error
      }
    }

    // Handle other non-OK responses
    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      }

      try {
        error.data = await response.json()
        if (
          error.data &&
          typeof error.data === 'object' &&
          'message' in error.data
        ) {
          error.message = (error.data as { message: string }).message
        }
      } catch {
        // Response is not JSON
      }

      throw error
    }

    // Handle empty responses
    if (response.status === 204) {
      return undefined as T
    }

    return response.json()
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }
}

export const api = new ApiClient(API_BASE_URL)
export type { ApiError }
