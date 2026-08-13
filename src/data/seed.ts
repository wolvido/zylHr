import {
  Applicant,
  AuditEvent,
  BenefitPlan,
  DemoState,
  Device,
  Employee,
  OrganizationRecord,
  PayrollRun,
  PayrollSignOffItem,
  PerformanceCycle,
  Persona,
  Requisition,
  Role,
  WorkflowRequest,
} from '../types';

export const DEMO_DATE = '2026-08-13';
export const SEED_VERSION = 'ZYLHR-DEMO-0.1';
export const DEMO_PASSWORD = 'zylhr-demo';

export const demoClock = {
  today: () => DEMO_DATE,
  now: () => `${DEMO_DATE}T10:30:00+08:00`,
};

export const createPayrollSignOff = (completed = false): PayrollSignOffItem[] => [
  { id: 'sources', label: 'HR, time, benefit, and request sources are locked', checked: completed, checkedBy: completed ? 'payroll@demo.zylhr' : undefined, checkedAt: completed ? '2026-08-05T13:10:00+08:00' : undefined },
  { id: 'variance', label: 'Material employee and run variances are reviewed', checked: completed, checkedBy: completed ? 'payroll@demo.zylhr' : undefined, checkedAt: completed ? '2026-08-05T13:16:00+08:00' : undefined },
  { id: 'exceptions', label: 'Payroll blockers and warnings are dispositioned', checked: completed, checkedBy: completed ? 'payroll@demo.zylhr' : undefined, checkedAt: completed ? '2026-08-05T13:22:00+08:00' : undefined },
  { id: 'reconciliation', label: 'Register, bank, accounting, and statutory controls reconcile', checked: completed, checkedBy: completed ? 'payroll@demo.zylhr' : undefined, checkedAt: completed ? '2026-08-05T13:29:00+08:00' : undefined },
];

export const personas: Persona[] = [
  { role: 'admin', email: 'admin@demo.zylhr', title: 'System Administrator', initials: 'SA', description: 'Organization, configuration, audit, and integration simulators.' },
  { role: 'hr', email: 'hr@demo.zylhr', title: 'HR Administrator', initials: 'HR', description: 'People, contracts, benefits, final HR approvals, and reports.' },
  { role: 'recruiter', email: 'recruiter@demo.zylhr', title: 'Recruiter', initials: 'RC', description: 'Requisitions, candidates, interviews, offers, and hiring.' },
  { role: 'timeadmin', email: 'timeadmin@demo.zylhr', title: 'Time Administrator', initials: 'TA', description: 'Schedules, biometric simulation, attendance, and exceptions.' },
  { role: 'manager', email: 'manager@demo.zylhr', title: 'Line Manager', initials: 'LM', description: 'Team insights, first-stage approvals, and performance reviews.', employeeId: 'EMP-2026-010' },
  { role: 'payroll', email: 'payroll@demo.zylhr', title: 'Payroll Processor', initials: 'PP', description: 'Payroll calculation, validation, evidence, and reports.' },
  { role: 'payrollapprover', email: 'payrollapprover@demo.zylhr', title: 'Payroll Approver', initials: 'PA', description: 'Independent payroll sign-off, approval, and release.' },
  { role: 'finance', email: 'finance@demo.zylhr', title: 'Finance User', initials: 'FN', description: 'Released totals, bank files, and accounting exports.' },
  { role: 'employee', email: 'employee@demo.zylhr', title: 'Employee', initials: 'MS', description: 'Self-service, attendance, requests, reviews, benefits, and payslips.', employeeId: 'EMP-2026-001' },
];

export const roleLabels: Record<Role, string> = Object.fromEntries(personas.map((p) => [p.role, p.title])) as Record<Role, string>;

const firstNames = ['Mika', 'Juan', 'Maria', 'Carlo', 'Ana', 'Paolo', 'Nina', 'Luis', 'Sofia', 'Ramon', 'Bea', 'Diego', 'Lara', 'Enzo', 'Camille', 'Marco', 'Tala', 'Noel'];
const lastNames = ['Santos', 'Dela Cruz', 'Reyes', 'Villanueva', 'Garcia', 'Mendoza', 'Navarro', 'Aquino', 'Bautista', 'Castillo', 'Flores', 'Ramos', 'Torres', 'Lim', 'Soriano', 'Valdez'];
const departments = ['Human Resources', 'Finance', 'Information Technology', 'Sales', 'Customer Operations', 'Field Operations', 'Administration', 'Executive'];
const positions = ['HR Specialist', 'Financial Analyst', 'Software Engineer', 'Account Executive', 'Operations Coordinator', 'Field Specialist', 'Admin Associate', 'Team Manager'];
const branches = ['Metro Manila HQ', 'Cebu Operations Center', 'Davao Operations Center'];
const entities = ['ZylWorks Services, Inc.', 'ZylWorks Operations, Inc.'];
const schedules = ['Fixed Day', 'Flexible', 'Rotating', 'Overnight', 'Split Shift'];

export function seedEmployees(): Employee[] {
  return Array.from({ length: 250 }, (_, index) => {
    const n = index + 1;
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[(index * 7) % lastNames.length];
    const status: Employee['status'] = n > 246 ? 'Separated' : 'Active';
    const payrollGroup: Employee['payrollGroup'] = n === 1 ? 'Semi-monthly' : n <= 30 || n === 31 ? 'Weekly' : n <= 220 ? 'Semi-monthly' : 'Monthly';
    const payBasis = n % 13 === 0 ? 'Hourly' : n % 7 === 0 ? 'Daily' : 'Monthly';
    const salaryCents = payBasis === 'Monthly' ? (28000 + (index % 18) * 3500) * 100 : payBasis === 'Daily' ? (760 + (index % 8) * 85) * 100 : (115 + (index % 7) * 22) * 100;
    const currentSnapshot = { entity: entities[index % entities.length], branch: branches[index % branches.length], department: departments[index % departments.length], position: positions[index % positions.length], salaryCents, payrollGroup, status };
    const employmentHistory: Employee['employmentHistory'] = [{ id: `HIST-${n}-1`, type: 'Hire', effectiveDate: `${2021 + (index % 6)}-${String(1 + (index % 12)).padStart(2, '0')}-${String(1 + (index % 24)).padStart(2, '0')}`, reason: 'Fictional seeded hire', detail: `${positions[index % positions.length]} · ${departments[index % departments.length]}`, snapshot: { ...currentSnapshot, status: 'Active' } }];
    if (n === 1) {
      employmentHistory[0].snapshot = { ...currentSnapshot, department: 'Administration', position: 'Admin Associate', salaryCents: 3600000 };
      employmentHistory.push({ id: 'HIST-1-2', type: 'Transfer', effectiveDate: '2025-03-01', reason: 'Seeded cross-functional transfer', detail: 'HR Specialist · Human Resources', snapshot: currentSnapshot });
    }
    if (n === 2) {
      employmentHistory[0].snapshot = { ...currentSnapshot, salaryCents: Math.max(100, salaryCents - 450000) };
      employmentHistory.push({ id: 'HIST-2-2', type: 'Compensation change', effectiveDate: '2026-01-01', reason: 'Seeded annual compensation review', detail: `Salary changed to PHP ${(salaryCents / 100).toFixed(2)}`, snapshot: currentSnapshot });
    }
    if (n === 3) {
      employmentHistory[0].snapshot = { ...currentSnapshot, position: 'Admin Associate' };
      employmentHistory.push({ id: 'HIST-3-2', type: 'Promotion', effectiveDate: '2025-10-15', reason: 'Seeded promotion', detail: `${currentSnapshot.position} · ${currentSnapshot.department}`, snapshot: currentSnapshot });
    }
    if (status === 'Separated') employmentHistory.push({ id: `HIST-${n}-2`, type: 'Separation', effectiveDate: '2026-07-31', reason: 'Seeded voluntary separation', detail: 'Separated', snapshot: currentSnapshot });
    return {
      id: `EMP-2026-${String(n).padStart(3, '0')}`,
      employeeNo: String(n).padStart(3, '0'),
      firstName,
      lastName,
      email: `${firstName}.${lastName}.${n}@fictional.zylworks.example`.toLowerCase().replaceAll(' ', ''),
      phone: `+63 917 555 ${String(1000 + n).slice(-4)}`,
      entity: entities[index % entities.length],
      branch: branches[index % branches.length],
      department: departments[index % departments.length],
      position: positions[index % positions.length],
      managerId: n === 10 ? undefined : n <= 18 ? 'EMP-2026-010' : `EMP-2026-${String(10 + (index % 5)).padStart(3, '0')}`,
      status,
      employmentType: n % 17 === 0 ? 'Part-time' : n % 11 === 0 ? 'Contractual' : n % 6 === 0 ? 'Probationary' : 'Regular',
      payBasis,
      salaryCents,
      payrollGroup,
      schedule: schedules[index % schedules.length],
      hireDate: `${2021 + (index % 6)}-${String(1 + (index % 12)).padStart(2, '0')}-${String(1 + (index % 24)).padStart(2, '0')}`,
      leaveBalance: 4 + (index % 11),
      bankAccount: n === 32 ? 'DEMO-BANK-PENDING' : `DEMO-BANK-${String(88000000 + n)}`,
      governmentId: `DEMO-GOV-${String(910000000 + n)}`,
      benefitPlanIds: index % 3 === 0 ? ['BEN-001', 'BEN-003'] : ['BEN-001'],
      loanDeductionCents: index % 19 === 0 ? 125000 : 0,
      employmentHistory,
    };
  });
}

const organization: OrganizationRecord[] = [
  { id: 'ORG-001', type: 'Entity', name: 'ZylWorks Services, Inc.', parent: 'ZylWorks Group', active: true },
  { id: 'ORG-002', type: 'Entity', name: 'ZylWorks Operations, Inc.', parent: 'ZylWorks Group', active: true },
  ...branches.map((name, i) => ({ id: `BR-${i + 1}`, type: 'Branch' as const, name, parent: i === 0 ? entities[0] : entities[1], active: true })),
  ...departments.map((name, i) => ({ id: `DEP-${i + 1}`, type: 'Department' as const, name, parent: 'ZylWorks Group', active: true })),
  ...positions.map((name, i) => ({ id: `POS-${i + 1}`, type: 'Position' as const, name, parent: departments[i], active: true })),
  { id: 'CC-001', type: 'Cost center', name: 'Corporate Services', parent: entities[0], active: true },
  { id: 'CC-002', type: 'Cost center', name: 'Operations Delivery', parent: entities[1], active: true },
];

const requisitions: Requisition[] = [
  { id: 'REQ-101', title: 'Senior Software Engineer', department: 'Information Technology', openings: 2, applicants: 7, status: 'Open' },
  { id: 'REQ-102', title: 'HR Business Partner', department: 'Human Resources', openings: 1, applicants: 5, status: 'Open' },
  { id: 'REQ-103', title: 'Payroll Specialist', department: 'Finance', openings: 1, applicants: 4, status: 'Open' },
  { id: 'REQ-104', title: 'Customer Operations Lead', department: 'Customer Operations', openings: 2, applicants: 6, status: 'Open' },
  { id: 'REQ-105', title: 'Field Operations Associate', department: 'Field Operations', openings: 3, applicants: 3, status: 'On hold' },
];

const applicantNames = ['Lea Mendoza', 'Anton Javier', 'Mara de Leon', 'Gio Alcantara', 'Iris Pascual', 'Theo Domingo', 'Yna Salazar', 'Renzo Go', 'Kyla Manalo', 'Joaquin Sy'];
const applicants: Applicant[] = Array.from({ length: 25 }, (_, index) => ({
  id: `APP-${String(index + 1).padStart(3, '0')}`,
  name: applicantNames[index % applicantNames.length] + (index >= applicantNames.length ? ` ${index + 1}` : ''),
  email: `applicant${index + 1}@fictional.example`,
  requisition: requisitions[index % requisitions.length].title,
  stage: index === 0 ? 'Offer' : index < 5 ? 'Interview' : index < 11 ? 'Screening' : 'Applied',
  score: 68 + ((index * 7) % 30),
  feedback: index === 0 ? 'Offer accepted. Ready for employee draft conversion.' : 'Seeded interview notes for demonstration.',
  offerAccepted: index === 0,
}));

const benefits: BenefitPlan[] = [
  { id: 'BEN-001', name: 'HMO Core', category: 'Health', eligibility: 'All active employees', employeeCents: 65000, employerCents: 145000, enrolledCount: 246 },
  { id: 'BEN-002', name: 'HMO Dependent Plus', category: 'Health', eligibility: 'Regular employees', employeeCents: 120000, employerCents: 80000, enrolledCount: 88 },
  { id: 'BEN-003', name: 'Group Life', category: 'Insurance', eligibility: 'Regular and probationary', employeeCents: 18000, employerCents: 42000, enrolledCount: 164 },
  { id: 'BEN-004', name: 'Meal Allowance', category: 'Allowance', eligibility: 'Operations employees', employeeCents: 0, employerCents: 150000, enrolledCount: 102 },
  { id: 'BEN-005', name: 'Wellness Fund', category: 'Wellness', eligibility: 'All active employees', employeeCents: 25000, employerCents: 25000, enrolledCount: 97 },
];

const requests: WorkflowRequest[] = [
  { id: 'REQ-WF-001', employeeId: 'EMP-2026-002', type: 'Vacation Leave', startDate: '2026-08-18', endDate: '2026-08-19', units: 2, reason: 'Family commitment', status: 'Pending Manager', createdAt: demoClock.now(), history: [{ at: demoClock.now(), actor: 'Employee', action: 'Submitted' }] },
  { id: 'REQ-WF-002', employeeId: 'EMP-2026-003', type: 'Overtime', startDate: '2026-08-11', endDate: '2026-08-11', units: 3, reason: 'Month-end close', status: 'Pending HR', createdAt: demoClock.now(), history: [{ at: demoClock.now(), actor: 'Employee', action: 'Submitted' }, { at: demoClock.now(), actor: 'Line Manager', action: 'Approved' }] },
  { id: 'REQ-WF-003', employeeId: 'EMP-2026-001', type: 'Attendance Correction', startDate: '2026-08-12', endDate: '2026-08-12', units: 1, reason: 'Forgot to clock out after client call', status: 'Pending Manager', createdAt: demoClock.now(), history: [{ at: demoClock.now(), actor: 'Employee', action: 'Submitted' }] },
  ...Array.from({ length: 12 }, (_, index) => {
    const types = ['Vacation Leave', 'Unpaid Leave', 'Overtime', 'Attendance Correction'] as const;
    const statuses = ['Pending Manager', 'Pending HR', 'Approved', 'Rejected', 'Returned'] as const;
    const type = types[index % types.length];
    const status = statuses[index % statuses.length];
    const employeeId = `EMP-2026-${String(index + 5).padStart(3, '0')}`;
    const history = [{ at: demoClock.now(), actor: 'employee@demo.zylhr', action: 'Submitted' }];
    if (status === 'Pending HR' || status === 'Approved') history.push({ at: demoClock.now(), actor: 'manager@demo.zylhr', action: 'Approved' });
    if (status === 'Approved') history.push({ at: demoClock.now(), actor: 'hr@demo.zylhr', action: 'Approved' });
    return { id: `REQ-WF-${String(index + 4).padStart(3, '0')}`, employeeId, type, startDate: `2026-08-${String(16 + index).padStart(2, '0')}`, endDate: `2026-08-${String(16 + index).padStart(2, '0')}`, units: type === 'Overtime' ? 2 + (index % 3) : 1, reason: `Fictional seeded ${type.toLowerCase()} scenario`, status, createdAt: demoClock.now(), history };
  }),
];

const devices: Device[] = [
  { id: 'BIO-01', name: 'Manila Main Lobby', location: 'Metro Manila HQ', status: 'Ready', lastSync: 'Never — demo seed' },
  { id: 'BIO-02', name: 'Cebu Operations Floor', location: 'Cebu Operations Center', status: 'Ready', lastSync: 'Never — demo seed' },
  { id: 'BIO-03', name: 'Davao Staff Entrance', location: 'Davao Operations Center', status: 'Offline', lastSync: 'Demo device offline' },
];

const performanceCycles: PerformanceCycle[] = [
  { id: 'PERF-2026-H2', name: '2026 Midyear Growth Review', status: 'Active', dueDate: '2026-08-31', participants: [{ employeeId: 'EMP-2026-001', selfReview: '', managerReview: '', acknowledged: false }, { employeeId: 'EMP-2026-002', selfReview: 'Goals are on track.', managerReview: '', acknowledged: false }] },
  { id: 'PERF-2025-YE', name: '2025 Year-end Review', status: 'Completed', dueDate: '2026-01-31', participants: [{ employeeId: 'EMP-2026-001', selfReview: 'Completed key goals.', managerReview: 'Strong, reliable delivery.', rating: 4, acknowledged: true }] },
];

const payrollRuns: PayrollRun[] = [
  { id: 'PAY-2026-07B', name: 'July 16–31 Released Run', group: 'Semi-monthly', period: '2026-07-16 to 2026-07-31', status: 'Released', releasedAt: '2026-08-05T14:00:00+08:00', signOff: createPayrollSignOff(true) },
  { id: 'PAY-2026-08A', name: 'August 1–15 Current Run', group: 'Semi-monthly', period: '2026-08-01 to 2026-08-15', status: 'Draft', signOff: createPayrollSignOff() },
];

const audit: AuditEvent[] = Array.from({ length: 52 }, (_, index) => ({
  id: `AUD-${String(index + 1).padStart(3, '0')}`,
  at: `${DEMO_DATE}T${String(9 + (index % 2)).padStart(2, '0')}:${String(index % 60).padStart(2, '0')}:00+08:00`,
  actor: index % 3 === 0 ? 'hr@demo.zylhr' : index % 3 === 1 ? 'timeadmin@demo.zylhr' : 'system@demo.zylhr',
  action: index % 4 === 0 ? 'Updated' : index % 4 === 1 ? 'Viewed' : index % 4 === 2 ? 'Submitted' : 'Exported',
  area: ['People', 'Attendance', 'Payroll', 'Reports'][index % 4],
  detail: `Fictional seeded audit event ${index + 1}`,
}));

export function createDemoState(): DemoState {
  return {
    employees: seedEmployees(),
    applicants: applicants.map((item) => ({ ...item })),
    requisitions: requisitions.map((item) => ({ ...item })),
    organization: organization.map((item) => ({ ...item })),
    requests: requests.map((item) => ({ ...item, history: [...item.history] })),
    attendanceExceptions: [
      { id: 'ATT-001', employeeId: 'EMP-2026-001', date: '2026-08-12', type: 'Missing punch', details: 'No OUT event after 09:01 IN', status: 'Correction submitted', minutes: 480 },
      { id: 'ATT-002', employeeId: 'EMP-2026-002', date: '2026-08-12', type: 'Late / undertime', details: '08:19 IN — 19 minutes late', status: 'Open', minutes: 19 },
      { id: 'ATT-003', employeeId: 'EMP-2026-003', date: '2026-08-11', type: 'Unscheduled work', details: 'Rest-day punch pair detected', status: 'Open', minutes: 176 },
      { id: 'ATT-004', employeeId: 'EMP-2026-004', date: '2026-08-10', type: 'Unmatched identity', details: 'Device user DEMO-991 not mapped', status: 'Open', minutes: 0 },
      ...Array.from({ length: 20 }, (_, i) => ({ id: `ATT-${String(i + 5).padStart(3, '0')}`, employeeId: `EMP-2026-${String(i + 5).padStart(3, '0')}`, date: `2026-08-${String(1 + (i % 12)).padStart(2, '0')}`, type: (i % 2 ? 'Late / undertime' : 'Missing punch') as 'Late / undertime' | 'Missing punch', details: i % 2 ? 'Seeded late arrival' : 'Seeded missing OUT event', status: 'Open' as const, minutes: 8 + i })),
    ],
    devices: devices.map((item) => ({ ...item })),
    biometricSynced: false,
    benefits: benefits.map((item) => ({ ...item })),
    performanceCycles: performanceCycles.map((cycle) => ({ ...cycle, participants: cycle.participants.map((p) => ({ ...p })) })),
    payrollRuns: payrollRuns.map((item) => ({ ...item })),
    audit,
    notifications: Array.from({ length: 20 }, (_, i) => ({ id: `NOT-${i + 1}`, at: demoClock.now(), recipient: i % 2 ? 'employee@demo.zylhr' : 'hr@demo.zylhr', title: i % 2 ? 'Request update' : 'HR task reminder', body: 'This is a fictional in-app demo notification.', read: i > 3 })),
    outbox: Array.from({ length: 20 }, (_, i) => ({ id: `OUT-${i + 1}`, at: demoClock.now(), channel: i % 2 ? 'Email' : 'Mobile', recipient: i % 2 ? 'employee@fictional.example' : 'Demo mobile recipient', subject: `Simulated notification ${i + 1}`, status: i === 4 ? 'Simulated failed' : 'Simulated delivered' })),
    submissionReferences: [],
    webhookAttempts: 2,
    temporaryUploads: [],
    webClockedIn: false,
    scheduleTemplates: [
      { id: 'SCH-001', name: 'Fixed Day', start: '08:00', end: '17:00', breakMinutes: 60, paidBreak: false, overnight: false },
      { id: 'SCH-002', name: 'Flexible', start: '10:00', end: '15:00', breakMinutes: 60, paidBreak: false, overnight: false },
      { id: 'SCH-003', name: 'Rotating', start: '14:00', end: '22:00', breakMinutes: 30, paidBreak: true, overnight: false },
      { id: 'SCH-004', name: 'Overnight', start: '22:00', end: '07:00', breakMinutes: 60, paidBreak: false, overnight: true },
      { id: 'SCH-005', name: 'Split Shift', start: '06:00', end: '19:00', breakMinutes: 300, paidBreak: false, overnight: false, split: '06:00–10:00 + 15:00–19:00' },
    ],
    attendanceEvents: Array.from({ length: 24 }, (_, index) => ({ id: `EVT-${String(index + 1).padStart(3, '0')}`, employeeId: `EMP-2026-${String(1 + Math.floor(index / 2)).padStart(3, '0')}`, deviceId: `BIO-0${1 + (index % 2)}`, timestamp: `2026-08-12T${index % 2 === 0 ? '08:0' + (index % 9) : '17:0' + (index % 9)}:00+08:00`, direction: (index % 2 === 0 ? 'IN' : 'OUT') as 'IN' | 'OUT', source: 'Biometric' as const, result: 'Accepted' as const })),
    dailyAttendance: Array.from({ length: 24 }, (_, index) => {
      const outcomes = ['Missing punch', 'Late', 'Undertime', 'Absent', 'Overtime candidate', 'Rest-day work', 'Holiday work', 'Overnight work', 'Present'] as const;
      const status = outcomes[index % outcomes.length];
      const absent = status === 'Absent';
      const missing = status === 'Missing punch';
      return { employeeId: `EMP-2026-${String(index + 1).padStart(3, '0')}`, date: '2026-08-12', firstIn: absent ? undefined : status === 'Overnight work' ? '22:00' : `08:${String(index % 20).padStart(2, '0')}`, lastOut: absent || missing ? undefined : status === 'Overnight work' ? '07:00 (+1)' : `17:${String(index % 12).padStart(2, '0')}`, status, payableMinutes: absent || missing ? 0 : status === 'Undertime' ? 420 : 480, lateMinutes: status === 'Late' ? 15 : 0, overtimeMinutes: ['Overtime candidate', 'Rest-day work', 'Holiday work'].includes(status) ? 60 : 0 };
    }),
    attendancePeriodClosed: false,
    documentCompliance: [
      { id: 'DOC-CMP-001', employeeId: 'EMP-2026-001', category: 'Policy', documentName: '2026 Employee Handbook', confidentiality: 'Standard', dueDate: '2026-08-20', version: 'v2026.2', status: 'Acknowledgement due', owner: 'Employee' },
      { id: 'DOC-CMP-002', employeeId: 'EMP-2026-002', category: 'Government', documentName: 'Government ID verification', confidentiality: 'Restricted', dueDate: '2026-08-18', version: 'v1', status: 'Missing', owner: 'HR Operations' },
      { id: 'DOC-CMP-003', employeeId: 'EMP-2026-003', category: 'Contract', documentName: 'Probationary contract', confidentiality: 'Restricted', dueDate: '2026-08-28', version: 'v2', status: 'Expiring', owner: 'HR Operations' },
      { id: 'DOC-CMP-004', employeeId: 'EMP-2026-004', category: 'Medical', documentName: 'Annual medical clearance', confidentiality: 'Restricted', dueDate: '2026-08-16', version: 'v1', status: 'Missing', owner: 'Employee' },
      { id: 'DOC-CMP-005', employeeId: 'EMP-2026-005', category: 'Policy', documentName: 'Information Security Policy', confidentiality: 'Standard', dueDate: '2026-08-25', version: 'v3.1', status: 'Acknowledgement due', owner: 'Employee' },
      { id: 'DOC-CMP-006', employeeId: 'EMP-2026-006', category: 'Contract', documentName: 'Employment contract', confidentiality: 'Restricted', dueDate: '2027-02-28', version: 'v1', status: 'Current', owner: 'HR Operations', resolvedAt: demoClock.now() },
      ...Array.from({ length: 18 }, (_, index) => ({ id: `DOC-CMP-${String(index + 7).padStart(3, '0')}`, employeeId: `EMP-2026-${String(index + 7).padStart(3, '0')}`, category: index % 3 === 0 ? 'Contract' : index % 3 === 1 ? 'Government' : 'Policy', documentName: index % 3 === 0 ? 'Employment contract' : index % 3 === 1 ? 'Government ID verification' : 'Code of Conduct', confidentiality: index % 3 === 1 ? 'Restricted' as const : 'Standard' as const, dueDate: `2026-0${index % 2 ? '9' : '8'}-${String(14 + (index % 14)).padStart(2, '0')}`, version: `v${1 + (index % 3)}`, status: index % 5 === 0 ? 'Missing' as const : index % 5 === 1 ? 'Expiring' as const : index % 5 === 2 ? 'Acknowledgement due' as const : 'Current' as const, owner: index % 2 ? 'Employee' : 'HR Operations' })),
    ],
    importBatches: [],
  };
}
