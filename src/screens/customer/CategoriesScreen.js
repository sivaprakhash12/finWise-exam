import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import { Button, Input, T } from '../../components/UI';
import { BalanceSummary } from '../../components/Finance';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { filterByPeriod, totals } from '../../utils/reports';

// Part I – 5. Overall categories screen
export default function CategoriesScreen({ navigation }) {
  const { categories, myTransactions, currentUser, addCategory } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const all = totals(myTransactions);
  const month = totals(filterByPeriod(myTransactions, 'Monthly'));
  const tiles = [...categories, { key: 'More', icon: 'add' }];

  const save = () => {
    const v = name.trim();
    if (!v) return setError('Enter a category name');
    if (!/^[A-Za-z ]{3,20}$/.test(v)) return setError('Use 3–20 letters only');
    const res = addCategory(v);
    if (!res.ok) return setError(res.error);
    setOpen(false); setName(''); setError('');
  };

  return (
    <Screen header={{ title: 'Categories' }}
      top={<BalanceSummary balance={all.balance} expense={month.expense} budget={currentUser.budget} />}>
      <View style={styles.grid}>
        {tiles.map((c) => {
          const count = myTransactions.filter((t) => t.category === c.key).length;
          return (
            <Pressable key={c.key} style={styles.cell}
              onPress={() => (c.key === 'More' ? setOpen(true) : navigation.navigate('CategoryDetail', { category: c.key }))}>
              {({ pressed }) => (
                <>
                  <View style={[styles.tile, pressed && { backgroundColor: COLORS.vividBlue }]}>
                    <Ionicons name={c.icon} size={40} color={COLORS.white} />
                  </View>
                  <T style={styles.label} numberOfLines={1}>{c.key}</T>
                  {c.key !== 'More' ? <T style={styles.count}>{count} item{count === 1 ? '' : 's'}</T> : null}
                </>
              )}
            </Pressable>
          );
        })}
      </View>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.modal}>
            <T weight="semibold" style={{ fontSize: 20, textAlign: 'center', marginBottom: 16 }}>New Category</T>
            <Input placeholder="Write..." value={name} onChangeText={(v) => { setName(v); setError(''); }} error={error} autoFocus />
            <Button title="Save" onPress={save} style={{ width: '100%' }} />
            <Button title="Cancel" variant="secondary" onPress={() => { setOpen(false); setError(''); }} style={{ width: '100%', marginTop: 10 }} />
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cell: { width: '31%', alignItems: 'center', marginBottom: 18 },
  tile: { width: '100%', aspectRatio: 1.07, borderRadius: 25, backgroundColor: COLORS.lightBlue, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 14, marginTop: 6 },
  count: { fontSize: 10, color: COLORS.grey },
  backdrop: { flex: 1, backgroundColor: 'rgba(5,34,36,0.45)', alignItems: 'center', justifyContent: 'center', padding: 30 },
  modal: { backgroundColor: COLORS.honeydew, borderRadius: 30, padding: 26, width: '100%' },
});
