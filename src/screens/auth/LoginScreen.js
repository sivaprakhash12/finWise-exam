import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import { Button, Input, Segmented, T } from '../../components/UI';
import { COLORS } from '../../theme';
import { useApp } from '../../context/AppContext';
import { isEmail } from '../../utils/validation';

export default function LoginScreen({ navigation, route }) {
  const { login } = useApp();
  const [role, setRole] = useState(route.params?.role === 'admin' ? 'Admin' : 'Customer');
  const [email, setEmail] = useState(route.params?.email || '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!email.trim()) e.email = 'Enter your username or email';
    else if (email.includes('@') && !isEmail(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Enter your password';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    if (Object.keys(e).length) return;
    const res = login(email, password, role.toLowerCase());
    if (!res.ok) setErrors({ form: res.error });
  };

  const demo = role === 'Admin' ? 'sivaprakhash or admin / admin123' : 'john@finwise.com / john123';

  return (
    <Screen
      header={{ title: 'Welcome', left: 'back', right: null }}
      top={
        <View style={{ paddingBottom: 8 }}>
          <T weight="bold" style={{ fontSize: 22, color: COLORS.white }}>Sign in to FinWise</T>
          <T style={{ fontSize: 13, color: COLORS.headerMuted, marginTop: 3 }}>
            {role === 'Admin' ? 'Enterprise administrator control portal' : 'Personal wealth & financial management'}
          </T>
        </View>
      }
    >
      <Segmented options={['Customer', 'Admin']} value={role} onChange={(v) => { setRole(v); setErrors({}); }} style={{ marginTop: 0, marginBottom: 20 }} />
      <Input label="Username Or Email" placeholder={role === 'Admin' ? 'sivaprakhash or admin' : 'example@example.com'} value={email} onChangeText={setEmail}
        autoCapitalize="none" keyboardType="email-address" error={errors.email} />
      <Input label="Password" placeholder="● ● ● ● ● ● ● ●" value={password} onChangeText={setPassword} secure error={errors.password} />
      {errors.form ? <T style={styles.formError}>{errors.form}</T> : null}

      <Button title="Log In" onPress={submit} style={{ width: '100%', marginTop: 8 }} />
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'center', marginVertical: 14 }}>
        <T weight="bold" style={{ fontSize: 13, color: COLORS.primaryDark }}>Forgot Password?</T>
      </TouchableOpacity>
      <Button title="Create New Account" variant="secondary" onPress={() => navigation.navigate('SignUp', { role: role.toLowerCase() })} style={{ width: '100%' }} />

      <T style={styles.or}>or continue with</T>
      <View style={styles.social}>
        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
          <Ionicons name="logo-google" size={22} color={COLORS.dark} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialBtn, { marginLeft: 16 }]} activeOpacity={0.8}>
          <Ionicons name="logo-apple" size={24} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      <View style={styles.demoCard}>
        <Ionicons name="key-outline" size={15} color={COLORS.primaryDark} style={{ marginRight: 6 }} />
        <T weight="medium" style={styles.demo}>Demo: <T weight="bold" style={{ color: COLORS.dark }}>{demo}</T></T>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  formError: { color: COLORS.danger, textAlign: 'center', fontSize: 13, marginTop: 2, marginBottom: 6 },
  or: { textAlign: 'center', fontSize: 12, color: COLORS.grey, marginTop: 20 },
  social: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  socialBtn: {
    width: 52, height: 50, borderRadius: 16, backgroundColor: COLORS.white,
    borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  demoCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: 'rgba(0, 208, 158, 0.3)',
    borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, marginTop: 24,
  },
  demo: { fontSize: 12, color: COLORS.darkMuted },
});
