export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test((v || '').trim());
export const isMobile = (v) => /^[6-9]\d{9}$/.test((v || '').trim());
export const isName = (v) => /^[A-Za-z][A-Za-z .']{2,39}$/.test((v || '').trim());
export const isAmount = (v) => /^\d+(\.\d{1,2})?$/.test((v || '').trim()) && Number(v) > 0;

// Admin sign-up needs this code (no backend, so it is kept in the app)
export const ADMIN_ACCESS_CODE = 'ADMIN2026';

export const validatePassword = (v) => {
  if (!v) return 'Password is required';
  if (v.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Use at least one letter and one number';
  return '';
};
