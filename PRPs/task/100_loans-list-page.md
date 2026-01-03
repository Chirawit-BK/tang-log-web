# PRP: Loans List Page

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | M |
| Suggested Execution Order | 100 |

---

## 1. Context

The Loans tab displays all loans (both borrowed and lent) in a single list. Each loan card shows key info: outstanding principal, interest accrued, and status. This is the entry point to loan management.

---

## 2. Objective

Implement the loans list page with loan cards showing computed financial state.

---

## 3. Scope (IN)

### Loans List Page:

**Route:** `/loans`

```
┌─────────────────────────────┐
│ Loans                       │
├─────────────────────────────┤
│ [All] [Borrowed] [Lent]    │ ← Filter tabs
├─────────────────────────────┤
│ BORROWED (ยืมเขา)           │
│ ┌─────────────────────────┐ │
│ │ 👤 John Doe             │ │
│ │ Principal: ฿10,000      │ │
│ │ Outstanding: ฿7,500     │ │
│ │ Interest: ฿200 accrued  │ │
│ │ Due: Jan 15, 2025      →│ │
│ │ [🔵 Active]             │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 👤 Company ABC          │ │
│ │ Principal: ฿50,000      │ │
│ │ Outstanding: ฿0         │ │
│ │ [✓ Closed]              │ │
│ └─────────────────────────┘ │
│                             │
│ LENT (ให้ยืม)               │
│ ┌─────────────────────────┐ │
│ │ 👤 Jane Smith           │ │
│ │ Principal: ฿5,000       │ │
│ │ Outstanding: ฿5,000     │ │
│ │ Interest: ฿50 accrued   │ │
│ │ Due: Feb 1, 2025       →│ │
│ │ [🔵 Active]             │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │      + Add Loan         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Loan Card Information:

- Counterparty name (who you borrowed from / lent to)
- Original principal amount
- Outstanding principal (current debt)
- Interest accrued (unpaid periods * rate)
- Due date (if set)
- Status badge (Active / Closed)
- Direction indicator (visual differentiation)

### Filter Tabs:

- **All:** All loans
- **Borrowed (ยืมเขา):** direction = 'borrow'
- **Lent (ให้ยืม):** direction = 'lend'

### Status Filter:

- Toggle: Show closed loans (default: hidden)

### Loan Card Colors:

- Borrowed: Red/orange tint (you owe money)
- Lent: Green/blue tint (money owed to you)
- Closed: Gray/muted

### Add Loan Button:

Opens Add Loan modal (covered in separate interaction, can use same modal pattern as transactions)

### Add Loan Modal (basic):

```
┌─────────────────────────────┐
│ Add Loan              [✕]  │
├─────────────────────────────┤
│ I am...                     │
│ [Borrowing] [Lending]       │
│                             │
│ Counterparty Name           │
│ ┌─────────────────────────┐ │
│ │ John Doe                │ │
│ └─────────────────────────┘ │
│                             │
│ Principal Amount            │
│ ┌─────────────────────────┐ │
│ │ ฿ 10,000                │ │
│ └─────────────────────────┘ │
│                             │
│ Account                     │
│ ┌─────────────────────────┐ │
│ │ 💵 Cash                ▼│ │
│ └─────────────────────────┘ │
│                             │
│ Interest Type               │
│ [Fixed Amount] [Percentage] │
│                             │
│ Interest Rate/Amount        │
│ ┌─────────────────────────┐ │
│ │ 100 ฿ / period          │ │
│ └─────────────────────────┘ │
│                             │
│ Interest Period             │
│ [Weekly] [Monthly]          │
│                             │
│ Interest Start Date         │
│ ┌─────────────────────────┐ │
│ │ 📅 Jan 1, 2025         │ │
│ └─────────────────────────┘ │
│                             │
│ Due Date (optional)         │
│ ┌─────────────────────────┐ │
│ │ 📅 Select...           │ │
│ └─────────────────────────┘ │
│                             │
│ Notes (optional)            │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │        Create           │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 4. Non-goals (OUT)

- Loan detail page (separate PRP)
- Payment recording (separate PRP)
- Loan reminders/notifications
- Loan agreements/documents

---

## 5. Key Rules / Invariants

1. Interest accrued calculated live from API
2. Outstanding principal from API (not computed client-side)
3. Closed loans hidden by default
4. Direction affects card color/styling
5. Counterparty name required
6. Zero-interest loans allowed (rate = 0)

---

## 6. Dependencies

- 030_tab-bar-routing
- API: 080_loans-domain-model
- API: 090_loan-interest-engine

---

## 7. Assumptions / Questions

**Assumptions:**
- API returns computed interest state
- Loans ordered by: active first, then by created_at desc
- Interest calculation done server-side

**Questions:**
- Q: Should we show total interest paid?
- Q: Should cards expand inline or navigate to detail?
- Q: Color coding for overdue loans?

---

## 8. Definition of Done

- [ ] Loans list page renders
- [ ] Loan cards show all required info
- [ ] Filter tabs work (All/Borrowed/Lent)
- [ ] Closed loans toggle works
- [ ] Cards styled differently by direction
- [ ] Add Loan modal opens
- [ ] Add Loan form validates correctly
- [ ] Add Loan creates loan and refreshes list
- [ ] Tap card navigates to detail page
- [ ] Loading state during fetch
- [ ] Empty state when no loans
