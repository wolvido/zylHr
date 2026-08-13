export type Role =
  | 'admin'
  | 'hr'
  | 'recruiter'
  | 'timeadmin'
  | 'manager'
  | 'payroll'
  | 'payrollapprover'
  | 'finance'
  | 'employee';

export type PageKey =
  | 'dashboard'
  | 'organization'
  | 'recruitment'
  | 'people'
  | 'attendance'
  | 'requests'
  | 'benefits'
  | 'performance'
  | 'approvals'
  | 'operations'
  | 'imports'
  | 'documents'
  | 'payroll'
  | 'reports'
  | 'integrations'
  | 'administration';

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface Persona {
  role: Role;
  email: string;
  title: string;
  initials: string;
  description: string;
  employeeId?: string;
}

export type EmployeeStatus = 'Active' | 'Draft' | 'Separated';
export type EmploymentType = 'Regular' | 'Probationary' | 'Contractual' | 'Part-time';
export type PayBasis = 'Monthly' | 'Daily' | 'Hourly';
export type PayrollGroup = 'Weekly' | 'Semi-monthly' | 'Monthly';

export interface Employee {
  id: string;
  employeeNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  entity: string;
  branch: string;
  department: string;
  position: string;
  managerId?: string;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  payBasis: PayBasis;
  salaryCents: number;
  payrollGroup: PayrollGroup;
  schedule: string;
  hireDate: string;
  leaveBalance: number;
  bankAccount: string;
  governmentId: string;
  benefitPlanIds: string[];
  loanDeductionCents: number;
  employmentHistory: EmploymentHistoryItem[];
}

export interface EmploymentHistoryItem {
  id: string;
  type: 'Hire' | 'Transfer' | 'Promotion' | 'Compensation change' | 'Regularization' | 'Separation';
  effectiveDate: string;
  reason: string;
  detail: string;
  snapshot?: {
    entity: string;
    branch: string;
    department: string;
    position: string;
    salaryCents: number;
    payrollGroup: PayrollGroup;
    status: EmployeeStatus;
  };
}

export type ApplicantStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired';

export interface Applicant {
  id: string;
  name: string;
  email: string;
  requisition: string;
  stage: ApplicantStage;
  score: number;
  feedback: string;
  offerAccepted: boolean;
  convertedEmployeeId?: string;
}

export interface Requisition {
  id: string;
  title: string;
  department: string;
  openings: number;
  applicants: number;
  status: 'Open' | 'On hold' | 'Closed';
}

export interface OrganizationRecord {
  id: string;
  type: 'Entity' | 'Branch' | 'Department' | 'Position' | 'Cost center';
  name: string;
  parent?: string;
  active: boolean;
}

export type RequestType = 'Unpaid Leave' | 'Vacation Leave' | 'Overtime' | 'Attendance Correction' | 'Profile Update';
export type RequestStatus = 'Pending Manager' | 'Pending HR' | 'Returned' | 'Rejected' | 'Approved';

export interface WorkflowRequest {
  id: string;
  employeeId: string;
  type: RequestType;
  startDate: string;
  endDate: string;
  units: number;
  reason: string;
  status: RequestStatus;
  createdAt: string;
  history: { at: string; actor: string; action: string; comment?: string }[];
}

export interface AttendanceException {
  id: string;
  employeeId: string;
  date: string;
  type: 'Missing punch' | 'Late / undertime' | 'Unscheduled work' | 'Unmatched identity';
  details: string;
  status: 'Open' | 'Correction submitted' | 'Resolved';
  minutes: number;
}

export interface ScheduleTemplate {
  id: string;
  name: string;
  start: string;
  end: string;
  breakMinutes: number;
  paidBreak: boolean;
  overnight: boolean;
  split?: string;
}

export interface AttendanceEvent {
  id: string;
  employeeId?: string;
  deviceId: string;
  timestamp: string;
  direction: 'IN' | 'OUT';
  source: 'Biometric' | 'Web clock' | 'Manual';
  result: 'Accepted' | 'Duplicate' | 'Rejected' | 'Unmatched';
}

export interface DailyAttendance {
  employeeId: string;
  date: string;
  firstIn?: string;
  lastOut?: string;
  status: 'Present' | 'Late' | 'Undertime' | 'Absent' | 'Missing punch' | 'Overtime candidate' | 'Rest-day work' | 'Holiday work' | 'Overnight work';
  payableMinutes: number;
  lateMinutes: number;
  overtimeMinutes: number;
}

export interface Device {
  id: string;
  name: string;
  location: string;
  status: 'Ready' | 'Offline';
  lastSync: string;
}

export interface BenefitPlan {
  id: string;
  name: string;
  category: string;
  eligibility: string;
  employeeCents: number;
  employerCents: number;
  enrolledCount: number;
}

export interface PerformanceParticipant {
  employeeId: string;
  selfReview: string;
  managerReview: string;
  rating?: number;
  acknowledged: boolean;
}

export interface PerformanceCycle {
  id: string;
  name: string;
  status: 'Active' | 'Completed';
  dueDate: string;
  participants: PerformanceParticipant[];
}

export interface PayrollLine {
  employeeId: string;
  basicCents: number;
  overtimeCents: number;
  allowancesCents: number;
  unpaidLeaveCents: number;
  lateCents: number;
  benefitsCents: number;
  loanCents: number;
  sssCents: number;
  philHealthCents: number;
  pagIbigCents: number;
  withholdingCents: number;
  grossCents: number;
  deductionsCents: number;
  netCents: number;
  warnings: string[];
}

export type PayrollStatus = 'Draft' | 'Calculated' | 'Validated' | 'Approved' | 'Released';

export interface PayrollSnapshot {
  version: number;
  createdAt: string;
  preparedBy: Role;
  rulePack: string;
  lines: PayrollLine[];
  totals: { grossCents: number; deductionsCents: number; netCents: number; employerCents: number };
  blockers: string[];
  warnings: string[];
}

export interface PayrollRun {
  id: string;
  name: string;
  group: PayrollGroup;
  period: string;
  status: PayrollStatus;
  snapshot?: PayrollSnapshot;
  approvedBy?: Role;
  releasedAt?: string;
  signOff: PayrollSignOffItem[];
}

export interface PayrollSignOffItem {
  id: 'sources' | 'variance' | 'exceptions' | 'reconciliation';
  label: string;
  checked: boolean;
  checkedBy?: string;
  checkedAt?: string;
}

export type DocumentComplianceStatus = 'Current' | 'Missing' | 'Expiring' | 'Acknowledgement due';

export interface DocumentComplianceItem {
  id: string;
  employeeId: string;
  category: string;
  documentName: string;
  confidentiality: 'Standard' | 'Restricted';
  dueDate: string;
  version: string;
  status: DocumentComplianceStatus;
  owner: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export type ImportKind = 'Employee master' | 'Attendance events';

export interface ImportRow {
  rowNumber: number;
  values: Record<string, string>;
  valid: boolean;
  errors: string[];
}

export interface ImportBatch {
  id: string;
  kind: ImportKind;
  fileName: string;
  createdAt: string;
  createdBy: string;
  rows: ImportRow[];
  status: 'Previewed' | 'Committed';
  committedAt?: string;
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  area: string;
  detail: string;
}

export interface NotificationItem {
  id: string;
  at: string;
  recipient: string;
  title: string;
  body: string;
  read: boolean;
}

export interface OutboxItem {
  id: string;
  at: string;
  channel: 'Email' | 'Mobile';
  recipient: string;
  subject: string;
  status: 'Simulated delivered' | 'Simulated failed';
}

export interface TemporaryUpload {
  id: string;
  employeeId: string;
  name: string;
  size: number;
  selectedAt: string;
}

export interface DemoState {
  employees: Employee[];
  applicants: Applicant[];
  requisitions: Requisition[];
  organization: OrganizationRecord[];
  requests: WorkflowRequest[];
  attendanceExceptions: AttendanceException[];
  devices: Device[];
  biometricSynced: boolean;
  benefits: BenefitPlan[];
  performanceCycles: PerformanceCycle[];
  payrollRuns: PayrollRun[];
  audit: AuditEvent[];
  notifications: NotificationItem[];
  outbox: OutboxItem[];
  submissionReferences: string[];
  webhookAttempts: number;
  temporaryUploads: TemporaryUpload[];
  webClockedIn: boolean;
  scheduleTemplates: ScheduleTemplate[];
  attendanceEvents: AttendanceEvent[];
  dailyAttendance: DailyAttendance[];
  attendancePeriodClosed: boolean;
  documentCompliance: DocumentComplianceItem[];
  importBatches: ImportBatch[];
}
