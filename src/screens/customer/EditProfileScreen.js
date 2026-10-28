import React, { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import Screen from '../../components/Screen';
import { Button, Input, T } from '../../components/UI';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { isEmail, isMobile, isName } from '../../utils/validation';
import { Avatar } from './ProfileScreen';

// Part I – 3. Edit profile screen (customer only)
export default function EditProfileScreen({ navigation }) {
  const { currentUser, updateProfile } = useApp();
  const [f, setF] = useState({
    name: currentUser.name, mobile: currentUser.mobile, email: currentUser.email, budget: String(currentUser.budget || 20000),
    pushNotifications: currentUser.pushNotifications, darkTheme: currentUser.darkTheme,
  });
  const [errors, setErrors] = useState({});
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    const e = {};
    if (!isName(f.name)) e.name = 'Enter a valid name (letters only, min 3)';
    if (!isMobile(f.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    if (!isEmail(f.email)) e.email = 'Enter a valid email address';
    if (!/^\d+$/.test(f.budget) || Number(f.budget) < 100) e.budget = 'Budget must be a whole number of at least 100';
    setErrors(e);
    if (Object.keys(e).length) return;
    const res = updateProfile({ ...f, name: f.name.trim(), email: f.email.trim(), budget: Number(f.budget) });
    if (!res.ok) return setErrors({ email: res.error });
    if (navigation.canGoBack()) navigation.goBack();
    else if (currentUser.role === 'admin') navigation.navigate('AdminTabs');
    else navigation.navigate('MainTabs');
  };

  return (
    <Screen header={{ title: 'Edit My Profile', left: 'back' }} top={<View style={{ height: 50 }} />}
      floating={<Avatar name={f.name || currentUser.name} />} contentStyle={{ paddingTop: 66 }}>
      <T weight="bold" style={{ fontSize: 20, textAlign: 'center' }}>{f.name || currentUser.name}</T>
      <T style={{ fontSize: 13, textAlign: 'center', marginBottom: 18 }}>ID: {currentUser.id}</T>

      <T weight="semibold" style={{ fontSize: 18, marginBottom: 12 }}>Account Settings</T>
      <Input label="Username" value={f.name} onChangeText={set('name')} error={errors.name} />
      <Input label="Phone" value={f.mobile} onChangeText={(v) => set('mobile')(v.replace(/\D/g, '').slice(0, 10))} keyboardType="phone-pad" error={errors.mobile} />
      <Input label="Email Address" value={f.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" error={errors.email} />
      <Input label="Monthly Budget ($)" value={f.budget} onChangeText={(v) => set('budget')(v.replace(/\D/g, ''))} keyboardType="number-pad" error={errors.budget} />

      <View style={styles.toggle}>
        <T weight="medium" style={{ fontSize: 15 }}>Push Notifications</T>
        <Switch value={f.pushNotifications} onValueChange={set('pushNotifications')}
          trackColor={{ true: COLORS.primary, false: COLORS.lightGreen }} thumbColor={COLORS.white} />
      </View>
      <View style={styles.toggle}>
        <T weight="medium" style={{ fontSize: 15 }}>Turn Dark Theme</T>
        <Switch value={f.darkTheme} onValueChange={set('darkTheme')}
          trackColor={{ true: COLORS.primary, false: COLORS.lightGreen }} thumbColor={COLORS.white} />
      </View>

      <Button title="Update Profile" onPress={save} style={{ width: 210, marginTop: 16 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6, paddingHorizontal: 4 },
});
