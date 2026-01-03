# PRP: Categories Management UI

| Field | Value |
|-------|-------|
| Owner | web |
| Estimated Complexity | M |
| Suggested Execution Order | 060 |

---

## 1. Context

Categories classify transactions as income or expense types. TangLog creates system categories on signup, and users can add custom categories. Management is accessed from Settings.

---

## 2. Objective

Implement categories management UI within the Settings section.

---

## 3. Scope (IN)

### Access Point:

Settings → Categories

### Categories List Page:

**Route:** `/settings/categories`

```
┌─────────────────────────────┐
│ ← Categories                │
├─────────────────────────────┤
│ INCOME                      │
│ ┌─────────────────────────┐ │
│ │ 💰 Salary          [sys]│ │
│ │ 💼 Freelance       [sys]│ │
│ │ 📈 Investment      [sys]│ │
│ │ 🎁 Gift            [sys]│ │
│ │ ➕ Other Income    [sys]│ │
│ │ 💵 Side Hustle          │ │ ← User created
│ └─────────────────────────┘ │
│                             │
│ EXPENSE                     │
│ ┌─────────────────────────┐ │
│ │ 🍔 Food & Dining   [sys]│ │
│ │ 🚗 Transportation  [sys]│ │
│ │ 🛒 Shopping        [sys]│ │
│ │ ... more categories ... │ │
│ │ 🏋️ Gym Membership       │ │ ← User created
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │    + Add Category       │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Category Card Info:
- Icon
- Name
- [sys] badge for system categories
- Tap to edit

### Add Category Modal:

```
┌─────────────────────────────┐
│ Add Category          [✕]  │
├─────────────────────────────┤
│ Type                        │
│ ○ Income    ● Expense       │
│                             │
│ Name                        │
│ ┌─────────────────────────┐ │
│ │ Subscriptions           │ │
│ └─────────────────────────┘ │
│                             │
│ Icon                        │
│ [icon grid picker]          │
│                             │
│ Color                       │
│ [color palette picker]      │
│                             │
│ ┌─────────────────────────┐ │
│ │        Create           │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Edit Category Modal:

**For user-created categories:**
- Can edit name, icon, color
- Type is READ-ONLY (shown but not editable)
- Delete button with confirmation

**For system categories:**
- Name is READ-ONLY
- Can edit icon and color only
- No delete button
- "System category" notice

### Validation:
- Name required
- Name unique within type (income/expense)
- Icon required
- Type required

---

## 4. Non-goals (OUT)

- Category hierarchy/subcategories
- Category budgets
- Merging categories
- Reordering categories

---

## 5. Key Rules / Invariants

1. Type (income/expense) immutable after creation
2. System categories cannot be deleted
3. System categories can have icon/color customized
4. Category names unique per user per type
5. Cannot delete category with transactions (API enforces)
6. "Interest" category is system and required for loans

---

## 6. Dependencies

- 030_tab-bar-routing
- API: 050_categories-module

---

## 7. Assumptions / Questions

**Assumptions:**
- Icon picker shows common category icons
- Color picker has preset palette
- Categories grouped by type in list

**Questions:**
- Q: How many custom categories allowed?
- Q: Should we show usage count per category?
- Q: Can users hide system categories they don't use?

---

## 8. Definition of Done

- [ ] Categories list page renders
- [ ] Categories grouped by Income/Expense
- [ ] System categories marked with badge
- [ ] Add Category modal works
- [ ] Type selector (income/expense) works
- [ ] Edit user category: name, icon, color editable
- [ ] Edit system category: icon, color only
- [ ] Delete user category with confirmation
- [ ] Cannot delete system categories
- [ ] Name uniqueness validated
- [ ] Loading and error states handled
