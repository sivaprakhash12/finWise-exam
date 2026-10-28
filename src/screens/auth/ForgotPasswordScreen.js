import React, { useState } from 'react';
import { Alert } from 'react-native';
import Screen from '../../components/Screen';
import { Button, Input, T } from '../../components/UI';
import { useApp } from '../../context/AppContext';
import { isEmail } from '../../utils/validation';

export default function ForgotPasswordScreen({ navigation }) {
  const { resetPasswordExists } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!isEmail(email)) return setError('Enter a valid email address');
    if (!resetPasswordExists(email)) return setError('No account found with this email');
    setError('');
    Alert.alert('Check your email', `A password reset link has been sent to ${email.trim()} (demo – no backend).`, [
      { text: 'Back to Log In', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <Screen header={{ title: 'Forgot Password', left: 'back', right: null, large: true }}>
      <T weight="semibold" style={{ fontSize: 20, marginBottom: 8 }}>Reset Password?</T>
      <T style={{ fontSize: 14, marginBottom: 24 }}>Enter the email linked to your account and we will send you a reset link.</T>
      <Input label="Enter Email Address" placeholder="example@example.com" value={email} onChangeText={setEmail}
        autoCapitalize="none" keyboardType="email-address" error={error} />
      <Button title="Next Step" onPress={submit} style={{ width: 210, marginTop: 20 }} />
      <Button title="Sign Up" variant="secondary" onPress={() => navigation.navigate('SignUp')} style={{ width: 210, marginTop: 40 }} />
    </Screen>
  );
}
