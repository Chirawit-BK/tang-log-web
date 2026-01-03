# PRP: Waste Level Component & UX

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | S |
| Suggested Execution Order | 090 |

---

## 1. Context

Waste level is a unique TangLog feature that categorizes each expense as necessary, optional, or wasteful. This helps users understand their spending habits beyond just category totals.

---

## 2. Objective

Implement the waste level selector component and its display throughout the app.

---

## 3. Scope (IN)

### Waste Level Selector:

Used in: Add/Edit Transaction modal (expense only)

```
┌─────────────────────────────────────┐
│ How essential was this expense?     │
│                                     │
│ [🟢 Necessary] [🟡 Optional] [🔴 Wasteful]│
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Necessary: Required for daily   │ │
│ │ life (rent, groceries, etc.)    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Selector Behavior:

**Necessary (green):**
- For: rent, bills, basic groceries, essential transport
- Color: `#22c55e` (green-500)

**Optional (yellow/amber):**
- For: eating out, entertainment, upgrades
- Color: `#eab308` (yellow-500)

**Wasteful (red):**
- For: impulse buys, regretted purchases
- Color: `#ef4444` (red-500)

### Component API:

```typescript
interface WasteLevelSelectorProps {
  value: 'necessary' | 'optional' | 'wasteful' | null;
  onChange: (level: 'necessary' | 'optional' | 'wasteful') => void;
  disabled?: boolean;
  showHelp?: boolean; // show description tooltip
}
```

### Display Components:

**Waste Level Badge:**
- Small colored dot/badge
- Used in: transaction cards, transaction detail

**Waste Level Text:**
- Colored text label
- Used in: transaction detail, filters

### Dashboard Pie Chart Integration:

Already covered in Dashboard PRP, but waste component provides:
- Color constants
- Legend labels
- Formatting utilities

### Onboarding Tooltip:

First time user adds expense:
- Show tooltip explaining waste levels
- "This helps you understand your spending habits"
- Dismissable, don't show again

---

## 4. Non-goals (OUT)

- Automatic waste level suggestion
- Category-based defaults
- Waste level analytics beyond pie chart
- Waste "goals" or limits

---

## 5. Key Rules / Invariants

1. Waste level is REQUIRED for expenses
2. Waste level is FORBIDDEN for income/transfer/loan_flow
3. Colors must be consistent everywhere
4. Selector is single-select (not toggle)
5. No "unknown" or "other" option

---

## 6. Dependencies

- 080_transaction-add-edit-modal (uses selector)
- 040_dashboard-page (uses pie chart)

---

## 7. Assumptions / Questions

**Assumptions:**
- Users understand the concept after brief explanation
- No AI/ML suggestions for waste level
- Colors are accessible (colorblind friendly indicators too)

**Questions:**
- Q: Should we provide examples for each level?
- Q: Should users be able to change waste level quickly from list?
- Q: Track waste level trends over time?

---

## 8. Definition of Done

- [ ] WasteLevelSelector component implemented
- [ ] Three-option selector with colors
- [ ] Single-select behavior
- [ ] Help text/tooltip available
- [ ] WasteLevelBadge component (small indicator)
- [ ] WasteLevelText component (label)
- [ ] Consistent colors exported as constants
- [ ] Integrated into Add/Edit modal
- [ ] Displayed in transaction cards
- [ ] Displayed in transaction detail
- [ ] First-time tooltip implemented
- [ ] Accessible (not color-only indicator)
