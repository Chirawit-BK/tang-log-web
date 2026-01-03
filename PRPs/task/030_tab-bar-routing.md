# PRP: Tab Bar Navigation & Routing

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | M |
| Suggested Execution Order | 030 |

---

## 1. Context

TangLog uses a bottom tab bar for primary navigation, common in mobile apps. The tab bar must be iOS-like in feel, respect safe areas, and handle routing correctly.

---

## 2. Objective

Implement the main navigation structure with 5-tab bottom bar.

---

## 3. Scope (IN)

### Tab Bar Design:

```
┌─────────────────────────────────────┐
│                                     │
│          [Page Content]             │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  📊      📋      ➕      💳      ⚙️  │
│ Dash   Trans    Add    Loans   Set  │
└─────────────────────────────────────┘
       ↑ Safe area padding for home indicator
```

### Tabs:

1. **Dashboard** (default)
   - Icon: chart/home
   - Route: `/`

2. **Transactions**
   - Icon: list/receipt
   - Route: `/transactions`

3. **Add** (center, prominent)
   - Icon: plus (larger, different color)
   - Action: Opens modal (NOT route change)

4. **Loans**
   - Icon: handshake/credit card
   - Route: `/loans`

5. **Settings**
   - Icon: gear/cog
   - Route: `/settings`

### Tab Bar Behavior:

- Fixed at bottom of screen
- Visible on all main pages
- Hidden on sub-pages (transaction detail, loan detail)
- Active tab highlighted
- Touch feedback on tap
- Respects safe area insets (iPhone home indicator)

### Routing Structure:

```
/                    → Dashboard (tab bar visible)
/transactions        → Transaction list (tab bar visible)
/transactions/:id    → Transaction detail (tab bar hidden, back button)
/loans              → Loans list (tab bar visible)
/loans/:id          → Loan detail (tab bar hidden, back button)
/settings           → Settings (tab bar visible)
/login              → Login (no tab bar)
```

### Add Button Modal:

- Center tab opens full-screen modal
- Modal has its own close button
- Modal contains Add Transaction form
- On success: close modal, refresh data
- On cancel: close modal, no action

### Safe Area Handling:

- Use `env(safe-area-inset-bottom)` for tab bar padding
- Tab bar content above home indicator
- Content area scrolls behind tab bar if needed

---

## 4. Non-goals (OUT)

- Gesture navigation (swipe between tabs)
- Tab badges/notifications
- Dynamic tab visibility
- Nested tab navigation

---

## 5. Key Rules / Invariants

1. Add button opens modal, not route
2. Tab bar hidden on detail pages
3. Active tab visually distinct
4. Safe area always respected
5. Only one page active at a time
6. Route changes preserve scroll position

---

## 6. Dependencies

- 001_project-scaffolding
- 020_auth-ui-session (protected routes)

---

## 7. Assumptions / Questions

**Assumptions:**
- React Router v6 for routing
- Framer Motion or similar for transitions
- Tab icons from Lucide or similar library

**Questions:**
- Q: Should tab navigation animate?
- Q: Should we preload tab content?
- Q: Remember last visited tab on app reopen?

---

## 8. Definition of Done

- [ ] Tab bar renders with 5 tabs
- [ ] Dashboard is default route
- [ ] Tab clicks navigate correctly
- [ ] Add button opens modal (not route)
- [ ] Active tab highlighted
- [ ] Tab bar hidden on detail routes
- [ ] Back button on detail pages
- [ ] Safe area padding correct on iPhone
- [ ] Touch feedback on tab tap
- [ ] Works in standalone PWA mode
- [ ] Route protection enforced
