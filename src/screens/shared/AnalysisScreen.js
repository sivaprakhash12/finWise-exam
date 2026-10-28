import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import { Segmented, T } from '../../components/UI';
import { BalanceSummary, BarChart, ProgressRing } from '../../components/Finance';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { money } from '../../utils/format';
import { categoryBreakdown, chartData, filterByPeriod, totals } from '../../utils/reports';

// Part I – 2. Analysis screen (Admin sees all customers, Customer sees own data)
export default function AnalysisScreen() {
  const { isAdmin, myTransactions, customerTransactions, currentUser, customers } = useApp();
  const [period, setPeriod] = useState('Daily');
  const txs = isAdmin ? customerTransactions : myTransactions;

  const all = totals(txs);
  const month = totals(filterByPeriod(txs, 'Monthly'));
  const inPeriod = filterByPeriod(txs, period);
  const p = totals(inPeriod);
  const breakdown = categoryBreakdown(inPeriod).slice(0, 5);

  let targets;
  if (isAdmin) {
    const activeIds = new Set(filterByPeriod(txs, 'Monthly').map((t) => t.userId));
    targets = [
      { label: 'Active Users', pct: customers.length ? (activeIds.size / customers.length) * 100 : 0 },
      { label: 'Spend Ratio', pct: month.income ? (month.expense / month.income) * 100 : 0 },
    ];
  } else {
    const saved = txs.filter((t) => t.category === 'Savings').reduce((s, t) => s + t.amount, 0);
    targets = [
      { label: 'Savings Goal', pct: (saved / 2000) * 100 },
      { label: 'Budget Used', pct: (month.expense / (currentUser.budget || 1)) * 100 },
    ];
  }

  return (
    <Screen header={{ title: 'Analysis', subtitle: isAdmin ? 'All customers' : undefined }}
      top={<BalanceSummary balance={all.balance} expense={month.expense} budget={isAdmin ? null : currentUser.budget} />}>
      <Segmented options={['Daily', 'Weekly', 'Monthly', 'Year']} value={period} onChange={setPeriod} style={{ marginTop: 0, marginBottom: 20 }} />
      <BarChart data={chartData(txs, period)} />

      <View style={styles.summary}>
        <View style={styles.sumItem}>
          <View style={[styles.sumIcon, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="arrow-up-circle-outline" size={24} color={COLORS.primaryDark} />
          </View>
          <T style={{ fontSize: 12, color: COLORS.grey, marginTop: 6 }}>Total Inflow</T>
          <T weight="bold" style={{ fontSize: 18, color: COLORS.success, marginTop: 2 }}>{money(p.income)}</T>
        </View>
        <View style={styles.sumDivider} />
        <View style={styles.sumItem}>
          <View style={[styles.sumIcon, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="arrow-down-circle-outline" size={24} color={COLORS.danger} />
          </View>
          <T style={{ fontSize: 12, color: COLORS.grey, marginTop: 6 }}>Total Outflow</T>
          <T weight="bold" style={{ fontSize: 18, color: COLORS.danger, marginTop: 2 }}>{money(p.expense)}</T>
        </View>
      </View>

      <T weight="bold" style={styles.h}>{isAdmin ? 'Enterprise Targets' : 'Portfolio Targets'}</T>
      <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
        {targets.map((t) => <ProgressRing key={t.label} percent={t.pct} label={t.label} />)}
      </View>

      <T weight="bold" style={styles.h}>Top Spending ({period})</T>
      {breakdown.length === 0 ? <T style={{ color: COLORS.grey, fontSize: 13 }}>No expenses recorded in this period.</T> : null}
      <View style={styles.breakdownCard}>
        {breakdown.map((b, idx) => (
          <View key={b.category} style={[styles.breakdownRow, idx > 0 && { marginTop: 14 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <T weight="semibold" style={{ fontSize: 14, color: COLORS.dark }}>{b.category}</T>
              <T weight="bold" style={{ fontSize: 13, color: COLORS.dark }}>{money(b.amount)} <T style={{ color: COLORS.grey, fontSize: 11 }}>({b.pct}%)</T></T>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.min(100, Math.max(8, b.pct))}%` }]} />
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 22, padding: 18,
    borderWidth: 1, borderColor: '#E2E8F0', marginTop: 16,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  sumItem: { flex: 1, alignItems: 'center' },
  sumDivider: { width: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },
  sumIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  h: { fontSize: 16, color: COLORS.dark, marginTop: 24, marginBottom: 14 },
  breakdownCard: {
    backgroundColor: COLORS.card, borderRadius: 22, padding: 18,
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  breakdownRow: { width: '100%' },
  track: { height: 8, borderRadius: 4, backgroundColor: '#F1F5F9', overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
});
