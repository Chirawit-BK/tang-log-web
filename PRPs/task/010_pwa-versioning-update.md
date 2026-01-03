# PRP: PWA Versioning & Update Strategy

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | L |
| Suggested Execution Order | 010 |

---

## 1. Context

iOS aggressively caches PWA assets. Users can get stuck on old versions indefinitely. TangLog must implement a robust update strategy that forces users to get the latest version.

---

## 2. Objective

Implement a version-aware PWA that:
- Hashes all assets for cache-busting
- Checks for updates on app launch
- Forces refresh when update is available
- Prevents users from using stale versions

---

## 3. Scope (IN)

### Build Configuration:

**Asset Hashing:**
- All JS bundles: `[name].[contenthash].js`
- All CSS files: `[name].[contenthash].css`
- All images/fonts: `[name].[contenthash].[ext]`

**HTML Caching:**
- index.html must have no-cache headers
- Include version meta tag: `<meta name="app-version" content="1.0.0">`
- Version derived from package.json or build number

### Version Check System:

**API Endpoint (backend provides):**
- GET /api/version → `{ version: "1.0.0", minVersion: "1.0.0" }`

**App Startup Flow:**
1. App loads
2. Fetch /api/version
3. Compare with local version from meta tag
4. If mismatch: show blocking modal
5. Modal forces refresh (no dismiss option)

### Blocking Update Modal:

```
┌─────────────────────────────┐
│                             │
│     Update Available        │
│                             │
│  A new version of TangLog   │
│  is available. Please       │
│  refresh to continue.       │
│                             │
│  ┌───────────────────────┐  │
│  │      Refresh Now      │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

- No close button
- No "later" option
- Covers entire screen
- Refresh clears cache and reloads

### Service Worker (Level 1):

**Cache Strategy:**
- Cache app shell (HTML, CSS, JS) on install
- Network-first for API calls (never cache API responses)
- Stale-while-revalidate for static assets

**Update Detection:**
- Service worker checks for updates on activation
- If new version: post message to app
- App shows update modal

---

## 4. Non-goals (OUT)

- Offline mode
- Background sync
- Push notifications
- API response caching

---

## 5. Key Rules / Invariants

1. Users MUST NOT be able to dismiss the update modal
2. Version check happens on EVERY app launch
3. Failed version check allows app to continue (network issues)
4. Service worker must not cache API responses
5. index.html must never be cached by service worker
6. All asset URLs must include content hash

---

## 6. Dependencies

- 001_project-scaffolding

---

## 7. Assumptions / Questions

**Assumptions:**
- Version endpoint will be provided by API
- Semantic versioning used
- CDN/hosting configured for proper cache headers

**Questions:**
- Q: How to handle version check during network outage?
- Q: Should we show "what's new" in update modal?
- Q: How often to check for updates (on focus? interval?)?

---

## 8. Definition of Done

- [ ] Vite configured for content-hashed assets
- [ ] HTML has no-cache headers (server config or meta)
- [ ] Version meta tag present in HTML
- [ ] Version check runs on app startup
- [ ] Blocking modal appears on version mismatch
- [ ] Refresh button clears cache and reloads
- [ ] Service worker caches app shell only
- [ ] Service worker does NOT cache API calls
- [ ] New deployment triggers update on next launch
- [ ] Works correctly on iOS Safari
- [ ] Manual testing on real iPhone device
