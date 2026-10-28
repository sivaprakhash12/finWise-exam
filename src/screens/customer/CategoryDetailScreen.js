import React from 'react';
import { Alert, View } from 'react-native';
import Screen from '../../components/Screen';
import { Button, EmptyState, T } from '../../components/UI';
import { BalanceSummary, TransactionItem } from '../../components/Finance';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { money } from '../../utils/format';
import { groupByMonth, totals } from '../../utils/reports';

// Part I – 6. Category details screen
export default function CategoryDetailScreen({ navigation, route }) {
  const { category } = route.params;
  const { myTransactions, currentUser, deleteTransaction } = useApp();
  const list = myTransactions.filter((t) => t.category === category);
  const all = totals(myTransactions);
  const cat = totals(list);
  const sections = groupByMonth(list);

  const confirmDelete = (t) =>
    Alert.alert('Delete transaction', `Delete "${t.title}" (${money(t.amount)})?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(t.id) },
    ]);

  return (
    <Screen
      header={{ title: category, left: 'back' }}
      top={<BalanceSummary balance={all.balance} expense={cat.expense} expenseLabel={`${category} Spent`} budget={currentUser.budget} />}
      footer={
        <View style={{ paddingVertical: 14, backgroundColor: COLORS.honeydew }}>
          <Button title="Add Expenses" icon="add" onPress={() => navigation.navigate('AddTransaction', { category })} style={{ width: 210 }} />
        </View>
      }
    >
      {sections.length === 0 ? (
        <EmptyState icon="file-tray-outline" text={`No ${category} transactions yet. Add your first one below.`} />
      ) : (
        sections.map((s) => (
          <View key={s.title}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <T weight="medium" style={{ fontSize: 15 }}>{s.title.split(' ')[0]}</T>
              <T style={{ fontSize: 12, color: COLORS.blue }}>{money(-(s.total.expense - s.total.income))}</T>
            </View>
            {s.data.map((t) => (
              <TransactionItem key={t.id} item={t} middle={t.type === 'income' ? 'Income' : 'Expense'}
                onPress={() => navigation.navigate('AddTransaction', { transaction: t })}
                onLongPress={() => confirmDelete(t)} />
            ))}
          </View>
        ))
      )}
    </Screen>
  );
}
