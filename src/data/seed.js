// Dummy data – the hackathon says no backend / database, so everything lives in memory.
const ago = (days, h = 10, m = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const DEFAULT_CATEGORIES = [
  { key: 'Food', icon: 'fast-food-outline' },
  { key: 'Transport', icon: 'bus-outline' },
  { key: 'Medicine', icon: 'medkit-outline' },
  { key: 'Groceries', icon: 'basket-outline' },
  { key: 'Rent', icon: 'key-outline' },
  { key: 'Gifts', icon: 'gift-outline' },
  { key: 'Savings', icon: 'wallet-outline' },
  { key: 'Entertainment', icon: 'ticket-outline' },
];

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Gifts', 'Other'];

const EXTRA_ICONS = {
  Salary: 'cash-outline',
  Freelance: 'laptop-outline',
  Other: 'ellipsis-horizontal-circle-outline',
};

export const getCategoryIcon = (key) =>
  DEFAULT_CATEGORIES.find((c) => c.key === key)?.icon || EXTRA_ICONS[key] || 'pricetag-outline';

export const SEED_USERS = [
  {
    id: 'A001', role: 'admin', name: 'Sivaprakhash', email: 'sivaprakhash@finwise.com',
    password: 'admin123', mobile: '9876543210', dob: '19/12/2004',
    budget: 20000, pushNotifications: true, darkTheme: false,
  },
  {
    id: '25030024', role: 'customer', name: 'John Smith', email: 'john@finwise.com',
    password: 'john123', mobile: '9876501234', dob: '15/04/2001',
    budget: 20000, pushNotifications: true, darkTheme: false,
  },
  {
    id: '25030025', role: 'customer', name: 'Priya Kumar', email: 'priya@finwise.com',
    password: 'priya123', mobile: '9840012345', dob: '22/08/2002',
    budget: 8000, pushNotifications: true, darkTheme: false,
  },
  {
    id: '25030026', role: 'customer', name: 'Raja', email: 'raja@gmail.com',
    password: 'raja12345', mobile: '9876598765', dob: '10/10/1998',
    budget: 25000, pushNotifications: true, darkTheme: false,
  },
];

let n = 0;
const tx = (userId, daysAgo, h, m, title, category, amount, type = 'expense', message = '') => ({
  id: `T${++n}`, userId, title, category, amount, type, message, date: ago(daysAgo, h, m),
});

export const SEED_TRANSACTIONS = [
  // John – today / this week
  tx('25030024', 0, 9, 15, 'Breakfast', 'Food', 12.5),
  tx('25030024', 0, 13, 40, 'Metro Card', 'Transport', 20),
  tx('25030024', 1, 18, 27, 'Groceries', 'Groceries', 100),
  tx('25030024', 1, 20, 10, 'Dinner', 'Food', 26),
  tx('25030024', 2, 17, 0, 'Freelance Project', 'Freelance', 450, 'income'),
  tx('25030024', 3, 11, 30, 'Pharmacy', 'Medicine', 35),
  tx('25030024', 4, 19, 45, 'Movie Night', 'Entertainment', 30),
  tx('25030024', 5, 12, 0, 'Lunch', 'Food', 18.4),
  tx('25030024', 6, 8, 30, 'Fuel', 'Transport', 40),
  // John – this month & earlier
  tx('25030024', 9, 9, 0, 'Salary', 'Salary', 4000, 'income'),
  tx('25030024', 9, 10, 0, 'Rent', 'Rent', 674.4),
  tx('25030024', 12, 16, 20, 'Birthday Gift', 'Gifts', 60),
  tx('25030024', 14, 15, 0, 'Travel Fund', 'Savings', 300),
  tx('25030024', 20, 19, 0, 'Concert Ticket', 'Entertainment', 70),
  tx('25030024', 33, 9, 0, 'Salary', 'Salary', 4000, 'income'),
  tx('25030024', 33, 10, 0, 'Rent', 'Rent', 674.4),
  tx('25030024', 36, 13, 10, 'Groceries', 'Groceries', 120),
  tx('25030024', 40, 20, 30, 'Dinner Out', 'Food', 45),
  tx('25030024', 45, 14, 0, 'Car Fund', 'Savings', 500),
  tx('25030024', 63, 9, 0, 'Salary', 'Salary', 4000, 'income'),
  tx('25030024', 63, 10, 0, 'Rent', 'Rent', 674.4),
  tx('25030024', 70, 18, 0, 'Doctor Visit', 'Medicine', 80),
  tx('25030024', 95, 9, 0, 'Salary', 'Salary', 3800, 'income'),
  tx('25030024', 98, 12, 0, 'Groceries', 'Groceries', 140),
  tx('25030024', 130, 9, 0, 'Salary', 'Salary', 3800, 'income'),
  tx('25030024', 135, 19, 0, 'Shopping', 'Gifts', 210),
  // Priya
  tx('25030025', 0, 11, 0, 'Coffee', 'Food', 6),
  tx('25030025', 2, 9, 0, 'Bus Pass', 'Transport', 25),
  tx('25030025', 8, 9, 0, 'Salary', 'Salary', 2500, 'income'),
  tx('25030025', 8, 11, 0, 'Hostel Rent', 'Rent', 400),
  tx('25030025', 15, 18, 0, 'Groceries', 'Groceries', 90),
  tx('25030025', 38, 9, 0, 'Salary', 'Salary', 2500, 'income'),
  tx('25030025', 41, 17, 0, 'Books', 'Gifts', 55),
  // Raja
  tx('25030026', 0, 10, 30, 'Breakfast', 'Food', 15),
  tx('25030026', 1, 14, 0, 'Business Lunch', 'Food', 28),
  tx('25030026', 2, 9, 0, 'Consulting Project', 'Freelance', 1200, 'income'),
  tx('25030026', 3, 18, 0, 'Fuel Refill', 'Transport', 45),
  tx('25030026', 5, 9, 0, 'Monthly Salary', 'Salary', 5000, 'income'),
  tx('25030026', 6, 12, 0, 'Groceries Mart', 'Groceries', 110),
];

export const SEED_NOTIFICATIONS = [
  { id: 'N1', userId: '25030024', title: 'Reminder!', message: 'Set up your automatic saving to meet your savings goal.', date: ago(0, 8, 0), read: false },
  { id: 'N2', userId: '25030024', title: 'New update available', message: 'Daily, weekly and monthly reports are now on your home screen.', date: ago(1, 9, 0), read: false },
  { id: 'N3', userId: 'A001', title: 'Weekly summary ready', message: 'Customer spending report for this week is ready to review.', date: ago(0, 7, 30), read: false },
];
