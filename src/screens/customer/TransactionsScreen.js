import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import { Chip, EmptyState, T } from '../../components/UI';
import { TransactionItem } from '../../components/Finance';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { MONTHS, money } from '../../utils/format';
import { groupByMonth, totals } from '../../utils/reports';

// Part I – 4. Transaction (month wise) screen
export default function TransactionsScreen({ navigation }) {
  const { myTransactions, deleteTransaction } = useApp();
  const [type, setType] = useState('all'); // all | income | expense
  const [month, setMonth] = useState('All');

  const all = totals(myTransactions);
  const byType = type === 'all' ? myTransactions : myTransactions.filter((t) => t.type === type);
  const sectionsAll = useMemo(() => groupByMonth(byType), [byType]);

  const currentYear = new Date().getFullYear();
  const allYearMonths = useMemo(() => MONTHS.map((m) => `${m} ${currentYear}`), [currentYear]);
  const months = useMemo(() => ['All', ...allYearMonths], [allYearMonths]);

  const sections = useMemo(() => {
    if (month === 'All') return sectionsAll;
    const selectedMonth = month.split(' ')[0].toLowerCase();
    return sectionsAll.filter((s) => s.title.toLowerCase().startsWith(selectedMonth));
  }, [month, sectionsAll]);

  const toggle = (t) => setType((cur) => (cur === t ? 'all' : t));

  const confirmDelete = (t) =>
    Alert.alert('Delete transaction', `Delete "${t.title}" (${money(t.amount)})?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(t.id) },
    ]);

  const top = (
    <View>
      <View style={styles.balance}>
        <T weight="medium" style={{ fontSize: 15 }}>Total Balance</T>
        <T weight="bold" style={{ fontSize: 24 }}>{money(all.balance)}</T>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <TouchableOpacity onPress={() => toggle('income')} style={[styles.box, type === 'income' && styles.boxActive]}>
          <Ionicons name="arrow-up-circle-outline" size={24} color={type === 'income' ? COLORS.white : COLORS.primary} />
          <T weight="medium" style={[styles.boxLabel, type === 'income' && { color: COLORS.white }]}>Income</T>
          <T weight="bold" style={[styles.boxValue, type === 'income' && { color: COLORS.white }]}>{money(all.income)}</T>
        </TouchableOpacity>
        <View style={{ width: 12 }} />
        <TouchableOpacity onPress={() => toggle('expense')} style={[styles.box, type === 'expense' && styles.boxActive]}>
          <Ionicons name="arrow-down-circle-outline" size={24} color={type === 'expense' ? COLORS.white : COLORS.blue} />
          <T weight="medium" style={[styles.boxLabel, type === 'expense' && { color: COLORS.white }]}>Expense</T>
          <T weight="bold" style={[styles.boxValue, { color: type === 'expense' ? COLORS.white : COLORS.blue }]}>{money(all.expense)}</T>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Screen header={{ title: 'Transaction' }} top={top} scroll={false}
      footer={
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTransaction')}>
          <Ionicons name="add" size={30} color={COLORS.dark} />
        </TouchableOpacity>
      }
    >
      <View style={{ height: 44 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {months.map((m) => <Chip key={m} label={m} active={month === m} onPress={() => setMonth(m)} />)}
        </ScrollView>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(i) => i.id}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderSectionHeader={({ section }) => (
          <View style={styles.section}>
            <T weight="medium" style={{ fontSize: 15 }}>{section.title.split(' ')[0]}</T>
            <T style={{ fontSize: 11, color: COLORS.grey }}>
              In {money(section.total.income)} · Out {money(section.total.expense)}
            </T>
          </View>
        )}
        renderItem={({ item }) => (
          <TransactionItem item={item}
            onPress={() => navigation.navigate('AddTransaction', { transaction: item })}
            onLongPress={() => confirmDelete(item)} />
        )}
        ListEmptyComponent={<EmptyState text="No transactions here. Tap + to add one." />}
        ListFooterComponent={sections.length ? <T style={styles.hint}>Tap to edit · Long press to delete</T> : null}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  balance: { backgroundColor: COLORS.honeydew, borderRadius: 15, paddingVertical: 10, alignItems: 'center' },
  box: { flex: 1, backgroundColor: COLORS.honeydew, borderRadius: 15, padding: 12, alignItems: 'center' },
  boxActive: { backgroundColor: COLORS.blue },
  boxLabel: { fontSize: 14 },
  boxValue: { fontSize: 16 },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  fab: {
    position: 'absolute', right: 24, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
    shadowColor: COLORS.dark, shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
  hint: { textAlign: 'center', fontSize: 11, color: COLORS.grey, marginTop: 4 },
});
