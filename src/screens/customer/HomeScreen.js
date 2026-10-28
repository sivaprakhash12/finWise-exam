import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import { EmptyState, Segmented, T } from '../../components/UI';
import { BalanceSummary, ReportCard, TransactionItem } from '../../components/Finance';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { firstName, greeting, longDate, money } from '../../utils/format';
import { filterByPeriod, periodStart, totals } from '../../utils/reports';

export default function HomeScreen({ navigation }) {
  const { currentUser, myTransactions } = useApp();
  const [period, setPeriod] = useState('Monthly');

  const all = totals(myTransactions);
  const month = totals(filterByPeriod(myTransactions, 'Monthly'));
  const week = filterByPeriod(myTransactions, 'Weekly');
  const revenueWeek = totals(week).income;
  const foodWeek = week.filter((t) => t.category === 'Food' && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = myTransactions.filter((t) => t.category === 'Savings').reduce((s, t) => s + t.amount, 0);
  const savingsPct = Math.min(100, Math.round((savings / 2000) * 100));

  // Part III (iii) – daily / weekly / monthly report
  const periodTx = filterByPeriod(myTransactions, period);
  const rep = totals(periodTx);
  const dateText = period === 'Daily' ? longDate() : `${longDate(periodStart(period))} – ${longDate()}`;

  return (
    <Screen
      header={{ title: 'Hi, Welcome Back', subtitle: `${greeting()}, ${firstName(currentUser.name)}`, align: 'left' }}
      top={<BalanceSummary balance={all.balance} expense={month.expense} budget={currentUser.budget} />}
    >
      <View style={styles.goal}>
        <View style={styles.goalLeft}>
          <View style={styles.ring}>
            <Ionicons name="car-sport-outline" size={26} color={COLORS.primaryDark} />
          </View>
          <T weight="bold" style={styles.goalText}>Goal Savings</T>
          <View style={styles.percentBadge}>
            <T weight="bold" style={{ fontSize: 11, color: COLORS.primaryDark }}>{savingsPct}% achieved</T>
          </View>
        </View>
        <View style={styles.goalDivider} />
        <View style={{ flex: 1.3, justifyContent: 'center' }}>
          <View style={styles.goalRow}>
            <View style={[styles.statIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="trending-up-outline" size={18} color={COLORS.primaryDark} />
            </View>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <T style={{ fontSize: 11, color: COLORS.grey }}>Revenue Last Week</T>
              <T weight="bold" style={{ fontSize: 15, color: COLORS.dark }}>{money(revenueWeek)}</T>
            </View>
          </View>
          <View style={styles.hline} />
          <View style={styles.goalRow}>
            <View style={[styles.statIcon, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="restaurant-outline" size={18} color={COLORS.danger} />
            </View>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <T style={{ fontSize: 11, color: COLORS.grey }}>Food Expenses</T>
              <T weight="bold" style={{ fontSize: 15, color: COLORS.danger }}>{money(-foodWeek)}</T>
            </View>
          </View>
        </View>
      </View>

      <Segmented options={['Daily', 'Weekly', 'Monthly']} value={period} onChange={setPeriod} style={{ marginTop: 20, marginBottom: 16 }} />
      <ReportCard period={period} income={rep.income} expense={rep.expense} count={periodTx.length} dateText={dateText} />

      <T weight="bold" style={{ fontSize: 17, color: COLORS.dark, marginBottom: 14 }}>Transactions</T>
      {periodTx.length ? (
        periodTx.map((t) => (
          <TransactionItem key={t.id} item={t}
            onPress={() => navigation.navigate('TransactionsTab', { screen: 'AddTransaction', params: { transaction: t } })} />
        ))
      ) : (
        <EmptyState text={`No transactions recorded in this ${period.toLowerCase()} period.`} action="Record Expense"
          onAction={() => navigation.navigate('TransactionsTab', { screen: 'AddTransaction' })} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  goal: {
    backgroundColor: COLORS.card, borderRadius: 24, padding: 18, flexDirection: 'row',
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  goalLeft: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: 66, height: 66, borderRadius: 33, borderWidth: 4, borderColor: '#ECFDF5',
    borderTopColor: COLORS.primary, borderRightColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  goalText: { textAlign: 'center', fontSize: 13, marginTop: 8, color: COLORS.dark },
  percentBadge: { backgroundColor: '#ECFDF5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  goalDivider: { width: 1, backgroundColor: '#F1F5F9', marginHorizontal: 14 },
  goalRow: { flexDirection: 'row', alignItems: 'center' },
  statIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  hline: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
});
