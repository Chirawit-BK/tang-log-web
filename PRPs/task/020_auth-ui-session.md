# PRP: Authentication UI & Session Management

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | L |
| Suggested Execution Order | 020 |

---

## 1. Context

TangLog uses Google Sign-In and Sign in with Apple for authentication. The web app must handle OAuth flows, token storage, and session management.

---

## 2. Objective

Implement complete authentication UI and session management.

---

## 3. Scope (IN)

### Login Page:

**Route:** `/login` (unauthenticated only)

**Design:**
```
┌─────────────────────────────┐
│                             │
│         TangLog             │
│      [App Logo/Icon]        │
│                             │
│   Track your finances       │
│   without the confusion     │
│                             │
│  ┌───────────────────────┐  │
│  │ 🔵 Sign in with Google│  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ ⬛ Sign in with Apple │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

### OAuth Flows:

**Google Sign-In:**
1. User taps button
2. Open Google OAuth popup/redirect
3. Receive id_token from Google
4. POST to /auth/google
5. Receive access_token, refresh_token
6. Store tokens
7. Redirect to dashboard

**Sign in with Apple:**
1. User taps button
2. Open Apple OAuth popup/redirect
3. Receive id_token (and user info on first auth)
4. POST to /auth/apple
5. Receive access_token, refresh_token
6. Store tokens
7. Redirect to dashboard

### Token Storage:

- access_token: memory only (Zustand store)
- refresh_token: secure storage (localStorage with encryption or httpOnly cookie via API)

### Session Management:

**Auth Store (Zustand):**
```typescript
interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: TokenPair) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
}
```

**Token Refresh:**
- Intercept 401 responses
- Call /auth/refresh
- Retry original request
- If refresh fails: logout

**App Initialization:**
1. Check for stored refresh_token
2. If exists: try to refresh session
3. If success: hydrate user state
4. If fail: clear tokens, show login

### Protected Routes:

- All routes except /login require authentication
- Unauthenticated access redirects to /login
- Login page redirects to dashboard if authenticated

### Logout:

- Call /auth/logout
- Clear all stored tokens
- Clear auth store
- Redirect to login

---

## 4. Non-goals (OUT)

- Email/password authentication
- Account linking
- Social features
- Remember me functionality (always persistent)

---

## 5. Key Rules / Invariants

1. access_token never stored in localStorage (XSS risk)
2. refresh_token stored securely
3. All API calls except /auth/* require access_token
4. 401 triggers token refresh automatically
5. OAuth popup must work on iOS Safari
6. Handle OAuth errors gracefully

---

## 6. Dependencies

- 001_project-scaffolding
- API: 020_auth-module (endpoints ready)

---

## 7. Assumptions / Questions

**Assumptions:**
- Google and Apple OAuth client IDs configured
- API handles token verification
- refresh_token via httpOnly cookie preferred (if API supports)

**Questions:**
- Q: Should we use popup or redirect for OAuth?
- Q: How to handle OAuth cancellation?
- Q: Should we show loading during session restore?

---

## 8. Definition of Done

- [ ] Login page renders with both OAuth buttons
- [ ] Google Sign-In flow works end-to-end
- [ ] Apple Sign-In flow works end-to-end
- [ ] Tokens stored correctly
- [ ] Auth store tracks user state
- [ ] Protected routes redirect unauthenticated users
- [ ] Login redirects authenticated users to dashboard
- [ ] Token refresh works on 401
- [ ] Logout clears all state
- [ ] Works on iOS Safari
- [ ] OAuth errors show user-friendly messages
- [ ] Loading state during authentication
