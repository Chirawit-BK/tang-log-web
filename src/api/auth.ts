import { api } from './client'
import type { User } from '@/stores/authStore'

interface AuthResponse {
  user: User
  accessToken: string
}

interface AppleUserInfo {
  name?: {
    firstName?: string
    lastName?: string
  }
  email?: string
}

export const authApi = {
  /**
   * Exchange Google authorization code for tokens
   * Backend should:
   * 1. Exchange code for tokens with Google
   * 2. Verify id_token
   * 3. Create/update user
   * 4. Return access_token in response body
   * 5. Set refresh_token as httpOnly cookie
   */
  googleAuth: async (code: string): Promise<AuthResponse> => {
    const redirectUri = `${window.location.origin}/auth/google/callback`
    return api.post<AuthResponse>(
      '/auth/google',
      { code, redirectUri },
      { skipAuth: true }
    )
  },

  /**
   * Exchange Apple authorization code for tokens
   * Backend should:
   * 1. Exchange code for tokens with Apple
   * 2. Verify id_token
   * 3. Create/update user (use userInfo on first auth)
   * 4. Return access_token in response body
   * 5. Set refresh_token as httpOnly cookie
   */
  appleAuth: async (
    code: string,
    idToken: string,
    userInfo?: AppleUserInfo
  ): Promise<AuthResponse> => {
    return api.post<AuthResponse>(
      '/auth/apple',
      { code, idToken, userInfo },
      { skipAuth: true }
    )
  },

  /**
   * Refresh access token using httpOnly cookie
   * Backend should:
   * 1. Read refresh_token from httpOnly cookie
   * 2. Validate refresh token
   * 3. Generate new access_token
   * 4. Optionally rotate refresh_token
   * 5. Return new access_token in response body
   */
  refresh: async (): Promise<{ accessToken: string }> => {
    return api.post<{ accessToken: string }>(
      '/auth/refresh',
      undefined,
      { skipAuth: true }
    )
  },

  /**
   * Logout and invalidate session
   * Backend should:
   * 1. Invalidate refresh token
   * 2. Clear httpOnly cookie
   */
  logout: async (): Promise<void> => {
    return api.post('/auth/logout', undefined, { skipAuth: true })
  },

  /**
   * Get current user profile
   */
  me: async (): Promise<User> => {
    return api.get<User>('/auth/me')
  },
}
