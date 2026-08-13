import React, { PropsWithChildren, ReactNode } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { LucideIcon, X } from 'lucide-react-native';
import { colors, radii, shadow } from '../theme';
import { StatusTone } from '../types';

export function Button({ label, onPress, icon: Icon, tone = 'primary', disabled = false, compact = false }: { label: string; onPress?: () => void; icon?: LucideIcon; tone?: 'primary' | 'secondary' | 'ghost' | 'danger'; disabled?: boolean; compact?: boolean }) {
  const palette = tone === 'primary' ? { bg: colors.blue, text: '#fff', border: colors.blue } : tone === 'danger' ? { bg: colors.redSoft, text: colors.red, border: '#FECDCA' } : tone === 'ghost' ? { bg: 'transparent', text: colors.muted, border: 'transparent' } : { bg: colors.surface, text: colors.text, border: colors.borderStrong };
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, compact && styles.buttonCompact, { backgroundColor: palette.bg, borderColor: palette.border, opacity: disabled ? 0.45 : pressed ? 0.78 : 1 }]}>
      {Icon ? <Icon size={compact ? 14 : 16} color={palette.text} strokeWidth={2} /> : null}
      <Text style={[styles.buttonText, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({ icon: Icon, label, onPress }: { icon: LucideIcon; label: string; onPress?: () => void }) {
  return <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.iconButton, pressed && { backgroundColor: colors.surfaceAlt }]}><Icon size={18} color={colors.muted} /></Pressable>;
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: StatusTone }) {
  const map = {
    neutral: { bg: '#F1F5F9', text: '#475569' },
    info: { bg: colors.blueSoft, text: colors.blueDark },
    success: { bg: colors.greenSoft, text: colors.green },
    warning: { bg: colors.amberSoft, text: colors.amber },
    danger: { bg: colors.redSoft, text: colors.red },
  };
  return <View style={[styles.badge, { backgroundColor: map[tone].bg }]}><Text style={[styles.badgeText, { color: map[tone].text }]}>{label}</Text></View>;
}

export function StatCard({ label, value, detail, icon: Icon, tone = 'info', onPress }: { label: string; value: string; detail?: string; icon?: LucideIcon; tone?: StatusTone; onPress?: () => void }) {
  const content = <View style={styles.statInner}><View style={styles.statTop}><Text style={styles.statLabel}>{label}</Text>{Icon ? <Icon size={18} color={tone === 'danger' ? colors.red : tone === 'success' ? colors.green : tone === 'warning' ? colors.amber : colors.blue} /> : null}</View><Text style={styles.statValue}>{value}</Text>{detail ? <Text style={styles.statDetail}>{detail}</Text> : null}</View>;
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => [styles.statCard, pressed && { opacity: 0.82 }]}>{content}</Pressable> : <View style={styles.statCard}>{content}</View>;
}

export function Field({ label, error, ...props }: TextInputProps & { label?: string; error?: string }) {
  return <View style={styles.fieldWrap}>{label ? <Text style={styles.fieldLabel}>{label}</Text> : null}<TextInput placeholderTextColor={colors.subtle} {...props} style={[styles.input, props.multiline && styles.textarea, props.style]} />{error ? <Text style={styles.fieldError}>{error}</Text> : null}</View>;
}

export function SelectChips<T extends string>({ label, options, value, onChange }: { label?: string; options: readonly T[]; value: T; onChange: (value: T) => void }) {
  return <View style={styles.fieldWrap}>{label ? <Text style={styles.fieldLabel}>{label}</Text> : null}<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>{options.map((option) => <Pressable key={option} onPress={() => onChange(option)} style={[styles.choiceChip, value === option && styles.choiceChipActive]}><Text style={[styles.choiceText, value === option && styles.choiceTextActive]}>{option}</Text></Pressable>)}</ScrollView></View>;
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <View style={styles.sectionHeader}><View style={{ flex: 1 }}><Text style={styles.sectionTitle}>{title}</Text>{subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}</View>{action}</View>;
}

export function EmptyState({ title, body, icon: Icon }: { title: string; body: string; icon?: LucideIcon }) {
  return <View style={styles.empty}>{Icon ? <Icon size={28} color={colors.subtle} /> : null}<Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyBody}>{body}</Text></View>;
}

export function Dialog({ visible, title, subtitle, children, onClose, width = 560 }: PropsWithChildren<{ visible: boolean; title: string; subtitle?: string; onClose: () => void; width?: number }>) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}><View style={styles.modalBackdrop}><View style={[styles.dialog, { maxWidth: width }]}><View style={styles.dialogHeader}><View style={{ flex: 1 }}><Text style={styles.dialogTitle}>{title}</Text>{subtitle ? <Text style={styles.dialogSubtitle}>{subtitle}</Text> : null}</View><IconButton icon={X} label="Close" onPress={onClose} /></View><ScrollView contentContainerStyle={styles.dialogBody}>{children}</ScrollView></View></View></Modal>;
}

export function Table({ headers, rows, minWidth = 760 }: { headers: string[]; rows: ReactNode[][]; minWidth?: number }) {
  const widths = headers.map((_, index) => index === 0 ? 1.5 : 1);
  return <ScrollView horizontal showsHorizontalScrollIndicator><View style={[styles.table, { minWidth }]}><View style={styles.tableHeader}>{headers.map((header, index) => <Text key={header} style={[styles.tableHeaderText, { flex: widths[index] }]}>{header}</Text>)}</View>{rows.map((row, r) => <View key={r} style={[styles.tableRow, r % 2 === 1 && { backgroundColor: '#FBFCFE' }]}>{row.map((cell, c) => <View key={c} style={[styles.tableCell, { flex: widths[c] }]}>{typeof cell === 'string' || typeof cell === 'number' ? <Text style={styles.tableText} numberOfLines={2}>{cell}</Text> : cell}</View>)}</View>)}</View></ScrollView>;
}

export function Progress({ value, color = colors.blue }: { value: number; color?: string }) {
  return <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }]} /></View>;
}

export function LoadingBlock({ label = 'Loading demo data…' }: { label?: string }) {
  return <View style={styles.loading}><ActivityIndicator color={colors.blue} /><Text style={styles.sectionSubtitle}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  button: { minHeight: 38, paddingHorizontal: 15, borderWidth: 1, borderRadius: radii.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  buttonCompact: { minHeight: 32, paddingHorizontal: 11 },
  buttonText: { fontSize: 13, fontWeight: '700' },
  iconButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, ...shadow },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.full, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  statCard: { minWidth: 170, flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg },
  statInner: { padding: 16, gap: 4 }, statTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statLabel: { fontSize: 12, color: colors.muted, fontWeight: '600' }, statValue: { fontSize: 25, lineHeight: 32, fontWeight: '800', color: colors.ink, fontVariant: ['tabular-nums'] }, statDetail: { fontSize: 11, color: colors.muted },
  fieldWrap: { gap: 6, flex: 1, minWidth: 150 }, fieldLabel: { color: colors.text, fontSize: 12, fontWeight: '700' },
  input: { minHeight: 40, backgroundColor: colors.surface, borderColor: colors.borderStrong, borderWidth: 1, borderRadius: radii.md, paddingHorizontal: 12, fontSize: 14, color: colors.ink, outlineStyle: 'none' } as never,
  textarea: { minHeight: 88, paddingTop: 11, textAlignVertical: 'top' }, fieldError: { color: colors.red, fontSize: 11 },
  chipRow: { gap: 7 }, choiceChip: { borderWidth: 1, borderColor: colors.border, paddingHorizontal: 11, paddingVertical: 8, borderRadius: radii.full, backgroundColor: colors.surface }, choiceChipActive: { borderColor: colors.blue, backgroundColor: colors.blueSoft }, choiceText: { color: colors.muted, fontSize: 12, fontWeight: '600' }, choiceTextActive: { color: colors.blueDark },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }, sectionTitle: { fontSize: 16, color: colors.ink, fontWeight: '800' }, sectionSubtitle: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 2 },
  empty: { minHeight: 170, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 8 }, emptyTitle: { color: colors.text, fontWeight: '800', fontSize: 14 }, emptyBody: { color: colors.muted, fontSize: 12, maxWidth: 360, textAlign: 'center', lineHeight: 18 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.48)', padding: 20, alignItems: 'center', justifyContent: 'center' }, dialog: { width: '100%', maxHeight: '90%', borderRadius: radii.xl, backgroundColor: colors.surface, ...shadow }, dialogHeader: { paddingHorizontal: 22, paddingVertical: 16, borderBottomWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center' }, dialogTitle: { fontSize: 18, fontWeight: '800', color: colors.ink }, dialogSubtitle: { fontSize: 12, color: colors.muted, marginTop: 3 }, dialogBody: { padding: 22, gap: 16 },
  table: { flex: 1 }, tableHeader: { minHeight: 38, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceAlt, borderBottomWidth: 1, borderColor: colors.border }, tableHeaderText: { fontSize: 10, color: colors.muted, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.35, paddingHorizontal: 6 }, tableRow: { minHeight: 50, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#E9EEF5' }, tableCell: { paddingHorizontal: 6, justifyContent: 'center' }, tableText: { color: colors.text, fontSize: 12, lineHeight: 16 },
  progressTrack: { height: 7, borderRadius: radii.full, backgroundColor: '#E9EEF5', overflow: 'hidden' }, progressFill: { height: 7, borderRadius: radii.full }, loading: { padding: 28, alignItems: 'center', justifyContent: 'center', gap: 10 },
});
