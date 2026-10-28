import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import { EmptyState, Input, T } from '../../components/UI';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { initials, money } from '../../utils/format';
import { totals } from '../../utils/reports';

export default function CustomersScreen({ navigation }) {
  const { customers, customerTransactions } = useApp();
  const [q, setQ] = useState('');
  const list = customers.filter((c) => `${c.name} ${c.email} ${c.id}`.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <Screen header={{ title: 'Customers' }} top={
      <View style={{ alignItems: 'center' }}>
        <T style={{ fontSize: 13 }}>Registered customers</T>
        <T weight="bold" style={{ fontSize: 30, color: COLORS.honeydew }}>{customers.length}</T>
      </View>
    }>
      <Input placeholder="Search by name, email or ID" value={q} onChangeText={setQ} autoCapitalize="none"
        right={<Ionicons name="search" size={18} color={COLORS.dark} />} />
      {list.length === 0 ? <EmptyState icon="people-outline" text="No customer matches your search." /> : null}
      {list.map((c) => {
        const tx = customerTransactions.filter((t) => t.userId === c.id);
        const s = totals(tx);
        return (
          <TouchableOpacity key={c.id} style={styles.card} onPress={() => navigation.navigate('CustomerDetail', { id: c.id })}>
            <View style={styles.avatar}><T weight="bold" style={{ color: COLORS.white, fontSize: 16 }}>{initials(c.name)}</T></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <T weight="semibold" style={{ fontSize: 15 }}>{c.name}</T>
              <T style={{ fontSize: 12 }}>{c.email}</T>
              <T style={{ fontSize: 11, color: COLORS.grey }}>ID {c.id} · {tx.length} transactions</T>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <T weight="semibold" style={{ fontSize: 14 }}>{money(s.balance)}</T>
              <T style={{ fontSize: 11, color: COLORS.blue }}>-{money(s.expense)}</T>
            </View>
          </TouchableOpacity>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightGreen, borderRadius: 22, padding: 14, marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.void, alignItems: 'center', justifyContent: 'center' },
});
