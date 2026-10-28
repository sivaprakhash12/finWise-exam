import React, { useState } from 'react';
import Screen from '../../components/Screen';
import { Button, Input, T } from '../../components/UI';
import { useApp } from '../../context/AppContext';
import { validatePassword } from '../../utils/validation';

export default function SecurityScreen({ navigation }) {
  const { changePassword } = useApp();
  const [f, setF] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    const e = {};
    if (!f.current) e.current = 'Enter your current password';
    const pw = validatePassword(f.next);
    if (pw) e.next = pw;
    else if (f.next === f.current) e.next = 'New password must be different';
    if (f.confirm !== f.next) e.confirm = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length) return;
    const res = changePassword(f.current, f.next);
    if (!res.ok) return setErrors({ current: res.error });
    navigation.goBack();
  };

  return (
    <Screen header={{ title: 'Change Password', left: 'back' }}>
      <T style={{ fontSize: 14, marginBottom: 20 }}>Use at least 6 characters with a letter and a number.</T>
      <Input label="Current Password" secure value={f.current} onChangeText={set('current')} error={errors.current} />
      <Input label="New Password" secure value={f.next} onChangeText={set('next')} error={errors.next} />
      <Input label="Confirm New Password" secure value={f.confirm} onChangeText={set('confirm')} error={errors.confirm} />
      <Button title="Change Password" onPress={save} style={{ width: 230, marginTop: 20 }} />
    </Screen>
  );
}
