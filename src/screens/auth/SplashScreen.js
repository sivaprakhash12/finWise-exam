import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Logo } from '../../components/UI';
import { COLORS, FONTS } from '../../theme';

export default function SplashScreen({ fontsLoaded }) {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.badge}>
        <Logo color={COLORS.primary} size={90} />
      </View>
      <Text style={[styles.brand, fontsLoaded && { fontFamily: FONTS.bold }]}>FinWise<Text style={{ color: COLORS.primary }}>.</Text></Text>
      <Text style={styles.sub}>Enterprise Wealth & Budget Intelligence</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.headerBg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  badge: {
    width: 104, height: 104, borderRadius: 36,
    backgroundColor: 'rgba(0, 208, 158, 0.12)', borderWidth: 1.5, borderColor: 'rgba(0, 208, 158, 0.35)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
  },
  brand: { fontSize: 44, color: COLORS.white, marginTop: 18, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: 13, color: COLORS.headerMuted, marginTop: 6, letterSpacing: 0.5 },
});
