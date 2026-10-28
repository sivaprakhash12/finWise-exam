import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import { Button, Input, Segmented, T } from '../../components/UI';
import { COLORS } from '../../theme';
import { useApp } from '../../context/AppContext';
import { ADMIN_ACCESS_CODE, isEmail, isMobile, isName, validatePassword } from '../../utils/validation';
import { parseDate } from '../../utils/format';

export default function SignUpScreen({ navigation, route }) {
  const { signup } = useApp();
  const [role, setRole] = useState(route.params?.role === 'admin' ? 'Admin' : 'Customer');
  const [f, setF] = useState({ name: '', email: '', mobile: '', dob: '', password: '', confirm: '', code: '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const onDob = (v) => {
    // auto insert slashes -> DD/MM/YYYY
    const d = v.replace(/\D/g, '').slice(0, 8);
    let out = d;
    if (d.length > 4) out = `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
    else if (d.length > 2) out = `${d.slice(0, 2)}/${d.slice(2)}`;
    set('dob')(out);
  };

  const submit = () => {
    const e = {};
    if (!isName(f.name)) e.name = 'Enter your full name (letters only, min 3)';
    if (!isEmail(f.email)) e.email = 'Enter a valid email address';
    if (!isMobile(f.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    const dob = parseDate(f.dob);
    if (!dob) e.dob = 'Enter date of birth as DD/MM/YYYY';
    else {
      const age = (Date.now() - dob.getTime()) / (365.25 * 86400000);
      if (age < 13) e.dob = 'You must be at least 13 years old';
      if (age > 100) e.dob = 'Enter a valid date of birth';
    }
    const pw = validatePassword(f.password);
    if (pw) e.password = pw;
    if (!f.confirm) e.confirm = 'Confirm your password';
    else if (f.confirm !== f.password) e.confirm = 'Passwords do not match';
    if (role === 'Admin' && f.code.trim() !== ADMIN_ACCESS_CODE) e.code = 'Invalid admin access code';
    setErrors(e);
    if (Object.keys(e).length) return;

    const res = signup({ ...f, role: role.toLowerCase() });
    if (!res.ok) return setErrors({ email: res.error });
    Alert.alert('Account created', `Welcome ${f.name.trim().split(' ')[0]}! Log in with your new ${role.toLowerCase()} account.`, [
      { text: 'Log In', onPress: () => navigation.replace('Login', { role: role.toLowerCase(), email: f.email.trim() }) },
    ]);
  };

  return (
    <Screen header={{ title: 'Create Account', left: 'back', right: null, large: true }}>
      <Segmented options={['Customer', 'Admin']} value={role} onChange={setRole} style={{ marginTop: 0, marginBottom: 18 }} />
      <Input label="Full Name" placeholder="John Smith" value={f.name} onChangeText={set('name')} error={errors.name} />
      <Input label="Email" placeholder="example@example.com" value={f.email} onChangeText={set('email')}
        autoCapitalize="none" keyboardType="email-address" error={errors.email} />
      <Input label="Mobile Number" placeholder="9876543210" value={f.mobile} onChangeText={(v) => set('mobile')(v.replace(/\D/g, '').slice(0, 10))}
        keyboardType="phone-pad" error={errors.mobile} />
      <Input label="Date Of Birth" placeholder="DD / MM / YYYY" value={f.dob} onChangeText={onDob} keyboardType="number-pad" error={errors.dob} />
      <Input label="Password" placeholder="● ● ● ● ● ● ● ●" value={f.password} onChangeText={set('password')} secure error={errors.password} />
      <Input label="Confirm Password" placeholder="● ● ● ● ● ● ● ●" value={f.confirm} onChangeText={set('confirm')} secure error={errors.confirm} />
      {role === 'Admin' ? (
        <Input label="Admin Access Code" placeholder="Provided by your organisation" value={f.code} onChangeText={set('code')}
          autoCapitalize="characters" error={errors.code} />
      ) : null}

      <T style={styles.terms}>By continuing, you agree to{'\n'}<T weight="semibold" style={{ fontSize: 12 }}>Terms of Use and Privacy Policy.</T></T>
      <Button title="Sign Up" onPress={submit} style={{ width: 210 }} />
      <T style={styles.footer}>
        Already have an account?{' '}
        <T style={{ color: COLORS.blue, fontSize: 13 }} onPress={() => navigation.replace('Login', { role: role.toLowerCase() })}>Log In</T>
      </T>
    </Screen>
  );
}


const styles = StyleSheet.create({
  terms: { textAlign: 'center', fontSize: 12, marginVertical: 12 },
  footer: { textAlign: 'center', fontSize: 13, marginTop: 14 },
});
