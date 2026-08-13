import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AlertTriangle, CalendarClock, Check, ClipboardList, Download, FileCheck2, FileUp, History, SearchCheck, ShieldAlert } from 'lucide-react-native';
import { Badge, Button, Card, Dialog, EmptyState, Field, SectionHeader, SelectChips, StatCard, Table } from '../components/ui';
import { useDemo } from '../store/DemoStore';
import { colors, money, radii } from '../theme';
import { ImportKind, PageKey, StatusTone } from '../types';
import { attendanceImportFixture, buildWorkItems, employeeAsOf, employeeImportFixture, validateImport } from '../services/demoPlus';
import { downloadCsv } from '../services/exports';

const priorityTone = (priority: string): StatusTone => priority === 'Critical' ? 'danger' : priority === 'High' ? 'warning' : priority === 'Medium' ? 'info' : 'neutral';

export function OperationsScreen({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  const { state, persona } = useDemo();
  const [priority, setPriority] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');
  const [status, setStatus] = useState('All statuses');
  const items = useMemo(() => buildWorkItems(state, persona), [state, persona]);
  const statuses = ['All statuses', ...Array.from(new Set(items.map((item) => item.status)))];
  const shown = items.filter((item) => (priority === 'All' || item.priority === priority) && (status === 'All statuses' || item.status === status));
  return <>
    <View style={styles.stats}><StatCard label="Critical" value={String(items.filter((item) => item.priority === 'Critical').length)} detail="Immediate action" icon={ShieldAlert} tone="danger" /><StatCard label="High priority" value={String(items.filter((item) => item.priority === 'High').length)} detail="Due soon" icon={AlertTriangle} tone="warning" /><StatCard label="Open work" value={String(items.length)} detail="Scoped to this persona" icon={ClipboardList} /><StatCard label="Oldest" value={`${Math.max(0, ...items.map((item) => item.ageDays))}d`} detail="Queue age" icon={CalendarClock} /></View>
    <Card><View style={styles.pad}><SectionHeader title="Operations Command Center" subtitle="One prioritized queue assembled from live workflow, time, document, payroll, recruitment, performance, and connector state." /><View style={styles.filters}><SelectChips label="Priority" options={['All', 'Critical', 'High', 'Medium', 'Low'] as const} value={priority} onChange={setPriority} /><SelectChips label="Status" options={statuses} value={status} onChange={setStatus} /></View></View>
      {shown.length ? <Table minWidth={1050} headers={['Work item', 'Priority', 'Owner', 'Due', 'Age', 'Status', 'Next action']} rows={shown.map((item) => [<View><Text style={styles.primary}>{item.title}</Text><Text style={styles.secondary}>{item.id} · {item.detail}</Text></View>, <Badge label={item.priority} tone={priorityTone(item.priority)} />, item.owner, item.dueDate, `${item.ageDays} days`, <Badge label={item.status} tone={item.status.includes('Pending') || item.status === 'Open' || item.status === 'Not signed' ? 'warning' : 'info'} />, <Button label={item.action} compact tone="secondary" onPress={() => onNavigate(item.page)} />])} /> : <EmptyState icon={Check} title="Queue cleared" body="There are no work items for the current filters and persona." />}
    </Card>
  </>;
}

export function ImportsScreen() {
  const { state, persona, stageImport, commitImport, recordExport } = useDemo();
  const [kind, setKind] = useState<ImportKind>(persona?.role === 'timeadmin' ? 'Attendance events' : 'Employee master');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const batch = state.importBatches.find((item) => item.id === selectedId) ?? state.importBatches[0];
  const preview = (fileName: string, csv: string) => {
    const result = validateImport(kind, csv, state);
    if (result.fatal) { setError(result.fatal); return; }
    const id = stageImport(kind, fileName, result.rows);
    if (id) { setSelectedId(id); setError(''); }
  };
  const pickFile = () => {
    if (typeof document === 'undefined') { setError('File selection is available in the web demo.'); return; }
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.csv,text/csv';
    input.onchange = () => { const file = input.files?.[0]; if (file) void file.text().then((text) => preview(file.name, text)); };
    input.click();
  };
  const invalid = batch?.rows.filter((row) => !row.valid) ?? [];
  return <>
    <View style={styles.stats}><StatCard label="Previewed batches" value={String(state.importBatches.filter((item) => item.status === 'Previewed').length)} detail="Awaiting commit" icon={SearchCheck} /><StatCard label="Committed batches" value={String(state.importBatches.filter((item) => item.status === 'Committed').length)} detail="Runtime-local history" icon={FileCheck2} tone="success" /><StatCard label="Valid rows" value={String(batch?.rows.filter((row) => row.valid).length ?? 0)} detail={batch?.fileName ?? 'Load a fixture'} icon={Check} /><StatCard label="Invalid rows" value={String(invalid.length)} detail="Skipped on commit" icon={AlertTriangle} tone={invalid.length ? 'warning' : 'success'} /></View>
    <Card style={styles.pad}><SectionHeader title="Bulk Import Center" subtitle="Select a local CSV or use a deterministic fixture. Files are parsed in this browser and never transmitted." /><SelectChips label="Import type" options={persona?.role === 'timeadmin' ? ['Attendance events'] as const : ['Employee master'] as const} value={kind} onChange={setKind} /><View style={styles.actions}><Button label="Load demo fixture" icon={SearchCheck} onPress={() => preview(kind === 'Employee master' ? 'employee-master-demo.csv' : 'attendance-events-demo.csv', kind === 'Employee master' ? employeeImportFixture : attendanceImportFixture)} /><Button label="Select local CSV" icon={FileUp} tone="secondary" onPress={pickFile} /></View>{error ? <Text style={styles.error}>{error}</Text> : null}</Card>
    {batch ? <Card><View style={styles.pad}><SectionHeader title={`${batch.kind} · ${batch.fileName}`} subtitle={`${batch.id} · ${batch.status} · ${batch.rows.filter((row) => row.valid).length} valid / ${invalid.length} invalid`} action={<Badge label={batch.status} tone={batch.status === 'Committed' ? 'success' : 'warning'} />} /><View style={styles.actions}><Button label="Commit valid rows" icon={Check} disabled={batch.status === 'Committed' || !batch.rows.some((row) => row.valid)} onPress={() => commitImport(batch.id)} /><Button label="Download error report" icon={Download} tone="secondary" disabled={!invalid.length} onPress={() => { downloadCsv('IMPORT_ERRORS', [['Row', 'Errors', 'Values'], ...invalid.map((row) => [row.rowNumber, row.errors.join('; '), JSON.stringify(row.values)])]); recordExport(`${batch.id} import error report`); }} /></View></View><Table minWidth={940} headers={['Row', 'Result', 'Values', 'Errors']} rows={batch.rows.map((row) => [String(row.rowNumber), <Badge label={row.valid ? 'Valid' : 'Invalid'} tone={row.valid ? 'success' : 'danger'} />, Object.values(row.values).join(' · '), row.errors.join('; ') || '—'])} /></Card> : <EmptyState icon={FileUp} title="No import preview yet" body="Load a fixture or select a CSV to validate it before any runtime data changes." />}
    {state.importBatches.length ? <Card><View style={styles.pad}><SectionHeader title="Import audit history" subtitle="Preview and commit evidence is also recorded in the main audit trail." /></View><Table headers={['Batch', 'Type', 'File', 'Created by', 'Rows', 'Status']} rows={state.importBatches.map((item) => [item.id, item.kind, item.fileName, item.createdBy, String(item.rows.length), <Badge label={item.status} tone={item.status === 'Committed' ? 'success' : 'warning'} />])} /></Card> : null}
  </>;
}

export function DocumentsScreen() {
  const { state, persona, resolveDocument, sendDocumentReminder, acknowledgeDocument, recordExport } = useDemo();
  const [status, setStatus] = useState<'All' | 'Missing' | 'Expiring' | 'Acknowledgement due' | 'Current'>('All');
  const [historyId, setHistoryId] = useState<string | null>(null);
  const records = state.documentCompliance.filter((item) => (persona?.role === 'employee' ? item.employeeId === persona.employeeId : true) && (status === 'All' || item.status === status));
  const historyItem = state.documentCompliance.find((item) => item.id === historyId);
  const employeeName = (id: string) => { const employee = state.employees.find((item) => item.id === id); return employee ? `${employee.firstName} ${employee.lastName}` : id; };
  return <>
    <View style={styles.stats}><StatCard label="Missing" value={String(records.filter((item) => item.status === 'Missing').length)} detail="Required evidence absent" icon={AlertTriangle} tone="danger" /><StatCard label="Expiring" value={String(records.filter((item) => item.status === 'Expiring').length)} detail="Renewal required" icon={CalendarClock} tone="warning" /><StatCard label="Acknowledgements" value={String(records.filter((item) => item.status === 'Acknowledgement due').length)} detail="Policy response due" icon={FileCheck2} /><StatCard label="Current" value={String(records.filter((item) => item.status === 'Current').length)} detail="Compliant" icon={Check} tone="success" /></View>
    <Card><View style={styles.pad}><SectionHeader title="Document Compliance Center" subtitle="Required records, confidentiality, version, due date, owner, and next action. No production files are stored." action={<Button label="Export employee-file manifest" icon={Download} compact tone="secondary" onPress={() => { downloadCsv('EMPLOYEE_FILE_MANIFEST', [['Employee ID', 'Employee', 'Category', 'Document', 'Confidentiality', 'Due date', 'Version', 'Status'], ...records.map((item) => [item.employeeId, employeeName(item.employeeId), item.category, item.documentName, item.confidentiality, item.dueDate, item.version, item.status])]); recordExport(`Document manifest · ${persona?.role === 'employee' ? 'self' : 'authorized scope'}`); }} />} /><SelectChips label="Status" options={['All', 'Missing', 'Expiring', 'Acknowledgement due', 'Current'] as const} value={status} onChange={setStatus} /></View>
      {records.length ? <Table minWidth={1150} headers={['Employee / document', 'Category', 'Confidentiality', 'Due / expiry', 'Version', 'Owner', 'Status', 'Actions']} rows={records.map((item) => [<View><Text style={styles.primary}>{item.documentName}</Text><Text style={styles.secondary}>{employeeName(item.employeeId)} · {item.employeeId}</Text></View>, item.category, <Badge label={item.confidentiality} tone={item.confidentiality === 'Restricted' ? 'warning' : 'neutral'} />, item.dueDate, item.version, item.owner, <Badge label={item.status} tone={item.status === 'Current' ? 'success' : item.status === 'Missing' ? 'danger' : 'warning'} />, <View style={styles.inline}><Button label="History" compact tone="secondary" onPress={() => setHistoryId(item.id)} />{item.status === 'Current' ? null : persona?.role === 'employee' ? <Button label="Acknowledge" compact onPress={() => acknowledgeDocument(item.id)} /> : persona?.role === 'hr' ? <><Button label="Remind" compact tone="secondary" onPress={() => sendDocumentReminder(item.id)} /><Button label="Resolve" compact onPress={() => resolveDocument(item.id)} /></> : <Badge label="View only" tone="neutral" />}</View>])} /> : <EmptyState icon={Check} title="No matching requirements" body="Change the status filter to view other document obligations." />}
    </Card>
    <Dialog visible={!!historyItem} title={historyItem?.documentName ?? 'Document version history'} subtitle={historyItem ? `${historyItem.employeeId} · ${historyItem.category} · ${historyItem.confidentiality}` : ''} onClose={() => setHistoryId(null)}><Table minWidth={520} headers={['Version', 'Date', 'Event', 'Evidence']} rows={historyItem ? [[historyItem.version, historyItem.resolvedAt?.slice(0, 10) ?? historyItem.dueDate, historyItem.status === 'Current' ? 'Current version established' : 'Requirement opened', historyItem.acknowledgedAt ? `Acknowledged ${historyItem.acknowledgedAt}` : 'Fictional demo metadata'], ['v1', '2025-08-13', 'Initial seeded version', 'Historical demo entry']] : []} /><Card style={styles.notice}><Text style={styles.primary}>Demo version history</Text><Text style={styles.secondary}>These entries prove version-aware UI behavior only. No production document file, signature, retention record, or malware scan exists.</Text></Card></Dialog>
  </>;
}

export function HistoricalAsOfPanel() {
  const { state } = useDemo();
  const [date, setDate] = useState('2024-12-31');
  const snapshots = useMemo(() => state.employees.map((employee) => employeeAsOf(employee, date)).filter((item): item is NonNullable<typeof item> => !!item), [state.employees, date]);
  const active = snapshots.filter((item) => item.snapshot.status === 'Active');
  const changed = snapshots.filter((item) => item.snapshot.department !== item.employee.department || item.snapshot.position !== item.employee.position || item.snapshot.salaryCents !== item.employee.salaryCents || item.snapshot.status !== item.employee.status);
  const departments = Array.from(new Set([...state.organization.filter((item) => item.type === 'Department').map((item) => item.name), ...active.map((item) => item.snapshot.department)])).map((department) => ({ department, asOf: active.filter((item) => item.snapshot.department === department).length, current: state.employees.filter((employee) => employee.status === 'Active' && employee.department === department).length }));
  return <View style={styles.stack}>
    <Card style={styles.pad}><SectionHeader title="Historical as-of mode" subtitle="Reconstructs seeded effective-dated assignments without mutating the current employee record." /><View style={styles.filters}><SelectChips label="Quick dates" options={['2024-12-31', '2025-12-31', '2026-08-13'] as const} value={(['2024-12-31', '2025-12-31', '2026-08-13'].includes(date) ? date : '2024-12-31') as '2024-12-31'} onChange={setDate} /><Field label="Custom as-of date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" /></View></Card>
    <View style={styles.stats}><StatCard label="As-of headcount" value={String(active.length)} detail={date} icon={History} /><StatCard label="Current headcount" value={String(state.employees.filter((employee) => employee.status === 'Active').length)} detail="2026-08-13" icon={FileCheck2} tone="success" /><StatCard label="Changed records" value={String(changed.length)} detail="Assignment, pay, or status" icon={SearchCheck} tone="warning" /></View>
    <Card><View style={styles.pad}><SectionHeader title="Current versus as-of employee versions" subtitle={`Showing differences effective on or before ${date}.`} /></View>{changed.length ? <Table minWidth={1100} headers={['Employee', 'Effective source', 'As-of assignment', 'Current assignment', 'As-of pay', 'Current pay', 'Status']} rows={changed.slice(0, 24).map((item) => [<View><Text style={styles.primary}>{item.employee.firstName} {item.employee.lastName}</Text><Text style={styles.secondary}>{item.employee.id}</Text></View>, `${item.source} · ${item.effectiveDate}`, `${item.snapshot.position} · ${item.snapshot.department}`, `${item.employee.position} · ${item.employee.department}`, money(item.snapshot.salaryCents), money(item.employee.salaryCents), `${item.snapshot.status} → ${item.employee.status}`])} /> : <EmptyState icon={History} title="No version differences at this date" body="Choose an earlier date to see seeded transfers, promotions, compensation changes, and separations." />}</Card>
    <Card><View style={styles.pad}><SectionHeader title="Department headcount comparison" subtitle="Totals are reconstructed from the same effective-dated employee snapshots." /></View><Table headers={['Department', `As of ${date}`, 'Current', 'Difference']} rows={departments.map((item) => [item.department, String(item.asOf), String(item.current), String(item.current - item.asOf)])} /></Card>
  </View>;
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, stack: { gap: 18 }, pad: { padding: 18, gap: 15 }, filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, inline: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 }, primary: { color: colors.text, fontSize: 11, fontWeight: '800' }, secondary: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 2 }, error: { padding: 11, borderRadius: radii.md, color: colors.red, backgroundColor: colors.redSoft, fontSize: 12, fontWeight: '700' }, notice: { padding: 12, backgroundColor: colors.blueSoft, borderColor: '#D1E0FF' },
});
