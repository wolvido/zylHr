import { jsPDF } from 'jspdf';
import { strToU8, zipSync } from 'fflate';
import { demoClock } from '../data/seed';
import { Employee, PayrollSnapshot } from '../types';
import { money } from '../theme';

const safeStamp = demoClock.now().replaceAll(':', '-');
const demoMeta = [
  ['NOTICE', 'DEMO / NOT FOR SUBMISSION'],
  ['Generated', demoClock.now()],
  ['Rule pack', 'PH-DEMO-SIMPLIFIED-v1'],
];

function downloadBlob(filename: string, blob: Blob) {
  if (typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export function downloadCsv(label: string, rows: (string | number)[][]) {
  const content = [...demoMeta, [], ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
  downloadBlob(`${label}_DEMO_NOT_FOR_SUBMISSION_${safeStamp}.csv`, new Blob([content], { type: 'text/csv;charset=utf-8' }));
}

const xmlEscape = (value: string | number) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

function columnName(index: number) {
  let result = '';
  let current = index + 1;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    current = Math.floor((current - 1) / 26);
  }
  return result;
}

function sheetXml(rows: (string | number)[][]) {
  const body = rows.map((row, rowIndex) => `<row r="${rowIndex + 1}">${row.map((cell, columnIndex) => {
    const ref = `${columnName(columnIndex)}${rowIndex + 1}`;
    return typeof cell === 'number' ? `<c r="${ref}"><v>${Number.isFinite(cell) ? cell : 0}</v></c>` : `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(cell)}</t></is></c>`;
  }).join('')}</row>`).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><sheetData>${body}</sheetData></worksheet>`;
}

export function buildDemoWorkbookBytes(sheets: Record<string, (string | number)[][]>) {
  const entries: { name: string; rows: (string | number)[][] }[] = Object.entries(sheets).map(([name, rows]) => ({
    name: name.slice(0, 31),
    rows: [...demoMeta, [], ...rows],
  }));
  const types = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${entries.map((_, index) => `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`;
  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${entries.map((entry, index) => `<sheet name="${xmlEscape(entry.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`).join('')}</sheets></workbook>`;
  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${entries.map((_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`).join('')}<Relationship Id="rId${entries.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><name val="Arial"/></font></fonts><fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs></styleSheet>`;
  const files: Record<string, Uint8Array> = {
    '[Content_Types].xml': strToU8(types),
    '_rels/.rels': strToU8(rootRels),
    'xl/workbook.xml': strToU8(workbook),
    'xl/_rels/workbook.xml.rels': strToU8(workbookRels),
    'xl/styles.xml': strToU8(styles),
  };
  entries.forEach((entry, index) => { files[`xl/worksheets/sheet${index + 1}.xml`] = strToU8(sheetXml(entry.rows)); });
  return zipSync(files, { level: 6 });
}

function writeWorkbook(label: string, sheets: Record<string, (string | number)[][]>) {
  const archive = buildDemoWorkbookBytes(sheets);
  const buffer = archive.buffer.slice(archive.byteOffset, archive.byteOffset + archive.byteLength) as ArrayBuffer;
  downloadBlob(`${label}_DEMO_NOT_FOR_SUBMISSION_${safeStamp}.xlsx`, new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
}

export function downloadPayrollRegister(snapshot: PayrollSnapshot, employees: Employee[]) {
  const rows: (string | number)[][] = [['Employee', 'Employee ID', 'Gross', 'Deductions', 'Net', 'Warnings']];
  snapshot.lines.forEach((line) => {
    const employee = employees.find((item) => item.id === line.employeeId);
    rows.push([`${employee?.firstName ?? ''} ${employee?.lastName ?? ''}`, line.employeeId, line.grossCents / 100, line.deductionsCents / 100, line.netCents / 100, line.warnings.join('; ')]);
  });
  rows.push(['CONTROL TOTAL', '', snapshot.totals.grossCents / 100, snapshot.totals.deductionsCents / 100, snapshot.totals.netCents / 100, '']);
  writeWorkbook('PAYROLL_REGISTER', { Register: rows });
}

export function downloadBankFile(snapshot: PayrollSnapshot, employees: Employee[]) {
  const rows: (string | number)[][] = [['Employee ID', 'Fictional Account', 'Net Amount', 'Payment Reference']];
  snapshot.lines.forEach((line) => {
    const employee = employees.find((item) => item.id === line.employeeId);
    rows.push([line.employeeId, employee?.bankAccount ?? 'DEMO-MISSING', line.netCents / 100, `DEMO-PAY-${line.employeeId}`]);
  });
  rows.push(['CONTROL TOTAL', '', snapshot.totals.netCents / 100, 'DEMO ONLY']);
  downloadCsv('BANK_PAYROLL', rows);
}

export function downloadAccountingJournal(snapshot: PayrollSnapshot) {
  const gross = snapshot.totals.grossCents / 100;
  const deductions = snapshot.totals.deductionsCents / 100;
  const net = snapshot.totals.netCents / 100;
  writeWorkbook('ACCOUNTING_JOURNAL', {
    Journal: [
      ['Account', 'Cost Center', 'Debit', 'Credit'],
      ['Salary expense', 'DEMO-CORP', gross, 0],
      ['Payroll deductions payable', 'DEMO-CORP', 0, deductions],
      ['Payroll cash clearing', 'DEMO-CORP', 0, net],
      ['CONTROL TOTAL', '', gross, gross],
    ],
  });
}

export function downloadGovernmentSummary(snapshot: PayrollSnapshot, kind: 'BIR' | 'SSS' | 'PhilHealth' | 'Pag-IBIG') {
  const field = kind === 'BIR' ? 'withholdingCents' : kind === 'SSS' ? 'sssCents' : kind === 'PhilHealth' ? 'philHealthCents' : 'pagIbigCents';
  const total = snapshot.lines.reduce((sum, line) => sum + line[field], 0);
  writeWorkbook(`${kind.toUpperCase()}_SUMMARY`, {
    Summary: [['Agency', 'Employee count', 'Employee total'], [kind, snapshot.lines.length, total / 100], ['CONTROL TOTAL', '', total / 100]],
  });
}

export function downloadPayslip(snapshot: PayrollSnapshot, employee: Employee) {
  const line = snapshot.lines.find((item) => item.employeeId === employee.id);
  if (!line) return false;
  const pdf = new jsPDF();
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 210, 34, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.text('ZylHR Demo Payslip', 16, 17);
  pdf.setFontSize(10);
  pdf.text('DEMO / NOT FOR SUBMISSION', 16, 26);
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(12);
  pdf.text(`${employee.firstName} ${employee.lastName} · ${employee.id}`, 16, 48);
  pdf.text(`Period snapshot: ${snapshot.createdAt}`, 16, 57);
  pdf.text(`Rule pack: ${snapshot.rulePack}`, 16, 66);
  const items = [
    ['Basic pay', line.basicCents], ['Overtime', line.overtimeCents], ['Allowances', line.allowancesCents], ['Unpaid leave', -line.unpaidLeaveCents],
    ['Late / undertime', -line.lateCents], ['SSS', -line.sssCents], ['PhilHealth', -line.philHealthCents], ['Pag-IBIG', -line.pagIbigCents],
    ['Withholding', -line.withholdingCents], ['Benefits', -line.benefitsCents], ['Loan', -line.loanCents],
  ] as const;
  let y = 82;
  items.forEach(([label, cents]) => { pdf.text(label, 18, y); pdf.text(money(cents), 146, y, { align: 'right' }); y += 9; });
  pdf.setDrawColor(203, 213, 225); pdf.line(16, y, 194, y); y += 12;
  pdf.setFontSize(15); pdf.text('Net pay', 18, y); pdf.text(money(line.netCents), 146, y, { align: 'right' });
  pdf.setFontSize(9); pdf.setTextColor(100, 116, 139); pdf.text(`Generated ${demoClock.now()} · Fictional data · Not a production payroll record`, 16, 282);
  pdf.save(`PAYSLIP_${employee.id}_DEMO_NOT_FOR_SUBMISSION.pdf`);
  return true;
}
