# PRP: Accounts Management UI

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | M |
| Suggested Execution Order | 050 |

---

## 1. Context

Users manage multiple accounts (cash, bank, e-wallet, credit card). Account management is accessed from Settings. Users need to create, edit, and deactivate accounts.

---

## 2. Objective

Implement accounts management UI within the Settings section.

---

## 3. Scope (IN)

### Access Point:

Settings → Accounts

### Accounts List Page:

**Route:** `/settings/accounts`

```
┌─────────────────────────────┐
│ ← Accounts                  │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 💵 Cash         ฿5,000  │ │
│ │ Active                  → │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 🏦 SCB Savings ฿25,000  │ │
│ │ Active                  → │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 📱 PromptPay    ฿3,500  │ │
│ │ Active                  → │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │     + Add Account       │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Account Card Info:
- Icon (based on type or custom)
- Name
- Current balance
- Status (Active/Inactive)
- Tap to edit

### Add Account Modal:

```
┌─────────────────────────────┐
│ Add Account           [✕]  │
├─────────────────────────────┤
│ Name                        │
│ ┌─────────────────────────┐ │
│ │ My Savings              │ │
│ └─────────────────────────┘ │
│                             │
│ Type                        │
│ [Cash] [Bank] [E-wallet] [CC]│
│                             │
│ Initial Balance             │
│ ┌─────────────────────────┐ │
│ │ ฿ 10,000               │ │
│ └─────────────────────────┘ │
│                             │
│ Icon & Color                │
│ [icon picker] [color picker]│
│                             │
│ ┌─────────────────────────┐ │
│ │        Create           │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Edit Account Modal:

Similar to Add, but:
- Initial balance is READ-ONLY (displayed, not editable)
- Shows "Current Balance: ฿X" (computed)
- Can change name, type, icon, color
- Can toggle Active/Inactive
- Delete button (with confirmation)

### Delete Confirmation:

```
┌─────────────────────────────┐
│ Delete Account?             │
├─────────────────────────────┤
│ "Cash" will be deleted.     │
│                             │
│ This cannot be undone after │
│ 7 days.                     │
│                             │
│ ┌─────────────────────────┐ │
│ │      Cancel             │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │      Delete             │ │  ← Red/destructive
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Account Types:
- Cash (💵)
- Bank (🏦)
- E-wallet (📱)
- Credit Card (💳)

---

## 4. Non-goals (OUT)

- Account reconciliation
- Bank connection/sync
- Account groups
- Multi-currency

---

## 5. Key Rules / Invariants

1. Initial balance immutable after creation
2. Cannot delete account with transactions (API enforces)
3. Current balance = initial + all transaction effects
4. Inactive accounts still show in list (grayed out)
5. Type affects default icon only

---

## 6. Dependencies

- 030_tab-bar-routing
- API: 040_accounts-module

---

## 7. Assumptions / Questions

**Assumptions:**
- Maximum ~10 accounts per user
- Icon picker has preset options
- Color picker has preset palette

**Questions:**
- Q: Should we show transaction count per account?
- Q: Can inactive accounts receive transactions?
- Q: Should we sort accounts (alphabetical, by balance)?

---

## 8. Definition of Done

- [ ] Accounts list page renders
- [ ] Each account shows name, icon, balance, status
- [ ] Add Account modal opens and creates account
- [ ] Edit Account modal opens with prefilled data
- [ ] Name, type, icon, color editable
- [ ] Initial balance displayed but not editable
- [ ] Active/Inactive toggle works
- [ ] Delete with confirmation works
- [ ] Delete fails gracefully if transactions exist
- [ ] New account appears in list immediately
- [ ] Loading and error states handled
