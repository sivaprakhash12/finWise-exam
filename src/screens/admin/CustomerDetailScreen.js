import React from 'react';
import { View } from 'react-native';
import Screen from '../../components/Screen';
import { EmptyState, T } from '../../components/UI';
import { BalanceSummary, TransactionItem } from '../../components/Finance';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { groupByMonth, totals } from '../../utils/reports';

export default function CustomerDetailScreen({ route }) {
  const { customers, customerTransactions } = useApp();
  const c = customers.find((x) => x.id === route.params.id);
  if (!c) return null;
  const tx = customerTransactions.filter((t) => t.userId === c.id);
  const s = totals(tx);

  return (
    <Screen header={{ title: c.name, left: 'back' }} top={<BalanceSummary balance={s.balance} expense={s.expense} budget={c.budget} />}>
      <View style={{ backgroundColor: COLORS.lightGreen, borderRadius: 20, padding: 14, marginBottom: 18 }}>
        <T style={{ fontSize: 13 }}>Email: {c.email}</T>
        <T style={{ fontSize: 13 }}>Mobile: {c.mobile}</T>
        <T style={{ fontSize: 13 }}>Customer ID: {c.id}</T>
      </View>
      {tx.length === 0 ? <EmptyState text="This customer has no transactions yet." /> : null}
      {groupByMonth(tx).map((sec) => (
        <View key={sec.title}>
          <T weight="medium" style={{ fontSize: 15, marginBottom: 12 }}>{sec.title}</T>
          {sec.data.map((t) => <TransactionItem key={t.id} item={t} />)}
        </View>
      ))}
    </Screen>
  );
}
