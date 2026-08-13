# ZylHR Demo MVP Specification

| Field | Value |
|---|---|
| Product | ZylHR |
| Document type | Client-facing Demo MVP Specification |
| Version | 0.1 |
| Status | Draft for approval |
| Primary audience | Potential Philippine business clients |
| Client surface | Responsive web application only; entirely client-side at runtime |
| Execution model | Self-contained browser application with no backend API or remote data service |
| Data model | Client-side in-memory store with deterministic seeded data |
| Seed size | Approximately 250 employees |
| Data lifetime | Resets whenever the browser page reloads or the application is reopened |
| Last updated | 2026-08-13 |

> **Demo notice:** ZylHR Demo is a functional product demonstration, not a production HRIS or certified payroll system. All people, organizations, identifiers, bank accounts, documents, and payroll values are fictional. Generated files must be labeled **DEMO / NOT FOR SUBMISSION**.

---

## 1. Purpose

ZylHR Demo must let a potential business client experience the important HRIS workflows from beginning to end without requiring production infrastructure, external service accounts, hardware, or persistent storage.

It is not a static prototype. Users must be able to create and edit records, submit requests, approve work, calculate payroll, generate payslips, and download reports during the current browser runtime. The application resets to its original seeded state whenever the page reloads or the application is reopened.

### 1.1 What the demo must prove

The demo must show that ZylHR can provide one connected flow across:

1. Organization setup
2. Recruitment and hiring
3. Employee management
4. Scheduling and attendance
5. Leave, overtime, and approvals
6. Benefits and performance
7. Reports and dashboards
8. Payroll and payslips

The strongest proof is that changes in an earlier module visibly affect later modules. For example, hiring an applicant creates an employee, approved unpaid leave affects attendance, and attendance affects the payroll preview.

### 1.2 Demo definition of “fully functional”

Within the demo scope, a feature is fully functional when:

- Forms validate and save data to the client-side in-memory store.
- Lists, details, filters, searches, and dashboards use the current browser runtime's data.
- Workflow state changes are enforced rather than visually faked.
- Role permissions affect what each seeded account can see and do.
- Approved upstream changes flow into downstream calculations.
- Generated reports and files contain the current browser runtime's data or the applicable frozen payroll snapshot.
- Expected errors and exceptions can be demonstrated.

It does **not** mean production-grade scale, security certification, complete legal coverage, hardware integration, persistent data, or every possible HR/payroll edge case.

### 1.3 Relationship to the master product specification

This document is a demo-specific scope derived from the ZylHR Master Product Specification. It does not replace or reduce the production roadmap. When a production requirement is simplified, mocked, or omitted here, the master specification remains the target for the sellable system.

---

## 2. Confirmed demo decisions

| Area | Decision |
|---|---|
| Audience | Potential business clients |
| Included workflows | Organization, employees, attendance, leave, approvals, payroll, payslips, recruitment, hiring, benefits, performance, reports, and dashboards |
| Payroll fidelity | Realistic simplified Philippine calculations |
| User interface | Responsive web only |
| Authentication | Separate seeded login accounts for different roles |
| Employee data volume | Approximately 250 employees |
| Persistence | Client-side memory only; reset on page reload or application reopen |
| Runtime services | No backend API, application server, remote database, or network account is required |
| Demo isolation | Every browser tab or application instance receives its own independent seeded dataset |
| Biometric integration | Mocked |
| Notifications | Email and mobile delivery mocked; in-app behavior functional |
| Government submission | Mocked |
| Public API and webhooks | Mocked |
| Bank outputs | Actual downloadable demo files; no bank transmission |
| Accounting outputs | Actual downloadable demo files; no accounting-system transmission |
| Government outputs | Actual downloadable demo files; no government submission |

---

## 3. Demo product boundaries

### 3.1 Functional in the demo

- Seeded account login and role-based navigation
- Organization and employee CRUD
- Applicant pipeline and applicant-to-employee conversion
- Employee profiles, contracts, documents, compensation, benefits, and employment history
- Fixed, flexible, rotating, overnight, and split-shift examples
- Attendance event viewing and manual/demo event creation
- Simulated biometric synchronization
- Attendance exception handling and correction requests
- Leave and overtime submission
- Manager approval followed by HR approval
- Performance-review workflows
- Simplified Philippine payroll calculation
- Payroll validation, approval, release, payslip publishing, and runtime-local history
- Dashboards and standard reports
- Browser-generated downloads in the required formats defined in section 3.3
- Sample bank, accounting, and government output downloads
- In-app notifications and simulated external-delivery status
- Runtime-local audit trail for important actions
- Role-scoped global search across people, recruitment, organization, requests, payroll, and tasks
- A prioritized Operations Command Center with deep links to the responsible module
- Browser-local CSV import preview, row validation, reconciliation, and commit for employee and attendance fixtures
- A document-compliance center for missing, expiring, current, and acknowledgement-due records
- Payroll period variance analysis, reconciliation evidence, and processor sign-off checklist
- Historical as-of views for employee assignments and organization headcount

### 3.2 Mocked, but visible and interactive

| Capability | Demo behavior |
|---|---|
| Biometric synchronization | A demo device page shows seeded devices. “Sync Demo Events” inserts prepared punch events and displays accepted, duplicate, and rejected counts. No hardware connection occurs. |
| Email notifications | Events create entries in a Demo Outbox with recipient, subject, status, and preview. No email is sent. |
| Mobile notifications | Events appear in the notification log as simulated push messages. There is no mobile app or push provider. |
| Government submission | Users generate a labeled sample output, then may click “Simulate Submission” to receive a fictional reference number. No portal is contacted. |
| Public API | An Integration Playground shows sample requests and responses from a local in-process mock adapter. It makes no HTTP request and is not a supported external API. |
| Webhooks | A local Webhook Simulator records sample deliveries, retries, and payload previews without making outbound network calls. |

### 3.3 Generated for real, but safe for demonstration

The following formats are required so acceptance does not depend on whichever export library is selected. Additional formats are optional.

| Artifact | Required demo format |
|---|---|
| Payslip | PDF |
| Payroll register | XLSX |
| Bank payroll sample | CSV |
| Accounting journal | XLSX |
| BIR, SSS, PhilHealth, and Pag-IBIG demonstration summaries | XLSX |
| Common HR, attendance, leave, benefit, performance, and audit report exports | CSV |

Every financial or government-facing output must:

- Use fictional identifiers and accounts.
- Display `DEMO` and `NOT FOR SUBMISSION` in the filename and/or content.
- Contain a generated timestamp and demo rule-pack label.
- Never include a real bank endpoint, government credentials, or production submission action.

### 3.4 Omitted from the demo

- Persistent relational database and production migrations
- Multi-client hosting and per-client deployments
- Actual cloud/on-premise installation automation
- Backups, disaster recovery, high availability, and failover
- Real biometric hardware drivers or device network access
- Real email, SMS, or mobile push delivery
- Real bank transfer or bank API connection
- Real government portal submission
- Real accounting-system connection
- Externally callable public API and outbound webhooks
- Mobile and kiosk applications
- Production SSO, MFA, password reset, session hardening, and identity lifecycle
- Production encryption/key management and formal security certification
- Complete payroll compliance certification
- Full year-end tax adjustment, prior-employer reconciliation, final pay, retroactive multi-period recalculation, and every statutory edge case
- Arbitrary client-configurable payroll formula engine
- Arbitrary client-configurable approval-workflow builder
- Massive file storage, malware scanning, legal hold, and retention automation
- Production analytics, telemetry, support tooling, and service-level guarantees
- Load certification for 500+ concurrent users or 10,000-employee payroll

---

## 4. Demo company and seeded dataset

### 4.1 Fictional company

The seed represents **ZylWorks Group**, a fictional Philippine enterprise. It is deliberately industry-neutral enough to demonstrate office, field, operations, and shift-based employees.

Suggested organization structure:

- **Organization group:** ZylWorks Group
- **Legal entities:**
  - ZylWorks Services, Inc.
  - ZylWorks Operations, Inc.
- **Branches/sites:**
  - Metro Manila Headquarters
  - Cebu Operations Center
  - Davao Operations Center
- **Departments:** Executive, Human Resources, Finance, Information Technology, Sales, Customer Operations, Field Operations, and Administration
- **Positions:** Approximately 30–40 positions across staff, specialist, supervisor, manager, and executive levels

### 4.2 Employee seed

Seed approximately 250 employee records:

| Category | Suggested count |
|---|---:|
| Active payroll employees | 246 |
| Separated historical employees | 4 |
| Weekly payroll group | 30 active employees |
| Semi-monthly payroll group | 190 active employees |
| Monthly payroll group | 26 active employees |

The employee set must include representative examples of:

- Regular employees
- Probationary employees
- Contractual/project-based employees
- Part-time employees
- Monthly, daily, and hourly pay bases
- Managers with direct reports
- Employees from every branch and legal entity
- Employees with different benefits, schedules, leave balances, deductions, and payroll results
- At least one newly hired employee, one pending regularization, one future contract expiration, and one separated employee

### 4.3 Other seeded records

| Dataset | Suggested seed |
|---|---:|
| Open job requisitions | 5 |
| Applicants | 25 |
| Applicants ready for interview | 4 |
| Applicant with accepted offer | 1 |
| Schedule templates | 5 or more |
| Biometric/demo devices | 3 |
| Attendance period | Current and previous period |
| Attendance exceptions | 20–30 varied cases |
| Leave requests | 12–20 across workflow states |
| Overtime/correction requests | 10–15 across workflow states |
| Benefit plans | 4–6 |
| Active performance cycle | 1 |
| Completed performance cycle | 1 |
| Payroll runs | Previous released run and current draft run |
| Notifications/outbox items | 20+ |
| Audit events | 50+ |

### 4.4 Seed quality requirements

- All data is fictional and safe to display publicly.
- Names must look realistic but must not be copied from real employees.
- Government identifiers, phone numbers, email addresses, and bank accounts use reserved or clearly fictional formats.
- Seed relationships must be internally consistent.
- The same seed version must produce the same baseline records and calculation results.
- Seed dates should be derived from an injectable `DemoClock` so records always appear current without making calculations nondeterministic.
- The application must show its seed version and demo date in an About or Demo Information page.

---

## 5. Seeded accounts and permissions

Use separate seeded credentials. Do not provide an instant role-switch control inside an authenticated session. Signing out and signing in as another persona must retain the current in-memory walkthrough state; reloading the page resets it.

| Persona | Example account | Demonstrates |
|---|---|---|
| System Administrator | `admin@demo.zylhr` | Organization, configuration, accounts, audit, and integrations |
| HR Administrator | `hr@demo.zylhr` | Employees, contracts, benefits, HR approvals, and reports |
| Recruiter | `recruiter@demo.zylhr` | Requisitions, candidates, interviews, offers, and hiring |
| Time Administrator | `timeadmin@demo.zylhr` | Schedules, biometric simulation, attendance, and exceptions |
| Line Manager | `manager@demo.zylhr` | Team dashboard and first-stage approvals |
| Payroll Processor | `payroll@demo.zylhr` | Payroll calculation, validation, and exports |
| Payroll Approver | `payrollapprover@demo.zylhr` | Payroll sign-off and release |
| Finance User | `finance@demo.zylhr` | Payroll totals, bank files, and accounting exports |
| Employee | `employee@demo.zylhr` | Self-service, attendance, requests, performance tasks, and payslips |

Implementation notes:

- Use a clearly labeled shared demo password or a demo-account selector on the landing page. Because the application is entirely client-side, these credentials demonstrate role workflows but are not a security boundary and must never be presented as production authentication.
- Seeded credentials and baseline state are recreated whenever the page reloads or the application is reopened.
- Each account must have a concise “What you can demonstrate” card after login.
- Unauthorized pages must be hidden from navigation and rejected again by route, action, and data-access guards in the application service/store layer. These client-side guards demonstrate intended product authorization behavior but cannot protect bundled demo data from browser developer tools.
- A Logout action returns users to the account-selection/login page.

### 5.1 Demo permission matrix

All records are fictional, but the demo must still model least-privilege behavior. The scope below applies to screens, actions, selectors, reports, and generated files—not only navigation visibility.

| Persona | Record scope | Allowed actions | Sensitive-data visibility | Export permissions | Explicit limitations |
|---|---|---|---|---|---|
| System Administrator | Entire demo organization for configuration purposes | Manage organization reference data, seeded accounts, demo settings, audit viewer, and integration simulators | General employee directory only; compensation, payroll, bank, government ID, benefit, and performance details hidden by default | Configuration and audit demonstrations | Cannot process or approve payroll, approve employee requests, or view unrestricted payroll details |
| HR Administrator | All applicants and employees across both legal entities | Manage employees, contracts, documents, compensation, benefits, employment actions, HR-stage approvals, and HR reports | Full compensation and employment details; government and bank identifiers masked unless a demonstrated HR action requires them | Authorized HR, people, benefit, leave, and audit reports | Cannot give final payroll approval or download bank-payment files |
| Recruiter | All requisitions and applicants; converted employee drafts until HR activation | Manage requisitions, applicants, interviews, offers, and applicant-to-employee conversion | Applicant details and offer compensation; no active-employee payroll, bank, government ID, benefit, or performance data | Recruitment reports only | Cannot activate employees, perform HR approval, or access payroll |
| Time Administrator | All employees' schedules, time events, attendance results, and exceptions | Manage schedules, run biometric simulation, resolve time exceptions, and close the demo attendance period | Basic identity and work assignment; compensation, payroll, bank, government ID, benefit, and performance data hidden | Scheduling, attendance, and exception reports | Cannot approve own requests or modify compensation/payroll results |
| Line Manager | Direct reports only | View team data, perform first-stage request approvals, and complete manager performance tasks | Basic profile, schedule, attendance, requests, and performance for direct reports; compensation, payslip, bank, and government ID data hidden | Direct-report operational reports only | Cannot view employees outside the team, perform final HR approval, or approve own requests |
| Payroll Processor | Employees in all seeded payroll groups | Calculate, validate, correct supported payroll issues, recalculate, and generate payroll/statutory reports | Full payroll inputs and results; bank accounts and government identifiers masked on screen except validation status | Payroll register and labeled statutory demonstration reports | Cannot give final approval, release payroll, or download the finance bank-payment file |
| Payroll Approver | All seeded payroll groups and their calculation evidence | Review, approve, and release a validated payroll run | Full gross-to-net results and source evidence; bank and government identifiers masked | Payroll sign-off evidence and released payroll register | Cannot edit source HR/time data or approve a run that was prepared under the same persona |
| Finance User | Released payroll totals and payment/accounting outputs | Review reconciliation totals and generate bank/accounting demonstration files | Payment totals and masked employee payment details on screen; full fictional account values may appear only in explicitly labeled downloaded demo files | Bank payroll and accounting journal demonstration files | Cannot edit employee, attendance, benefit, performance, or payroll calculations |
| Employee | Self only | View own profile, time, requests, performance tasks, benefits, and released payslips; submit permitted requests and changes | Own data, with bank and government identifiers masked except where an edit form explicitly requires entry | Own released payslip and personal reports only | Cannot access another employee or approve any request |

---

## 6. Information architecture

### 6.1 Primary navigation

Navigation is role-dependent and uses the following page groups:

1. Dashboard
2. Organization
3. Recruitment
4. People
5. Time & Attendance
6. Leave & Overtime
7. Benefits
8. Performance
9. Approvals
10. Payroll
11. Reports
12. Integrations
13. Administration
14. Operations
15. Imports
16. Document Compliance

Global search is available from the authenticated application shell and is not a separate navigation destination.

### 6.2 Demo context banner

Every authenticated page must show a small, non-obstructive demo indicator:

- `Demo environment`
- `Fictional data`
- `Changes reset when this page reloads or the demo is reopened`

Financial and government output pages must show the stronger warning: `Demo output — not for payment or submission`.

---

## 7. Functional requirements

### 7.1 Authentication and demo foundation

| ID | Requirement |
|---|---|
| DEMO-FND-001 | Allow login using the separate seeded persona accounts. |
| DEMO-FND-002 | Enforce role-based page, action, and data visibility for the seeded roles through navigation, route, action, and data-access guards in the client application. |
| DEMO-FND-003 | Record runtime-local audit events for create, edit, submit, approve, reject, payroll, export, and simulated integration actions. |
| DEMO-FND-004 | Provide in-app notifications and a Demo Outbox for simulated email/mobile delivery. |
| DEMO-FND-005 | Provide responsive layouts for common desktop, tablet, and mobile-browser widths without creating a native mobile app. |
| DEMO-FND-006 | Display clear empty, loading, validation, success, error, and unauthorized states. |
| DEMO-FND-007 | Seed a new client-side in-memory store on initial application load and discard all changes when the page reloads or the application is reopened. Logout and persona changes within the same runtime must retain the current walkthrough state. |
| DEMO-FND-008 | Run all domain behavior without a backend API, application server, remote database, cloud account, or runtime network dependency. Static application assets may be served locally. |
| DEMO-FND-009 | Generate reports, payslips, and other downloads in the browser from the current in-memory domain state. |
| DEMO-FND-010 | Provide global search across authorized employees, applicants, requisitions, organization records, requests, payroll runs, and work items. Search results must respect the seeded persona's page and record scope and deep-link to the relevant module. |
| DEMO-FND-011 | Provide a role-scoped Operations Command Center that combines approvals, attendance exceptions, employee-data changes, document compliance, recruitment tasks, performance deadlines, payroll blockers, and integration failures. Each item shows priority, owner, due date, age, status, and next action. |
| DEMO-FND-012 | Provide browser-local employee-master and attendance-event CSV import demonstrations with validation preview, row-level errors, reconciliation totals, commit confirmation, audit history, and an error-report download. No selected file is transmitted or retained after reload. |

### 7.2 Organization

| ID | Requirement |
|---|---|
| DEMO-ORG-001 | Display group, legal entities, branches, departments, positions, cost centers, and reporting lines. |
| DEMO-ORG-002 | Allow authorized users to create, edit, activate, and deactivate organization records during the current runtime. |
| DEMO-ORG-003 | Prevent deletion of organization records referenced by employees; display a useful explanation. |
| DEMO-ORG-004 | Provide list and hierarchy/organization-chart views. |
| DEMO-ORG-005 | Show employee counts by entity, branch, department, and position using live session data. |
| DEMO-ORG-006 | Provide an as-of date mode that reconstructs seeded employee assignment, position, compensation, payroll group, status, and organization headcount from effective-dated history without changing the current record. |
| DEMO-ORG-007 | Provide a current-versus-as-of comparison for employees with seeded transfers, promotions, regularizations, compensation changes, or separations. |

**Demo acceptance:** An administrator can create a department and position, assign an employee, and see dashboard counts update.

### 7.3 Recruitment and hiring

| ID | Requirement |
|---|---|
| DEMO-ATS-001 | List and create job requisitions linked to organization records. |
| DEMO-ATS-002 | Show applicant cards or rows organized by pipeline stage. |
| DEMO-ATS-003 | Allow users to add an applicant, update applicant details, move stages, record an interview, and enter feedback. |
| DEMO-ATS-004 | Allow an offer to be prepared, marked accepted, and converted into an employee draft. |
| DEMO-ATS-005 | Require HR to review organization assignment, employment type, compensation, schedule, and payroll group before activation. |
| DEMO-ATS-006 | Update recruitment and headcount dashboards after a hire. |

**Demo acceptance:** The seeded accepted applicant can be converted into an employee using the next deterministic employee number (`251` for seed version 0.1), activated, found in People, and included in relevant reports during the runtime.

### 7.4 Employees, contracts, and documents

| ID | Requirement |
|---|---|
| DEMO-EMP-001 | List approximately 250 employees with search, filters, sorting, pagination/virtualization, and status badges. |
| DEMO-EMP-002 | Display profile, employment, organization, compensation, schedule, benefits, documents, attendance, leave, performance, and payroll tabs as authorized. |
| DEMO-EMP-003 | Allow HR to create and edit an employee and assign entity, branch, department, position, manager, employment type, pay basis, schedule, and payroll group. |
| DEMO-EMP-004 | Support regular, probationary, contractual/project-based, and part-time examples. |
| DEMO-EMP-005 | Allow runtime-local promotion, transfer, compensation change, regularization, and separation actions with effective date and reason. |
| DEMO-EMP-006 | Allow employees to propose personal-information changes for HR review. |
| DEMO-DOC-001 | Show seeded contract and document records with sample previews. |
| DEMO-DOC-002 | Allow a browser-local temporary file selection or simulated upload metadata during the runtime. Selected file objects must never be transmitted and are discarded on page reload. |
| DEMO-DOC-003 | Show missing and expiring document indicators. |
| DEMO-DOC-004 | Provide a document-compliance center with required category, owner, confidentiality, due/expiry date, version, status, and next action. |
| DEMO-DOC-005 | Allow HR to send a simulated reminder and resolve missing or expiring seeded requirements. Allow the seeded employee to acknowledge only their own acknowledgement-due policy. |
| DEMO-DOC-006 | Update the work queue, employee compliance summary, notification log, Demo Outbox, and audit trail after a document action. |
| DEMO-DOC-007 | Display demo version history and allow an authorized employee-file manifest CSV export for the current role scope. The history and manifest contain metadata only and do not imply production storage, legal signature, retention, or malware scanning. |

**Demo acceptance:** HR can edit an employee's department or salary, and dependent screens reflect the approved session value without changing unrelated history.

### 7.5 Scheduling and attendance

| ID | Requirement |
|---|---|
| DEMO-TIM-001 | Display fixed, flexible, rotating, overnight, and split-shift templates with paid/unpaid break examples. |
| DEMO-TIM-002 | Allow schedule assignment and a calendar/team schedule view. |
| DEMO-TIM-003 | Show raw attendance events separately from interpreted daily attendance. |
| DEMO-TIM-004 | Calculate common attendance outcomes: present, late, undertime, absent, missing punch, overtime candidate, rest-day work, holiday work, and overnight work. |
| DEMO-TIM-005 | Allow employee clock-in/out from the responsive web self-service view when enabled for the seeded employee. |
| DEMO-TIM-006 | Provide a biometric-device screen with three fictional devices and a functional “Sync Demo Events” simulation. |
| DEMO-TIM-007 | The simulated sync must create prepared events and report accepted, duplicate, rejected, and unmatched counts. Re-running the same batch must not duplicate events. |
| DEMO-TIM-008 | Allow an employee to submit a missing-punch correction with reason. |
| DEMO-TIM-009 | Allow the time administrator to resolve attendance exceptions and close the demonstration period. |

**Demo acceptance:** A user can synchronize sample events, correct a missing punch through approval, and see the corrected payable-time result used in payroll.

### 7.6 Leave, overtime, and approvals

| ID | Requirement |
|---|---|
| DEMO-LVA-001 | Show seeded leave types and balances using a simplified balance ledger. |
| DEMO-LVA-002 | Let employees submit full-day, half-day, or hourly requests where supported by the leave type. |
| DEMO-LVA-003 | Validate obvious overlaps, insufficient balance, and invalid dates. |
| DEMO-OVT-001 | Let employees submit overtime requests linked to a date/schedule. |
| DEMO-APR-001 | Route leave, overtime, and attendance-correction requests first to the seeded manager and then to HR. |
| DEMO-APR-002 | Support approve, reject, and return-for-changes actions with comments. |
| DEMO-APR-003 | Prevent self-approval. |
| DEMO-APR-004 | Update request history, balances, attendance, notifications, and payroll inputs after final HR approval. |

**Demo acceptance:** The Employee submits unpaid leave, the Manager approves it, HR gives final approval, and the current payroll preview shows the resulting deduction.

### 7.7 Benefits

| ID | Requirement |
|---|---|
| DEMO-BEN-001 | Display four to six seeded benefit plans with eligibility, employer share, and employee deduction examples. |
| DEMO-BEN-002 | Allow HR to enroll or remove an eligible employee during the current runtime. |
| DEMO-BEN-003 | Prevent duplicate enrollment and show a useful validation message. |
| DEMO-BEN-004 | Feed the employee share of supported benefits into the payroll preview. |
| DEMO-BEN-005 | Provide enrollment and cost summary reports. |

### 7.8 Performance

| ID | Requirement |
|---|---|
| DEMO-PRF-001 | Show one active and one completed performance cycle. |
| DEMO-PRF-002 | Support goals, employee self-review, manager rating/comment, and employee acknowledgement for seeded participants. |
| DEMO-PRF-003 | Show cycle progress, overdue tasks, goal progress, and rating distribution. |
| DEMO-PRF-004 | Restrict employee, manager, and HR views according to seeded role. |
| DEMO-PRF-005 | Do not automatically change compensation or employment from ratings. |

**Demo acceptance:** The seeded employee submits a self-review; the manager completes the manager section; HR can view progress and the employee can acknowledge the completed review.

### 7.9 Simplified Philippine payroll

#### 7.9.1 Demo calculation coverage

The demo payroll engine must calculate common, explainable cases using a clearly labeled `PH-DEMO-SIMPLIFIED` rule pack.

Included calculation inputs:

- Basic pay for monthly, daily, and hourly employees
- Simplified proration for hire or unpaid absence within the period
- Late and undertime deductions
- Approved unpaid leave deduction
- Approved overtime earnings
- Night-work, rest-day, and holiday earning examples
- Taxable and non-taxable allowance examples
- Employee benefit deductions
- Simple company loan deduction
- Representative SSS, PhilHealth, and Pag-IBIG employee/employer shares
- Representative withholding tax on compensation
- Gross pay, taxable pay, total deductions, employer contributions, and net pay

The demo may use simplified assumptions for workday divisors, proration, rounding, statutory brackets, thresholds, and special cases. Those assumptions must be documented in the Payroll Rule Information drawer.

#### 7.9.2 Payroll workflow

| ID | Requirement |
|---|---|
| DEMO-PAY-001 | Display weekly, semi-monthly, and monthly payroll groups. |
| DEMO-PAY-002 | Include a previously released payroll run and a current draft run. |
| DEMO-PAY-003 | Calculate draft payroll from the current runtime's employee, attendance, leave, overtime, benefit, and compensation data. Approved and released versions use their frozen calculation snapshots. |
| DEMO-PAY-004 | Show validation blockers and warnings, including missing bank details, unresolved attendance, unusual variance, and negative-net-pay examples. |
| DEMO-PAY-005 | Allow the processor to correct supported issues and recalculate an affected employee or entire run. |
| DEMO-PAY-006 | Provide employee-level gross-to-net breakdown with linked source inputs. |
| DEMO-PAY-007 | Support Draft → Calculated → Validated → Approved → Released states. |
| DEMO-PAY-008 | Require the separate Payroll Approver account for final approval. |
| DEMO-PAY-009 | Publish payslips only after release. |
| DEMO-PAY-010 | Let the Employee account view and download its released payslip. |
| DEMO-PAY-011 | Create runtime-local audit entries for calculation, approval, release, and exports. |
| DEMO-PAY-012 | Capture the payroll inputs, rule-pack version, calculation breakdowns, warnings, and totals used by each calculated payroll version so the result does not change silently when current employee or time data changes. |
| DEMO-PAY-013 | Treat an approved or released payroll version and its payslips as immutable within the current browser runtime. Later source-data edits affect only a new draft calculation; reopening or reversing a released payroll is not supported in the demo. |
| DEMO-PAY-014 | Compare the current calculated snapshot with the seeded prior released run and show gross, deduction, and net variance at run and employee level. Highlight material changes and explain seeded new-hire, separation, compensation, leave, and deduction drivers. |
| DEMO-PAY-015 | Display bank, accounting, statutory, and payroll-register reconciliation evidence with exact control totals derived from the selected frozen snapshot. |
| DEMO-PAY-016 | Require the Payroll Processor to complete a runtime-local source-lock, variance-review, exception-resolution, and reconciliation checklist before validation. Record actor and timestamp for each sign-off item. |
| DEMO-PAY-017 | Freeze the processor checklist and reconciliation evidence when the separate Payroll Approver approves or releases the run. |

#### 7.9.3 Payroll outputs

| ID | Requirement |
|---|---|
| DEMO-OUT-001 | Generate a downloadable payroll register from the current approved/released run. |
| DEMO-OUT-002 | Generate a downloadable sample bank payroll file with fictional accounts and control totals. |
| DEMO-OUT-003 | Generate a downloadable accounting journal with balanced debit/credit totals and sample cost-center dimensions. |
| DEMO-OUT-004 | Generate downloadable demonstration reports for BIR withholding, SSS, PhilHealth, and Pag-IBIG totals. |
| DEMO-OUT-005 | Allow “Simulate Government Submission” after file generation and record a fictional submission reference. |
| DEMO-OUT-006 | Mark every financial/government file as demo-only and not for submission. |

**Demo acceptance:** Approved attendance and leave changes affect payroll; the processor calculates and validates; a different seeded account approves; payslips publish; finance downloads bank/accounting files; and government outputs download with clear demo markings.

### 7.10 Reports and dashboards

| ID | Requirement |
|---|---|
| DEMO-RPT-001 | Provide role-specific dashboard cards and charts using live in-memory data. |
| DEMO-RPT-002 | Support drill-down from headline totals to the underlying filtered records. |
| DEMO-RPT-003 | Provide standard headcount, hiring, attendance, leave, overtime, benefit, performance, payroll, and audit reports. |
| DEMO-RPT-004 | Provide filters for entity, branch, department, status, payroll group, and date where relevant. |
| DEMO-RPT-005 | Export supported reports with demo labeling and the filters used. |
| DEMO-RPT-006 | Ensure displayed totals and downloaded totals reconcile. |
| DEMO-RPT-007 | Support an as-of date on the historical organization and employee view and make the chosen date explicit in displayed results. |
| DEMO-RPT-008 | Provide payroll variance drill-down from run totals to changed employees and their principal demo driver. |

### 7.11 Mock integrations center

| ID | Requirement |
|---|---|
| DEMO-INT-001 | Display fictional biometric, notification, API, webhook, bank, accounting, and government connectors. |
| DEMO-INT-002 | Clearly distinguish `Simulated`, `File Export Only`, and `Not Connected` statuses. |
| DEMO-INT-003 | Provide an API Playground with documented example requests/responses but no externally supported endpoint. |
| DEMO-INT-004 | Provide a Webhook Simulator with sample event payload, success/failure status, retry, and delivery history without external calls. |
| DEMO-INT-005 | Provide a Demo Outbox for simulated email/mobile notifications. |
| DEMO-INT-006 | Never suggest that a simulated connection is live. |

---

## 8. Simplified payroll assumptions

The demo must be believable without claiming compliance completeness.

### 8.1 Required rule disclosure

The payroll screen must provide a “Demo Rules” drawer containing:

- Demo rule-pack name and version
- Statement that rules are illustrative and not certified for production
- Pay-period and workday assumptions
- Included earnings and deductions
- Simplified statutory contribution and withholding assumptions
- Unsupported cases
- Calculation rounding approach

### 8.2 Demo rule-pack approach

The demo must use one frozen, data-driven rule pack such as `PH-DEMO-SIMPLIFIED-v1`. It should be realistic enough for common walkthrough cases without claiming comprehensive compliance.

- Choose and display a specific reference date for the rule pack.
- Where feasible, start from officially published Philippine tax and contribution tables effective on that reference date rather than invented rates.
- Keep demo simplifications for proration, divisors, thresholds, special cases, and rounding explicit in the rule-pack data and Demo Rules drawer.
- Do not build an arbitrary formula editor. Rule values and formulas may be maintained as reviewed application fixtures/configuration.
- Prepare golden calculation cases with fixed inputs and expected line-by-line results before the demo is shown to clients.
- Include, at minimum, golden cases for ordinary monthly pay, daily or hourly pay, unpaid leave, late/undertime, overtime or night work, mid-period hire proration, benefits/loan deductions, statutory contributions, withholding, and a payroll validation blocker.
- Require payroll-reviewer approval of the reference date, assumptions, rule values, and golden results before client-facing use.
- Changing the rule pack requires a new version and updated golden results; it must not change a previously calculated payroll version silently.

### 8.3 Payroll calculation snapshots

A payroll snapshot is simply a frozen in-memory copy of the data used for a calculation. It makes the workflow behave credibly without adding persistent storage.

- Draft payroll reads the latest current employee, compensation, attendance, leave, overtime, and benefit data.
- Calculating creates a versioned snapshot of those inputs, the selected rule pack, line-by-line results, warnings, and totals.
- Recalculation creates or replaces the current draft calculation version and remains deterministic for unchanged inputs.
- Approval freezes the selected calculated version.
- Release publishes payslips and outputs only from the approved frozen version.
- Editing source data after release does not alter that released run or payslip. It affects only a later draft calculation.
- Payroll reopening, reversal, off-cycle correction, and post-release adjustment are outside the demo scope.
- All snapshots remain client-side and in memory and reset with the rest of the demo when the page reloads.

### 8.4 Unsupported or limited payroll cases

- Complex year-end annualization and tax refund/recovery
- Multiple prior employers and full BIR year-to-date reconciliation
- Multiple retroactive periods
- Final pay and separation tax edge cases
- Maternity/sickness benefit reimbursement workflows
- Garnishments and complex deduction priority law
- Full 13th-month reconciliation across irregular components
- Every wage order, sector exemption, compressed workweek, or collective bargaining rule
- Complete statutory file schemas certified against current government validators
- Payroll reversals after actual bank payment

Unsupported cases should either be absent from the seed or show a clear `Not available in demo` explanation.

---

## 9. Client-side in-memory data and technical behavior

### 9.1 Runtime behavior

- Seed a fresh in-memory store when the browser application first loads.
- Keep all CRUD, approvals, payroll changes, calculation snapshots, audit events, uploaded-file objects, and simulated integrations in the memory of that browser runtime only.
- Do not use a backend, remote database, network service, `localStorage`, `sessionStorage`, or `IndexedDB` for application data.
- Retain the current walkthrough state when navigating or logging out and signing in as another persona within the same loaded page.
- Reset automatically when the page reloads, the tab is closed, or the application is reopened.
- Give every browser tab, window, or separately opened application instance its own independent seeded state. No demo runtime shares state with another.
- Do not include a manual reset button in this version.
- Display a reset notice before actions that may take users significant time and on the login/account-selection page.
- Require no internet connection after the application assets have loaded. Simulated integration actions must remain local and must never attempt outbound delivery.

### 9.2 Architecture constraints

Even though persistence is omitted, the demo should not tightly couple business logic to seed data.

- Access data through repository/service interfaces backed by the client-side in-memory store so production adapters can replace them later.
- Keep the authoritative demo state in a centralized application store rather than duplicating mutable records across screens.
- Keep payroll, attendance, approval, and reporting logic outside UI components.
- Use stable IDs and deterministic seed generation.
- Use fixed-precision decimal values for money.
- Use an injectable clock and `Asia/Manila` business-time behavior while representing timestamps safely.
- Generate exports in the browser from current domain data or a released payroll snapshot, not static output files.
- Keep mocked external connectors behind interfaces so real adapters can replace them later.
- Treat client-side login and permission guards as workflow demonstrations, not as production security controls.
- Do not build backend, deployment, persistence, synchronization, or production-security abstractions for this demo.

### 9.3 Temporary files

- Seeded sample documents may be bundled read-only fixtures.
- User uploads may be represented by browser `File`/`Blob` objects and metadata held only in memory. They must be discarded on page reload and never transmitted.
- Generated downloads may be created in the browser on demand and discarded after delivery or page reload.
- No real employee or client documents may be uploaded to a public demo.

---

## 10. Recommended guided demonstration

The main walkthrough should take approximately 20–30 minutes.

### Scene 1 — Company overview

1. Log in as HR Administrator.
2. Show the dashboard, two legal entities, three branches, departments, and approximately 250 employees.
3. Open an employee profile to show connected HR, time, benefits, performance, and payroll data.

### Scene 2 — Recruitment to employee

1. Log in as Recruiter.
2. Open the accepted applicant and show the hiring history.
3. Convert the applicant to an employee draft.
4. Log in as HR and complete the assignment, compensation, schedule, and payroll setup.
5. Activate the new employee and confirm updated headcount.

### Scene 3 — Attendance and exception

1. Log in as Time Administrator.
2. Run a simulated biometric sync.
3. Show accepted events, a duplicate, an unmatched identity, and a missing punch.
4. Log in as Employee and submit a correction.
5. Log in as Manager, approve it, then log in as HR for final approval.
6. Return to attendance and show the corrected payable time.

### Scene 4 — Leave through payroll

1. As Employee, submit an unpaid leave request.
2. As Manager, approve it.
3. As HR, give final approval.
4. As Payroll Processor, calculate the current payroll and show the leave deduction with source trace.
5. Resolve a seeded warning and recalculate.
6. As Payroll Approver, approve and release payroll.
7. As Employee, open the newly released payslip.

### Scene 5 — Outputs and executive view

1. As Finance, download the demo bank file and balanced accounting journal.
2. Generate government report files and simulate submission.
3. Show dashboard/report drill-down and export.
4. End on the audit trail showing the actions taken during the walkthrough.

Benefits and performance can be shown either between Scenes 2 and 3 or as a separate short exploration depending on client interest.

---

## 11. Demo-versus-production comparison

| Area | Demo MVP | Production ZylHR |
|---|---|---|
| Database | Client-side memory, reset on page reload/reopen | Durable, isolated client database with migration and recovery |
| Employee scale | Approximately 250 seeded employees | Designed and certified for contracted enterprise volume |
| Web | Functional responsive web | Hardened responsive web with production support |
| Mobile/kiosk | Not included | Dedicated mobile and kiosk/tablet surfaces |
| Login | Seeded accounts | Client-managed identity, MFA, password lifecycle, optional SSO |
| Roles | Representative fixed roles | Configurable roles, field permissions, and data scopes |
| Audit | Browser-runtime-local demonstration | Durable, protected, retained audit evidence |
| Payroll | Realistic simplified Philippine cases | Validated effective-dated Philippine rule packs and edge cases |
| Biometric | Simulated sync | Certified device/file/connectors |
| Notifications | In-app plus simulated outbox | Real email/mobile delivery and monitoring |
| Bank/accounting | Downloadable demo files | Certified client formats and controlled production delivery |
| Government | Demo files and simulated submission | Current validated outputs and supported submission process |
| API/webhooks | Internal simulator | Authenticated, versioned external interfaces |
| Documents | Fixtures/temporary uploads | Secure object storage, scanning, versioning, retention |
| Operations | Basic app runtime | Monitoring, backup, disaster recovery, upgrades, support SLA |
| Security | Reasonable demo safeguards | Full threat model, hardening, testing, encryption, and governance |

---

## 12. Demo quality requirements

### 12.1 Usability

- No included navigation item should lead to a blank or placeholder-only page.
- The seeded data should make every dashboard and report useful immediately.
- Every mocked feature must be labeled without breaking the client-facing experience.
- Important actions provide success feedback and show the resulting data change.
- Errors explain how the user can continue.
- Tables remain usable with approximately 250 employees.

### 12.2 Performance

Suggested demonstration targets on supported hardware:

- Initial seed and startup within 10 seconds.
- Normal page navigation and list filters feel immediate; target under 2 seconds.
- Report generation under 5 seconds for the seeded data.
- Payroll calculation under 10 seconds for all seeded payroll groups.
- Export generation under 5 seconds.

These are demo usability goals, not contractual production performance commitments.

### 12.3 Reliability

- A successful action must remain visible while navigating and changing personas until the page reloads or the application is reopened.
- Repeated simulated biometric sync must be idempotent.
- Repeated approval clicks must not create duplicate actions.
- Payroll recalculation with unchanged inputs must produce the same results.
- Downloaded totals must match the current screen totals.

### 12.4 Browser support

- Current desktop Chrome and Edge are required for the first demo.
- Responsive layouts should remain usable in a mobile-width browser, even though no native employee app is included.
- Other browsers are best-effort unless added to the demo test matrix.

---

## 13. Acceptance test checklist

The demo is ready to show clients when all of the following pass:

### Foundation

- [ ] Every seeded account can log in and log out.
- [ ] Every role sees the correct navigation and authorized data.
- [ ] Navigation, logout, and login as another persona retain the current walkthrough state.
- [ ] Page reload or reopening the application restores the original seed exactly.
- [ ] A separately opened tab or application instance has an independent seeded state.
- [ ] Demo and fictional-data notices are visible.
- [ ] Global search returns only role-authorized result types and opens the relevant module.
- [ ] Operations work items show priority, owner, due date, age, status, and a working next action.
- [ ] Employee and attendance CSV fixtures preview valid/invalid rows, export errors, commit valid rows, and create audit evidence.

### Organization and people

- [ ] Approximately 250 employees render with fast search and filters.
- [ ] Organization edits update related views.
- [ ] Employee create/edit/transfer actions work during the current runtime.
- [ ] Employee details link correctly to attendance, benefits, performance, and payroll.
- [ ] Selecting a historical as-of date changes reconstructed assignment and headcount without altering current records.
- [ ] Current-versus-as-of comparison explains at least one seeded employee movement.
- [ ] Document compliance supports reminder, resolution, employee acknowledgement, and live queue updates.

### Recruitment

- [ ] A requisition and applicant can be created.
- [ ] Applicant stages and interview feedback work.
- [ ] The accepted applicant converts to an employee draft and can be activated.

### Time and approvals

- [ ] Schedule types and overnight examples display correctly.
- [ ] Demo biometric sync inserts events without duplicates.
- [ ] Employee correction, leave, and overtime requests route Manager → HR.
- [ ] Final approval updates dependent attendance/balance/payroll data.

### Benefits and performance

- [ ] Benefit enrollment changes payroll deduction preview.
- [ ] Self-review, manager review, and acknowledgement work.
- [ ] Progress and cost reports reconcile.

### Payroll and outputs

- [ ] Payroll calculates all seeded employees without unexplained errors.
- [ ] Seeded warnings/blockers can be resolved.
- [ ] Payroll requires a separate approver account.
- [ ] Changing current compensation or time data after release does not alter the released payroll version or its payslips.
- [ ] Released payslips are available to the correct employee.
- [ ] Bank, accounting, and government demonstration files download successfully.
- [ ] Files clearly state `DEMO / NOT FOR SUBMISSION`.
- [ ] Screen, report, and file totals reconcile.
- [ ] Current-versus-prior payroll variance reconciles from run totals to employee-level changes and seeded drivers.
- [ ] Processor sign-off is required before validation and records the acting persona and timestamp.
- [ ] Approved and released sign-off evidence is frozen with the payroll snapshot.

### Mock integrations

- [ ] Notification outbox displays generated messages without sending them.
- [ ] API and webhook simulators show realistic success/failure behavior without network calls.
- [ ] Government submission simulation creates only a fictional reference.
- [ ] No page claims a simulated connection is live.

### Presentation quality

- [ ] The complete guided demo can be performed in 20–30 minutes.
- [ ] No included path ends at an unfinished placeholder.
- [ ] There are no real persons, accounts, government IDs, credentials, or client records.
- [ ] The application is freshly loaded before each client demonstration so the exact baseline seed is restored.

---

## 14. Suggested build order

1. In-memory domain model, deterministic seed, demo clock, and seeded authentication
2. Shared layout, role navigation, demo notices, notifications, and audit
3. Organization and employee management
4. Recruitment and applicant-to-employee conversion
5. Scheduling, attendance, and biometric simulation
6. Leave, overtime, attendance corrections, and Manager → HR approval
7. Benefits and performance
8. Simplified payroll engine and payslips
9. Reports, dashboards, and downloadable outputs
10. Mock API/webhooks, Demo Outbox, and submission simulator
11. Full demo walkthrough testing, polish, persona-state continuity, and reload-reset verification

The build should prioritize one complete vertical path early:

`Employee → Attendance → Leave approval → Payroll calculation → Payslip`

This proves the core cross-module architecture before the remaining breadth is added.

---

## 15. Future production conversion

The demo is not expected to become production merely by replacing the client-side in-memory store. Production conversion requires separate work for:

- Durable database design, migrations, concurrency, and data integrity
- Client isolation and deployment architecture
- Production identity, MFA/SSO, authorization review, and secrets
- Security, privacy, retention, audit integrity, and incident response
- Complete Philippine payroll rule validation and statutory output certification
- Persistent document storage and malware protection
- Real connectors, file profiles, monitoring, and reconciliation
- Import/migration tooling
- Backups, recovery, observability, support, and upgrades
- Load, accessibility, browser, penetration, and disaster-recovery testing

The demo should reuse clean domain and service boundaries, but its acceptance does not imply production readiness.

---

## 16. Open design and content decisions

These can be decided during technical design and content review without changing the approved demo scope. Decisions that affect client-facing truth claims—especially payroll assumptions—require the named reviewer approval before the demo is shown to clients.

1. Exact frontend framework, in-memory store library, and domain/repository organization.
2. Exact PDF/XLSX generation libraries that work entirely in the browser.
3. Final fictional company name and visual branding.
4. Local launch and packaging method for the self-contained web application.
5. Payroll rule-pack reference date, reviewed assumptions, rule-table values, golden expected results, and named payroll reviewer.
6. Exact demo usernames and account-selection/credential experience.
7. Whether the careers/application page is reachable from the unauthenticated demo landing page or demonstrated from the Recruiter view only.
8. Which charts are used on each dashboard.

---

## 17. Approval

| Reviewer | Responsibility | Status |
|---|---|---|
| Product owner | Demo scope and client story | Pending |
| HR reviewer | HR workflows and seeded scenarios | Pending |
| Payroll reviewer | Simplified calculations and disclaimers | Pending |
| Engineering lead | Feasibility and architecture boundaries | Pending |
| QA lead | Acceptance test coverage | Pending |
| Sales/demo owner | Guided client walkthrough | Pending |
