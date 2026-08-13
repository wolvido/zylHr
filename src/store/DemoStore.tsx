import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { createDemoState, createPayrollSignOff, demoClock, DEMO_PASSWORD, personas, roleLabels } from '../data/seed';
import { calculatePayroll } from '../services/payroll';
import {
  ApplicantStage,
  DemoState,
  Employee,
  ImportKind,
  ImportRow,
  OrganizationRecord,
  PageKey,
  Persona,
  RequestType,
  Role,
} from '../types';

const rolePages: Record<Role, PageKey[]> = {
  admin: ['dashboard', 'operations', 'organization', 'people', 'imports', 'documents', 'reports', 'integrations', 'administration'],
  hr: ['dashboard', 'operations', 'organization', 'recruitment', 'people', 'imports', 'documents', 'attendance', 'requests', 'benefits', 'performance', 'approvals', 'reports'],
  recruiter: ['dashboard', 'operations', 'recruitment', 'people', 'reports'],
  timeadmin: ['dashboard', 'operations', 'people', 'imports', 'attendance', 'requests', 'reports', 'integrations'],
  manager: ['dashboard', 'operations', 'people', 'attendance', 'requests', 'performance', 'approvals', 'reports'],
  payroll: ['dashboard', 'operations', 'people', 'attendance', 'requests', 'benefits', 'payroll', 'reports'],
  payrollapprover: ['dashboard', 'operations', 'payroll', 'reports'],
  finance: ['dashboard', 'payroll', 'reports', 'integrations'],
  employee: ['dashboard', 'people', 'documents', 'attendance', 'requests', 'benefits', 'performance', 'payroll'],
};

function withReleasedSnapshot() {
  const state = createDemoState();
  const snapshot = calculatePayroll(state.employees, state.requests, state.benefits, 'payroll', 1);
  const releasedSnapshot = { ...snapshot, blockers: [], warnings: snapshot.warnings.filter((warning) => !warning.includes('EMP-2026-032')), lines: snapshot.lines.map((line) => line.employeeId === 'EMP-2026-032' ? { ...line, warnings: line.warnings.filter((warning) => warning !== 'Missing bank account validation') } : line) };
  const priorLines = releasedSnapshot.lines.map((line, index) => {
    const delta = index < 4 ? 125000 + index * 25000 : index === 8 ? -90000 : 0;
    return delta ? { ...line, basicCents: Math.max(0, line.basicCents - delta), grossCents: Math.max(0, line.grossCents - delta), netCents: Math.max(0, line.netCents - delta) } : line;
  });
  const priorSnapshot = { ...releasedSnapshot, createdAt: '2026-08-05T13:00:00+08:00', lines: priorLines, totals: { ...releasedSnapshot.totals, grossCents: priorLines.reduce((sum, line) => sum + line.grossCents, 0), deductionsCents: priorLines.reduce((sum, line) => sum + line.deductionsCents, 0), netCents: priorLines.reduce((sum, line) => sum + line.netCents, 0) } };
  state.payrollRuns = state.payrollRuns.map((run) => run.status === 'Released' ? { ...run, snapshot: priorSnapshot, approvedBy: 'payrollapprover' } : run);
  return state;
}

interface NewRequestInput {
  type: RequestType;
  startDate: string;
  endDate: string;
  units: number;
  reason: string;
}

interface DemoContextValue {
  state: DemoState;
  persona: Persona | null;
  message: string;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  canAccess: (page: PageKey) => boolean;
  dismissMessage: () => void;
  addOrganization: (type: OrganizationRecord['type'], name: string, parent?: string) => boolean;
  updateOrganization: (id: string, name: string, parent?: string) => boolean;
  deleteOrganization: (id: string) => boolean;
  toggleOrganization: (id: string) => boolean;
  addEmployee: (input: Partial<Employee> & Pick<Employee, 'firstName' | 'lastName' | 'department' | 'position'>) => boolean;
  updateEmployeeSalary: (id: string, salaryCents: number) => boolean;
  updateEmployeeAssignment: (id: string, department: string, position: string) => boolean;
  applyEmploymentAction: (id: string, type: 'Transfer' | 'Promotion' | 'Compensation change' | 'Regularization' | 'Separation', effectiveDate: string, reason: string, detail: string) => boolean;
  moveApplicant: (id: string, stage: ApplicantStage) => boolean;
  addApplicant: (name: string, email: string, requisition: string) => boolean;
  createRequisition: (title: string, department: string, openings: number) => boolean;
  updateApplicantAssessment: (id: string, score: number, feedback: string) => boolean;
  acceptApplicantOffer: (id: string) => boolean;
  convertApplicant: (id: string) => boolean;
  activateEmployee: (id: string) => boolean;
  syncBiometric: () => { accepted: number; duplicate: number; rejected: number; unmatched: number } | null;
  resolveException: (id: string) => boolean;
  resolveAllAttendanceExceptions: () => boolean;
  assignSchedule: (employeeId: string, schedule: string) => boolean;
  addManualAttendanceEvent: (employeeId: string, direction: 'IN' | 'OUT') => boolean;
  closeAttendancePeriod: () => boolean;
  submitRequest: (input: NewRequestInput) => boolean;
  decideRequest: (id: string, action: 'approve' | 'reject' | 'return', comment?: string) => boolean;
  toggleBenefit: (employeeId: string, benefitId: string) => boolean;
  submitSelfReview: (text: string) => boolean;
  submitManagerReview: (employeeId: string, text: string, rating: number) => boolean;
  acknowledgeReview: () => boolean;
  calculateCurrentPayroll: () => boolean;
  resolvePayrollBlocker: () => boolean;
  validateCurrentPayroll: () => boolean;
  approveCurrentPayroll: () => boolean;
  releaseCurrentPayroll: () => boolean;
  simulateGovernmentSubmission: () => string | null;
  simulateWebhook: () => boolean;
  markNotificationsRead: () => void;
  recordExport: (detail: string) => void;
  addTemporaryUpload: (employeeId: string, name: string, size: number) => boolean;
  toggleWebClock: () => boolean;
  stageImport: (kind: ImportKind, fileName: string, rows: ImportRow[]) => string | null;
  commitImport: (id: string) => boolean;
  resolveDocument: (id: string) => boolean;
  sendDocumentReminder: (id: string) => boolean;
  acknowledgeDocument: (id: string) => boolean;
  togglePayrollSignOff: (id: 'sources' | 'variance' | 'exceptions' | 'reconciliation') => boolean;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<DemoState>(withReleasedSnapshot);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [message, setMessage] = useState('');

  const notify = (text: string) => setMessage(text);
  const guard = (roles: Role[]) => {
    if (!persona || !roles.includes(persona.role)) {
      notify('That action is not available for this demo account.');
      return false;
    }
    return true;
  };

  const audit = (current: DemoState, action: string, area: string, detail: string): DemoState => ({
    ...current,
    audit: [{ id: `AUD-${current.audit.length + 1}`, at: demoClock.now(), actor: persona?.email ?? 'demo', action, area, detail }, ...current.audit],
  });

  const createMessage = (current: DemoState, recipient: string, title: string, body: string): DemoState => ({
    ...current,
    notifications: [{ id: `NOT-${current.notifications.length + 1}`, at: demoClock.now(), recipient, title, body, read: false }, ...current.notifications],
    outbox: [{ id: `OUT-${current.outbox.length + 1}`, at: demoClock.now(), channel: 'Email', recipient, subject: title, status: 'Simulated delivered' }, ...current.outbox],
  });

  const value = useMemo<DemoContextValue>(() => ({
    state,
    persona,
    message,
    login: (email, password) => {
      const account = personas.find((item) => item.email === email);
      if (!account || password !== DEMO_PASSWORD) {
        notify('Use the shared demo password shown on this page.');
        return false;
      }
      setPersona(account);
      notify(`Signed in as ${account.title}.`);
      return true;
    },
    logout: () => {
      setPersona(null);
      notify('Signed out. Your walkthrough changes remain until this page reloads.');
    },
    canAccess: (page) => !!persona && rolePages[persona.role].includes(page),
    dismissMessage: () => setMessage(''),
    addOrganization: (type, name, parent) => {
      if (!guard(['admin'])) return false;
      if (!name.trim()) return false;
      setState((current) => audit({ ...current, organization: [...current.organization, { id: `ORG-${current.organization.length + 1}`, type, name: name.trim(), parent, active: true }] }, 'Created', 'Organization', `${type}: ${name}`));
      notify(`${type} created.`);
      return true;
    },
    updateOrganization: (id, name, parent) => {
      if (!guard(['admin'])) return false;
      if (!name.trim()) { notify('Organization record name is required.'); return false; }
      const original = state.organization.find((item) => item.id === id);
      if (!original) return false;
      setState((current) => audit({ ...current, organization: current.organization.map((item) => item.id === id ? { ...item, name: name.trim(), parent } : item), employees: current.employees.map((employee) => ({ ...employee, entity: employee.entity === original.name ? name.trim() : employee.entity, branch: employee.branch === original.name ? name.trim() : employee.branch, department: employee.department === original.name ? name.trim() : employee.department, position: employee.position === original.name ? name.trim() : employee.position })) }, 'Updated', 'Organization', `${id} renamed to ${name.trim()}`));
      notify('Organization record and dependent employee references updated.');
      return true;
    },
    deleteOrganization: (id) => {
      if (!guard(['admin'])) return false;
      const record = state.organization.find((item) => item.id === id);
      if (!record) return false;
      const referenced = state.employees.some((employee) => [employee.entity, employee.branch, employee.department, employee.position].includes(record.name));
      if (referenced) { notify('Deletion blocked: employees reference this organization record.'); return false; }
      setState((current) => audit({ ...current, organization: current.organization.filter((item) => item.id !== id) }, 'Deleted', 'Organization', `${record.type}: ${record.name}`));
      notify('Unreferenced organization record deleted.');
      return true;
    },
    toggleOrganization: (id) => {
      if (!guard(['admin'])) return false;
      const referenced = state.employees.some((employee) => employee.department === state.organization.find((item) => item.id === id)?.name);
      if (referenced) {
        notify('This record is referenced by employees. It can be edited, but cannot be deactivated in the demo.');
        return false;
      }
      setState((current) => audit({ ...current, organization: current.organization.map((item) => item.id === id ? { ...item, active: !item.active } : item) }, 'Updated', 'Organization', id));
      return true;
    },
    addEmployee: (input) => {
      if (!guard(['hr'])) return false;
      const next = Math.max(252, ...state.employees.map((employee) => Number(employee.employeeNo) + 1));
      const employee: Employee = {
        id: `EMP-2026-${String(next).padStart(3, '0')}`,
        employeeNo: String(next).padStart(3, '0'),
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email ?? `${input.firstName}.${input.lastName}@fictional.zylworks.example`.toLowerCase().replaceAll(' ', ''),
        phone: '+63 917 555 0251', entity: input.entity ?? 'ZylWorks Services, Inc.', branch: input.branch ?? 'Metro Manila HQ',
        department: input.department, position: input.position, status: input.status ?? 'Draft', employmentType: input.employmentType ?? 'Probationary',
        payBasis: input.payBasis ?? 'Monthly', salaryCents: input.salaryCents ?? 4200000, payrollGroup: input.payrollGroup ?? 'Semi-monthly',
        schedule: input.schedule ?? 'Fixed Day', hireDate: input.hireDate ?? demoClock.today(), leaveBalance: 0, bankAccount: 'DEMO-BANK-PENDING', governmentId: 'DEMO-GOV-PENDING', benefitPlanIds: ['BEN-001'], loanDeductionCents: 0,
        employmentHistory: [{ id: `HIST-${next}-1`, type: 'Hire', effectiveDate: input.hireDate ?? demoClock.today(), reason: 'HR-created employee draft', detail: `${input.position} · ${input.department}` }],
      };
      setState((current) => audit({ ...current, employees: [...current.employees, employee] }, 'Created', 'People', `${employee.id} employee draft`));
      notify(`Employee draft ${employee.id} created.`);
      return true;
    },
    updateEmployeeSalary: (id, salaryCents) => {
      if (!guard(['hr'])) return false;
      if (salaryCents <= 0) { notify('Salary must be greater than zero.'); return false; }
      setState((current) => audit({ ...current, employees: current.employees.map((employee) => employee.id === id ? { ...employee, salaryCents } : employee) }, 'Updated', 'People', `${id} compensation change`));
      notify('Compensation updated for the current runtime.');
      return true;
    },
    updateEmployeeAssignment: (id, department, position) => {
      if (!guard(['admin', 'hr'])) return false;
      if (!state.organization.some((item) => item.type === 'Department' && item.name === department && item.active) || !state.organization.some((item) => item.type === 'Position' && item.name === position && item.active)) { notify('Choose active department and position records.'); return false; }
      setState((current) => audit({ ...current, employees: current.employees.map((employee) => employee.id === id ? { ...employee, department, position, employmentHistory: [...employee.employmentHistory, { id: `HIST-${id}-${employee.employmentHistory.length + 1}`, type: 'Transfer', effectiveDate: demoClock.today(), reason: 'Organization assignment update', detail: `${position} · ${department}`, snapshot: { entity: employee.entity, branch: employee.branch, department, position, salaryCents: employee.salaryCents, payrollGroup: employee.payrollGroup, status: employee.status } }] } : employee) }, 'Updated assignment', 'People', `${id} → ${department} / ${position}`));
      notify('Employee assignment updated; organization counts now reconcile.');
      return true;
    },
    applyEmploymentAction: (id, type, effectiveDate, reason, detail) => {
      if (!guard(['hr'])) return false;
      if (!reason.trim() || !effectiveDate) { notify('Effective date and reason are required.'); return false; }
      setState((current) => audit({ ...current, employees: current.employees.map((employee) => {
        if (employee.id !== id) return employee;
        const status = type === 'Separation' ? 'Separated' as const : employee.status;
        const employmentType = type === 'Regularization' ? 'Regular' as const : employee.employmentType;
        return { ...employee, status, employmentType, employmentHistory: [...employee.employmentHistory, { id: `HIST-${id}-${employee.employmentHistory.length + 1}`, type, effectiveDate, reason: reason.trim(), detail: detail.trim() || type, snapshot: { entity: employee.entity, branch: employee.branch, department: employee.department, position: employee.position, salaryCents: employee.salaryCents, payrollGroup: employee.payrollGroup, status } }] };
      }) }, type, 'People', `${id} · ${effectiveDate} · ${reason}`));
      notify(`${type} recorded with an effective-dated history entry.`);
      return true;
    },
    moveApplicant: (id, stage) => {
      if (!guard(['recruiter'])) return false;
      setState((current) => audit({ ...current, applicants: current.applicants.map((item) => item.id === id ? { ...item, stage, offerAccepted: stage === 'Offer' ? item.offerAccepted : item.offerAccepted } : item) }, 'Updated', 'Recruitment', `${id} moved to ${stage}`));
      notify(`Applicant moved to ${stage}.`);
      return true;
    },
    addApplicant: (name, email, requisition) => {
      if (!guard(['recruiter'])) return false;
      if (!name.trim() || !email.includes('@')) { notify('Enter a name and valid demo email.'); return false; }
      setState((current) => audit({ ...current, applicants: [...current.applicants, { id: `APP-${String(current.applicants.length + 1).padStart(3, '0')}`, name, email, requisition, stage: 'Applied', score: 0, feedback: '', offerAccepted: false }] }, 'Created', 'Recruitment', name));
      notify('Applicant added to Applied.');
      return true;
    },
    createRequisition: (title, department, openings) => {
      if (!guard(['recruiter'])) return false;
      if (!title.trim() || openings < 1) { notify('Enter a title and at least one opening.'); return false; }
      setState((current) => audit({ ...current, requisitions: [...current.requisitions, { id: `REQ-${100 + current.requisitions.length + 1}`, title: title.trim(), department, openings, applicants: 0, status: 'Open' }] }, 'Created', 'Recruitment', `${title} · ${department}`));
      notify('Job requisition created.');
      return true;
    },
    updateApplicantAssessment: (id, score, feedback) => {
      if (!guard(['recruiter'])) return false;
      if (score < 0 || score > 100 || !feedback.trim()) { notify('Enter a score from 0–100 and interview feedback.'); return false; }
      setState((current) => audit({ ...current, applicants: current.applicants.map((item) => item.id === id ? { ...item, score, feedback: feedback.trim(), stage: item.stage === 'Screening' ? 'Interview' : item.stage } : item) }, 'Recorded interview', 'Recruitment', `${id} · ${score}%`));
      notify('Interview assessment saved.');
      return true;
    },
    acceptApplicantOffer: (id) => {
      if (!guard(['recruiter'])) return false;
      const applicant = state.applicants.find((item) => item.id === id);
      if (!applicant || applicant.stage !== 'Offer') { notify('Move the applicant to Offer before accepting it.'); return false; }
      setState((current) => audit({ ...current, applicants: current.applicants.map((item) => item.id === id ? { ...item, offerAccepted: true, feedback: `${item.feedback}\nOffer accepted in demo.`.trim() } : item) }, 'Accepted offer', 'Recruitment', id));
      notify('Offer marked accepted and ready for employee conversion.');
      return true;
    },
    convertApplicant: (id) => {
      if (!guard(['recruiter'])) return false;
      const applicant = state.applicants.find((item) => item.id === id);
      if (!applicant?.offerAccepted || applicant.convertedEmployeeId) { notify('Only an accepted, unconverted offer can become an employee draft.'); return false; }
      const [firstName, ...rest] = applicant.name.split(' ');
      const next = 251;
      const employeeId = 'EMP-2026-251';
      if (state.employees.some((employee) => employee.id === employeeId)) { notify('The accepted applicant was already assigned employee 251.'); return false; }
      const employee: Employee = {
        id: employeeId, employeeNo: String(next).padStart(3, '0'), firstName, lastName: rest.join(' '), email: applicant.email, phone: '+63 917 555 0251',
        entity: 'ZylWorks Services, Inc.', branch: 'Metro Manila HQ', department: 'Information Technology', position: applicant.requisition,
        status: 'Draft', employmentType: 'Probationary', payBasis: 'Monthly', salaryCents: 5800000, payrollGroup: 'Semi-monthly', schedule: 'Fixed Day',
        hireDate: demoClock.today(), leaveBalance: 0, bankAccount: 'DEMO-BANK-PENDING', governmentId: 'DEMO-GOV-PENDING', benefitPlanIds: ['BEN-001'], loanDeductionCents: 0,
        employmentHistory: [{ id: 'HIST-251-1', type: 'Hire', effectiveDate: demoClock.today(), reason: 'Converted from accepted applicant', detail: `${applicant.requisition} · HR activation pending` }],
      };
      setState((current) => audit({ ...current, employees: [...current.employees, employee], applicants: current.applicants.map((item) => item.id === id ? { ...item, stage: 'Hired', convertedEmployeeId: employeeId } : item) }, 'Converted', 'Recruitment', `${id} to ${employeeId}`));
      notify(`${employeeId} created as an HR activation draft.`);
      return true;
    },
    activateEmployee: (id) => {
      if (!guard(['hr'])) return false;
      const employee = state.employees.find((item) => item.id === id);
      if (!employee || employee.status !== 'Draft') { notify('Select an employee draft to activate.'); return false; }
      setState((current) => audit(createMessage({ ...current, employees: current.employees.map((item) => item.id === id ? { ...item, status: 'Active' } : item) }, employee.email, 'Welcome to ZylWorks', 'Your fictional employee record is active.'), 'Activated', 'People', id));
      notify(`${id} activated. Headcount and reports are updated.`);
      return true;
    },
    syncBiometric: () => {
      if (!guard(['timeadmin'])) return null;
      if (state.biometricSynced) { notify('This demo batch was already synchronized; no duplicate events were inserted.'); return { accepted: 0, duplicate: 18, rejected: 2, unmatched: 1 }; }
      setState((current) => audit({ ...current, biometricSynced: true, devices: current.devices.map((device) => device.status === 'Ready' ? { ...device, lastSync: `${demoClock.today()} 10:30 PHT` } : device), attendanceEvents: [...current.attendanceEvents,
        ...Array.from({ length: 18 }, (_, index) => ({ id: `SYNC-${String(index + 1).padStart(3, '0')}`, employeeId: `EMP-2026-${String(index + 20).padStart(3, '0')}`, deviceId: index % 2 ? 'BIO-02' : 'BIO-01', timestamp: `2026-08-13T${index % 2 ? '17' : '08'}:${String(index).padStart(2, '0')}:00+08:00`, direction: (index % 2 ? 'OUT' : 'IN') as 'IN' | 'OUT', source: 'Biometric' as const, result: 'Accepted' as const })),
        { id: 'SYNC-DUP', employeeId: 'EMP-2026-020', deviceId: 'BIO-01', timestamp: '2026-08-13T08:00:00+08:00', direction: 'IN', source: 'Biometric', result: 'Duplicate' },
        { id: 'SYNC-REJ-1', employeeId: 'EMP-2026-021', deviceId: 'BIO-02', timestamp: '2026-08-13T25:99:00+08:00', direction: 'IN', source: 'Biometric', result: 'Rejected' },
        { id: 'SYNC-REJ-2', employeeId: 'EMP-2026-022', deviceId: 'BIO-01', timestamp: 'invalid-demo-event', direction: 'OUT', source: 'Biometric', result: 'Rejected' },
        { id: 'SYNC-UNMATCHED', deviceId: 'BIO-02', timestamp: '2026-08-13T08:14:00+08:00', direction: 'IN', source: 'Biometric', result: 'Unmatched' },
      ] }, 'Simulated sync', 'Attendance', '18 accepted, 1 duplicate, 2 rejected, 1 unmatched'));
      notify('Demo sync complete: 18 accepted, 1 duplicate, 2 rejected, 1 unmatched.');
      return { accepted: 18, duplicate: 1, rejected: 2, unmatched: 1 };
    },
    resolveException: (id) => {
      if (!guard(['timeadmin'])) return false;
      const target = state.attendanceExceptions.find((item) => item.id === id);
      setState((current) => audit({ ...current, attendanceExceptions: current.attendanceExceptions.map((item) => item.id === id ? { ...item, status: 'Resolved' } : item), dailyAttendance: current.dailyAttendance.map((day) => target && day.employeeId === target.employeeId && day.date === target.date ? { ...day, status: 'Present', lastOut: day.lastOut ?? '17:00', payableMinutes: 480, lateMinutes: target.type === 'Late / undertime' ? 0 : day.lateMinutes } : day) }, 'Resolved', 'Attendance', id));
      notify('Attendance exception resolved; payable time is updated.');
      return true;
    },
    resolveAllAttendanceExceptions: () => {
      if (!guard(['timeadmin'])) return false;
      setState((current) => audit({ ...current, attendanceExceptions: current.attendanceExceptions.map((item) => ({ ...item, status: 'Resolved' })), dailyAttendance: current.dailyAttendance.map((day) => day.status === 'Missing punch' ? { ...day, status: 'Present', lastOut: '17:00', payableMinutes: 480 } : day) }, 'Resolved batch', 'Attendance', 'All seeded demo exceptions resolved'));
      notify('All seeded demo exceptions resolved. The attendance period can now be closed.');
      return true;
    },
    assignSchedule: (employeeId, schedule) => {
      if (!guard(['timeadmin'])) return false;
      if (!state.employees.some((employee) => employee.id === employeeId) || !state.scheduleTemplates.some((template) => template.name === schedule)) { notify('Enter a valid employee ID and schedule.'); return false; }
      setState((current) => audit({ ...current, employees: current.employees.map((employee) => employee.id === employeeId ? { ...employee, schedule } : employee) }, 'Assigned schedule', 'Attendance', `${employeeId} → ${schedule}`));
      notify('Schedule assignment updated in the live employee record.');
      return true;
    },
    addManualAttendanceEvent: (employeeId, direction) => {
      if (!persona || !['timeadmin', 'employee'].includes(persona.role) || (persona.role === 'employee' && persona.employeeId !== employeeId)) { notify('This account cannot create that attendance event.'); return false; }
      setState((current) => audit({ ...current, attendanceEvents: [{ id: `EVT-${current.attendanceEvents.length + 1}`, employeeId, deviceId: persona.role === 'employee' ? 'WEB-SELF-SERVICE' : 'MANUAL-ADMIN', timestamp: demoClock.now(), direction, source: persona.role === 'employee' ? 'Web clock' : 'Manual', result: 'Accepted' }, ...current.attendanceEvents] }, `Recorded ${direction}`, 'Attendance', `${employeeId} · ${persona.role === 'employee' ? 'web clock' : 'manual'}`));
      notify(`${direction} event recorded in the raw event stream.`);
      return true;
    },
    closeAttendancePeriod: () => {
      if (!guard(['timeadmin'])) return false;
      const unresolved = state.attendanceExceptions.filter((item) => item.status !== 'Resolved').length;
      if (unresolved) { notify(`Resolve ${unresolved} attendance exception${unresolved === 1 ? '' : 's'} before closing the period.`); return false; }
      setState((current) => audit({ ...current, attendancePeriodClosed: true }, 'Closed period', 'Attendance', 'August 1–15 demo attendance period'));
      notify('Attendance period closed. Payroll can use the interpreted payable-time results.');
      return true;
    },
    submitRequest: (input) => {
      if (!guard(['employee'])) return false;
      if (!persona?.employeeId || !input.reason.trim() || input.units <= 0) { notify('Complete all request fields.'); return false; }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(input.startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(input.endDate) || input.endDate < input.startDate) { notify('Enter valid dates with the end date on or after the start date.'); return false; }
      const employee = state.employees.find((item) => item.id === persona.employeeId);
      if (input.type === 'Vacation Leave' && input.units > (employee?.leaveBalance ?? 0)) { notify(`Insufficient vacation balance. Available: ${employee?.leaveBalance ?? 0} days.`); return false; }
      if (input.type === 'Overtime' && input.units > 12) { notify('Overtime requests are limited to 12 hours per date in this demo.'); return false; }
      const overlap = input.type !== 'Profile Update' && state.requests.some((request) => request.employeeId === persona.employeeId && input.startDate <= request.endDate && input.endDate >= request.startDate && !['Rejected', 'Returned'].includes(request.status));
      if (overlap) { notify('A request already exists for this date. Choose another demo date.'); return false; }
      const status = input.type === 'Profile Update' ? 'Pending HR' as const : 'Pending Manager' as const;
      const request = { id: `REQ-WF-${String(state.requests.length + 1).padStart(3, '0')}`, employeeId: persona.employeeId, ...input, status, createdAt: demoClock.now(), history: [{ at: demoClock.now(), actor: persona.email, action: 'Submitted' }] };
      const recipient = status === 'Pending HR' ? 'hr@demo.zylhr' : 'manager@demo.zylhr';
      setState((current) => audit(createMessage({ ...current, requests: [request, ...current.requests] }, recipient, `${input.type} awaiting approval`, `${persona.email} submitted a fictional request.`), 'Submitted', 'Requests', request.id));
      notify(status === 'Pending HR' ? 'Profile update submitted directly to HR.' : 'Request submitted to the Line Manager.');
      return true;
    },
    decideRequest: (id, action, comment) => {
      const request = state.requests.find((item) => item.id === id);
      if (!request || !persona) return false;
      const isManagerStage = request.status === 'Pending Manager' && persona.role === 'manager';
      const isHrStage = request.status === 'Pending HR' && persona.role === 'hr';
      if (!isManagerStage && !isHrStage) { notify('This request is not at your approval stage.'); return false; }
      if (isManagerStage && state.employees.find((employee) => employee.id === request.employeeId)?.managerId !== persona.employeeId) { notify('Managers can approve direct reports only.'); return false; }
      if (persona.employeeId === request.employeeId) { notify('Self-approval is blocked.'); return false; }
      const nextStatus = action === 'reject' ? 'Rejected' : action === 'return' ? 'Returned' : isManagerStage ? 'Pending HR' : 'Approved';
      setState((current) => {
        let next = { ...current, requests: current.requests.map((item) => item.id === id ? { ...item, status: nextStatus, history: [...item.history, { at: demoClock.now(), actor: persona.email, action: action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Returned for changes', comment }] } : item) } as DemoState;
        if (nextStatus === 'Approved') {
          const approved = next.requests.find((item) => item.id === id)!;
          if (approved.type === 'Vacation Leave') next = { ...next, employees: next.employees.map((employee) => employee.id === approved.employeeId ? { ...employee, leaveBalance: Math.max(0, employee.leaveBalance - approved.units) } : employee) };
          if (approved.type === 'Attendance Correction') next = { ...next, attendanceExceptions: next.attendanceExceptions.map((exception) => exception.employeeId === approved.employeeId && exception.status !== 'Resolved' ? { ...exception, status: 'Resolved' } : exception) };
        }
        const recipient = nextStatus === 'Pending HR' ? 'hr@demo.zylhr' : next.employees.find((employee) => employee.id === request.employeeId)?.email ?? 'employee@demo.zylhr';
        return audit(createMessage(next, recipient, `Request ${nextStatus}`, `${request.type} is now ${nextStatus}.`), action === 'approve' ? 'Approved' : 'Updated', 'Approvals', id);
      });
      notify(`Request moved to ${nextStatus}.`);
      return true;
    },
    toggleBenefit: (employeeId, benefitId) => {
      if (!guard(['hr'])) return false;
      const targetEmployee = state.employees.find((employee) => employee.id === employeeId);
      const targetPlan = state.benefits.find((plan) => plan.id === benefitId);
      if (!targetEmployee || !targetPlan) { notify('Select a valid employee and benefit plan.'); return false; }
      const alreadyEnrolled = targetEmployee.benefitPlanIds.includes(benefitId);
      if (!alreadyEnrolled && targetPlan.eligibility === 'Regular employees' && targetEmployee.employmentType !== 'Regular') { notify('Enrollment blocked: this plan is limited to regular employees.'); return false; }
      if (!alreadyEnrolled && targetPlan.eligibility === 'Operations employees' && !targetEmployee.department.includes('Operations')) { notify('Enrollment blocked: this allowance is limited to Operations employees.'); return false; }
      setState((current) => {
        const enrolled = current.employees.find((employee) => employee.id === employeeId)?.benefitPlanIds.includes(benefitId);
        const next = { ...current, employees: current.employees.map((employee) => employee.id === employeeId ? { ...employee, benefitPlanIds: enrolled ? employee.benefitPlanIds.filter((id) => id !== benefitId) : [...employee.benefitPlanIds, benefitId] } : employee), benefits: current.benefits.map((benefit) => benefit.id === benefitId ? { ...benefit, enrolledCount: benefit.enrolledCount + (enrolled ? -1 : 1) } : benefit) };
        return audit(next, enrolled ? 'Removed enrollment' : 'Enrolled', 'Benefits', `${employeeId} / ${benefitId}`);
      });
      notify('Benefit enrollment updated; payroll preview will use the new deduction.');
      return true;
    },
    submitSelfReview: (text) => {
      if (!guard(['employee']) || !persona?.employeeId || !text.trim()) return false;
      setState((current) => audit({ ...current, performanceCycles: current.performanceCycles.map((cycle) => cycle.status === 'Active' ? { ...cycle, participants: cycle.participants.map((participant) => participant.employeeId === persona.employeeId ? { ...participant, selfReview: text } : participant) } : cycle) }, 'Submitted', 'Performance', 'Employee self-review'));
      notify('Self-review submitted to your manager.');
      return true;
    },
    submitManagerReview: (employeeId, text, rating) => {
      if (!guard(['manager']) || !text.trim() || rating < 1 || rating > 5) return false;
      setState((current) => audit({ ...current, performanceCycles: current.performanceCycles.map((cycle) => cycle.status === 'Active' ? { ...cycle, participants: cycle.participants.map((participant) => participant.employeeId === employeeId ? { ...participant, managerReview: text, rating } : participant) } : cycle) }, 'Completed', 'Performance', `${employeeId} manager review`));
      notify('Manager review completed.');
      return true;
    },
    acknowledgeReview: () => {
      if (!guard(['employee']) || !persona?.employeeId) return false;
      const canAcknowledge = state.performanceCycles.some((cycle) => cycle.status === 'Active' && cycle.participants.some((participant) => participant.employeeId === persona.employeeId && !!participant.managerReview));
      if (!canAcknowledge) { notify('The manager review must be completed before acknowledgement.'); return false; }
      setState((current) => audit({ ...current, performanceCycles: current.performanceCycles.map((cycle) => cycle.status === 'Active' ? { ...cycle, participants: cycle.participants.map((participant) => participant.employeeId === persona.employeeId ? { ...participant, acknowledged: true } : participant) } : cycle) }, 'Acknowledged', 'Performance', 'Employee acknowledgement'));
      notify('Review acknowledged.');
      return true;
    },
    calculateCurrentPayroll: () => {
      if (!guard(['payroll'])) return false;
      setState((current) => {
        const run = current.payrollRuns.find((item) => item.id === 'PAY-2026-08A')!;
        const version = (run.snapshot?.version ?? 0) + 1;
        const snapshot = calculatePayroll(current.employees, current.requests, current.benefits, 'payroll', version);
        return audit({ ...current, payrollRuns: current.payrollRuns.map((item) => item.id === run.id ? { ...item, status: 'Calculated', snapshot, signOff: createPayrollSignOff() } : item) }, 'Calculated', 'Payroll', `${run.id} version ${version}`);
      });
      notify('Payroll calculation snapshot created from current HR, time, request, and benefit data.');
      return true;
    },
    resolvePayrollBlocker: () => {
      if (!guard(['payroll'])) return false;
      setState((current) => audit({ ...current, employees: current.employees.map((employee) => employee.id === 'EMP-2026-032' ? { ...employee, bankAccount: 'DEMO-BANK-88000032' } : employee), payrollRuns: current.payrollRuns.map((run) => run.id === 'PAY-2026-08A' && run.snapshot ? { ...run, status: 'Calculated', snapshot: { ...run.snapshot, blockers: [], warnings: run.snapshot.warnings.filter((warning) => !warning.includes('EMP-2026-032')), lines: run.snapshot.lines.map((line) => line.employeeId === 'EMP-2026-032' ? { ...line, warnings: line.warnings.filter((warning) => warning !== 'Missing bank account validation') } : line) } } : run) }, 'Resolved blocker', 'Payroll', 'Fictional bank validation completed for EMP-2026-032'));
      notify('Validation blocker resolved. Recalculate or validate the run.');
      return true;
    },
    validateCurrentPayroll: () => {
      if (!guard(['payroll'])) return false;
      const run = state.payrollRuns.find((item) => item.id === 'PAY-2026-08A');
      if (!run?.snapshot) { notify('Calculate the run first.'); return false; }
      if (run.snapshot.blockers.length) { notify('Resolve all blockers before validation.'); return false; }
      if (!run.signOff.every((item) => item.checked)) { notify('Complete all processor sign-off items before validation.'); return false; }
      setState((current) => audit({ ...current, payrollRuns: current.payrollRuns.map((item) => item.id === run.id ? { ...item, status: 'Validated' } : item) }, 'Validated', 'Payroll', run.id));
      notify('Run validated and ready for the separate Payroll Approver account.');
      return true;
    },
    approveCurrentPayroll: () => {
      if (!guard(['payrollapprover'])) return false;
      const run = state.payrollRuns.find((item) => item.id === 'PAY-2026-08A');
      if (run?.status !== 'Validated') { notify('Only a validated run can be approved.'); return false; }
      if (run.snapshot?.preparedBy === persona?.role) { notify('The preparer cannot approve the same payroll version.'); return false; }
      setState((current) => audit({ ...current, payrollRuns: current.payrollRuns.map((item) => item.id === run.id ? { ...item, status: 'Approved', approvedBy: 'payrollapprover' } : item) }, 'Approved', 'Payroll', run.id));
      notify('Payroll approved. The frozen snapshot can now be released.');
      return true;
    },
    releaseCurrentPayroll: () => {
      if (!guard(['payrollapprover'])) return false;
      const run = state.payrollRuns.find((item) => item.id === 'PAY-2026-08A');
      if (run?.status !== 'Approved') { notify('Approve the run before release.'); return false; }
      setState((current) => audit(createMessage({ ...current, payrollRuns: current.payrollRuns.map((item) => item.id === run.id ? { ...item, status: 'Released', releasedAt: demoClock.now() } : item) }, 'employee@demo.zylhr', 'Payslip published', 'A fictional demo payslip is now available.'), 'Released', 'Payroll', run.id));
      notify('Payroll released. Payslips and finance outputs are now available.');
      return true;
    },
    simulateGovernmentSubmission: () => {
      if (!guard(['finance'])) return null;
      const ref = `DEMO-GOV-${demoClock.today().replaceAll('-', '')}-${String(state.submissionReferences.length + 1).padStart(3, '0')}`;
      setState((current) => audit({ ...current, submissionReferences: [ref, ...current.submissionReferences] }, 'Simulated submission', 'Integrations', ref));
      notify(`Fictional submission reference created: ${ref}`);
      return ref;
    },
    simulateWebhook: () => {
      if (!guard(['admin'])) return false;
      setState((current) => audit({ ...current, webhookAttempts: current.webhookAttempts + 1 }, 'Simulated delivery', 'Integrations', 'Local webhook payload; no network request made'));
      notify('Local webhook delivery simulated. No outbound request was made.');
      return true;
    },
    markNotificationsRead: () => setState((current) => ({ ...current, notifications: current.notifications.map((item) => ({ ...item, read: true })) })),
    recordExport: (detail) => setState((current) => audit(current, 'Exported', 'Reports', detail)),
    addTemporaryUpload: (employeeId, name, size) => {
      if (!persona || (persona.role !== 'hr' && !(persona.role === 'employee' && persona.employeeId === employeeId))) { notify('This demo account cannot attach a document for that employee.'); return false; }
      setState((current) => audit({ ...current, temporaryUploads: [{ id: `UP-${current.temporaryUploads.length + 1}`, employeeId, name, size, selectedAt: demoClock.now() }, ...current.temporaryUploads] }, 'Selected temporary file', 'People', `${employeeId} · ${name} · never transmitted`));
      notify('Temporary file metadata added. The file was not transmitted and will disappear on reload.');
      return true;
    },
    stageImport: (kind, fileName, rows) => {
      const allowed = kind === 'Employee master' ? guard(['admin', 'hr']) : guard(['timeadmin']);
      if (!allowed || !rows.length) { if (!rows.length) notify('The import file does not contain data rows.'); return null; }
      const id = `IMP-${String(state.importBatches.length + 1).padStart(3, '0')}`;
      setState((current) => audit({ ...current, importBatches: [{ id, kind, fileName, createdAt: demoClock.now(), createdBy: persona?.email ?? 'demo', rows, status: 'Previewed' }, ...current.importBatches] }, 'Previewed import', 'Imports', `${kind} · ${fileName} · ${rows.filter((row) => row.valid).length} valid / ${rows.filter((row) => !row.valid).length} invalid`));
      notify('Import preview created. Review row errors before committing valid rows.');
      return id;
    },
    commitImport: (id) => {
      const batch = state.importBatches.find((item) => item.id === id);
      if (!batch || batch.status !== 'Previewed') { notify('Choose a previewed import batch.'); return false; }
      const allowed = batch.kind === 'Employee master' ? guard(['admin', 'hr']) : guard(['timeadmin']);
      if (!allowed) return false;
      const validRows = batch.rows.filter((row) => row.valid);
      if (!validRows.length) { notify('There are no valid rows to commit.'); return false; }
      setState((current) => {
        let next = { ...current } as DemoState;
        if (batch.kind === 'Employee master') {
          const start = Math.max(252, ...current.employees.map((employee) => Number(employee.employeeNo) + 1));
          const additions: Employee[] = validRows.map((row, index) => {
            const employeeNo = String(start + index).padStart(3, '0');
            const values = row.values;
            const employee: Employee = { id: `EMP-2026-${employeeNo}`, employeeNo, firstName: values.first_name, lastName: values.last_name, email: values.email.toLowerCase(), phone: '+63 917 555 9000', entity: 'ZylWorks Services, Inc.', branch: 'Metro Manila HQ', department: values.department, position: values.position, status: 'Draft', employmentType: 'Probationary', payBasis: 'Monthly', salaryCents: Number(values.monthly_salary) * 100, payrollGroup: 'Semi-monthly', schedule: 'Fixed Day', hireDate: values.hire_date, leaveBalance: 0, bankAccount: 'DEMO-BANK-PENDING', governmentId: 'DEMO-GOV-PENDING', benefitPlanIds: ['BEN-001'], loanDeductionCents: 0, employmentHistory: [] };
            employee.employmentHistory = [{ id: `HIST-${employeeNo}-1`, type: 'Hire', effectiveDate: employee.hireDate, reason: `Imported from ${batch.fileName}`, detail: `${employee.position} · ${employee.department}`, snapshot: { entity: employee.entity, branch: employee.branch, department: employee.department, position: employee.position, salaryCents: employee.salaryCents, payrollGroup: employee.payrollGroup, status: employee.status } }];
            return employee;
          });
          next = { ...next, employees: [...next.employees, ...additions] };
        } else {
          const events = validRows.map((row, index) => ({ id: `IMP-EVT-${current.attendanceEvents.length + index + 1}`, employeeId: row.values.employee_id, deviceId: row.values.device_id || 'FILE-IMPORT', timestamp: row.values.timestamp, direction: row.values.direction as 'IN' | 'OUT', source: 'Manual' as const, result: 'Accepted' as const }));
          next = { ...next, attendanceEvents: [...events, ...next.attendanceEvents] };
        }
        next = { ...next, importBatches: next.importBatches.map((item) => item.id === id ? { ...item, status: 'Committed', committedAt: demoClock.now() } : item) };
        return audit(next, 'Committed import', 'Imports', `${id} · ${validRows.length} valid rows committed`);
      });
      notify(`${validRows.length} valid ${batch.kind.toLowerCase()} rows committed; invalid rows were skipped.`);
      return true;
    },
    resolveDocument: (id) => {
      if (!guard(['hr'])) return false;
      const item = state.documentCompliance.find((document) => document.id === id);
      if (!item || item.status === 'Current') { notify('Select an open document requirement.'); return false; }
      setState((current) => audit({ ...current, documentCompliance: current.documentCompliance.map((document) => document.id === id ? { ...document, status: 'Current', resolvedAt: demoClock.now() } : document) }, 'Resolved requirement', 'Documents', `${id} · ${item.documentName}`));
      notify('Document requirement resolved and removed from the open work queue.');
      return true;
    },
    sendDocumentReminder: (id) => {
      if (!guard(['hr'])) return false;
      const item = state.documentCompliance.find((document) => document.id === id);
      const employee = state.employees.find((candidate) => candidate.id === item?.employeeId);
      if (!item || !employee || item.status === 'Current') return false;
      setState((current) => audit(createMessage(current, employee.email, `Document action required: ${item.documentName}`, `Complete the fictional ${item.category.toLowerCase()} requirement by ${item.dueDate}.`), 'Sent reminder', 'Documents', `${id} · simulated delivery`));
      notify('Reminder added to in-app notifications and the Demo Outbox. Nothing was sent externally.');
      return true;
    },
    acknowledgeDocument: (id) => {
      if (!guard(['employee']) || !persona?.employeeId) return false;
      const item = state.documentCompliance.find((document) => document.id === id);
      if (!item || item.employeeId !== persona.employeeId || item.status !== 'Acknowledgement due') { notify('You can acknowledge only your own pending policy.'); return false; }
      setState((current) => audit({ ...current, documentCompliance: current.documentCompliance.map((document) => document.id === id ? { ...document, status: 'Current', acknowledgedAt: demoClock.now(), resolvedAt: demoClock.now() } : document) }, 'Acknowledged policy', 'Documents', `${id} · ${item.version}`));
      notify('Policy acknowledgement recorded with version and timestamp.');
      return true;
    },
    togglePayrollSignOff: (id) => {
      if (!guard(['payroll'])) return false;
      const run = state.payrollRuns.find((item) => item.id === 'PAY-2026-08A');
      if (!run?.snapshot || !['Calculated', 'Validated'].includes(run.status)) { notify('Calculate the current run before completing sign-off.'); return false; }
      if (run.status === 'Validated') { notify('Validated sign-off evidence is frozen. Recalculate to create a new checklist.'); return false; }
      setState((current) => audit({ ...current, payrollRuns: current.payrollRuns.map((item) => item.id === run.id ? { ...item, signOff: item.signOff.map((check) => check.id === id ? { ...check, checked: !check.checked, checkedBy: !check.checked ? persona?.email : undefined, checkedAt: !check.checked ? demoClock.now() : undefined } : check) } : item) }, 'Updated sign-off', 'Payroll', `${run.id} · ${id}`));
      notify('Processor sign-off checklist updated.');
      return true;
    },
    toggleWebClock: () => {
      if (!guard(['employee'])) return false;
      setState((current) => audit({ ...current, webClockedIn: !current.webClockedIn, attendanceEvents: [{ id: `EVT-${current.attendanceEvents.length + 1}`, employeeId: persona?.employeeId, deviceId: 'WEB-SELF-SERVICE', timestamp: demoClock.now(), direction: current.webClockedIn ? 'OUT' : 'IN', source: 'Web clock', result: 'Accepted' }, ...current.attendanceEvents] }, current.webClockedIn ? 'Clocked out' : 'Clocked in', 'Attendance', 'Responsive web self-service event'));
      notify(state.webClockedIn ? 'Demo clock-out recorded.' : 'Demo clock-in recorded.');
      return true;
    },
  // State and persona intentionally recreate actions when data changes; this keeps guards and calculations current.
  }), [state, persona, message]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used inside DemoProvider');
  return context;
}

export const pageAccess = rolePages;
export const personaTitle = (role: Role) => roleLabels[role];
