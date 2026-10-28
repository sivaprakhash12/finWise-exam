import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import { EmptyState, Segmented, T } from '../../components/UI';
import { ReportCard, TransactionItem } from '../../components/Finance';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { firstName, greeting, longDate, money } from '../../utils/format';
import { categoryBreakdown, filterByPeriod, periodStart, totals } from '../../utils/reports';

// Admin home – reports daily / weekly / monthly across every customer
export default function AdminDashboardScreen() {
  const { currentUser, customers, customerTransactions } = useApp();
  const [period, setPeriod] = useState('Monthly');
  const all = totals(customerTransactions);
  const periodTx = filterByPeriod(customerTransactions, period);
  const rep = totals(periodTx);
  const top = categoryBreakdown(periodTx)[0];
  const nameOf = (id) => firstName(customers.find((c) => c.id === id)?.name);
  const dateText = period === 'Daily' ? longDate() : `${longDate(periodStart(period))} – ${longDate()}`;

  const summary = (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <T style={{ fontSize: 12, color: COLORS.headerMuted }}>Total Customers</T>
        <T weight="bold" style={{ fontSize: 28, color: COLORS.white, marginTop: 2 }}>{customers.length}</T>
      </View>
      <View style={{ width: 1, height: 44, backgroundColor: 'rgba(255, 255, 255, 0.15)', marginHorizontal: 4 }} />
      <View style={{ flex: 1.4, paddingLeft: 16 }}>
        <T style={{ fontSize: 12, color: COLORS.headerMuted }}>Combined Balance</T>
        <T weight="bold" style={{ fontSize: 24, color: COLORS.white, marginTop: 2 }} numberOfLines={1} adjustsFontSizeToFit>{money(all.balance)}</T>
        <T style={{ fontSize: 12, color: '#FCA5A5', marginTop: 1 }}>Spent {money(all.expense)}</T>
      </View>
    </View>
  );

  return (
    <Screen header={{ title: `Hi, ${currentUser.name}`, subtitle: `${greeting()} · Executive Admin Portal`, align: 'left' }} top={summary}>
      <View style={styles.cards}>
        <Mini icon="people-outline" label="Active this month"
          value={String(new Set(filterByPeriod(customerTransactions, 'Monthly').map((t) => t.userId)).size)} />
        <View style={styles.cardDivider} />
        <Mini icon="pricetags-outline" label={`Top category (${period})`} value={top ? top.category : '—'} />
      </View>

      <Segmented options={['Daily', 'Weekly', 'Monthly']} value={period} onChange={setPeriod} style={{ marginTop: 18, marginBottom: 16 }} />
      <ReportCard period={period} income={rep.income} expense={rep.expense} count={periodTx.length} dateText={dateText} />

      <T weight="bold" style={{ fontSize: 17, color: COLORS.dark, marginBottom: 14 }}>Recent Customer Transactions</T>
      {periodTx.length ? periodTx.slice(0, 15).map((t) => <TransactionItem key={t.id} item={t} middle={nameOf(t.userId)} />)
        : <EmptyState text={`No customer activity recorded in this ${period.toLowerCase()} cycle.`} />}
    </Screen>
  );
}

const Mini = ({ icon, label, value }) => (
  <View style={styles.mini}>
    <View style={styles.miniIcon}>
      <Ionicons name={icon} size={22} color={COLORS.primaryDark} />
    </View>
    <T style={{ fontSize: 12, color: COLORS.grey, marginTop: 8 }}>{label}</T>
    <T weight="bold" style={{ fontSize: 17, color: COLORS.dark, marginTop: 2 }}>{value}</T>
  </View>
);

const styles = StyleSheet.create({
  cards: {
    flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 22, padding: 18,
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  cardDivider: { width: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },
  mini: { flex: 1, alignItems: 'center' },
  miniIcon: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: '#ECFDF5',
    alignItems: 'center', justifyContent: 'center',
  },
});
