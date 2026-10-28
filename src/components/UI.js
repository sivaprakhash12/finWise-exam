import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme';

// Poppins text
export function T({ style, weight = 'regular', ...props }) {
  return <Text {...props} style={[{ fontFamily: FONTS[weight], color: COLORS.dark }, style]} />;
}

export function Logo({ color = COLORS.primary, size = 110 }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="stats-chart" size={size * 0.62} color={color} />
      <Ionicons name="trending-up" size={size * 0.5} color={color} style={{ position: 'absolute', top: -2, right: 4 }} />
    </View>
  );
}

export function Button({ title, onPress, variant = 'primary', style, icon, disabled }) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const bg = isPrimary ? COLORS.primary : isDanger ? COLORS.danger : COLORS.white;
  const textColor = isPrimary ? COLORS.void : isDanger ? COLORS.white : COLORS.dark;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.6 : 1 },
        isPrimary && styles.btnPrimaryShadow,
        variant === 'secondary' && styles.btnSecondary,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={textColor} style={{ marginRight: 8 }} /> : null}
      <T weight="bold" style={[styles.btnText, { color: textColor }]}>{title}</T>
    </TouchableOpacity>
  );
}

export function Input({ label, error, secure, style, multiline, right, ...props }) {
  const [hidden, setHidden] = useState(true);
  return (
    <View style={[{ marginBottom: 16 }, style]}>
      {label ? <T weight="semibold" style={styles.label}>{label}</T> : null}
      <View style={[styles.inputWrap, multiline && { height: 110, alignItems: 'flex-start' }, error && styles.inputError]}>
        <TextInput
          placeholderTextColor="#94A3B8"
          secureTextEntry={secure && hidden}
          multiline={multiline}
          style={[styles.input, multiline && { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
          {...props}
        />
        {secure ? (
          <TouchableOpacity onPress={() => setHidden(!hidden)} hitSlop={10}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.grey} />
          </TouchableOpacity>
        ) : right}
      </View>
      {error ? <T style={styles.error}>{error}</T> : null}
    </View>
  );
}

export function Segmented({ options, value, onChange, style }) {
  return (
    <View style={[styles.seg, style]}>
      {options.map((o) => {
        const active = o === value;
        return (
          <TouchableOpacity key={o} activeOpacity={0.8} onPress={() => onChange(o)} style={[styles.segItem, active && styles.segActive]}>
            <T weight={active ? 'bold' : 'medium'} style={{ fontSize: 13, color: active ? COLORS.primaryDark : COLORS.grey }}>
              {o}
            </T>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function Chip({ label, active, onPress, icon }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary }]}
    >
      {icon ? <Ionicons name={icon} size={15} color={active ? COLORS.primaryDark : COLORS.grey} style={{ marginRight: 6 }} /> : null}
      <T weight={active ? 'bold' : 'medium'} style={{ fontSize: 13, color: active ? COLORS.primaryDark : COLORS.dark }}>
        {label}
      </T>
    </TouchableOpacity>
  );
}

export function EmptyState({ icon = 'receipt-outline', text, action, onAction }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyCircle}>
        <Ionicons name={icon} size={36} color={COLORS.primaryDark} />
      </View>
      <T weight="medium" style={styles.emptyText}>{text}</T>
      {action ? <Button title={action} onPress={onAction} style={{ marginTop: 14, width: 200 }} /> : null}
    </View>
  );
}

export function ConfirmModal({ visible, title, message, confirmText = 'Yes', onConfirm, onCancel }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.modal}>
          <T weight="bold" style={{ fontSize: 20, textAlign: 'center', color: COLORS.dark }}>{title}</T>
          <T style={{ textAlign: 'center', marginVertical: 14, fontSize: 14, color: COLORS.grey }}>{message}</T>
          <Button title={confirmText} onPress={onConfirm} style={{ width: '100%' }} />
          <Button title="Cancel" variant="secondary" onPress={onCancel} style={{ width: '100%', marginTop: 10 }} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  btn: {
    height: 50, borderRadius: 16, paddingHorizontal: 24, minWidth: 190,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
  },
  btnPrimaryShadow: {
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.32, shadowRadius: 10, elevation: 4,
  },
  btnSecondary: {
    borderWidth: 1.5, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  btnText: { fontSize: 15, letterSpacing: 0.2 },
  label: { fontSize: 13, marginBottom: 7, marginLeft: 4, color: COLORS.darkMuted },
  inputWrap: {
    backgroundColor: COLORS.white, borderRadius: 16, height: 50, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },
  inputError: { borderColor: COLORS.danger },
  input: { flex: 1, fontFamily: FONTS.medium, fontSize: 15, color: COLORS.dark, paddingVertical: 0 },
  error: { color: COLORS.danger, fontSize: 12, marginTop: 4, marginLeft: 6 },
  seg: {
    flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 16, padding: 4, marginVertical: 14,
  },
  segItem: { flex: 1, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  segActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: '#E2E8F0',
    paddingHorizontal: 14, height: 36, borderRadius: 12, marginRight: 8, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 3, elevation: 1,
  },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyCircle: {
    width: 68, height: 68, borderRadius: 34, backgroundColor: '#ECFDF5',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  emptyText: { textAlign: 'center', color: COLORS.grey, marginTop: 4, fontSize: 14, paddingHorizontal: 20 },
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', alignItems: 'center', justifyContent: 'center', padding: 26 },
  modal: {
    backgroundColor: COLORS.white, borderRadius: 26, padding: 26, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 10,
  },
});
