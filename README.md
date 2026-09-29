# NeuroBank – Frontend Banking Application

NeuroBank is a modern banking web application that allows users to manage their accounts, deposit and withdraw funds, transfer money between accounts, and review their transaction history.

---

## Team Responsibilities

| Team Member | Assigned Pages |
|-------------|----------------|
| Jack | Main / Landing Page |
| Robert | Sign In & Log In |
| Juan | Home & Accounts |
| James | Deposit & Withdraw |
| Chandramouli | Transfer |
| Ye | Transactions |

---

## Navigation Structure

After logging in, the main application navigation should follow this structure:

- Dashboard
- Accounts
- Transaction Center
  - Deposit
  - Withdraw
  - Transfer
- Transactions

The navigation bar should remain visually consistent across all authenticated pages.

---

## Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Main Background | Very Dark Navy | `#06101F` |
| Sidebar Background | Dark Navy | `#071225` |
| Card Background | Navy | `#0B1930` |
| Secondary Card Background | Dark Blue | `#10213D` |
| Primary Blue | Electric Blue | `#1677FF` |
| Blue Highlight | Bright Blue | `#2F80FF` |
| Primary Text | White | `#F5F7FF` |
| Secondary Text | Light Blue/Gray | `#9CAED0` |
| Borders | Muted Navy Blue | `#1B3559` |
| Deposit / Positive | Green | `#00D69A` |
| Withdraw / Negative | Red | `#FF365F` |
| Transfer Accent | Purple | `#6C4DFF` |

### CSS Variables

We will use these variables to keep the colors consistent:

```css
:root {
    --bg-primary: #06101F;
    --bg-sidebar: #071225;
    --bg-card: #0B1930;
    --bg-card-secondary: #10213D;

    --primary-blue: #1677FF;
    --highlight-blue: #2F80FF;

    --text-primary: #F5F7FF;
    --text-secondary: #9CAED0;

    --border-color: #1B3559;

    --success: #00D69A;
    --danger: #FF365F;
    --transfer: #6C4DFF;
}