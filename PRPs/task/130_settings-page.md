# PRP: Settings Page

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | M |
| Suggested Execution Order | 130 |

---

## 1. Context

The Settings tab provides access to user profile, account management, category management, and app configuration. It's the hub for all configuration tasks.

---

## 2. Objective

Implement the settings page with navigation to all configuration sections.

---

## 3. Scope (IN)

### Settings Page:

**Route:** `/settings`

```
┌─────────────────────────────┐
│ Settings                    │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 👤  John Doe            │ │
│ │     john@example.com    │ │
│ │     Edit Profile       →│ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ DATA                        │
│ ┌─────────────────────────┐ │
│ │ 🏦 Accounts            →│ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 📁 Categories          →│ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ APP                         │
│ ┌─────────────────────────┐ │
│ │ 🌙 Theme               →│ │
│ │     System (Auto)        │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 🔔 Notifications       →│ │
│ │     Off                  │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ ABOUT                       │
│ ┌─────────────────────────┐ │
│ │ ℹ️ About TangLog        →│ │
│ │     Version 1.0.0        │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 📄 Privacy Policy      →│ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 📋 Terms of Service    →│ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 🚪 Sign Out             │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 🗑️ Delete Account       │ │ ← Destructive action
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Profile Section:

- Shows avatar (from OAuth provider)
- Shows name
- Shows email
- Tap to edit profile (name, avatar URL)

### Edit Profile Modal:

```
┌─────────────────────────────┐
│ Edit Profile          [✕]  │
├─────────────────────────────┤
│      [Avatar Image]        │
│                             │
│ Name                        │
│ ┌─────────────────────────┐ │
│ │ John Doe                │ │
│ └─────────────────────────┘ │
│                             │
│ Email (cannot change)       │
│ john@example.com            │
│                             │
│ ┌─────────────────────────┐ │
│ │         Save            │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Data Section:

- **Accounts:** Navigate to accounts management
- **Categories:** Navigate to categories management

### App Section:

**Theme:**
- System (Auto)
- Light
- Dark

**Notifications:** (placeholder for future)
- Currently shows "Off"
- Tap shows "Coming soon" message

### About Section:

- **About TangLog:** App info, credits
- **Privacy Policy:** Opens URL or in-app page
- **Terms of Service:** Opens URL or in-app page
- Version number displayed

### Sign Out:

- Confirmation: "Are you sure you want to sign out?"
- Clears all local data
- Redirects to login

### Delete Account:

- Opens confirmation modal
- Requires typing "DELETE" to confirm
- Calls API to soft-delete
- Signs out and redirects to login

```
┌─────────────────────────────┐
│ Delete Account        [✕]  │
├─────────────────────────────┤
│ ⚠️ This action cannot be   │
│ undone after 7 days.        │
│                             │
│ All your data will be       │
│ permanently deleted.        │
│                             │
│ Type "DELETE" to confirm:   │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │    Delete My Account    │ │ ← Red/destructive
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 4. Non-goals (OUT)

- Data export
- Backup/restore
- Currency settings (THB only)
- Language settings (single language)
- Biometric lock

---

## 5. Key Rules / Invariants

1. Email is read-only (from OAuth)
2. Theme preference stored locally
3. Sign out clears all stored data
4. Delete account requires explicit confirmation
5. Version shows package.json version

---

## 6. Dependencies

- 030_tab-bar-routing
- 050_accounts-management (linked)
- 060_categories-management (linked)
- 020_auth-ui-session (logout)
- API: 030_users-module

---

## 7. Assumptions / Questions

**Assumptions:**
- Theme uses system preference by default
- Privacy/Terms are external URLs
- Notifications not implemented for MVP

**Questions:**
- Q: Should we support data export before delete?
- Q: Should theme be synced to server or local only?
- Q: Add feedback/support link?

---

## 8. Definition of Done

- [ ] Settings page renders with all sections
- [ ] Profile section shows user info
- [ ] Edit profile modal works
- [ ] Accounts link navigates correctly
- [ ] Categories link navigates correctly
- [ ] Theme selector works
- [ ] Theme persists across sessions
- [ ] About shows version
- [ ] Privacy/Terms links work
- [ ] Sign out with confirmation
- [ ] Sign out clears all data
- [ ] Delete account requires "DELETE" confirmation
- [ ] Delete account calls API and signs out
- [ ] All navigation has back buttons
