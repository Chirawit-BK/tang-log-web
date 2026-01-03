# PRP: Dashboard Page

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | L |
| Suggested Execution Order | 040 |

---

## 1. Context

The Dashboard is the default landing page showing financial overview: income, expenses, balance, top categories, and waste distribution. It must be fast, scannable, and encourage financial awareness.

---

## 2. Objective

Implement the complete dashboard UI with all summary cards and visualizations.

---

## 3. Scope (IN)

### Dashboard Layout:

```
┌─────────────────────────────┐
│ TangLog          [Day ▼]   │  ← Header with period selector
├─────────────────────────────┤
│ ┌─────────┐ ┌─────────────┐ │
│ │ Income  │ │   Expense   │ │
│ │ ฿12,500 │ │   ฿8,200    │ │
│ └─────────┘ └─────────────┘ │
├─────────────────────────────┤
│      Total Balance          │
│        ฿45,300              │
│    [cash] [bank] [ewallet]  │  ← Account chips
├─────────────────────────────┤
│    Top Expense Categories   │
│ ┌─────────────────────────┐ │
│ │ 🍔 Food       ฿3,500    │ │
│ │ 🚗 Transport  ฿2,100    │ │
│ │ 🛒 Shopping   ฿1,800    │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│     Waste Distribution      │
│      [Pie Chart]            │
│  🟢 Necessary  🟡 Optional  │
│        🔴 Wasteful          │
├─────────────────────────────┤
│       Loans Summary         │
│  Borrowed: ฿10,000 owing    │
│  Lent: ฿5,000 owed to you   │
│  Interest: ฿200 accrued     │
└─────────────────────────────┘
      [Floating + Button]
```

### Components:

**Period Selector:**
- Dropdown: Day / Week / Month
- Date picker for specific date
- Updates all dashboard data

**Summary Cards:**
- Income total (green)
- Expense total (red)
- Tappable for quick list view

**Total Balance Card:**
- Sum of all account balances
- Expandable to show per-account breakdown
- Account chips showing individual balances

**Top Categories:**
- Top 5 expense categories
- Shows icon, name, amount
- Tappable to filter transactions

**Waste Pie Chart:**
- Three segments: necessary, optional, wasteful
- Interactive (tap for details)
- Legend with amounts

**Loans Summary:**
- Total borrowed outstanding
- Total lent outstanding
- Total interest accrued today
- Tappable to go to loans page

**Floating Add Button:**
- Fixed position bottom-right
- Above tab bar
- Opens Add Transaction modal

### Data Fetching:

- Fetch on mount and period change
- Show loading skeletons
- Cache previous data for instant display
- Pull-to-refresh support

---

## 4. Non-goals (OUT)

- Historical trends/charts
- Budget tracking
- Notifications
- Goals/targets

---

## 5. Key Rules / Invariants

1. Income/Expense totals exclude TRANSFER and LOAN_FLOW
2. Waste chart uses expense transactions only
3. Balance includes all transaction kinds
4. All amounts formatted as Thai Baht (฿)
5. Loading states for all async data
6. Empty states for no data periods

---

## 6. Dependencies

- 030_tab-bar-routing
- API: 120_dashboard-aggregation

---

## 7. Assumptions / Questions

**Assumptions:**
- Chart library: Chart.js or Recharts
- Period default: current month
- Skeleton loading preferred over spinner

**Questions:**
- Q: Should cards be reorderable?
- Q: What to show when no transactions exist?
- Q: Should we show percentage change from previous period?

---

## 8. Definition of Done

- [ ] Dashboard renders with all sections
- [ ] Period selector works (day/week/month)
- [ ] Income and expense totals correct
- [ ] Balance shows sum of all accounts
- [ ] Top categories list populated
- [ ] Pie chart renders waste distribution
- [ ] Loans summary shows correct totals
- [ ] Floating add button visible
- [ ] Loading skeletons during fetch
- [ ] Pull-to-refresh works
- [ ] Empty state for no data
- [ ] Responsive within mobile viewport
- [ ] Data refreshes on period change
