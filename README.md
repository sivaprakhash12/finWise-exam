# FinWise – Finance Budget Tracker (React Native / Expo)

MCA Sem III · Core Elective II · Mobile App Development using React Native – Major Hackathon

## Run it

```bash
npm install
npx expo install --fix     # matches package versions to your Expo SDK
npx expo start             # scan the QR with Expo Go (Android / iOS)
```
If Expo Go on your phone asks for a newer SDK: `npx expo install expo@latest` then `npx expo install --fix`.

## Demo logins
| Role | Email | Password |
|---|---|---|
| Customer | john@finwise.com | john123 |
| Customer | priya@finwise.com | priya123 |
| Admin | admin@finwise.com | admin123 |

Admin sign-up needs the access code **ADMIN2026**.

## Requirement → where it is

| Requirement | Marks | Implementation |
|---|---|---|
| 1. Home screen with Sign up / Sign in (Admin & Customer) | 5 | `screens/auth/WelcomeScreen.js` (role switch), `LoginScreen.js`, `SignUpScreen.js`, `ForgotPasswordScreen.js` |
| 2. Analysis screen (Admin & Customer) | 5 | `screens/shared/AnalysisScreen.js` – Daily/Weekly/Monthly/Year chart, targets, top spending. Admin sees all customers |
| 3. Profile & Edit Profile (Customer) | 5 | `screens/customer/ProfileScreen.js`, `EditProfileScreen.js`, `SecurityScreen.js` |
| 4. Transaction (month wise) (Customer) | 5 | `screens/customer/TransactionsScreen.js` – SectionList grouped by month, month chips, income/expense filter, add/edit/delete |
| 5. Overall Categories (Customer) | 5 | `screens/customer/CategoriesScreen.js` – grid + "More" to add a category |
| 6. Category Details (Customer) | 5 | `screens/customer/CategoryDetailScreen.js` + `AddTransactionScreen.js` |
| Stack Navigation | 10 | Root auth stack, Transactions stack, Categories stack, Profile stack, Admin customers stack |
| Tab Navigation | 10 | Customer: Home, Analysis, Transactions, Categories, Profile · Admin: Dashboard, Analysis, Customers |
| Drawer Navigation | 10 | Custom drawer for both roles (`navigation/DrawerContent.js`) |
| All users navigate every screen | 5 | Role-based navigators in `navigation/RootNavigator.js` |
| Personalised alert on transaction change | 5 | `context/AppContext.js` – add / update / delete show "Hi John…" alert with new balance + budget warning, saved in Notifications |
| Daily / weekly / monthly report on home | 5 | `HomeScreen.js` (customer) & `AdminDashboardScreen.js` (admin) |

Validation: email, 10-digit mobile, name, DOB (DD/MM/YYYY, age check), password strength, confirm password, admin code, amount (> 0, 2 decimals), date (not in future), title length, category required, budget.

No backend / database – data is kept in React Context (in memory).

## Structure
```
App.js
src/
  theme.js              Figma colours (Caribbean Green #00D09E, Honeydew #F1FFF3 …) + Poppins
  context/AppContext.js state, auth, transactions, personalised alerts
  data/seed.js          demo users, transactions, categories
  utils/                format, reports (daily/weekly/monthly), validation
  components/           Screen (green header + rounded sheet), UI, Finance (chart, rows, summary)
  navigation/           Root stack, Customer drawer→tabs→stacks, Admin drawer→tabs→stack
  screens/auth | customer | admin | shared
```

## Demo flow for presentation
1. Splash → Welcome → choose Customer → Log In (john@finwise.com / john123)
2. Home: switch Daily / Weekly / Monthly report
3. Categories → Food → Add Expenses → Save → personalised alert pops up
4. Transactions: month chips, tap Income/Expense boxes, tap a row to edit, long press to delete (alert each time)
5. Bell → Notifications (alerts history)
6. Analysis: Daily / Weekly / Monthly / Year chart
7. Profile → Edit Profile → Update (validation) → Logout
8. Drawer (menu icon) shows Stack + Tabs + Drawer together
9. Log in as Admin → Dashboard reports, Analysis of all customers, Customers → customer details
