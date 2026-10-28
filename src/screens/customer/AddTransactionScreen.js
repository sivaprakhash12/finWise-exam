import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import { Button, Chip, Input, Segmented, T } from '../../components/UI';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { INCOME_CATEGORIES, getCategoryIcon } from '../../data/seed';
import { formatDate, parseDate } from '../../utils/format';
import { isAmount } from '../../utils/validation';

// Add / edit / delete a transaction – every change fires a personalised alert
export default function AddTransactionScreen({ navigation, route }) {
  const editing = route.params?.transaction;
  const preset = route.params?.category;
  const { categories, addTransaction, updateTransaction, deleteTransaction } = useApp();

  const [type, setType] = useState(editing ? (editing.type === 'income' ? 'Income' : 'Expense') : INCOME_CATEGORIES.includes(preset) && preset !== 'Gifts' ? 'Income' : 'Expense');
  const [date, setDate] = useState(formatDate(editing ? editing.date : new Date()));
  const [category, setCategory] = useState(editing?.category || preset || '');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [title, setTitle] = useState(editing?.title || '');
  const [message, setMessage] = useState(editing?.message || '');
  const [errors, setErrors] = useState({});

  const options = type === 'Income' ? INCOME_CATEGORIES : categories.map((c) => c.key);

  const onDate = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 8);
    let out = d;
    if (d.length > 4) out = `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
    else if (d.length > 2) out = `${d.slice(0, 2)}/${d.slice(2)}`;
    setDate(out);
  };

  const save = () => {
    const e = {};
    const d = parseDate(date);
    const today = new Date(); today.setHours(23, 59, 59, 999);
    if (!d) e.date = 'Enter a valid date as DD/MM/YYYY';
    else if (d > today) e.date = 'Date cannot be in the future';
    else if (d.getFullYear() < 2000) e.date = 'Enter a date after 2000';
    if (!category) e.category = 'Choose a category';
    else if (!options.includes(category)) e.category = `Choose a ${type.toLowerCase()} category`;
    if (!amount.trim()) e.amount = 'Enter the amount';
    else if (!isAmount(amount)) e.amount = 'Enter a valid amount (max 2 decimals, more than 0)';
    else if (Number(amount) > 1000000) e.amount = 'Amount looks too large';
    if (title.trim().length < 3) e.title = 'Title must be at least 3 characters';
    else if (title.trim().length > 30) e.title = 'Keep the title under 30 characters';
    if (message.length > 200) e.message = 'Message can be up to 200 characters';
    setErrors(e);
    if (Object.keys(e).length) return;

    // keep the original time when editing the same day, otherwise use the current time
    const when = new Date(d);
    const src = editing && formatDate(editing.date) === date ? new Date(editing.date) : new Date();
    when.setHours(src.getHours(), src.getMinutes(), 0, 0);

    const data = {
      type: type.toLowerCase(), category, amount: Math.round(Number(amount) * 100) / 100,
      title: title.trim(), message: message.trim(), date: when.toISOString(),
    };
    if (editing) updateTransaction(editing.id, data);
    else addTransaction(data);
    navigation.goBack();
  };

  const remove = () =>
    Alert.alert('Delete transaction', `Delete "${editing.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteTransaction(editing.id); navigation.goBack(); } },
    ]);

  return (
    <Screen header={{ title: editing ? 'Edit Transaction' : `Add ${type === 'Income' ? 'Income' : 'Expenses'}`, left: 'back' }}>
      <Segmented options={['Expense', 'Income']} value={type}
        onChange={(v) => { setType(v); setCategory(''); }} style={{ marginTop: 0, marginBottom: 18 }} />

      <Input label="Date" placeholder="DD/MM/YYYY" value={date} onChangeText={onDate} keyboardType="number-pad" error={errors.date}
        right={<Ionicons name="calendar" size={20} color={COLORS.primary} />} />

      <T weight="medium" style={{ fontSize: 15, marginBottom: 8, marginLeft: 6 }}>Category</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {options.map((c) => (
          <Chip key={c} label={c} icon={getCategoryIcon(c)} active={category === c} onPress={() => { setCategory(c); setErrors((p) => ({ ...p, category: '' })); }} />
        ))}
      </View>
      {errors.category ? <T style={{ color: COLORS.danger, fontSize: 12, marginLeft: 8, marginBottom: 8 }}>{errors.category}</T> : <View style={{ height: 8 }} />}

      <Input label="Amount" placeholder="$0.00" value={amount} onChangeText={(v) => setAmount(v.replace(/[^0-9.]/g, ''))}
        keyboardType="decimal-pad" error={errors.amount} />
      <Input label={`${type} Title`} placeholder={type === 'Income' ? 'e.g. Salary' : 'e.g. Dinner'} value={title} onChangeText={setTitle} error={errors.title} />
      <Input placeholder="Enter Message" value={message} onChangeText={setMessage} multiline error={errors.message} />

      <Button title={editing ? 'Update' : 'Save'} onPress={save} style={{ width: 210, marginTop: 6 }} />
      {editing ? <Button title="Delete" variant="danger" icon="trash-outline" onPress={remove} style={{ width: 210, marginTop: 12 }} /> : null}
    </Screen>
  );
}
