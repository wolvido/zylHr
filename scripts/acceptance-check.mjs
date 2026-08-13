import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { unzipSync, strFromU8 } from 'fflate';

const workspace = resolve(import.meta.dirname, '..');
const output = mkdtempSync(join(workspace, 'node_modules', '.zylhr-acceptance-'));
execFileSync(process.execPath, [
  join(workspace, 'node_modules/typescript/bin/tsc'), '--ignoreConfig', '--module', 'commonjs', '--target', 'es2022', '--esModuleInterop', '--skipLibCheck', '--outDir', output,
  join(workspace, 'src/types.ts'), join(workspace, 'src/data/seed.ts'), join(workspace, 'src/services/payroll.ts'), join(workspace, 'src/services/exports.ts'), join(workspace, 'src/services/demoPlus.ts'),
], { cwd: workspace, stdio: 'inherit' });

const require = createRequire(import.meta.url);
const seed = require(join(output, 'data/seed.js'));
const payroll = require(join(output, 'services/payroll.js'));
const exportsService = require(join(output, 'services/exports.js'));
const demoPlus = require(join(output, 'services/demoPlus.js'));
const state = seed.createDemoState();

assert.equal(state.employees.length, 250, 'employee seed count');
assert.equal(state.employees.filter((employee) => employee.status === 'Active').length, 246, 'active employee count');
assert.deepEqual(Object.fromEntries(['Weekly', 'Semi-monthly', 'Monthly'].map((group) => [group, state.employees.filter((employee) => employee.status === 'Active' && employee.payrollGroup === group).length])), { Weekly: 30, 'Semi-monthly': 190, Monthly: 26 }, 'payroll group split');
assert.equal(state.applicants.length, 25, 'applicant count');
assert.equal(state.requisitions.length, 5, 'requisition count');
assert.equal(state.scheduleTemplates.length, 5, 'schedule templates');
assert.equal(state.devices.length, 3, 'biometric devices');
assert.ok(state.attendanceExceptions.length >= 20, 'attendance exception breadth');
assert.ok(state.requests.length >= 12, 'request workflow seed breadth');
assert.deepEqual(new Set(state.dailyAttendance.map((day) => day.status)), new Set(['Present', 'Late', 'Undertime', 'Absent', 'Missing punch', 'Overtime candidate', 'Rest-day work', 'Holiday work', 'Overnight work']), 'all attendance outcomes represented');
assert.ok(state.notifications.length >= 20 && state.outbox.length >= 20 && state.audit.length >= 50, 'operational evidence seed');
assert.equal(state.performanceCycles.filter((cycle) => cycle.status === 'Active').length, 1, 'active performance cycle');
assert.equal(state.performanceCycles.filter((cycle) => cycle.status === 'Completed').length, 1, 'completed performance cycle');
assert.ok(state.documentCompliance.some((item) => item.status === 'Missing') && state.documentCompliance.some((item) => item.status === 'Expiring') && state.documentCompliance.some((item) => item.status === 'Acknowledgement due'), 'document compliance scenario breadth');
assert.equal(state.payrollRuns.find((run) => run.id === 'PAY-2026-08A').signOff.length, 4, 'processor sign-off catalog');
assert.ok(state.payrollRuns.find((run) => run.status === 'Released').signOff.every((item) => item.checked), 'released sign-off evidence');

const asOfMika = demoPlus.employeeAsOf(state.employees[0], '2024-12-31');
assert.equal(asOfMika.snapshot.department, 'Administration', 'historical assignment reconstruction');
assert.notEqual(asOfMika.snapshot.department, state.employees[0].department, 'historical view differs without mutating current assignment');

const employeeImport = demoPlus.validateImport('Employee master', demoPlus.employeeImportFixture, state);
const attendanceImport = demoPlus.validateImport('Attendance events', demoPlus.attendanceImportFixture, state);
assert.equal(employeeImport.rows.filter((row) => row.valid).length, 2, 'employee import valid rows');
assert.equal(employeeImport.rows.filter((row) => !row.valid).length, 2, 'employee import invalid rows');
assert.equal(attendanceImport.rows.filter((row) => row.valid).length, 2, 'attendance import valid rows');
assert.equal(attendanceImport.rows.filter((row) => !row.valid).length, 2, 'attendance import invalid rows');
const hrPersona = seed.personas.find((persona) => persona.role === 'hr');
assert.ok(demoPlus.buildWorkItems(state, hrPersona).some((item) => item.page === 'documents'), 'HR command center includes document work');
const employeePersona = seed.personas.find((persona) => persona.role === 'employee');
const employeeSearch = demoPlus.globalSearch(state, employeePersona, 'EMP-2026-002', (page) => ['dashboard', 'people', 'documents', 'attendance', 'requests', 'benefits', 'performance', 'payroll'].includes(page));
assert.equal(employeeSearch.filter((result) => result.kind === 'Employee').length, 0, 'employee global search respects self scope');

const calculationA = payroll.calculatePayroll(state.employees, state.requests, state.benefits, 'payroll', 1);
const calculationB = payroll.calculatePayroll(state.employees, state.requests, state.benefits, 'payroll', 1);
assert.deepEqual(calculationA, calculationB, 'unchanged payroll input must be deterministic');
assert.equal(calculationA.lines.length, 190, 'semi-monthly employee coverage');
assert.ok(calculationA.blockers.length > 0, 'seeded validation blocker');
assert.equal(calculationA.totals.grossCents - calculationA.totals.deductionsCents, calculationA.totals.netCents, 'payroll totals reconcile');
assert.ok(demoPlus.reconciliationEvidence(calculationA).every((item) => item.status === 'Reconciled'), 'all payroll output controls reconcile');

const approvedLeave = { id: 'ACCEPT-LVA', employeeId: 'EMP-2026-001', type: 'Unpaid Leave', startDate: '2026-08-20', endDate: '2026-08-20', units: 1, reason: 'Acceptance case', status: 'Approved', createdAt: seed.demoClock.now(), history: [] };
const withLeave = payroll.calculatePayroll(state.employees, [...state.requests, approvedLeave], state.benefits, 'payroll', 1);
const beforeLine = calculationA.lines.find((line) => line.employeeId === approvedLeave.employeeId);
const afterLine = withLeave.lines.find((line) => line.employeeId === approvedLeave.employeeId);
assert.ok(afterLine.unpaidLeaveCents > 0 && afterLine.netCents < beforeLine.netCents, 'approved unpaid leave changes payroll');

const releasedSnapshot = JSON.parse(JSON.stringify(calculationA));
state.employees[0].salaryCents += 1_000_000;
assert.deepEqual(releasedSnapshot, calculationA, 'frozen snapshot remains immutable after source edit');
assert.equal(payroll.GOLDEN_CASES.length, 9, 'payroll golden scenario catalog');

const workbook = exportsService.buildDemoWorkbookBytes({ Summary: [['Metric', 'Amount'], ['Net', calculationA.totals.netCents / 100]] });
const workbookFiles = unzipSync(workbook);
assert.ok(workbookFiles['[Content_Types].xml'] && workbookFiles['xl/workbook.xml'] && workbookFiles['xl/worksheets/sheet1.xml'], 'valid XLSX package parts');
assert.ok(strFromU8(workbookFiles['xl/worksheets/sheet1.xml']).includes('DEMO / NOT FOR SUBMISSION'), 'XLSX demo notice');

const sourceFiles = ['App.tsx', ...['src/store/DemoStore.tsx', 'src/services/payroll.ts', 'src/services/demoPlus.ts', 'src/screens/DemoPlusScreens.tsx', 'src/screens/IntegrationsAdminScreens.tsx']].map((path) => readFileSync(join(workspace, path), 'utf8')).join('\n');
for (const prohibited of ['localStorage.', 'sessionStorage.', 'indexedDB.', 'fetch(', 'XMLHttpRequest']) assert.ok(!sourceFiles.includes(prohibited), `no prohibited runtime service: ${prohibited}`);

console.log(JSON.stringify({
  result: 'PASS',
  employees: state.employees.length,
  activeEmployees: 246,
  payrollLines: calculationA.lines.length,
  payrollNetCents: calculationA.totals.netCents,
  unpaidLeaveReductionCents: beforeLine.netCents - afterLine.netCents,
  workbookBytes: workbook.byteLength,
  goldenCases: payroll.GOLDEN_CASES.length,
  documentRequirements: state.documentCompliance.length,
  employeeImportValidRows: employeeImport.rows.filter((row) => row.valid).length,
  attendanceImportValidRows: attendanceImport.rows.filter((row) => row.valid).length,
  payrollReconciliationControls: demoPlus.reconciliationEvidence(calculationA).length,
  runtimeNetworkDependencies: 0,
}, null, 2));
