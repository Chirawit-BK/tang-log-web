# PRP: Transactions List & Filters

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | L |
| Suggested Execution Order | 070 |

---

## 1. Context

The Transactions tab shows all user transactions with powerful filtering. Users need to search, filter, and paginate through potentially many transactions.

---

## 2. Objective

Implement the transactions list page with search, filters, and pagination.

---

## 3. Scope (IN)

### Transactions List Page:

**Route:** `/transactions`

```
┌─────────────────────────────┐
│ Transactions         [🔍]  │ ← Search toggle
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 🔍 Search notes...     │ │ ← Search bar (collapsible)
│ └─────────────────────────┘ │
│ [Filters: Date ▼] [Kind ▼] [More ▼] │ ← Filter chips
├─────────────────────────────┤
│ TODAY                       │
│ ┌─────────────────────────┐ │
│ │ 🍔 Lunch                │ │
│ │ Food & Dining   -฿150   │ │
│ │ 12:30 PM               →│ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 💰 Salary               │ │
│ │ Income        +฿25,000  │ │
│ │ 10:00 AM               →│ │
│ └─────────────────────────┘ │
│                             │
│ YESTERDAY                   │
│ ┌─────────────────────────┐ │
│ │ 🚗 Uber                 │ │
│ │ Transportation  -฿120   │ │
│ │ 8:00 PM                →│ │
│ └─────────────────────────┘ │
│                             │
│ [Load More...]              │
└─────────────────────────────┘
```

### Transaction Card:
- Category icon
- Note (or category name if no note)
- Category name (or account for TRANSFER)
- Amount (green for income, red for expense)
- Time
- Waste indicator dot (optional, wasteful)
- Tap to view/edit

### Search:
- Searches note field
- Debounced input (300ms)
- Case-insensitive partial match
- Clear button

### Filter Options:

**Date Range:**
- Today
- This Week
- This Month
- Custom Range (date picker)

**Kind:**
- All (default)
- Income
- Expense
- Transfer
- (LOAN_FLOW excluded from manual filter - shown separately)

**Category:**
- Multi-select from user's categories
- Grouped by income/expense

**Account:**
- Multi-select from user's accounts

**Waste Level:** (Expense only)
- Necessary
- Optional
- Wasteful

### Sorting:
- Date descending (default)
- Date ascending
- Amount descending
- Amount ascending

### Pagination:
- Load more button (not infinite scroll)
- 20 items per page
- Total count displayed
- "No more transactions" when exhausted

### Empty States:
- No transactions ever: "Start tracking by adding your first transaction"
- No results for filter: "No transactions match your filters"

---

## 4. Non-goals (OUT)

- Bulk actions (multi-select)
- Export functionality
- Transaction grouping by category
- Inline editing

---

## 5. Key Rules / Invariants

1. LOAN_FLOW transactions appear in list but not in kind filter
2. Income amounts shown as positive (+)
3. Expense/Transfer amounts shown as negative (-)
4. Grouped by date (Today, Yesterday, dates)
5. Filters are AND conditions (all must match)
6. Empty search shows all transactions
7. Maintain filter state on navigation

---

## 6. Dependencies

- 030_tab-bar-routing
- API: 070_transactions-module

---

## 7. Assumptions / Questions

**Assumptions:**
- List virtualization not needed for MVP (load more pagination)
- Filters stored in URL params for shareability
- Search debounced to reduce API calls

**Questions:**
- Q: Should we show running balance per transaction?
- Q: Infinite scroll vs load more button?
- Q: Should filters persist across sessions?

---

## 8. Definition of Done

- [ ] Transactions list renders with cards
- [ ] Cards show all required info
- [ ] Grouped by date sections
- [ ] Search filters by note
- [ ] Date filter works (presets + custom)
- [ ] Kind filter works
- [ ] Category filter works (multi-select)
- [ ] Account filter works (multi-select)
- [ ] Waste level filter works
- [ ] Sorting options work
- [ ] Pagination loads more
- [ ] Empty states display correctly
- [ ] Tap navigates to transaction detail
- [ ] Loading state during fetch
- [ ] Filter state preserved on back navigation
