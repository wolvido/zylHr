# ZylHR Demo UAT Walkthrough

This is a final client-facing visual confirmation. The automated domain acceptance suite is available through `npm run acceptance`.

## Start

1. Use Node.js 22.13 or newer.
2. Run `npm install`.
3. Run `npm run web`.
4. Use the shared password `zylhr-demo` for every seeded account.

Reloading the browser restores the deterministic seed. Signing out and changing accounts without reloading preserves walkthrough changes.

## Scene 1 — Organization and employee record

1. Sign in as `admin@demo.zylhr`.
2. Open Organization, switch between List and Hierarchy, and create a department and position.
3. Switch to Historical as-of, compare `2024-12-31` with the current date, and confirm Mika Santos reconstructs under Administration without changing her current Human Resources assignment.
4. Verify deletion of a referenced organization record is blocked with an explanation.
5. Open Imports, load the employee fixture, confirm two valid and two invalid rows, download the error report, and commit the valid rows.
6. Sign out without reloading and sign in as `hr@demo.zylhr`.
7. Open People, search/filter/sort, open an employee, change their assignment, and record an effective-dated HR action.
8. Confirm organization counts and employment history update.

## Scene 1B — Search, operations, and document compliance

1. From HR, use Search ZylHR or Ctrl/Cmd+K to find an employee, request, applicant, organization record, and work item.
2. Open Operations and confirm each item shows priority, owner, due date, age, status, and a working next action.
3. Open Documents, send a reminder for an open requirement, and confirm a notification and Demo Outbox entry are created.
4. Open document History, export the authorized employee-file manifest, and confirm the CSV is demo-labeled.
5. Resolve a missing or expiring requirement and confirm it disappears from the open Operations queue.
6. Sign in as `employee@demo.zylhr`, open Documents, acknowledge the 2026 Employee Handbook, and confirm only that employee's records are visible.

## Scene 2 — Recruitment to employee 251

1. Sign in as `recruiter@demo.zylhr`.
2. Create a requisition and applicant.
3. Open the applicant card, record interview feedback, advance stages, and accept an offer.
4. Convert the seeded accepted applicant to `EMP-2026-251`.
5. Sign in as HR, find the draft, review setup, and activate it.
6. Confirm active headcount increases.

## Scene 3 — Attendance and correction

1. Sign in as `timeadmin@demo.zylhr`.
2. Open Imports, load the attendance fixture, confirm two valid and two invalid rows, and commit the valid rows.
3. Open Time & Attendance → Schedules & period and run Sync Demo Events.
4. Confirm 18 accepted, 1 duplicate, 2 rejected, and 1 unmatched event.
5. Re-run the batch and confirm accepted remains zero.
6. Inspect Raw events and Daily attendance.
7. Resolve exceptions and close the attendance period.

## Scene 4 — Request through payroll

1. Sign in as `employee@demo.zylhr` and submit unpaid leave on an unused date.
2. Sign in as `manager@demo.zylhr` and approve it to HR.
3. Sign in as `hr@demo.zylhr` and give final approval.
4. Sign in as `payroll@demo.zylhr`, calculate payroll and resolve the seeded bank blocker.
5. Review current-versus-prior variance, employee drivers, and all four reconciliation controls.
6. Complete all four processor sign-off items and validate the run.
7. Open an employee trace and confirm approved unpaid leave appears as a source line.
8. Sign in as `payrollapprover@demo.zylhr`, verify the frozen checklist, approve, then release.
9. Sign in as Employee and download the released demo payslip PDF.

## Scene 5 — Outputs, reports, and audit

1. Sign in as `finance@demo.zylhr` and download bank CSV and accounting XLSX.
2. Open Integrations and simulate a government submission. Confirm the reference is explicitly fictional.
3. Sign in as Payroll Processor and download statutory demonstration XLSX files.
4. Use Reports filters, drill into a report, and download its labeled CSV.
5. Sign in as Administrator, open Administration, and inspect the audit trail and Demo Outbox.

## Responsive confirmation

At desktop, tablet, and mobile-browser widths verify:

- Sidebar becomes a menu overlay below 860 px.
- Cards wrap without horizontal page overflow.
- Dense tables retain their own horizontal scrolling.
- Dialogs remain reachable and scroll internally.
- Employee web clock and request forms remain usable at mobile width.

## Expected labeling

- Every authenticated page shows the demo/fictitious-data/reset notice.
- Payroll and financial pages show the stronger not-for-payment/submission warning.
- PDF, CSV, and XLSX filenames/content contain `DEMO` and `NOT FOR SUBMISSION`.
- Mock connectors never describe themselves as live.
