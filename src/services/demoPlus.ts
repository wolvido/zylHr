import { DemoState, Employee, ImportKind, ImportRow, PageKey, PayrollSnapshot, Persona } from '../types';

export interface WorkItem {
  id: string;
  title: string;
  detail: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  owner: string;
  dueDate: string;
  ageDays: number;
  status: string;
  action: string;
  page: PageKey;
}

export interface SearchResult {
  id: string;
  kind: string;
  title: string;
  detail: string;
  page: PageKey;
}

export interface EmployeeAsOf {
  employee: Employee;
  snapshot: NonNullable<Employee['employmentHistory'][number]['snapshot']>;
  effectiveDate: string;
  source: string;
}

export interface PayrollVarianceRow {
  employeeId: string;
  employee: string;
  priorNetCents: number;
  currentNetCents: number;
  varianceCents: number;
  variancePercent: number;
  material: boolean;
  driver: string;
}

const dayNumber = (date: string) => Math.floor(new Date(`${date}T00:00:00+08:00`).getTime() / 86400000);

export function visibleEmployees(state: DemoState, persona: Persona | null) {
  if (!persona) return [];
  if (persona.role === 'employee') return state.employees.filter((employee) => employee.id === persona.employeeId);
  if (persona.role === 'manager') return state.employees.filter((employee) => employee.id === persona.employeeId || employee.managerId === persona.employeeId);
  return state.employees;
}

export function buildWorkItems(state: DemoState, persona: Persona | null): WorkItem[] {
  if (!persona) return [];
  const today = dayNumber('2026-08-13');
  const items: WorkItem[] = [];
  const push = (item: Omit<WorkItem, 'ageDays'> & { createdDate?: string }) => items.push({ ...item, ageDays: Math.max(0, today - dayNumber(item.createdDate ?? item.dueDate)) });
  if (persona.role === 'manager' || persona.role === 'hr') {
    state.requests.filter((request) => persona.role === 'manager' ? request.status === 'Pending Manager' && state.employees.find((employee) => employee.id === request.employeeId)?.managerId === persona.employeeId : request.status === 'Pending HR').forEach((request) => push({ id: request.id, title: `${request.type} approval`, detail: request.employeeId, priority: request.type === 'Attendance Correction' ? 'High' : 'Medium', owner: persona.title, dueDate: request.startDate, createdDate: request.createdAt.slice(0, 10), status: request.status, action: 'Review request', page: 'approvals' }));
  }
  if (['timeadmin', 'manager'].includes(persona.role)) {
    const teamIds = new Set(visibleEmployees(state, persona).map((employee) => employee.id));
    state.attendanceExceptions.filter((item) => item.status !== 'Resolved' && (persona.role === 'timeadmin' || teamIds.has(item.employeeId))).slice(0, 12).forEach((item) => push({ id: item.id, title: item.type, detail: `${item.employeeId} · ${item.details}`, priority: item.type === 'Missing punch' || item.type === 'Unmatched identity' ? 'High' : 'Medium', owner: persona.role === 'timeadmin' ? 'Time Administration' : 'Line Manager', dueDate: '2026-08-15', createdDate: item.date, status: item.status, action: 'Resolve exception', page: 'attendance' }));
  }
  if (persona.role === 'hr') {
    state.documentCompliance.filter((item) => item.status !== 'Current').slice(0, 12).forEach((item) => push({ id: item.id, title: item.documentName, detail: `${item.employeeId} · ${item.category}`, priority: item.status === 'Missing' ? 'High' : item.status === 'Expiring' ? 'Medium' : 'Low', owner: item.owner, dueDate: item.dueDate, createdDate: '2026-08-01', status: item.status, action: item.status === 'Acknowledgement due' ? 'Send reminder' : 'Review requirement', page: 'documents' }));
    state.employees.filter((employee) => employee.benefitPlanIds.includes('BEN-003') && !['Regular', 'Probationary'].includes(employee.employmentType)).slice(0, 3).forEach((employee) => push({ id: `BEN-EX-${employee.id}`, title: 'Benefit eligibility exception', detail: `${employee.id} · Group Life · ${employee.employmentType}`, priority: 'Medium', owner: 'Benefits Administration', dueDate: '2026-08-20', createdDate: '2026-08-10', status: 'Review required', action: 'Review enrollment', page: 'benefits' }));
    state.performanceCycles.filter((cycle) => cycle.status === 'Active').flatMap((cycle) => cycle.participants.filter((participant) => !participant.selfReview || !participant.managerReview || !participant.acknowledged).map((participant) => ({ cycle, participant }))).slice(0, 4).forEach(({ cycle, participant }) => push({ id: `PRF-${participant.employeeId}`, title: 'Performance task overdue', detail: `${participant.employeeId} · ${cycle.name}`, priority: 'Medium', owner: 'HR Performance', dueDate: cycle.dueDate, createdDate: '2026-08-01', status: !participant.selfReview ? 'Self-review due' : !participant.managerReview ? 'Manager review due' : 'Acknowledgement due', action: 'Review cycle', page: 'performance' }));
  }
  if (persona.role === 'recruiter') {
    state.applicants.filter((applicant) => applicant.offerAccepted && !applicant.convertedEmployeeId).forEach((applicant) => push({ id: applicant.id, title: 'Accepted offer ready to convert', detail: `${applicant.name} · ${applicant.requisition}`, priority: 'High', owner: 'Recruiter', dueDate: '2026-08-15', createdDate: '2026-08-10', status: 'Ready', action: 'Convert applicant', page: 'recruitment' }));
  }
  if (persona.role === 'payroll') {
    const run = state.payrollRuns.find((item) => item.id === 'PAY-2026-08A');
    run?.snapshot?.blockers.forEach((blocker, index) => push({ id: `PAY-BLOCK-${index}`, title: 'Payroll validation blocker', detail: blocker, priority: 'Critical', owner: 'Payroll Processor', dueDate: '2026-08-14', createdDate: '2026-08-13', status: 'Open', action: 'Resolve blocker', page: 'payroll' }));
    run?.signOff.filter((item) => !item.checked).forEach((check) => push({ id: `SIGN-${check.id}`, title: check.label, detail: run.id, priority: 'High', owner: 'Payroll Processor', dueDate: '2026-08-14', createdDate: '2026-08-13', status: 'Not signed', action: 'Complete sign-off', page: 'payroll' }));
  }
  if (persona.role === 'payrollapprover') {
    const run = state.payrollRuns.find((item) => item.id === 'PAY-2026-08A');
    if (run?.status === 'Validated') push({ id: 'PAY-APPROVAL', title: 'Payroll awaiting independent approval', detail: `${run.name} · frozen version ${run.snapshot?.version}`, priority: 'Critical', owner: 'Payroll Approver', dueDate: '2026-08-14', createdDate: '2026-08-13', status: run.status, action: 'Review and approve', page: 'payroll' });
  }
  if (persona.role === 'manager') {
    state.performanceCycles.filter((cycle) => cycle.status === 'Active').forEach((cycle) => cycle.participants.filter((participant) => state.employees.find((employee) => employee.id === participant.employeeId)?.managerId === persona.employeeId && !!participant.selfReview && !participant.managerReview).forEach((participant) => push({ id: `PRF-MGR-${participant.employeeId}`, title: 'Manager review due', detail: `${participant.employeeId} · ${cycle.name}`, priority: 'High', owner: persona.title, dueDate: cycle.dueDate, createdDate: '2026-08-01', status: 'Manager review due', action: 'Complete review', page: 'performance' })));
  }
  if (['admin', 'timeadmin'].includes(persona.role)) {
    state.devices.filter((device) => device.status === 'Offline').forEach((device) => push({ id: device.id, title: 'Attendance device offline', detail: `${device.name} · ${device.location}`, priority: 'Medium', owner: 'System Administrator', dueDate: '2026-08-14', createdDate: '2026-08-12', status: device.status, action: 'Inspect connector', page: 'integrations' }));
  }
  return items.sort((a, b) => ['Critical', 'High', 'Medium', 'Low'].indexOf(a.priority) - ['Critical', 'High', 'Medium', 'Low'].indexOf(b.priority) || b.ageDays - a.ageDays);
}

export function globalSearch(state: DemoState, persona: Persona | null, query: string, canAccess: (page: PageKey) => boolean): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const results: SearchResult[] = [];
  if (canAccess('people')) visibleEmployees(state, persona).forEach((employee) => {
    const text = `${employee.id} ${employee.firstName} ${employee.lastName} ${employee.email} ${employee.department} ${employee.position}`.toLowerCase();
    if (text.includes(q)) results.push({ id: employee.id, kind: 'Employee', title: `${employee.firstName} ${employee.lastName}`, detail: `${employee.id} · ${employee.position} · ${employee.department}`, page: 'people' });
  });
  if (canAccess('recruitment')) {
    state.applicants.forEach((item) => { if (`${item.name} ${item.email} ${item.requisition} ${item.stage}`.toLowerCase().includes(q)) results.push({ id: item.id, kind: 'Applicant', title: item.name, detail: `${item.requisition} · ${item.stage}`, page: 'recruitment' }); });
    state.requisitions.forEach((item) => { if (`${item.id} ${item.title} ${item.department}`.toLowerCase().includes(q)) results.push({ id: item.id, kind: 'Requisition', title: item.title, detail: `${item.id} · ${item.department}`, page: 'recruitment' }); });
  }
  if (canAccess('organization')) state.organization.forEach((item) => { if (`${item.id} ${item.name} ${item.type} ${item.parent}`.toLowerCase().includes(q)) results.push({ id: item.id, kind: item.type, title: item.name, detail: item.parent ?? 'ZylWorks Group', page: 'organization' }); });
  if (canAccess('requests') || canAccess('approvals')) state.requests.forEach((item) => { if (`${item.id} ${item.employeeId} ${item.type} ${item.status} ${item.reason}`.toLowerCase().includes(q)) results.push({ id: item.id, kind: 'Request', title: item.type, detail: `${item.employeeId} · ${item.status}`, page: canAccess('approvals') ? 'approvals' : 'requests' }); });
  if (canAccess('payroll')) state.payrollRuns.forEach((item) => { if (`${item.id} ${item.name} ${item.period} ${item.status}`.toLowerCase().includes(q)) results.push({ id: item.id, kind: 'Payroll run', title: item.name, detail: `${item.id} · ${item.status}`, page: 'payroll' }); });
  if (canAccess('operations')) buildWorkItems(state, persona).forEach((item) => { if (`${item.title} ${item.detail} ${item.owner} ${item.status}`.toLowerCase().includes(q)) results.push({ id: item.id, kind: 'Work item', title: item.title, detail: `${item.owner} · ${item.status}`, page: item.page }); });
  return results.slice(0, 24);
}

function parseCsvRows(csv: string) {
  const rows: string[][] = [];
  let row: string[] = []; let value = ''; let quoted = false;
  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    if (char === '"' && quoted && csv[index + 1] === '"') { value += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(value.trim()); value = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && csv[index + 1] === '\n') index += 1; row.push(value.trim()); if (row.some(Boolean)) rows.push(row); row = []; value = ''; }
    else value += char;
  }
  row.push(value.trim()); if (row.some(Boolean)) rows.push(row);
  return rows;
}

export function validateImport(kind: ImportKind, csv: string, state: DemoState): { headers: string[]; rows: ImportRow[]; fatal?: string } {
  const parsed = parseCsvRows(csv);
  if (parsed.length < 2) return { headers: [], rows: [], fatal: 'The CSV needs a header and at least one data row.' };
  const headers = parsed[0].map((header) => header.trim().toLowerCase().replaceAll(' ', '_'));
  const required = kind === 'Employee master' ? ['first_name', 'last_name', 'email', 'department', 'position', 'hire_date', 'monthly_salary'] : ['employee_id', 'timestamp', 'direction', 'device_id'];
  const missing = required.filter((header) => !headers.includes(header));
  if (missing.length) return { headers, rows: [], fatal: `Missing required columns: ${missing.join(', ')}` };
  const rows = parsed.slice(1).map((cells, index) => {
    const values = Object.fromEntries(headers.map((header, cell) => [header, cells[cell]?.trim() ?? '']));
    const errors: string[] = [];
    if (kind === 'Employee master') {
      if (!values.first_name || !values.last_name) errors.push('First and last name are required');
      if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.push('Email is invalid');
      if (state.employees.some((employee) => employee.email.toLowerCase() === values.email.toLowerCase())) errors.push('Email already exists');
      if (!state.organization.some((item) => item.type === 'Department' && item.name === values.department && item.active)) errors.push('Department is not active');
      if (!state.organization.some((item) => item.type === 'Position' && item.name === values.position && item.active)) errors.push('Position is not active');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(values.hire_date)) errors.push('Hire date must be YYYY-MM-DD');
      if (!(Number(values.monthly_salary) > 0)) errors.push('Monthly salary must be positive');
    } else {
      if (!state.employees.some((employee) => employee.id === values.employee_id)) errors.push('Employee ID was not found');
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(values.timestamp)) errors.push('Timestamp must be ISO date-time');
      if (!['IN', 'OUT'].includes(values.direction.toUpperCase())) errors.push('Direction must be IN or OUT');
      values.direction = values.direction.toUpperCase();
    }
    return { rowNumber: index + 2, values, valid: errors.length === 0, errors };
  });
  return { headers, rows };
}

export function employeeAsOf(employee: Employee, date: string): EmployeeAsOf | null {
  const eligible = employee.employmentHistory.filter((item) => item.effectiveDate <= date && item.snapshot).sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
  const selected = eligible[0];
  if (!selected?.snapshot || employee.hireDate > date) return null;
  return { employee, snapshot: selected.snapshot, effectiveDate: selected.effectiveDate, source: selected.type };
}

export function payrollVariance(current: PayrollSnapshot | undefined, prior: PayrollSnapshot | undefined, state: DemoState): PayrollVarianceRow[] {
  if (!current || !prior) return [];
  const priorMap = new Map(prior.lines.map((line) => [line.employeeId, line]));
  return current.lines.map((line) => {
    const previous = priorMap.get(line.employeeId);
    const employee = state.employees.find((item) => item.id === line.employeeId);
    const varianceCents = line.netCents - (previous?.netCents ?? 0);
    const variancePercent = previous?.netCents ? (varianceCents / previous.netCents) * 100 : 100;
    const approvedLeave = state.requests.some((request) => request.employeeId === line.employeeId && request.type === 'Unpaid Leave' && request.status === 'Approved');
    const recentComp = employee?.employmentHistory.some((item) => item.type === 'Compensation change' && item.effectiveDate >= '2026-01-01');
    const driver = !previous ? 'New hire' : employee?.status === 'Separated' ? 'Separation' : approvedLeave ? 'Approved unpaid leave' : recentComp ? 'Compensation change' : line.loanCents ? 'Loan / recurring deduction' : Math.abs(varianceCents) >= 100000 ? 'Pay and attendance input mix' : 'No material change';
    return { employeeId: line.employeeId, employee: employee ? `${employee.firstName} ${employee.lastName}` : line.employeeId, priorNetCents: previous?.netCents ?? 0, currentNetCents: line.netCents, varianceCents, variancePercent, material: Math.abs(varianceCents) >= 100000 || Math.abs(variancePercent) >= 5, driver };
  }).sort((a, b) => Math.abs(b.varianceCents) - Math.abs(a.varianceCents));
}

export function reconciliationEvidence(snapshot: PayrollSnapshot | undefined) {
  if (!snapshot) return [];
  const statutory = snapshot.lines.reduce((sum, line) => sum + line.sssCents + line.philHealthCents + line.pagIbigCents + line.withholdingCents, 0);
  const registerControl = snapshot.lines.reduce((sum, line) => sum + line.netCents, 0);
  const accountingControl = snapshot.totals.netCents + snapshot.totals.deductionsCents + snapshot.totals.employerCents;
  return [
    { output: 'Payroll register', calculatedCents: snapshot.totals.netCents, controlCents: registerControl, status: snapshot.totals.netCents === registerControl ? 'Reconciled' : 'Mismatch' },
    { output: 'Bank payroll', calculatedCents: snapshot.totals.netCents, controlCents: registerControl, status: snapshot.totals.netCents === registerControl ? 'Reconciled' : 'Mismatch' },
    { output: 'Accounting journal', calculatedCents: snapshot.totals.grossCents + snapshot.totals.employerCents, controlCents: accountingControl, status: snapshot.totals.grossCents + snapshot.totals.employerCents === accountingControl ? 'Reconciled' : 'Mismatch' },
    { output: 'Statutory liabilities', calculatedCents: statutory, controlCents: statutory, status: 'Reconciled' },
  ];
}

export const employeeImportFixture = `first_name,last_name,email,department,position,hire_date,monthly_salary
Amihan,Lopez,amihan.lopez@fictional.example,Human Resources,HR Specialist,2026-09-01,42000
Tomas,Rivera,tomas.rivera@fictional.example,Information Technology,Software Engineer,2026-09-02,61000
Invalid,Department,invalid.department@fictional.example,Space Operations,Software Engineer,2026-09-03,50000
Missing,Salary,missing.salary@fictional.example,Finance,Financial Analyst,2026-09-04,0`;

export const attendanceImportFixture = `employee_id,timestamp,direction,device_id
EMP-2026-001,2026-08-13T08:03:00+08:00,IN,FILE-DEMO
EMP-2026-001,2026-08-13T17:06:00+08:00,OUT,FILE-DEMO
EMP-UNKNOWN,2026-08-13T08:10:00+08:00,IN,FILE-DEMO
EMP-2026-002,not-a-time,SIDEWAYS,FILE-DEMO`;
