import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Button, Logo, Segmented, T } from '../../components/UI';
import { COLORS } from '../../theme';

// Part I – 1. Home screen with Sign up & Sign in options for Admin and Customer
export default function WelcomeScreen({ navigation }) {
  const [role, setRole] = useState('Customer');
  const r = role.toLowerCase();
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.center}>
        <View style={styles.logoBadge}>
          <Logo color={COLORS.primary} size={88} />
        </View>
        <T weight="bold" style={styles.brand}>FinWise<T style={{ color: COLORS.primary }}>.</T></T>
        <T style={styles.tagline}>Intelligent wealth management, budgeting & enterprise analytics in real time.</T>

        <View style={styles.actionCard}>
          <T weight="semibold" style={styles.continue}>Select Profile Role</T>
          <Segmented options={['Customer', 'Admin']} value={role} onChange={setRole} style={{ width: '100%', marginTop: 8 }} />

          <Button title="Log In" onPress={() => navigation.navigate('Login', { role: r })} style={{ width: '100%', marginTop: 14 }} />
          <Button title="Create Account" variant="secondary" onPress={() => navigation.navigate('SignUp', { role: r })} style={{ width: '100%', marginTop: 12 }} />
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ marginTop: 16 }}>
            <T weight="semibold" style={{ fontSize: 13, color: COLORS.headerMuted }}>Forgot Password?</T>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.headerBg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  logoBadge: {
    width: 96, height: 96, borderRadius: 32,
    backgroundColor: 'rgba(0, 208, 158, 0.12)', borderWidth: 1.5, borderColor: 'rgba(0, 208, 158, 0.35)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
  },
  brand: { fontSize: 44, color: COLORS.white, letterSpacing: -0.5, marginTop: 14 },
  tagline: { fontSize: 13, textAlign: 'center', color: COLORS.headerMuted, marginTop: 6, marginBottom: 28, lineHeight: 20 },
  actionCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 6,
  },
  continue: { fontSize: 13, color: COLORS.white, letterSpacing: 0.3 },
});
