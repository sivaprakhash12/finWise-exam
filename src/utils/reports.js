import { DAYS, MONTHS, SHORT_MONTHS } from './format';

export const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const endOfToday = () => {
  const x = new Date();
  x.setHours(23, 59, 59, 999);
  return x;
};

export const periodStart = (period) => {
  const now = new Date();
  if (period === 'Daily') return startOfDay(now);
  if (period === 'Weekly') {
    const s = startOfDay(now);
    s.setDate(s.getDate() - 6);
    return s;
  }
  if (period === 'Year') return new Date(now.getFullYear(), 0, 1);
  return new Date(now.getFullYear(), now.getMonth(), 1); // Monthly
};

export const filterByPeriod = (txs, period) => {
  const from = periodStart(period);
  const to = endOfToday();
  return txs.filter((t) => {
    const d = new Date(t.date);
    return d >= from && d <= to;
  });
};

export const totals = (txs) => {
  const r = txs.reduce(
    (a, t) => {
      if (t.type === 'income') a.income += t.amount;
      else a.expense += t.amount;
      return a;
    },
    { income: 0, expense: 0 }
  );
  r.balance = r.income - r.expense;
  return r;
};

export const sortByDateDesc = (txs) => [...txs].sort((a, b) => new Date(b.date) - new Date(a.date));

export const monthLabel = (iso) => {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

// Month-wise grouping for SectionList
export const groupByMonth = (txs) => {
  const map = new Map();
  sortByDateDesc(txs).forEach((t) => {
    const key = monthLabel(t.date);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(t);
  });
  return Array.from(map, ([title, data]) => ({ title, data, total: totals(data) }));
};

const sumBetween = (txs, from, to) =>
  totals(txs.filter((t) => {
    const d = new Date(t.date);
    return d >= from && d < to;
  }));

// Buckets for the Income & Expenses bar chart
export const chartData = (txs, period) => {
  const now = new Date();
  const out = [];
  if (period === 'Daily') {
    for (let i = 6; i >= 0; i--) {
      const from = startOfDay(now);
      from.setDate(from.getDate() - i);
      const to = new Date(from);
      to.setDate(to.getDate() + 1);
      out.push({ label: DAYS[from.getDay()], ...sumBetween(txs, from, to) });
    }
  } else if (period === 'Weekly') {
    for (let i = 3; i >= 0; i--) {
      const to = startOfDay(now);
      to.setDate(to.getDate() + 1 - i * 7);
      const from = new Date(to);
      from.setDate(from.getDate() - 7);
      out.push({ label: `Wk ${4 - i}`, ...sumBetween(txs, from, to) });
    }
  } else if (period === 'Monthly') {
    for (let i = 5; i >= 0; i--) {
      const from = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const to = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      out.push({ label: SHORT_MONTHS[from.getMonth()], ...sumBetween(txs, from, to) });
    }
  } else {
    for (let i = 3; i >= 0; i--) {
      const y = now.getFullYear() - i;
      out.push({ label: String(y), ...sumBetween(txs, new Date(y, 0, 1), new Date(y + 1, 0, 1)) });
    }
  }
  return out;
};

export const categoryBreakdown = (txs) => {
  const exp = txs.filter((t) => t.type === 'expense');
  const total = exp.reduce((s, t) => s + t.amount, 0) || 1;
  const map = {};
  exp.forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount, pct: Math.round((amount / total) * 100) }))
    .sort((a, b) => b.amount - a.amount);
};

export const sectionTitleForDay = (iso) => {
  const d = startOfDay(new Date(iso));
  const today = startOfDay(new Date());
  const diff = Math.round((today - d) / 86400000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return 'This Week';
  return 'Earlier';
};
