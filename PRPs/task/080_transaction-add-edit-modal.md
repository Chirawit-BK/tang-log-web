# PRP: Transaction Add/Edit Modal

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | L |
| Suggested Execution Order | 080 |

---

## 1. Context

Users add transactions via the floating "+" button or center tab. Editing happens from the transaction detail page. The form must be intuitive and enforce all transaction validation rules.

---

## 2. Objective

Implement the transaction creation and editing modal with full validation.

---

## 3. Scope (IN)

### Add Transaction Modal:

Opened from:
- Floating "+" button on dashboard
- Center "Add" tab
- Quick add from transaction list

```
┌─────────────────────────────┐
│ Add Transaction       [✕]  │
├─────────────────────────────┤
│ Type                        │
│ [Income] [Expense] [Transfer]│
│                             │
│ Amount                      │
│ ┌─────────────────────────┐ │
│ │ ฿  |                    │ │ ← Number pad opens
│ └─────────────────────────┘ │
│                             │
│ Account                     │
│ ┌─────────────────────────┐ │
│ │ 💵 Cash                ▼│ │
│ └─────────────────────────┘ │
│                             │
│ Category (if Income/Expense)│
│ ┌─────────────────────────┐ │
│ │ 🍔 Food & Dining       ▼│ │
│ └─────────────────────────┘ │
│                             │
│ To Account (if Transfer)    │
│ ┌─────────────────────────┐ │
│ │ 🏦 Bank Account        ▼│ │
│ └─────────────────────────┘ │
│                             │
│ Waste Level (if Expense)    │
│ [Necessary] [Optional] [Wasteful]│
│                             │
│ Date                        │
│ ┌─────────────────────────┐ │
│ │ 📅 Today              ▼│ │
│ └─────────────────────────┘ │
│                             │
│ Note (optional)             │
│ ┌─────────────────────────┐ │
│ │ Lunch with colleagues   │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │         Save            │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Form Fields by Kind:

**INCOME:**
- Amount (required)
- Account (required)
- Category (required, income categories only)
- Date (required, defaults to today)
- Note (optional)

**EXPENSE:**
- Amount (required)
- Account (required)
- Category (required, expense categories only)
- Waste Level (required)
- Date (required, defaults to today)
- Note (optional)

**TRANSFER:**
- Amount (required)
- From Account (required)
- To Account (required, different from From)
- Date (required, defaults to today)
- Note (optional)
- NO category
- NO waste level

### Edit Transaction:

**Route:** `/transactions/:id` (detail page) → Edit button opens modal

Same form as Add, but:
- Kind is READ-ONLY (displayed, not changeable)
- All other fields editable
- Delete button available
- LOAN_FLOW transactions: entire form is READ-ONLY

### Amount Input:

- Numeric keyboard on mobile
- Format with thousand separators
- No decimal input (whole satang via x100 internally)
- Clear button

### Date Picker:

- Default: Today
- Quick options: Today, Yesterday
- Full calendar for other dates
- Cannot select future dates (>1 day)

### Validation:

- All required fields must be filled
- Amount must be positive
- Transfer accounts must be different
- Category type must match transaction kind
- Show inline errors

---

## 4. Non-goals (OUT)

- Recurring transactions
- Attachments/receipts
- Split transactions
- Templates

---

## 5. Key Rules / Invariants

1. LOAN_FLOW cannot be created via this modal
2. Kind cannot be changed on edit
3. Category options filtered by kind
4. Waste level only for EXPENSE
5. Transfer needs two different accounts
6. Success closes modal and refreshes list/dashboard

---

## 6. Dependencies

- 030_tab-bar-routing
- 050_accounts-management (account selector)
- 060_categories-management (category selector)
- API: 070_transactions-module

---

## 7. Assumptions / Questions

**Assumptions:**
- Form validates on blur and submit
- Success shows toast notification
- Modal can be closed without confirmation if no changes

**Questions:**
- Q: Should we remember last used account/category?
- Q: Copy transaction feature for quick re-entry?
- Q: Should amount input support calculator?

---

## 8. Definition of Done

- [ ] Add modal opens from all entry points
- [ ] Kind selector shows Income/Expense/Transfer
- [ ] Form fields change based on kind
- [ ] Amount input works with numeric keyboard
- [ ] Account selector populated from user accounts
- [ ] Category selector filtered by kind
- [ ] Waste level selector (expense only)
- [ ] Date picker works with quick options
- [ ] Validation shows inline errors
- [ ] Create transaction saves and closes modal
- [ ] Edit mode loads existing data
- [ ] Edit saves changes correctly
- [ ] Delete with confirmation works
- [ ] LOAN_FLOW transactions read-only
- [ ] Loading states during save
- [ ] Error handling for API failures
