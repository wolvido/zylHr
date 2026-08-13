import { BenefitPlan, Employee, PayrollLine, PayrollSnapshot, Role, WorkflowRequest } from '../types';
import { demoClock } from '../data/seed';

export const RULE_PACK = {
  id: 'PH-DEMO-SIMPLIFIED-v1',
  referenceDate: '2026-01-01',
  monthlyDivisor: 22,
  hourlyDivisor: 8,
  rounding: 'Nearest cent per line',
  disclaimer: 'Illustrative rules for a fictional demonstration. Not certified for production payroll.',
};

export const GOLDEN_CASES = [
  { id: 'MONTHLY-ORDINARY', label: 'Ordinary monthly pay', input: '₱44,000 monthly · semi-monthly', expected: '₱22,000 basic before allowances and deductions' },
  { id: 'DAILY-HOURLY', label: 'Daily / hourly pay', input: 'Explicit daily/hourly rate × demo workdays', expected: 'Deterministic period basic pay' },
  { id: 'UNPAID-LEAVE', label: 'Approved unpaid leave', input: '1 approved day', expected: 'One daily-rate deduction with source trace' },
  { id: 'LATE-UNDERTIME', label: 'Late / undertime', input: '30 interpreted minutes', expected: 'Half-hour equivalent deduction' },
  { id: 'OVERTIME-NIGHT', label: 'Overtime / night work', input: 'Approved hours × 1.25 demo multiplier', expected: 'Separate overtime earning line' },
  { id: 'MIDPERIOD-HIRE', label: 'Mid-period hire proration', input: 'Seeded recent hire scenario', expected: 'Explicit simplified proration disclosure' },
  { id: 'BENEFIT-LOAN', label: 'Benefits / loan', input: 'Snapshot enrollment and simple loan fixture', expected: 'Separate deduction lines' },
  { id: 'STATUTORY-TAX', label: 'Contributions / withholding', input: 'Representative frozen brackets', expected: 'SSS, PhilHealth, Pag-IBIG, withholding lines' },
  { id: 'VALIDATION-BLOCKER', label: 'Validation blocker', input: 'Pending fictional bank detail', expected: 'Validation blocked until resolved' },
] as const;

const round = (value: number) => Math.round(value);

function periodBasic(employee: Employee) {
  if (employee.payBasis === 'Monthly') return round(employee.salaryCents / (employee.payrollGroup === 'Semi-monthly' ? 2 : 1));
  if (employee.payBasis === 'Daily') return employee.salaryCents * (employee.payrollGroup === 'Weekly' ? 5 : employee.payrollGroup === 'Semi-monthly' ? 11 : 22);
  return employee.salaryCents * 8 * (employee.payrollGroup === 'Weekly' ? 5 : employee.payrollGroup === 'Semi-monthly' ? 11 : 22);
}

function withholding(taxableCents: number) {
  if (taxableCents <= 2083300) return 0;
  if (taxableCents <= 3333300) return round((taxableCents - 2083300) * 0.15);
  if (taxableCents <= 6666700) return 187500 + round((taxableCents - 3333300) * 0.2);
  return 854180 + round((taxableCents - 6666700) * 0.25);
}

export function calculatePayroll(
  employees: Employee[],
  requests: WorkflowRequest[],
  benefits: BenefitPlan[],
  preparedBy: Role,
  version: number,
): PayrollSnapshot {
  const active = employees.filter((employee) => employee.status === 'Active' && employee.payrollGroup === 'Semi-monthly');
  const lines: PayrollLine[] = active.map((employee, index) => {
    const basicCents = periodBasic(employee);
    const approved = requests.filter((request) => request.employeeId === employee.id && request.status === 'Approved');
    const unpaidUnits = approved.filter((request) => request.type === 'Unpaid Leave').reduce((sum, request) => sum + request.units, 0);
    const overtimeHours = approved.filter((request) => request.type === 'Overtime').reduce((sum, request) => sum + request.units, 0);
    const dailyRate = employee.payBasis === 'Monthly' ? employee.salaryCents / RULE_PACK.monthlyDivisor : employee.payBasis === 'Daily' ? employee.salaryCents : employee.salaryCents * 8;
    const hourlyRate = dailyRate / RULE_PACK.hourlyDivisor;
    const unpaidLeaveCents = round(dailyRate * unpaidUnits);
    const lateCents = index % 29 === 0 ? round(hourlyRate * 0.5) : 0;
    const overtimeCents = round(hourlyRate * overtimeHours * 1.25);
    const allowancesCents = index % 4 === 0 ? 150000 : 75000;
    const benefitsCents = employee.benefitPlanIds.reduce((total, id) => total + (benefits.find((plan) => plan.id === id)?.employeeCents ?? 0), 0);
    const grossCents = Math.max(0, basicCents + overtimeCents + allowancesCents - unpaidLeaveCents - lateCents);
    const sssCents = Math.min(135000, round(grossCents * 0.045));
    const philHealthCents = Math.min(250000, round(grossCents * 0.025));
    const pagIbigCents = Math.min(20000, round(grossCents * 0.02));
    const withholdingCents = withholding(Math.max(0, grossCents - sssCents - philHealthCents - pagIbigCents));
    const loanCents = employee.loanDeductionCents;
    const deductionsCents = sssCents + philHealthCents + pagIbigCents + withholdingCents + benefitsCents + loanCents;
    const netCents = grossCents - deductionsCents;
    const warnings: string[] = [];
    if (employee.bankAccount.includes('PENDING')) warnings.push('Missing bank account validation');
    if (netCents < 0) warnings.push('Negative net pay');
    if (unpaidUnits > 0) warnings.push('Approved unpaid leave applied');
    return { employeeId: employee.id, basicCents, overtimeCents, allowancesCents, unpaidLeaveCents, lateCents, benefitsCents, loanCents, sssCents, philHealthCents, pagIbigCents, withholdingCents, grossCents, deductionsCents, netCents, warnings };
  });
  const totals = lines.reduce(
    (sum, line) => ({ grossCents: sum.grossCents + line.grossCents, deductionsCents: sum.deductionsCents + line.deductionsCents, netCents: sum.netCents + line.netCents, employerCents: sum.employerCents + round(line.sssCents * 1.8 + line.philHealthCents) }),
    { grossCents: 0, deductionsCents: 0, netCents: 0, employerCents: 0 },
  );
  return {
    version,
    createdAt: demoClock.now(),
    preparedBy,
    rulePack: RULE_PACK.id,
    lines,
    totals,
    blockers: lines.filter((line) => line.warnings.includes('Missing bank account validation')).map((line) => `${line.employeeId} has missing bank details`),
    warnings: lines.flatMap((line) => line.warnings.map((warning) => `${line.employeeId}: ${warning}`)),
  };
}
