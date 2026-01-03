# PRP: Loan Detail Page

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | L |
| Suggested Execution Order | 110 |

---

## 1. Context

The loan detail page shows comprehensive information about a single loan: financial summary, interest calculations, and a timeline of all events. Users can record payments and manage the loan from here.

---

## 2. Objective

Implement the loan detail page with summary cards, interest breakdown, and event timeline.

---

## 3. Scope (IN)

### Loan Detail Page:

**Route:** `/loans/:id`

```
┌─────────────────────────────┐
│ ← John Doe            [⋮]  │ ← Back + actions menu
├─────────────────────────────┤
│ BORROWED                    │
│ ┌─────────────────────────┐ │
│ │  Principal   Outstanding│ │
│ │  ฿10,000     ฿7,500     │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │  Interest    Interest   │ │
│ │  Per Period  Accrued    │ │
│ │  ฿100/mo     ฿300       │ │
│ │  (3 unpaid periods)     │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │  Total Interest Paid    │ │
│ │  ฿600 (6 periods)       │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │  Due Date               │ │
│ │  Jan 15, 2025           │ │
│ │  (in 30 days)           │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ TIMELINE                    │
│ ┌─────────────────────────┐ │
│ │ ⬇️ Disbursed             │ │
│ │ ฿10,000                  │ │
│ │ Dec 1, 2024              │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 💰 Principal Payment     │ │
│ │ ฿2,500                   │ │
│ │ Dec 15, 2024             │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 💵 Interest Payment      │ │
│ │ ฿300 (3 periods)         │ │
│ │ Dec 15, 2024             │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 💵 Interest Payment      │ │
│ │ ฿300 (3 periods)         │ │
│ │ Dec 1, 2024              │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │    + Record Payment     │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Summary Cards:

**Principal Card:**
- Original principal amount
- Current outstanding principal
- Percentage paid progress bar

**Interest Card:**
- Interest rate/amount per period
- Interest period (weekly/monthly)
- Periods started (total)
- Periods paid
- Periods unpaid
- Interest accrued (unpaid * rate)

**Total Interest Paid Card:**
- Sum of all interest payments
- Number of periods paid

**Due Date Card (if set):**
- Due date
- Days until/overdue
- Visual warning if overdue

### Interest Breakdown Info:

Show how interest is calculated:
- "฿100 per month"
- "Started: Jan 1, 2025"
- "Periods started: 6"
- "Periods paid: 3"
- "Periods unpaid: 3"
- "Interest accrued: ฿300"

### Event Timeline:

Chronological list (newest first) of:
- Disburse event (initial)
- Principal payments
- Interest payments
- Adjustments (if any)
- Close event (if closed)

Each event card shows:
- Event type icon
- Amount
- For interest: periods paid
- Date
- Notes (if any)

### Actions Menu (⋮):

- Edit Loan (metadata only)
- Close Loan (if outstanding = 0)
- Delete Loan

---

## 4. Non-goals (OUT)

- Payment scheduling
- Loan restructuring
- Interest rate changes
- Document attachments

---

## 5. Key Rules / Invariants

1. Interest calculations from API (live computed)
2. Cannot close loan with outstanding principal
3. Disburse event always first in timeline
4. Events ordered by date descending
5. Closed loans are read-only
6. Delete cascades to all events and transactions

---

## 6. Dependencies

- 100_loans-list-page (navigation from)
- API: 080_loans-domain-model
- API: 090_loan-interest-engine
- API: 100_loan-events-module

---

## 7. Assumptions / Questions

**Assumptions:**
- API returns full loan with computed interest state
- API returns events with linked transaction info
- Timeline uses infinite scroll or "load more"

**Questions:**
- Q: Should events be editable inline?
- Q: Show linked transaction details?
- Q: Export loan history?

---

## 8. Definition of Done

- [ ] Detail page renders with all summary cards
- [ ] Principal card shows correct amounts
- [ ] Interest card shows calculation breakdown
- [ ] Interest accrued calculated correctly
- [ ] Due date card shows countdown
- [ ] Timeline lists all events
- [ ] Events styled by type
- [ ] Actions menu works
- [ ] Edit loan (metadata) works
- [ ] Close loan works (when outstanding = 0)
- [ ] Delete loan with confirmation
- [ ] Record Payment button opens modal
- [ ] Back navigation works
- [ ] Loading state during fetch
- [ ] Closed loan shows read-only state
