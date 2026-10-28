import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { T } from './UI';
import { formatTimeDate, money, shortMoney } from '../utils/format';
import { getCategoryIcon } from '../data/seed';

export function ProgressBar({ percent, amount }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <View style={styles.pbTrack}>
      <View style={[styles.pbFill, { width: `${Math.max(p, 14)}%` }]}>
        <T weight="bold" style={{ color: COLORS.void, fontSize: 11 }}>{Math.round(percent)}%</T>
      </View>
      <T weight="medium" style={styles.pbAmount}>{amount}</T>
    </View>
  );
}

// Total Balance / Total Expense + budget bar (top of Home, Categories, Category details)
export function BalanceSummary({ balance, expense, budget, expenseLabel = 'Total Expense' }) {
  const pct = budget ? (expense / budget) * 100 : 0;
  const note = pct < 50 ? 'Healthy budget.' : pct < 80 ? 'Well managed.' : pct < 100 ? 'Close to limit!' : 'Over budget!';
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Ionicons name="trending-up-outline" size={15} color={COLORS.primary} />
            <T style={styles.sumLabel}>Total Balance</T>
          </View>
          <T weight="bold" style={[styles.sumValue, { color: COLORS.white }]} numberOfLines={1} adjustsFontSizeToFit>{money(balance)}</T>
        </View>
        <View style={styles.vline} />
        <View style={{ flex: 1, paddingLeft: 18 }}>
          <View style={styles.row}>
            <Ionicons name="trending-down-outline" size={15} color="#F87171" />
            <T style={styles.sumLabel}>{expenseLabel}</T>
          </View>
          <T weight="bold" style={[styles.sumValue, { color: '#FCA5A5' }]} numberOfLines={1} adjustsFontSizeToFit>{money(-expense)}</T>
        </View>
      </View>
      {budget ? (
        <>
          <ProgressBar percent={pct} amount={money(budget)} />
          <View style={[styles.row, { marginTop: 8 }]}>
            <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.primary} />
            <T style={{ fontSize: 12, marginLeft: 6, color: COLORS.headerMuted }}>{Math.round(pct)}% of budget utilized · {note}</T>
          </View>
        </>
      ) : null}
    </View>
  );
}

// One row: icon | title + time | category | amount
export function TransactionItem({ item, onPress, onLongPress, middle }) {
  const income = item.type === 'income';
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!onPress && !onLongPress}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tx}
    >
      <View style={[styles.txIcon, { backgroundColor: income ? '#ECFDF5' : '#EFF6FF' }]}>
        <Ionicons name={getCategoryIcon(item.category)} size={22} color={income ? COLORS.primaryDark : COLORS.blue} />
      </View>
      <View style={{ flex: 1.5, marginLeft: 12 }}>
        <T weight="semibold" style={{ fontSize: 15, color: COLORS.dark }} numberOfLines={1}>{item.title}</T>
        <T style={{ fontSize: 11, color: COLORS.grey, marginTop: 1 }}>{formatTimeDate(item.date)}</T>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={styles.categoryPill}>
          <T weight="medium" style={{ fontSize: 11, color: COLORS.darkMuted }} numberOfLines={1}>{middle ?? item.category}</T>
        </View>
      </View>
      <T weight="bold" style={{ flex: 1.1, fontSize: 15, textAlign: 'right', color: income ? COLORS.success : COLORS.dark }} numberOfLines={1}>
        {income ? '+' : '-'}{money(item.amount)}
      </T>
    </TouchableOpacity>
  );
}

const niceStep = (max) => {
  const raw = max / 3;
  const mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const norm = raw / mag;
  return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
};

// Income (green) vs Expense (blue) bars
export function BarChart({ data, title = 'Income & Expenses' }) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.income, d.expense)));
  const step = niceStep(max);
  const ticks = [3, 2, 1, 0].map((i) => i * step);
  const top = ticks[0];
  const H = 150;
  return (
    <View style={styles.chartCard}>
      <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 16 }]}>
        <T weight="bold" style={{ fontSize: 16, color: COLORS.dark }}>{title}</T>
        <View style={styles.row}>
          <View style={styles.chartIcon}><Ionicons name="stats-chart" size={13} color={COLORS.primaryDark} /></View>
          <View style={[styles.chartIcon, { marginLeft: 8 }]}><Ionicons name="calendar-outline" size={14} color={COLORS.grey} /></View>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ height: H, justifyContent: 'space-between', marginRight: 8 }}>
          {ticks.map((t) => <T key={t} style={{ fontSize: 10, color: COLORS.grey }}>{shortMoney(t)}</T>)}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ height: H }}>
            {ticks.map((t, i) => (
              <View key={t} style={[styles.grid, { top: (i / 3) * (H - 1) + 6 }]} />
            ))}
            <View style={styles.barsRow}>
              {data.map((d) => (
                <View key={d.label} style={styles.barPair}>
                  <View style={[styles.bar, { height: Math.max(4, (d.income / top) * H), backgroundColor: COLORS.primary }]} />
                  <View style={[styles.bar, { height: Math.max(4, (d.expense / top) * H), backgroundColor: COLORS.blue }]} />
                </View>
              ))}
            </View>
          </View>
          <View style={[styles.barsRow, { position: 'relative', marginTop: 8 }]}>
            {data.map((d) => (
              <T key={d.label} weight="medium" style={{ fontSize: 11, color: COLORS.grey, flex: 1, textAlign: 'center' }} numberOfLines={1}>{d.label}</T>
            ))}
          </View>
        </View>
      </View>
      <View style={[styles.row, { justifyContent: 'center', marginTop: 14 }]}>
        <View style={[styles.dot, { backgroundColor: COLORS.primary }]} /><T weight="medium" style={{ fontSize: 12, marginRight: 18, color: COLORS.dark }}>Income</T>
        <View style={[styles.dot, { backgroundColor: COLORS.blue }]} /><T weight="medium" style={{ fontSize: 12, color: COLORS.dark }}>Expense</T>
      </View>
    </View>
  );
}

// Simple ring without extra libraries (quadrants fill as % grows)
export function ProgressRing({ percent, label, size = 72 }) {
  const p = Math.max(0, Math.min(100, percent));
  const c = (q) => (p >= q ? COLORS.primary : 'rgba(255, 255, 255, 0.15)');
  return (
    <View style={styles.target}>
      <View style={{
        width: size, height: size, borderRadius: size / 2, borderWidth: 6,
        borderTopColor: c(12.5), borderRightColor: c(37.5), borderBottomColor: c(62.5), borderLeftColor: c(87.5),
        transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center',
      }}>
        <T weight="bold" style={{ color: COLORS.white, fontSize: 14, transform: [{ rotate: '-45deg' }] }}>{Math.round(percent)}%</T>
      </View>
      <T weight="semibold" style={{ color: COLORS.white, marginTop: 8, fontSize: 13 }}>{label}</T>
    </View>
  );
}

// Daily / weekly / monthly report block on the home screen
export function ReportCard({ period, income, expense, count, dateText }) {
  const net = income - expense;
  return (
    <View style={styles.report}>
      <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
        <T weight="bold" style={{ fontSize: 16, color: COLORS.dark }}>{period} Summary</T>
        <View style={styles.dateBadge}>
          <T weight="medium" style={{ fontSize: 11, color: COLORS.grey }}>{dateText}</T>
        </View>
      </View>
      <View style={[styles.row, { marginTop: 4 }]}>
        <Stat label="Income" value={money(income)} color={COLORS.success} icon="arrow-up-circle-outline" />
        <Stat label="Expense" value={money(-expense)} color={COLORS.danger} icon="arrow-down-circle-outline" />
        <Stat label="Net Profit" value={money(net)} color={net >= 0 ? COLORS.dark : COLORS.danger} icon="wallet-outline" />
      </View>
      <T style={{ fontSize: 12, color: COLORS.grey, marginTop: 12, textAlign: 'center' }}>
        {count} transaction{count === 1 ? '' : 's'} recorded
      </T>
    </View>
  );
}

function Stat({ label, value, color, icon }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Ionicons name={icon} size={18} color={color} />
      <T style={{ fontSize: 11, color: COLORS.grey, marginTop: 2 }}>{label}</T>
      <T weight="bold" style={{ fontSize: 14, color, marginTop: 1 }} numberOfLines={1} adjustsFontSizeToFit>{value}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  sumLabel: { fontSize: 12, color: COLORS.headerMuted, marginLeft: 5 },
  sumValue: { fontSize: 24, marginTop: 3 },
  vline: { width: 1, height: 42, backgroundColor: 'rgba(255, 255, 255, 0.15)', marginHorizontal: 2 },
  pbTrack: {
    height: 24, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.12)', marginTop: 14,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)',
    flexDirection: 'row', alignItems: 'center', overflow: 'hidden',
  },
  pbFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 12, justifyContent: 'center', paddingLeft: 10 },
  pbAmount: { position: 'absolute', right: 12, fontSize: 12, color: COLORS.white, fontWeight: '600' },
  tx: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
    backgroundColor: COLORS.card, borderRadius: 18, marginBottom: 12,
    borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  txIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  categoryPill: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  chartCard: {
    backgroundColor: COLORS.card, borderRadius: 24, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
  },
  chartIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  grid: { position: 'absolute', left: 0, right: 0, height: 1, borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#E2E8F0' },
  barsRow: { position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' },
  barPair: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  bar: { width: 8, borderRadius: 5, marginHorizontal: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  target: {
    flex: 1, backgroundColor: '#1E293B', borderRadius: 22, paddingVertical: 18, alignItems: 'center', marginHorizontal: 6,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  report: {
    backgroundColor: COLORS.card, borderRadius: 22, padding: 18, marginBottom: 20,
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  dateBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
});
