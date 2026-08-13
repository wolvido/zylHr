import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, Banknote, BriefcaseBusiness, CalendarClock, CheckCircle2, ClockAlert, UsersRound } from 'lucide-react-native';
import { Badge, Card, Progress, SectionHeader, StatCard } from '../components/ui';
import { colors, money, number, radii } from '../theme';
import { PageKey } from '../types';
import { useDemo } from '../store/DemoStore';

export function DashboardScreen({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  const { state, persona, canAccess } = useDemo();
  const active = state.employees.filter((employee) => employee.status === 'Active');
  const drafts = state.employees.filter((employee) => employee.status === 'Draft').length;
  const pending = state.requests.filter((request) => request.status.startsWith('Pending')).length;
  const openExceptions = state.attendanceExceptions.filter((item) => item.status !== 'Resolved').length;
  const currentRun = state.payrollRuns.find((run) => run.id === 'PAY-2026-08A')!;
  const departments = [...new Set(active.map((employee) => employee.department))].map((department) => ({ department, count: active.filter((employee) => employee.department === department).length })).sort((a, b) => b.count - a.count);
  const myEmployee = state.employees.find((employee) => employee.id === persona?.employeeId);
  const team = persona?.role === 'manager' ? state.employees.filter((employee) => employee.managerId === persona.employeeId) : [];

  const cards = persona?.role === 'employee' && myEmployee ? [
    { label: 'Leave balance', value: `${myEmployee.leaveBalance} days`, detail: 'Current simplified ledger', icon: CalendarClock, tone: 'success' as const, page: 'requests' as PageKey },
    { label: 'Open requests', value: String(state.requests.filter((request) => request.employeeId === myEmployee.id && request.status.startsWith('Pending')).length), detail: 'Awaiting Manager or HR', icon: ClockAlert, tone: 'warning' as const, page: 'requests' as PageKey },
    { label: 'Benefits', value: String(myEmployee.benefitPlanIds.length), detail: 'Active enrollments', icon: CheckCircle2, tone: 'info' as const, page: 'benefits' as PageKey },
    { label: 'Latest payslip', value: state.payrollRuns.some((run) => run.status === 'Released') ? 'Available' : 'Pending', detail: 'Fictional demo document', icon: Banknote, tone: 'success' as const, page: 'payroll' as PageKey },
  ] : persona?.role === 'manager' ? [
    { label: 'Direct reports', value: String(team.length), detail: 'Your fictional team', icon: UsersRound, tone: 'info' as const, page: 'people' as PageKey },
    { label: 'Manager approvals', value: String(state.requests.filter((request) => request.status === 'Pending Manager').length), detail: 'First-stage decisions', icon: ClockAlert, tone: 'warning' as const, page: 'approvals' as PageKey },
    { label: 'Attendance flags', value: String(state.attendanceExceptions.filter((item) => team.some((employee) => employee.id === item.employeeId) && item.status !== 'Resolved').length), detail: 'Direct reports only', icon: CalendarClock, tone: 'danger' as const, page: 'attendance' as PageKey },
    { label: 'Review progress', value: '62%', detail: '2026 Midyear cycle', icon: CheckCircle2, tone: 'success' as const, page: 'performance' as PageKey },
  ] : [
    { label: 'Active headcount', value: number(active.length), detail: `${drafts} employee draft${drafts === 1 ? '' : 's'}`, icon: UsersRound, tone: 'info' as const, page: 'people' as PageKey },
    { label: 'Open requisitions', value: String(state.requisitions.filter((item) => item.status === 'Open').length), detail: `${state.applicants.length} applicants`, icon: BriefcaseBusiness, tone: 'success' as const, page: 'recruitment' as PageKey },
    { label: 'Pending approvals', value: String(pending), detail: 'Manager and HR stages', icon: ClockAlert, tone: 'warning' as const, page: 'approvals' as PageKey },
    { label: 'Attendance exceptions', value: String(openExceptions), detail: `${state.attendanceExceptions.filter((item) => item.type === 'Missing punch').length} missing punches`, icon: CalendarClock, tone: 'danger' as const, page: 'attendance' as PageKey },
  ];

  return <>
    <Card style={styles.welcome}><View style={{ flex: 1 }}><Text style={styles.eyebrow}>SIGNED IN FOR THIS WALKTHROUGH</Text><Text style={styles.welcomeTitle}>{persona?.title}</Text><Text style={styles.welcomeBody}>{persona?.description}</Text></View><Badge label="Runtime-only access" tone="info" /></Card>
    <View style={styles.stats}>{cards.filter((card) => canAccess(card.page)).map((card) => <StatCard key={card.label} {...card} onPress={() => onNavigate(card.page)} />)}</View>
    <View style={styles.twoCol}>
      <Card style={styles.panel}><SectionHeader title="Headcount by department" subtitle="Live counts update after activation or transfers." action={canAccess('people') ? <Pressable onPress={() => onNavigate('people')} style={styles.textAction}><Text style={styles.textActionText}>View people</Text><ArrowRight size={13} color={colors.blue} /></Pressable> : undefined} /><View style={styles.barList}>{departments.slice(0, 6).map((item) => <View key={item.department} style={styles.barRow}><View style={styles.barLabels}><Text style={styles.barName}>{item.department}</Text><Text style={styles.barCount}>{item.count}</Text></View><Progress value={(item.count / Math.max(...departments.map((d) => d.count))) * 100} /></View>)}</View></Card>
      <Card style={styles.panel}><SectionHeader title="Current payroll cycle" subtitle="August 1–15 · Semi-monthly" action={<Badge label={currentRun.status} tone={currentRun.status === 'Released' ? 'success' : currentRun.status === 'Draft' ? 'neutral' : 'info'} />} />
        <View style={styles.payrollTotal}><Text style={styles.payrollLabel}>{canAccess('payroll') ? 'Latest calculated net' : 'Financial details'}</Text><Text style={styles.payrollValue}>{canAccess('payroll') ? currentRun.snapshot ? money(currentRun.snapshot.totals.netCents) : 'Not calculated' : 'Restricted for this persona'}</Text></View>
        <View style={styles.steps}>{['Draft', 'Calculated', 'Validated', 'Approved', 'Released'].map((step, index) => { const current = ['Draft', 'Calculated', 'Validated', 'Approved', 'Released'].indexOf(currentRun.status); return <View key={step} style={styles.step}><View style={[styles.stepDot, index <= current && styles.stepDotDone]} /><Text style={[styles.stepText, index <= current && styles.stepTextDone]}>{step}</Text></View>; })}</View>
        {canAccess('payroll') ? <Pressable onPress={() => onNavigate('payroll')} style={styles.openPanel}><Text style={styles.openPanelText}>Open payroll evidence</Text><ArrowRight size={14} color={colors.blue} /></Pressable> : null}
      </Card>
    </View>
    <Card style={styles.panel}><SectionHeader title="Attention queue" subtitle="The most useful next actions for this persona." /><View style={styles.queue}>
      {[
        { title: `${pending} workflow requests need a decision`, detail: 'Manager and HR stages are enforced separately.', page: 'approvals' as PageKey, tone: 'warning' as const },
        { title: `${openExceptions} attendance exceptions remain open`, detail: 'Resolve source time before payroll validation.', page: 'attendance' as PageKey, tone: 'danger' as const },
        { title: `${state.applicants.filter((item) => item.offerAccepted && !item.convertedEmployeeId).length} accepted offer is ready to convert`, detail: 'Conversion creates the deterministic employee number 251.', page: 'recruitment' as PageKey, tone: 'info' as const },
      ].filter((item) => canAccess(item.page)).map((item) => <Pressable key={item.title} onPress={() => onNavigate(item.page)} style={styles.queueItem}><Badge label={item.tone === 'danger' ? 'Exception' : item.tone === 'warning' ? 'Pending' : 'Ready'} tone={item.tone} /><View style={{ flex: 1 }}><Text style={styles.queueTitle}>{item.title}</Text><Text style={styles.queueDetail}>{item.detail}</Text></View><ArrowRight size={16} color={colors.subtle} /></Pressable>)}
    </View></Card>
  </>;
}

const styles = StyleSheet.create({
  welcome: { padding: 18, flexDirection: 'row', alignItems: 'center', gap: 16 }, eyebrow: { color: colors.blue, fontSize: 9, fontWeight: '900', letterSpacing: 0.7 }, welcomeTitle: { color: colors.ink, fontSize: 20, fontWeight: '900', marginTop: 4 }, welcomeBody: { color: colors.muted, fontSize: 12, marginTop: 4 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, twoCol: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 }, panel: { padding: 18, flex: 1, minWidth: 300 }, barList: { gap: 14, marginTop: 18 }, barRow: { gap: 6 }, barLabels: { flexDirection: 'row', justifyContent: 'space-between' }, barName: { color: colors.text, fontSize: 11, fontWeight: '600' }, barCount: { color: colors.ink, fontSize: 11, fontWeight: '900', fontVariant: ['tabular-nums'] }, textAction: { flexDirection: 'row', alignItems: 'center', gap: 4 }, textActionText: { color: colors.blue, fontSize: 11, fontWeight: '800' },
  payrollTotal: { marginTop: 22, padding: 16, backgroundColor: colors.surfaceAlt, borderRadius: radii.md }, payrollLabel: { color: colors.muted, fontSize: 10 }, payrollValue: { color: colors.ink, fontSize: 22, fontWeight: '900', marginTop: 4, fontVariant: ['tabular-nums'] }, steps: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }, step: { alignItems: 'center', gap: 5 }, stepDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#DCE3EE' }, stepDotDone: { backgroundColor: colors.blue }, stepText: { color: colors.subtle, fontSize: 8 }, stepTextDone: { color: colors.blueDark, fontWeight: '700' }, openPanel: { marginTop: 20, borderTopWidth: 1, borderColor: colors.border, paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, openPanelText: { color: colors.blue, fontSize: 11, fontWeight: '800' },
  queue: { marginTop: 14 }, queueItem: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, borderColor: colors.border, paddingVertical: 11 }, queueTitle: { color: colors.text, fontSize: 12, fontWeight: '700' }, queueDetail: { color: colors.muted, fontSize: 10, marginTop: 3 },
});
