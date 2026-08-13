import React, { PropsWithChildren, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import {
  Bell, Building2, ChevronRight, CircleDollarSign, ClipboardCheck, ClipboardList, Clock3, FileBarChart, FileInput, Files, Gauge, Gift,
  LayoutDashboard, LogOut, Menu, Network, Search, Settings, ShieldCheck, Star, UserRoundSearch, UsersRound, X,
} from 'lucide-react-native';
import { colors, radii, shadow } from '../theme';
import { PageKey } from '../types';
import { useDemo } from '../store/DemoStore';
import { Badge, Dialog, Field, IconButton } from './ui';
import { globalSearch } from '../services/demoPlus';

export const pageMeta: Record<PageKey, { label: string; title: string; subtitle: string; icon: typeof Gauge }> = {
  dashboard: { label: 'Dashboard', title: 'HR Overview', subtitle: 'Live organization signals from this demo runtime.', icon: LayoutDashboard },
  operations: { label: 'Operations', title: 'Operations Command Center', subtitle: 'Prioritized work, ownership, aging, and direct next actions.', icon: ClipboardList },
  organization: { label: 'Organization', title: 'Organization Structure', subtitle: 'Legal entities, branches, departments, positions, and reporting lines.', icon: Building2 },
  recruitment: { label: 'Recruitment', title: 'Recruitment Pipeline', subtitle: 'Move fictional candidates from requisition to employee draft.', icon: UserRoundSearch },
  people: { label: 'People', title: 'Employee Directory', subtitle: 'Search and manage the connected employee record.', icon: UsersRound },
  imports: { label: 'Imports', title: 'Bulk Import Center', subtitle: 'Browser-local validation, reconciliation, commit, and error evidence.', icon: FileInput },
  documents: { label: 'Documents', title: 'Document Compliance', subtitle: 'Missing, expiring, current, and acknowledgement-due requirements.', icon: Files },
  attendance: { label: 'Time & Attendance', title: 'Attendance Operations', subtitle: 'Schedules, raw events, biometric simulation, and exceptions.', icon: Clock3 },
  requests: { label: 'Leave & Overtime', title: 'Requests & Balances', subtitle: 'Submit and trace leave, overtime, and attendance corrections.', icon: ClipboardCheck },
  benefits: { label: 'Benefits', title: 'Benefits Administration', subtitle: 'Eligibility, enrollment, cost, and payroll deductions.', icon: Gift },
  performance: { label: 'Performance', title: 'Performance Cycles', subtitle: 'Self-reviews, manager feedback, ratings, and acknowledgement.', icon: Star },
  approvals: { label: 'Approvals', title: 'Approvals Center', subtitle: 'Role-aware Manager → HR workflow decisions.', icon: ShieldCheck },
  payroll: { label: 'Payroll', title: 'Payroll Overview', subtitle: 'Frozen snapshots, validation, approval, release, and demo outputs.', icon: CircleDollarSign },
  reports: { label: 'Reports', title: 'Reports & Analytics', subtitle: 'Reconciled operational reports generated from current runtime data.', icon: FileBarChart },
  integrations: { label: 'Integrations', title: 'Mock Integrations Center', subtitle: 'Visible, interactive simulations that never make outbound requests.', icon: Network },
  administration: { label: 'Administration', title: 'Demo Administration', subtitle: 'Audit trail, seeded accounts, outbox, and demo information.', icon: Settings },
};

export function Shell({ page, onNavigate, children }: PropsWithChildren<{ page: PageKey; onNavigate: (page: PageKey) => void }>) {
  const { width } = useWindowDimensions();
  const compact = width < 860;
  const [menuOpen, setMenuOpen] = React.useState(!compact);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { persona, canAccess, logout, state, message, dismissMessage, markNotificationsRead } = useDemo();
  const meta = pageMeta[page];
  const unread = state.notifications.filter((item) => !item.read && (item.recipient === persona?.email || persona?.role === 'admin')).length;
  const searchResults = globalSearch(state, persona, searchQuery, canAccess);

  useEffect(() => { setMenuOpen(!compact); }, [compact]);
  useEffect(() => { if (!message) return; const id = setTimeout(dismissMessage, 4200); return () => clearTimeout(id); }, [message, dismissMessage]);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const listener = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true); } };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);

  const nav = (
    <View style={[styles.sidebar, compact && styles.sidebarOverlay]}>
      <View style={styles.brand}><View style={styles.brandMark}><Text style={styles.brandMarkText}>Z</Text></View><View><Text style={styles.brandTitle}>ZylHR</Text><Text style={styles.brandSub}>Enterprise HRIS Portal</Text></View>{compact ? <View style={{ marginLeft: 'auto' }}><IconButton icon={X} label="Close menu" onPress={() => setMenuOpen(false)} /></View> : null}</View>
      <ScrollView contentContainerStyle={styles.navList}>
        {(Object.keys(pageMeta) as PageKey[]).filter(canAccess).map((key) => {
          const item = pageMeta[key]; const Icon = item.icon; const active = page === key;
          return <Pressable key={key} onPress={() => { onNavigate(key); if (compact) setMenuOpen(false); }} style={({ pressed }) => [styles.navItem, active && styles.navItemActive, pressed && { opacity: 0.75 }]}><Icon size={16} color={active ? '#fff' : colors.muted} /><Text style={[styles.navText, active && styles.navTextActive]}>{item.label}</Text>{active ? <ChevronRight size={14} color="#fff" style={{ marginLeft: 'auto' }} /> : null}</Pressable>;
        })}
      </ScrollView>
      <View style={styles.sidebarFooter}><Pressable onPress={logout} style={styles.logout}><LogOut size={16} color={colors.red} /><Text style={styles.logoutText}>Sign out</Text></Pressable><Text style={styles.seed}>Seed ZYLHR-DEMO-0.1</Text></View>
    </View>
  );

  return <View style={styles.root}>
    {!compact || menuOpen ? nav : null}
    <View style={styles.main}>
      <View style={styles.topbar}>
        <View style={styles.topbarLeft}>{compact ? <IconButton icon={Menu} label="Open menu" onPress={() => setMenuOpen(true)} /> : null}<View><Text style={styles.topbarTitle}>{meta.title}</Text><Text style={styles.topbarSub}>{meta.subtitle}</Text></View></View>
        <View style={styles.topbarRight}><Pressable accessibilityRole="button" onPress={() => setSearchOpen(true)} style={styles.searchButton}><Search size={16} color={colors.muted} /><Text style={styles.searchLabel}>{compact ? 'Search' : 'Search ZylHR'}</Text><Text style={styles.searchHint}>⌘ K</Text></Pressable><Pressable onPress={markNotificationsRead} style={styles.bell}><Bell size={18} color={colors.muted} />{unread ? <View style={styles.unread}><Text style={styles.unreadText}>{Math.min(unread, 9)}</Text></View> : null}</Pressable><View style={styles.avatar}><Text style={styles.avatarText}>{persona?.initials}</Text></View><View style={styles.personaBlock}><Text style={styles.personaName}>{persona?.title}</Text><Text style={styles.personaEmail}>{persona?.email}</Text></View></View>
      </View>
      <View style={styles.demoBanner}><ShieldCheck size={14} color={colors.blueDark} /><Text style={styles.demoText}><Text style={{ fontWeight: '800' }}>Demo environment</Text> · Fictional data · Changes reset when this page reloads or the demo is reopened</Text></View>
      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.content}>{children}</ScrollView>
      {message ? <View style={styles.toast}><Text style={styles.toastText}>{message}</Text><Pressable onPress={dismissMessage}><X size={15} color="#fff" /></Pressable></View> : null}
    </View>
    {compact && menuOpen ? <Pressable onPress={() => setMenuOpen(false)} style={styles.overlay} /> : null}
    <Dialog visible={searchOpen} title="Search ZylHR" subtitle="Results are restricted to this persona's authorized modules and employee scope." onClose={() => { setSearchOpen(false); setSearchQuery(''); }} width={720}><Field autoFocus value={searchQuery} onChangeText={setSearchQuery} placeholder="Search employee, applicant, request, payroll run, or work item…" />{searchQuery.trim().length < 2 ? <View style={styles.searchEmpty}><Search size={24} color={colors.subtle} /><Text style={styles.searchEmptyTitle}>Type at least two characters</Text><Text style={styles.searchEmptyBody}>Try “Mika”, “attendance”, “PAY-2026”, or a department name.</Text></View> : searchResults.length ? <View style={styles.searchResults}>{searchResults.map((result) => <Pressable key={`${result.kind}-${result.id}`} onPress={() => { onNavigate(result.page); setSearchOpen(false); setSearchQuery(''); }} style={({ pressed }) => [styles.searchResult, pressed && { backgroundColor: colors.surfaceAlt }]}><View style={{ flex: 1 }}><Text style={styles.searchResultTitle}>{result.title}</Text><Text style={styles.searchResultDetail}>{result.detail}</Text></View><Badge label={result.kind} tone="info" /><ChevronRight size={16} color={colors.subtle} /></Pressable>)}</View> : <View style={styles.searchEmpty}><Search size={24} color={colors.subtle} /><Text style={styles.searchEmptyTitle}>No authorized results</Text><Text style={styles.searchEmptyBody}>Try a different term. Hidden modules and out-of-scope employees are never returned.</Text></View>}</Dialog>
  </View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, minHeight: '100%', backgroundColor: colors.canvas, flexDirection: 'row' },
  sidebar: { width: 218, backgroundColor: '#F8FAFF', borderRightWidth: 1, borderColor: colors.border, zIndex: 20 }, sidebarOverlay: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 276, ...shadow },
  brand: { minHeight: 72, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 10 }, brandMark: { width: 32, height: 32, backgroundColor: colors.ink, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, brandMarkText: { color: '#fff', fontSize: 17, fontWeight: '900' }, brandTitle: { fontSize: 16, fontWeight: '900', color: colors.ink }, brandSub: { fontSize: 9, color: colors.muted, marginTop: 1 },
  navList: { padding: 10, gap: 3 }, navItem: { minHeight: 36, paddingHorizontal: 10, borderRadius: radii.md, flexDirection: 'row', alignItems: 'center', gap: 10 }, navItemActive: { backgroundColor: colors.blue }, navText: { color: colors.text, fontSize: 12, fontWeight: '600' }, navTextActive: { color: '#fff', fontWeight: '800' },
  sidebarFooter: { marginTop: 'auto', padding: 14, borderTopWidth: 1, borderColor: colors.border, gap: 10 }, logout: { flexDirection: 'row', alignItems: 'center', gap: 9 }, logoutText: { color: colors.red, fontSize: 12, fontWeight: '700' }, seed: { fontSize: 9, color: colors.subtle },
  main: { flex: 1, minWidth: 0 }, topbar: { minHeight: 72, paddingHorizontal: 22, backgroundColor: colors.surface, borderBottomWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }, topbarLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }, topbarTitle: { fontSize: 17, fontWeight: '900', color: colors.ink }, topbarSub: { fontSize: 10, color: colors.muted, marginTop: 2 }, topbarRight: { flexDirection: 'row', alignItems: 'center', gap: 9 }, bell: { width: 38, height: 38, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' }, unread: { position: 'absolute', right: 1, top: 1, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }, unreadText: { color: '#fff', fontSize: 9, fontWeight: '900' }, avatar: { width: 34, height: 34, borderRadius: radii.full, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#fff', fontSize: 11, fontWeight: '900' }, personaBlock: { maxWidth: 150 }, personaName: { color: colors.text, fontSize: 11, fontWeight: '800' }, personaEmail: { color: colors.muted, fontSize: 9, marginTop: 1 },
  searchButton: { minHeight: 36, minWidth: 132, paddingHorizontal: 11, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.surfaceAlt, flexDirection: 'row', alignItems: 'center', gap: 7 }, searchLabel: { color: colors.muted, fontSize: 11, fontWeight: '600' }, searchHint: { marginLeft: 'auto', color: colors.subtle, fontSize: 9, fontWeight: '700' }, searchResults: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, overflow: 'hidden' }, searchResult: { minHeight: 58, paddingHorizontal: 13, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderColor: colors.border }, searchResultTitle: { color: colors.ink, fontSize: 12, fontWeight: '800' }, searchResultDetail: { color: colors.muted, fontSize: 10, marginTop: 3 }, searchEmpty: { minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: 7 }, searchEmptyTitle: { color: colors.text, fontSize: 13, fontWeight: '800' }, searchEmptyBody: { color: colors.muted, fontSize: 11, textAlign: 'center' },
  demoBanner: { minHeight: 34, paddingHorizontal: 22, backgroundColor: colors.blueSoft, borderBottomWidth: 1, borderColor: '#D1E0FF', flexDirection: 'row', alignItems: 'center', gap: 7 }, demoText: { color: colors.blueDark, fontSize: 10 }, contentScroll: { flex: 1 }, content: { padding: 22, gap: 18, width: '100%', maxWidth: 1480, alignSelf: 'center' },
  toast: { position: 'absolute', right: 20, bottom: 20, maxWidth: 440, minHeight: 44, paddingHorizontal: 16, paddingVertical: 12, borderRadius: radii.lg, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', gap: 14, ...shadow }, toastText: { color: '#fff', flex: 1, fontSize: 12, lineHeight: 18, fontWeight: '600' }, overlay: { position: 'absolute', left: 276, right: 0, top: 0, bottom: 0, zIndex: 10, backgroundColor: 'rgba(15,23,42,0.35)' },
});
