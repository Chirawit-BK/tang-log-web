# PRP: Web Project Scaffolding (PWA)

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | M |
| Suggested Execution Order | 001 |

---

## 1. Context

TangLog Web is an iPhone-first PWA installed via Safari's "Add to Home Screen". It must work standalone without browser chrome and feel native on iOS.

---

## 2. Objective

Set up a production-ready PWA project with:
- Modern React/Vue/Svelte framework (recommend React + Vite)
- TypeScript configuration
- PWA manifest
- iOS-specific meta tags
- CSS framework for mobile-first design
- API client setup
- State management foundation

---

## 3. Scope (IN)

### Project Setup:
- Initialize project with Vite + React + TypeScript
- Configure path aliases (@/components, @/hooks, etc.)
- Set up ESLint + Prettier
- Configure Tailwind CSS (or similar)
- Create folder structure

### PWA Configuration:
- manifest.json with:
  - name: "TangLog"
  - short_name: "TangLog"
  - display: "standalone"
  - orientation: "portrait"
  - theme_color, background_color
  - icons (multiple sizes for iOS)
- apple-touch-icon link tags
- apple-mobile-web-app-capable meta tag
- apple-mobile-web-app-status-bar-style meta tag
- viewport meta tag with viewport-fit=cover

### API Client:
- Create axios/fetch wrapper
- Configure base URL from environment
- Request/response interceptors
- Token attachment for authenticated requests
- Error handling utilities

### State Management:
- Set up Zustand or React Query
- Create auth store foundation
- Create API hooks pattern

### Folder Structure:
```
src/
  components/
    ui/          # Reusable UI components
    layout/      # Layout components
  pages/         # Route pages
  hooks/         # Custom hooks
  stores/        # State stores
  api/           # API client and types
  utils/         # Utility functions
  types/         # TypeScript types
```

---

## 4. Non-goals (OUT)

- Actual page implementations
- Authentication flow
- Service worker caching (separate PRP)
- Backend deployment

---

## 5. Key Rules / Invariants

- All monetary amounts displayed in THB with proper formatting
- Mobile-first: design for 375px width minimum
- Touch targets minimum 44x44px
- Safe area insets must be respected (iPhone notch/home indicator)
- All dates displayed in user's locale

---

## 6. Dependencies

- None (this is the first web task)

---

## 7. Assumptions / Questions

**Assumptions:**
- React 18+ with hooks
- Vite for build tooling
- Tailwind for styling
- Node.js 18+ available

**Questions:**
- Q: Should we use a component library (e.g., shadcn/ui)?
- Q: What icon library to use?
- Q: Should we set up Storybook for components?

---

## 8. Definition of Done

- [ ] `npm run dev` starts development server
- [ ] `npm run build` produces production build
- [ ] PWA manifest correctly configured
- [ ] iOS meta tags present in index.html
- [ ] Tailwind CSS working with custom theme
- [ ] API client can make authenticated requests
- [ ] TypeScript compiles without errors
- [ ] Folder structure matches specification
- [ ] .env.example documents required variables
- [ ] App installable as PWA on iOS Safari
