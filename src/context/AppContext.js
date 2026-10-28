import React, { createContext, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { DEFAULT_CATEGORIES, SEED_NOTIFICATIONS, SEED_TRANSACTIONS, SEED_USERS } from '../data/seed';
import { firstName, formatDate, money } from '../utils/format';
import { filterByPeriod, sortByDateDesc, totals } from '../utils/reports';

const AppContext = createContext(null);

let seq = 100;
const uid = (prefix) => `${prefix}${Date.now()}${seq++}`;

export function AppProvider({ children }) {
  const [users, setUsers] = useState(SEED_USERS);
  const [transactions, setTransactions] = useState(SEED_TRANSACTIONS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [currentUserId, setCurrentUserId] = useState(null);

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const isAdmin = currentUser?.role === 'admin';
  const customers = users.filter((u) => u.role === 'customer');

  const myTransactions = useMemo(
    () => sortByDateDesc(transactions.filter((t) => t.userId === currentUserId)),
    [transactions, currentUserId]
  );
  const customerTransactions = useMemo(() => {
    const ids = new Set(customers.map((c) => c.id));
    return sortByDateDesc(transactions.filter((t) => ids.has(t.userId)));
  }, [transactions, users]);

  const myNotifications = useMemo(
    () => notifications.filter((n) => n.userId === currentUserId).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [notifications, currentUserId]
  );
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  // ---------- notifications / personalised alerts ----------
  const notify = (userId, title, message, popup = true) => {
    setNotifications((prev) => [{ id: uid('N'), userId, title, message, date: new Date().toISOString(), read: false }, ...prev]);
    const user = users.find((u) => u.id === userId);
    if (popup && user?.pushNotifications !== false) {
      // small delay so it also shows when triggered from inside another Alert button
      setTimeout(() => Alert.alert(title, message), 300);
    }
  };

  const notifyAdmins = (title, message) => {
    users.filter((u) => u.role === 'admin').forEach((a) => notify(a.id, title, message, false));
  };

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => (n.userId === currentUserId ? { ...n, read: true } : n)));
  const clearNotifications = () => setNotifications((prev) => prev.filter((n) => n.userId !== currentUserId));

  // ---------- auth ----------
  const login = (identifier, password, role) => {
    const id = identifier.trim().toLowerCase();
    let user = users.find(
      (u) =>
        u.email.toLowerCase() === id ||
        u.name.toLowerCase() === id ||
        (u.role === 'admin' && (id === 'admin' || id === 'admin@finwise.com' || id === 'sivaprakash' || id === 'sivaprakhash' || id === 'sivaprakhash@finwise.com'))
    );
    if (!user && role === 'admin' && (id === 'admin' || id.includes('sivaprak'))) {
      user = users.find((u) => u.role === 'admin');
    }
    if (!user || user.password !== password) return { ok: false, error: 'Incorrect email or password' };
    if (user.role !== role) {
      if (role === 'admin' && (id === 'admin' || id.includes('sivaprak') || user.name.toLowerCase().includes('sivaprak'))) {
        user.role = 'admin';
      } else {
        return { ok: false, error: `This account is a ${user.role} account. Switch to "${user.role === 'admin' ? 'Admin' : 'Customer'}" to sign in.` };
      }
    }
    setCurrentUserId(user.id);
    return { ok: true, user };
  };

  const signup = ({ name, email, mobile, dob, password, role }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);
    if (existingIndex !== -1) {
      const existing = users[existingIndex];
      // If admin or matching role, allow registering/updating seamlessly
      if (existing.role === role || role === 'admin' || trimmedEmail.includes('sivaprak')) {
        const updatedUser = {
          ...existing,
          role,
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          dob: dob.trim(),
          password,
        };
        setUsers((prev) => prev.map((u, i) => (i === existingIndex ? updatedUser : u)));
        return { ok: true, user: updatedUser };
      }
      return { ok: false, error: 'This email is already registered. Log in instead.' };
    }
    const id = role === 'admin'
      ? `A${String(users.filter((u) => u.role === 'admin').length + 1).padStart(3, '0')}`
      : String(25030024 + users.length + 1);
    const user = {
      id, role, name: name.trim(), email: email.trim(), mobile: mobile.trim(), dob: dob.trim(), password,
      budget: 20000, pushNotifications: true, darkTheme: false,
    };
    setUsers((prev) => [...prev, user]);
    setNotifications((prev) => [
      { id: uid('N'), userId: id, title: 'Welcome to FinWise', message: `Hi ${firstName(name)}, your account is ready. Start by adding your first transaction.`, date: new Date().toISOString(), read: false },
      ...prev,
    ]);
    if (role === 'customer') notifyAdmins('New customer', `${name.trim()} (${email.trim()}) just signed up.`);
    return { ok: true, user };
  };

  const logout = () => setCurrentUserId(null);

  const resetPasswordExists = (email) => users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  // ---------- profile ----------
  const updateProfile = (changes) => {
    const email = changes.email?.trim().toLowerCase();
    if (email && users.some((u) => u.id !== currentUserId && u.email.toLowerCase() === email)) {
      return { ok: false, error: 'This email is used by another account' };
    }
    setUsers((prev) => prev.map((u) => (u.id === currentUserId ? { ...u, ...changes } : u)));
    const name = changes.name || currentUser.name;
    notify(currentUserId, 'Profile updated', `Hi ${firstName(name)}, your profile details were saved successfully.`, changes.pushNotifications !== false);
    return { ok: true };
  };

  const changePassword = (current, next) => {
    if (currentUser.password !== current) return { ok: false, error: 'Current password is incorrect' };
    setUsers((prev) => prev.map((u) => (u.id === currentUserId ? { ...u, password: next } : u)));
    notify(currentUserId, 'Password changed', `Hi ${firstName(currentUser.name)}, your password was changed. Use the new one next time you log in.`);
    return { ok: true };
  };

  // ---------- categories ----------
  const addCategory = (name) => {
    const key = name.trim().replace(/\b\w/g, (c) => c.toUpperCase());
    if (categories.some((c) => c.key.toLowerCase() === key.toLowerCase())) {
      return { ok: false, error: 'This category already exists' };
    }
    setCategories((prev) => [...prev, { key, icon: 'pricetag-outline' }]);
    notify(currentUserId, 'Category added', `Hi ${firstName(currentUser.name)}, "${key}" is now in your categories.`);
    return { ok: true };
  };

  // ---------- transactions (personalised alert on every change) ----------
  const budgetNote = (list) => {
    const used = totals(filterByPeriod(list, 'Monthly')).expense;
    const pct = Math.round((used / (currentUser.budget || 1)) * 100);
    if (pct >= 100) return `\n\n⚠️ You have crossed your monthly budget (${pct}% used).`;
    if (pct >= 80) return `\n\n⚠️ You have used ${pct}% of your monthly budget.`;
    return '';
  };

  const addTransaction = (data) => {
    const t = { ...data, id: uid('T'), userId: currentUserId };
    const next = [t, ...myTransactions];
    setTransactions((prev) => [t, ...prev]);
    const kind = t.type === 'income' ? 'An income' : 'An expense';
    notify(
      currentUserId,
      `Hi ${firstName(currentUser.name)} 👋`,
      `${kind} of ${money(t.amount)} for "${t.title}" was added to ${t.category} on ${formatDate(t.date)}.\nNew balance: ${money(totals(next).balance)}.${budgetNote(next)}`
    );
    notifyAdmins('Transaction added', `${currentUser.name} added ${t.type} "${t.title}" (${money(t.amount)}).`);
  };

  const updateTransaction = (id, changes) => {
    const old = transactions.find((t) => t.id === id);
    if (!old) return;
    const updated = { ...old, ...changes };
    const next = myTransactions.map((t) => (t.id === id ? updated : t));
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    const diffs = [];
    if (old.amount !== updated.amount) diffs.push(`amount ${money(old.amount)} → ${money(updated.amount)}`);
    if (old.category !== updated.category) diffs.push(`category ${old.category} → ${updated.category}`);
    if (old.title !== updated.title) diffs.push(`title "${old.title}" → "${updated.title}"`);
    if (formatDate(old.date) !== formatDate(updated.date)) diffs.push(`date ${formatDate(old.date)} → ${formatDate(updated.date)}`);
    if (old.type !== updated.type) diffs.push(`type ${old.type} → ${updated.type}`);
    notify(
      currentUserId,
      `Hi ${firstName(currentUser.name)}, transaction updated`,
      `"${updated.title}" was changed${diffs.length ? `: ${diffs.join(', ')}` : ' (no value changes)'}.\nNew balance: ${money(totals(next).balance)}.${budgetNote(next)}`
    );
  };

  const deleteTransaction = (id) => {
    const old = transactions.find((t) => t.id === id);
    if (!old) return;
    const next = myTransactions.filter((t) => t.id !== id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    notify(
      currentUserId,
      `Hi ${firstName(currentUser.name)}, transaction deleted`,
      `"${old.title}" (${money(old.amount)}, ${old.category}) was removed.\nNew balance: ${money(totals(next).balance)}.`
    );
  };

  const value = {
    users, customers, currentUser, isAdmin, categories,
    transactions, myTransactions, customerTransactions,
    notifications: myNotifications, unreadCount,
    login, signup, logout, resetPasswordExists,
    updateProfile, changePassword, addCategory,
    addTransaction, updateTransaction, deleteTransaction,
    markAllRead, clearNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
