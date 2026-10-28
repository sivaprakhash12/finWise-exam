import React from 'react';
import { View } from 'react-native';
import Screen from '../../components/Screen';
import { Logo, T } from '../../components/UI';
import { COLORS } from '../../theme';

const Row = ({ title, text }) => (
  <View style={{ marginBottom: 14 }}>
    <T weight="semibold" style={{ fontSize: 15 }}>{title}</T>
    <T style={{ fontSize: 13 }}>{text}</T>
  </View>
);

export default function AboutScreen() {
  return (
    <Screen header={{ title: 'About FinWise', right: null }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Logo size={80} />
        <T weight="semibold" style={{ fontSize: 28, color: COLORS.primary }}>FinWise</T>
        <T style={{ fontSize: 12, color: COLORS.grey }}>Finance Budget Tracker · v1.0.0</T>
      </View>
      <Row title="Users" text="Admin – dashboard, analysis of all customers, customer list. Customer – home reports, analysis, month-wise transactions, categories, profile." />
      <Row title="Navigation" text="Stack (auth flow, category → details → add), Bottom Tabs (main sections) and Drawer (side menu) are combined." />
      <Row title="Alerts" text="Every add, edit or delete of a transaction shows a personalised alert and is saved under Notifications." />
      <Row title="Reports" text="Home screen shows Daily, Weekly and Monthly income / expense reports." />
      <Row title="Data" text="No backend or database – data is kept in memory for the session." />
    </Screen>
  );
}
