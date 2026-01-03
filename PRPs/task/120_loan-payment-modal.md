# PRP: Loan Payment Modal

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | M |
| Suggested Execution Order | 120 |

---

## 1. Context

Recording loan payments is the primary interaction after loan creation. Users pay principal and interest separately but can do both in one interaction. The modal must make interest period calculation clear.

---

## 2. Objective

Implement the loan payment modal that records principal and/or interest payments.

---

## 3. Scope (IN)

### Record Payment Modal:

Opened from: Loan detail page "Record Payment" button

```
┌─────────────────────────────┐
│ Record Payment        [✕]  │
├─────────────────────────────┤
│ CURRENT STATE               │
│ Outstanding: ฿7,500         │
│ Interest/period: ฿100       │
│ Periods unpaid: 3           │
│ Interest accrued: ฿300      │
├─────────────────────────────┤
│                             │
│ Principal Payment           │
│ ┌─────────────────────────┐ │
│ │ ฿ 2,500                 │ │
│ └─────────────────────────┘ │
│ Remaining: ฿5,000           │
│                             │
│ Interest Periods to Pay     │
│ ┌─────────────────────────┐ │
│ │ 3 periods               │ │
│ └─────────────────────────┘ │
│ Amount: ฿300                │
│                             │
│ ─────────────────────────── │
│ Total Payment: ฿2,800       │
│ ─────────────────────────── │
│                             │
│ Payment Date                │
│ ┌─────────────────────────┐ │
│ │ 📅 Today                │ │
│ └─────────────────────────┘ │
│                             │
│ From Account                │
│ ┌─────────────────────────┐ │
│ │ 💵 Cash                ▼│ │
│ └─────────────────────────┘ │
│                             │
│ Notes (optional)            │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │     Record Payment      │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Current State Display:

Shows BEFORE recording:
- Outstanding principal
- Interest per period (amount or %)
- Number of unpaid periods
- Total interest accrued

### Principal Payment Input:

- Optional (can pay interest only)
- Amount in THB
- Cannot exceed outstanding principal
- Shows remaining principal after payment

### Interest Periods Input:

- Optional (can pay principal only)
- Integer input (number of periods)
- Shows calculated amount
- Cannot be negative
- Can exceed unpaid periods (pay ahead)

### Total Payment:

- Sum of principal + (periods × interest_per_period)
- Updates live as inputs change

### Payment Date:

- Defaults to today
- Can backdate for recording past payments
- Cannot be future

### From Account:

- Required
- Dropdown of user's active accounts
- For borrow: money goes OUT of this account
- For lend: money comes INTO this account

### Validation:

- At least one of principal or interest must be > 0
- Principal ≤ outstanding
- Interest periods ≥ 0
- Account required
- Date required

### On Submit:

Creates 1 or 2 loan events:
1. principal_payment (if principal > 0)
2. interest_payment (if periods > 0)

Each event creates linked transaction.

---

## 4. Non-goals (OUT)

- Partial period payments
- Payment scheduling
- Automatic recurring payments
- Split payment across accounts

---

## 5. Key Rules / Invariants

1. Interest paid in WHOLE periods only
2. Interest amount calculated server-side
3. Paying 0 principal and 0 interest is invalid
4. Principal payment creates LOAN_FLOW transaction
5. Interest payment creates EXPENSE/INCOME transaction
6. Payment cannot make outstanding negative
7. For borrow: both payments subtract from account
8. For lend: principal adds, interest adds to account

---

## 6. Dependencies

- 110_loan-detail-page (opens from)
- 050_accounts-management (account selector)
- API: 100_loan-events-module
- API: 090_loan-interest-engine

---

## 7. Assumptions / Questions

**Assumptions:**
- API handles creating both events atomically
- Interest calculation uses current outstanding principal
- Success closes modal and refreshes detail page

**Questions:**
- Q: Allow paying more interest periods than accrued?
- Q: Show warning if large payment?
- Q: Quick actions for common payments?

---

## 8. Definition of Done

- [ ] Modal opens from loan detail
- [ ] Current state displayed correctly
- [ ] Principal input works with validation
- [ ] Interest periods input works
- [ ] Interest amount calculated correctly
- [ ] Total payment updates live
- [ ] Date picker works
- [ ] Account selector populated
- [ ] Validation prevents invalid submissions
- [ ] Submit creates correct events
- [ ] Success closes modal
- [ ] Loan detail refreshes after payment
- [ ] Error handling for API failures
- [ ] Works for both borrow and lend directions
