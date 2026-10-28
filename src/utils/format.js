import { CURRENCY } from '../theme';

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const SHORT_MONTHS = MONTHS.map((m) => m.slice(0, 3));
export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pad = (v) => String(v).padStart(2, '0');

export const money = (value, { sign = false } = {}) => {
  const n = Number(value) || 0;
  const body = Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const prefix = n < 0 || sign ? '-' : '';
  return `${prefix}${CURRENCY}${body}`;
};

export const shortMoney = (v) => {
  if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
  return String(Math.round(v));
};

export const formatDate = (iso) => {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export const formatTimeDate = (iso) => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())} - ${MONTHS[d.getMonth()]} ${d.getDate()}`;
};

export const formatTime = (iso) => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const longDate = (d = new Date()) => `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;

// "DD/MM/YYYY" -> Date (or null when invalid)
export const parseDate = (str) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((str || '').trim());
  if (!m) return null;
  const day = +m[1];
  const mon = +m[2] - 1;
  const yr = +m[3];
  const d = new Date(yr, mon, day);
  if (d.getFullYear() !== yr || d.getMonth() !== mon || d.getDate() !== day) return null;
  return d;
};

export const firstName = (name = '') => name.trim().split(' ')[0] || 'there';

export const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => (p[0] || '').toUpperCase()).join('') || 'U';

export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};
