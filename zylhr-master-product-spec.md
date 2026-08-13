# ZylHR Master Product Specification

| Field | Value |
|---|---|
| Product | ZylHR |
| Document type | Master Product Specification |
| Version | 0.1 |
| Status | Draft for product and technical review |
| Primary market | Philippine businesses |
| Target customer | Enterprises with 500+ employees |
| Delivery model | Separate deployment per client |
| Last updated | 2026-08-13 |

> **Compliance note:** This specification defines product behavior, not legal or tax advice. Philippine payroll rules, contribution schedules, wage orders, filing formats, and statutory forms change over time. Before production use, each rule pack and government output must be validated by qualified Philippine payroll, tax, labor, and privacy professionals.

---

## 1. Executive summary

ZylHR is an enterprise Human Resources Information System for Philippine businesses. It centralizes organization structures, recruitment, employee records, contracts, benefits, schedules, attendance, leave, overtime, approvals, performance reviews, reporting, and Philippine payroll.

Each client receives a separate deployment and isolated data store. ZylHR must support vendor-managed cloud, client-owned cloud, and client on-premise installations from one maintained product line. Client branding is configurable.

The first sellable release is a complete operational suite rather than a limited employee-directory MVP. Payroll remains the last major module in the implementation sequence because it consumes approved organization, employee, compensation, schedule, attendance, leave, overtime, benefits, and statutory configuration data.

### 1.1 Product promise

ZylHR gives HR, managers, payroll teams, and employees one auditable source of truth from applicant entry through payroll completion.

### 1.2 Confirmed product decisions

| Area | Decision |
|---|---|
| Commercial model | Separate deployment per client |
| Deployment targets | Vendor-managed cloud, client cloud, and on-premise |
| Organization model | Both single-company-with-branches and multi-entity/subsidiary structures |
| Primary customer size | 500+ employees |
| Industry focus | Industry-agnostic |
| User surfaces | Responsive web, employee mobile app, attendance kiosk/tablet, and biometric integration |
| First sellable release | Full suite including Philippine payroll |
| Employee self-service | Profiles, records, payslips, attendance, corrections, leave, overtime, personal-data changes, and document uploads |
| Standard approval path | Manager approval followed by HR |
| First-release integrations | Bank payroll files, accounting exports, government report files, public API, and webhooks |
| Branding | Client-configurable |
| Broader first-release HR scope | Recruitment, applicant tracking, documents, contracts, benefits, and performance reviews |
| Worker arrangements | Regular, probationary, contractual, project-based, and part-time |
| Payroll schedules | Weekly, semi-monthly, and monthly; multiple payroll groups per company |
| Pay bases | Monthly, daily, and hourly |
| Payroll direction | Complete Philippine payroll with an architecture extensible to other countries later |

---

## 2. Product problem

Large organizations frequently operate HR through disconnected spreadsheets, attendance devices, email approvals, paper employee files, and separate payroll tools. This creates duplicated records, delayed corrections, inconsistent policy application, weak auditability, and payroll risk.

ZylHR must solve five connected problems:

1. Maintain a reliable, historically accurate source of employee and organization data.
2. Convert schedules and raw time events into explainable attendance results.
3. Route employee requests through accountable manager and HR approval.
4. Produce traceable payroll from approved source records and effective-dated Philippine rules.
5. Give authorized users timely reports without exposing unnecessary personal or payroll data.

---

## 3. Product goals and non-goals

### 3.1 Goals

- Support the complete applicant-to-employee-to-payroll lifecycle.
- Serve enterprises with at least 500 employees and complex branches, entities, shifts, and payroll groups.
- Make every payroll amount traceable to a rule, source record, approval, and effective date.
- Give employees useful self-service without weakening HR control.
- Support Philippine labor, tax, and mandatory-contribution requirements through versioned configuration.
- Keep every client deployment and its data isolated.
- Operate consistently across supported cloud and on-premise environments.
- Provide secure integrations without making direct database access necessary.
- Preserve historical truth through effective dating and immutable audit records.

### 3.2 First-release non-goals

- International payroll calculation; the design must be extensible, but only the Philippine rule pack is delivered.
- Training and certification management.
- A dedicated onboarding/offboarding checklist module. Basic hiring, activation, transfer, separation, clearance status, and final-pay data remain required.
- Automatic employee termination, hiring, promotion, or performance decisions using AI.
- Direct movement of money. ZylHR produces approved bank files but does not initiate bank transfers.
- Direct submission into government portals unless an officially supported interface is available and separately certified. The initial product generates validated report files and forms.
- A general accounting ledger or enterprise resource planning system.
- Advanced arbitrary approval-workflow design. First release uses the standard Manager → HR path for employee requests, with controlled delegation and escalation.
- Enterprise SSO in the initial integration scope. Local authentication and MFA are required; OIDC/SAML/Active Directory support remains a planned extension.

---

## 4. Product principles

1. **Payroll must be explainable.** Every peso must have a visible calculation breakdown.
2. **Approved records are controlled records.** Changes after approval require a reason, authorization, and audit trail.
3. **Rules are effective-dated.** Policies and statutory tables must never be overwritten in place.
4. **Employees see their own information.** Access is broad enough for self-service but limited by role and purpose.
5. **Exceptions are first-class work.** Missing punches, conflicts, rejected requests, and payroll variances must appear in actionable queues.
6. **Configuration before customization.** Client policies should be represented as validated configuration rather than source-code forks.
7. **One product, isolated deployments.** Hosting differences must not create incompatible ZylHR editions.
8. **Privacy by default.** Collect only necessary data and minimize exposure in screens, exports, logs, and integrations.

---

## 5. Users, roles, and access scopes

### 5.1 Standard roles

| Role | Primary responsibilities |
|---|---|
| Deployment Administrator | Installation, environment configuration, backups, monitoring, and upgrades; no routine HR access |
| ZylHR System Administrator | Branding, application configuration, access roles, reference data, and integrations |
| HR Administrator | Organization, employee master data, contracts, documents, benefits, leave, and HR approvals |
| Recruiter | Requisitions, applicants, interviews, offers, and applicant-to-employee conversion |
| Time Administrator | Schedules, devices, attendance exceptions, corrections, and time-period closure |
| Payroll Processor | Payroll preparation, validation, recalculation, statutory output, and payroll reporting |
| Payroll Approver | Final payroll review, approval, release authorization, and controlled reopening |
| Finance/Accounting User | Payroll summaries, journal exports, bank-file coordination, and reconciliation |
| HR Manager | HR reports, employee actions, performance-cycle management, and escalations |
| Line Manager | Team schedules, attendance, leave/overtime approval, employee records allowed by policy, and performance reviews |
| Employee | Self-service profile, documents, time records, requests, performance tasks, payslips, and personal reports |
| Auditor/Read-only Reviewer | Time-bound, read-only access to authorized records and audit evidence |
| Integration Service Account | Narrowly scoped machine access through API or file exchange |

### 5.2 Access scopes

Permissions must combine **action** and **data scope**:

- Self
- Direct reports
- Reporting hierarchy
- Department
- Branch/site
- Legal entity
- Payroll group
- Entire deployment

Sensitive fields such as salary, bank details, tax identifiers, government identifiers, medical/benefit information, and performance records require separate permissions from general employee-directory access.

### 5.3 Segregation of duties

- A payroll processor may prepare a payroll but cannot be its sole final approver.
- A user must not approve their own leave, overtime, attendance correction, compensation change, or payroll adjustment.
- Emergency overrides require an authorized role, mandatory reason, and audit event.
- Exporting unmasked payroll or government identifiers requires explicit export permission.

---

## 6. Product surfaces and information architecture

### 6.1 Responsive web application

Primary surface for administrators, HR, payroll, recruiters, finance, auditors, and managers.

Top-level navigation:

1. Home
2. Organization
3. Recruitment
4. People
5. Time & Attendance
6. Leave & Overtime
7. Benefits
8. Performance
9. Payroll
10. Reports
11. Approvals
12. Administration

### 6.2 Employee mobile application

- Clock in/out where company policy permits.
- Capture approved location evidence for field attendance.
- View schedules and time records.
- Request corrections, leave, and overtime.
- Upload supporting documents.
- View profile, benefits, requests, performance tasks, payslips, and tax certificates.
- Receive actionable notifications.
- Queue permitted attendance events when temporarily offline and synchronize safely.

### 6.3 Attendance kiosk/tablet

- Site-bound shared-device mode.
- Employee identification using configured PIN, QR, card, or supported device identity.
- Fast punch acknowledgement.
- Offline queue with tamper-evident event metadata.
- Device health and last-synchronization status.
- Restricted administration protected by re-authentication.

### 6.4 Biometric integration

- Support pull, push, scheduled file import, and connector-based synchronization where devices permit.
- Map device identities to employees with duplicate and orphan detection.
- Store normalized time events, device identifiers, and source evidence.
- Do not store raw biometric templates by default. Any connector that requires templates must isolate, encrypt, minimize, and separately authorize that processing.

---

## 7. Scope and implementation sequence

All modules below are required before the first sellable general release. They are implemented in dependency order.

| Sequence | Module | Why it comes here |
|---:|---|---|
| 0 | Platform foundation | Identity, security, configuration, audit, deployment, and shared services are prerequisites. |
| 1 | Organization | Defines entities, branches, departments, positions, cost centers, and reporting relationships. |
| 2 | Recruitment | Creates requisitions and applicants that can convert into controlled employee records. |
| 3 | Employees, documents, contracts, and benefits | Establishes the authoritative worker, employment, compensation, and eligibility data. |
| 4 | Scheduling | Defines expected work before attendance can be interpreted. |
| 5 | Attendance | Converts raw punches into payable time and exceptions. |
| 6 | Leave, overtime, and approvals | Resolves absences and additional work through Manager → HR approval. |
| 7 | Performance | Uses established employees, positions, managers, and cycles. |
| 8 | Reports and controls | Basic reports ship with each earlier module; cross-module and payroll-readiness reporting is completed here. |
| 9 | Payroll | Consumes approved upstream data and produces earnings, deductions, taxes, contributions, payslips, and outputs. |
| 10 | Integrations and production hardening | Certifies bank, accounting, government-file, API, security, scale, migration, backup, and deployment behavior. |

Reports are not postponed entirely until sequence 8. Every module must include operational lists, exports, and exception reports as it is built. Sequence 8 completes cross-module analytics and governance.

---

## 8. Core domain model

### 8.1 Organization entities

- Client deployment
- Organization group
- Legal entity
- Branch/site
- Business unit
- Department/team
- Cost center
- Position/job profile
- Reporting relationship
- Work location
- Holiday calendar

### 8.2 People entities

- Person
- Applicant
- Employee/worker record
- Employment
- Contract
- Assignment
- Compensation assignment
- Government identifier
- Bank account
- Dependent and emergency contact
- Document
- Benefit enrollment
- Performance cycle/review

### 8.3 Time entities

- Schedule template
- Shift
- Shift assignment
- Break rule
- Raw time event
- Attendance day
- Attendance exception
- Correction request
- Overtime request
- Leave request
- Leave balance ledger
- Approval action

### 8.4 Payroll entities

- Payroll group
- Pay calendar
- Pay period
- Payroll input
- Earning/deduction definition
- Statutory rule-pack version
- Employee payroll result
- Pay run
- Adjustment/reversal
- Payslip
- Bank-output batch
- Accounting journal batch
- Government report batch

### 8.5 Required modeling rules

- Every employee has one person identity and may have multiple sequential or concurrent employment/assignment records where client policy permits.
- Employee numbers are unique within a configured scope and cannot be silently reused.
- Organization, assignment, compensation, schedule, policy, and statutory changes are effective-dated.
- Historical transactions retain the rule and organization versions used when processed.
- Money uses fixed-precision decimal calculations, never binary floating-point arithmetic.
- Timestamps are stored in UTC with source timezone and device/source metadata. Business-day calculations use the assigned site timezone.
- Attachments are versioned objects with malware scanning, access controls, classification, and retention rules.

---

## 9. Functional requirements

### 9.1 Platform foundation

| ID | Requirement |
|---|---|
| FND-001 | Provide local username/password authentication with configurable MFA for privileged and payroll roles. |
| FND-002 | Provide role-based access with entity, branch, department, hierarchy, payroll-group, and self scopes. |
| FND-003 | Record immutable audit events for view, create, edit, approve, reject, export, import, login, impersonation, configuration, and payroll actions. |
| FND-004 | Include actor, timestamp, source, affected record, before/after values where safe, and reason in audit events. Secret values must never enter audit logs. |
| FND-005 | Provide configurable client logo, colors, application name treatment, favicon, login artwork, email templates, payslip branding, report headers, and domain settings. |
| FND-006 | Provide in-app and email notifications; mobile push notifications are supported when the mobile app is deployed. |
| FND-007 | Provide configurable business calendars, timezones, date/number formats, and Philippine peso formatting. |
| FND-008 | Support CSV/XLSX imports with validation preview, row-level errors, resumability, reconciliation totals, and import audit history. |
| FND-009 | Support bulk actions with permission checks, previews, confirmations, outcome summaries, and audit evidence. |
| FND-010 | Provide global search that respects field and record permissions. |
| FND-011 | Provide configurable record-retention policies and legal holds. |
| FND-012 | Provide feature flags and configuration versioning per deployment without client-specific code forks. |

**Foundation acceptance criteria**

- No user can retrieve a record outside their assigned data scope through UI, export, API, or guessed identifier.
- Privileged actions are searchable in the audit viewer.
- Configuration changes show who changed what, why, and when they take effect.
- A client theme can be applied without rebuilding application code.

### 9.2 Organization management

| ID | Requirement |
|---|---|
| ORG-001 | Create one or more legal entities under an organization group. |
| ORG-002 | Define branches, sites, business units, departments, teams, positions, job levels, and cost centers. |
| ORG-003 | Represent solid-line manager relationships and optional dotted-line relationships. |
| ORG-004 | Assign legal names, registered addresses, tax and government registration identifiers, and payroll registrations per legal entity. |
| ORG-005 | Assign work locations, holiday calendars, wage regions, and attendance policies to sites or employee groups. |
| ORG-006 | Effective-date organization changes without rewriting historical payroll or reporting context. |
| ORG-007 | Prevent deletion of referenced organization records; allow deactivation and controlled replacement. |
| ORG-008 | Display list, hierarchy, and organization-chart views. |
| ORG-009 | Support vacant, occupied, temporary, and abolished positions. |
| ORG-010 | Export the organization structure and provide change-history reports. |

**Organization acceptance criteria**

- The system can represent a group with multiple Philippine legal entities, each with multiple branches and separate payroll registrations.
- Moving an employee between departments on a future date does not alter past reports.
- An abolished department remains visible in historical records but cannot receive new assignments.

### 9.3 Recruitment and applicant tracking

| ID | Requirement |
|---|---|
| ATS-001 | Create and approve job requisitions tied to legal entity, branch, department, position, hiring manager, headcount, and target date. |
| ATS-002 | Publish jobs to a client-branded careers page and accept applications with privacy notice and consent/lawful-processing information. |
| ATS-003 | Support configurable pipeline stages such as New, Screening, Interview, Assessment, Offer, Hired, Rejected, and Withdrawn. |
| ATS-004 | Store resumes, application answers, interview notes, assessments, communications, source, and status history with restricted access. |
| ATS-005 | Schedule interviews and record structured interviewer feedback. |
| ATS-006 | Detect probable duplicate applicants without merging them automatically. |
| ATS-007 | Generate offer data from approved requisition and compensation information. |
| ATS-008 | Convert a hired applicant into an employee draft without duplicate re-entry; HR must review before activation. |
| ATS-009 | Enforce applicant-data retention and deletion/anonymization policies subject to legal hold. |
| ATS-010 | Report time-to-fill, source effectiveness, pipeline conversion, open requisitions, and hiring outcomes. |

**Recruitment acceptance criteria**

- A recruiter can move a candidate through a complete pipeline and convert the accepted candidate into an HR-reviewed employee draft.
- Interviewers see only assigned candidate information and cannot see compensation unless authorized.
- Rejected applicant data follows the configured retention policy.

### 9.4 Employee master records

| ID | Requirement |
|---|---|
| EMP-001 | Maintain a complete employee record including identity, contact, address, emergency contact, dependents, government identifiers, bank details, and work information. |
| EMP-002 | Support regular, probationary, contractual, project-based, and part-time employment classifications. |
| EMP-003 | Support monthly, daily, and hourly pay bases and multiple payroll-group assignments over time. |
| EMP-004 | Maintain hire date, regularization date, contract dates, service date, employment status, separation data, and rehire history. |
| EMP-005 | Maintain position, manager, entity, branch, department, cost center, work location, schedule group, and payroll group as effective-dated assignments. |
| EMP-006 | Maintain compensation components with currency, frequency, taxability, contribution treatment, proration behavior, and approval status. |
| EMP-007 | Validate format and uniqueness of configured government and employee identifiers while allowing authorized exception handling. |
| EMP-008 | Provide HR-controlled employee creation, activation, transfer, promotion, compensation change, separation, and rehire actions. |
| EMP-009 | Require reason and approval for sensitive changes that affect payroll. |
| EMP-010 | Provide employee history/timeline and compare versions of employment data. |
| EMP-011 | Let employees propose editable personal-data changes; changes affecting legal identity, government records, payroll, or bank data require HR verification. |
| EMP-012 | Support bulk employee import and mass assignment with validation and rollback-safe failure handling. |

**Employee acceptance criteria**

- HR can reconstruct an employee's entity, position, manager, schedule, compensation, and payroll group for any historical date.
- An employee bank-account change cannot affect an approved payroll without explicit reopening and audit.
- Employee self-service changes enter a review queue when company policy requires validation.

### 9.5 Documents and contracts

| ID | Requirement |
|---|---|
| DOC-001 | Configure document categories, required documents, confidentiality level, expiration rules, and retention policy. |
| DOC-002 | Upload, preview, download, replace, and archive document versions with malware scanning. |
| DOC-003 | Restrict medical, disciplinary, compensation, government-ID, and bank documents separately. |
| DOC-004 | Maintain employment contracts, amendments, effective dates, status, and linked compensation/assignment changes. |
| DOC-005 | Notify authorized users and employees of missing or expiring documents. |
| DOC-006 | Record employee acknowledgement of documents and policies with timestamp and version. |
| DOC-007 | Allow authorized export of an employee file with a manifest and export audit event. |
| DOC-008 | Do not represent simple acknowledgement as a legally qualified digital signature. |

### 9.6 Benefits administration

| ID | Requirement |
|---|---|
| BEN-001 | Define benefit plans, providers, coverage periods, eligibility rules, waiting periods, and enrollment windows. |
| BEN-002 | Support employee-only and dependent coverage. |
| BEN-003 | Define employer and employee shares as fixed values, percentages, tiers, or payroll-period amounts. |
| BEN-004 | Effective-date enrollments, suspensions, terminations, and plan changes. |
| BEN-005 | Feed approved employee deductions and employer costs into payroll. |
| BEN-006 | Prevent duplicate or ineligible enrollment and surface exceptions for HR review. |
| BEN-007 | Provide enrollment, eligibility, cost, and payroll-reconciliation reports. |

### 9.7 Scheduling

| ID | Requirement |
|---|---|
| SCH-001 | Define fixed, flexible, rotating, overnight, and split-shift templates. |
| SCH-002 | Define paid/unpaid and multiple break rules, grace periods, core hours, and required work duration. |
| SCH-003 | Assign schedules by employee or group with effective dates and controlled overrides. |
| SCH-004 | Maintain site and employee holiday calendars, including regular and special day classifications as configured. |
| SCH-005 | Provide day, week, month, team, and site schedule views. |
| SCH-006 | Detect overlapping assignments, invalid rest intervals, missing schedules, and schedule-policy conflicts. |
| SCH-007 | Support published and draft schedules; changes to published schedules notify affected employees. |
| SCH-008 | Preserve the schedule version used in attendance evaluation. |

### 9.8 Attendance and timekeeping

| ID | Requirement |
|---|---|
| ATT-001 | Receive time events from web, mobile, kiosk/tablet, biometric connectors, file imports, API, and authorized manual entry. |
| ATT-002 | Normalize source events while retaining original source, device, external identifier, timestamp, timezone, receipt time, and integrity metadata. |
| ATT-003 | Deduplicate repeated events idempotently and identify orphaned device identities. |
| ATT-004 | Interpret punches against fixed, flexible, rotating, overnight, and split schedules with multiple breaks. |
| ATT-005 | Calculate worked time, paid time, lateness, undertime, absence, breaks, overtime candidates, rest-day work, holiday work, and night-work segments using effective policy. |
| ATT-006 | Handle shifts crossing midnight, early/late punches, missing punches, unscheduled work, multiple sites, and changed schedules. |
| ATT-007 | Allow field/off-site attendance with configurable GPS/geofence and optional evidence capture subject to privacy policy. |
| ATT-008 | Queue offline mobile and kiosk events, clearly mark offline origin, and synchronize without duplicating punches. |
| ATT-009 | Let employees request corrections with reason and evidence. Route requests Manager → HR. |
| ATT-010 | Provide manager and time-administrator exception queues with filters, aging, bulk handling, and reason codes. |
| ATT-011 | Lock attendance periods before payroll. Reopening requires authorization and audit. |
| ATT-012 | Reconcile imported device counts against accepted, duplicate, invalid, orphaned, and pending events. |
| ATT-013 | Provide device/connector status, last successful sync, failure reason, and retry controls. |
| ATT-014 | Separate raw events from interpreted attendance results so rules can be rerun without destroying source evidence. |

**Attendance acceptance criteria**

- An overnight shift is assigned to the correct workday according to policy.
- Re-importing the same biometric batch creates no duplicate payable time.
- Every exception shows the source punches, expected schedule, applied rule, resulting calculation, and approval state.
- Approved and locked attendance cannot change silently after device resynchronization.

### 9.9 Leave, overtime, and approvals

| ID | Requirement |
|---|---|
| LVA-001 | Configure leave types, eligibility, accrual/grant methods, balance units, carryover, expiry, negative-balance policy, and attachments. |
| LVA-002 | Support full-day, half-day, and hourly leave where company policy permits. |
| LVA-003 | Calculate balance changes through an immutable ledger rather than overwriting a current balance. |
| LVA-004 | Validate overlapping requests, schedule coverage, holidays, rest days, blackout periods, notice requirements, and available balance. |
| LVA-005 | Route employee leave requests to the employee's manager and then HR. |
| LVA-006 | Support cancellation and amendment with recalculated balance and approval history. |
| OVT-001 | Support pre-shift, post-shift, rest-day, holiday, and scheduled overtime requests. |
| OVT-002 | Distinguish requested, rendered, approved, and payroll-payable overtime. |
| OVT-003 | Route overtime and attendance-correction requests Manager → HR. |
| APR-001 | Determine the manager from the effective reporting relationship at request time. |
| APR-002 | Support a configured delegate for manager absence and an HR escalation queue. |
| APR-003 | Prevent self-approval and record each action, comment, reason, timestamp, and actor. |
| APR-004 | Support Pending Manager, Pending HR, Approved, Rejected, Returned, Cancelled, and Expired states. |
| APR-005 | Notify requesters and current approvers of submission, action, return, escalation, and completion. |
| APR-006 | Preserve the full approval history even when the employee's manager later changes. |

**Approval acceptance criteria**

- A normal employee request cannot become payroll-effective before both manager and HR approval.
- Rejection or return requires a comment visible to the requester.
- Delegation never permits the employee to approve their own request.

### 9.10 Performance management

| ID | Requirement |
|---|---|
| PRF-001 | Configure review cycles, populations, templates, sections, rating scales, weights, and due dates. |
| PRF-002 | Support employee self-review, manager review, second-level review, HR moderation, and employee acknowledgement as configured. |
| PRF-003 | Define goals with owner, measurement, target, weight, due date, progress, and evidence. |
| PRF-004 | Preserve review versions, comments, ratings, acknowledgements, and reopening history. |
| PRF-005 | Restrict confidential feedback and calibration information by role. |
| PRF-006 | Provide completion, rating-distribution, goal-status, and overdue reports. |
| PRF-007 | Never automatically trigger termination, compensation, or promotion solely from a rating. |

### 9.11 Reports and dashboards

| ID | Requirement |
|---|---|
| RPT-001 | Provide role-specific dashboards for HR, managers, time administrators, payroll, finance, recruiters, and employees. |
| RPT-002 | Provide standard reports for headcount, movement, demographics, contracts, documents, recruitment, attendance, leave, overtime, benefits, performance, payroll, and audit. |
| RPT-003 | Support effective-date and as-of reporting. |
| RPT-004 | Support filter, group, sort, subtotal, compare-period, and drill-down behavior appropriate to each report. |
| RPT-005 | Export authorized results to CSV, XLSX, and PDF with export timestamp, filters, and classification. |
| RPT-006 | Mask sensitive fields by default and apply the requesting user's record and field permissions. |
| RPT-007 | Allow saved report views. Scheduled delivery is allowed only to verified authorized recipients and must be auditable. |
| RPT-008 | Provide payroll variance reports comparing current, previous, and expected results. |
| RPT-009 | Provide data-quality and exception reports before attendance and payroll closure. |
| RPT-010 | Ensure report totals reconcile to underlying transaction totals and exported results. |

### 9.12 Philippine payroll

#### 9.12.1 Payroll setup

| ID | Requirement |
|---|---|
| PAY-001 | Configure multiple payroll groups per legal entity with weekly, semi-monthly, or monthly calendars. |
| PAY-002 | Support monthly, daily, and hourly employees and effective-dated changes between pay arrangements. |
| PAY-003 | Configure earnings, deductions, employer costs, loans, taxable/non-taxable treatment, contribution treatment, proration, rounding, priority, and accounting mapping. |
| PAY-004 | Configure wage region/site, holiday calendar, work policy, tax status inputs, and statutory registrations. |
| PAY-005 | Maintain versioned Philippine statutory rule packs with source reference, publication date, effectivity date, approval, test evidence, and deployment history. |
| PAY-006 | Prevent a statutory version from being edited after use; corrections require a new version. |

#### 9.12.2 Inputs and calculations

| ID | Requirement |
|---|---|
| PAY-010 | Import approved regular pay, allowances, attendance, absences, tardiness, undertime, overtime, night work, rest-day work, holiday work, benefits, loans, adjustments, commissions, bonuses, and authorized manual inputs. |
| PAY-011 | Apply configured Philippine rules for regular holidays, special days, overtime, rest days, night-shift differential, and other wage-related benefits according to effective policy and law. |
| PAY-012 | Calculate withholding tax on compensation using the effective BIR rule version, including applicable annualization and prior-employer inputs. |
| PAY-013 | Calculate employee and employer shares for SSS and related administered programs, PhilHealth, and Pag-IBIG using effective-dated tables. |
| PAY-014 | Support configurable de minimis and other non-taxable thresholds, minimum-wage-earner treatment, and the statutory treatment of 13th-month pay and other benefits. |
| PAY-015 | Calculate 13th-month pay with explainable included/excluded components, eligibility dates, prior releases, adjustments, and final reconciliation. |
| PAY-016 | Support recurring and one-time deductions, benefit contributions, SSS/Pag-IBIG/company loans, cash advances, union dues, garnishments, and deduction priorities subject to policy and law. |
| PAY-017 | Support proration for hire, separation, unpaid leave, pay-rate change, and transfer within a pay period. |
| PAY-018 | Support retroactive adjustments, off-cycle payroll, final pay, reversal, refund, and recovery without rewriting prior approved runs. |
| PAY-019 | Show gross-to-net and employer-cost breakdown per employee with formula inputs, rates, caps, bases, rounding, and source records. |
| PAY-020 | Provide deterministic recalculation: unchanged inputs and rule versions must produce identical results. |

#### 9.12.3 Payroll workflow and controls

| ID | Requirement |
|---|---|
| PAY-030 | Use Draft → Calculated → Validated → Approved → Released → Posted → Closed states. |
| PAY-031 | Run pre-payroll validation for missing employee data, invalid bank details, unresolved attendance, unapproved requests, negative net pay, unusual variance, duplicate inputs, missing statutory identifiers, and configuration gaps. |
| PAY-032 | Allow authorized processors to resolve errors and recalculate only affected employees or the complete run. |
| PAY-033 | Require an independent payroll approver before release. |
| PAY-034 | Lock source snapshots and calculation versions at approval. |
| PAY-035 | Require controlled reopening, reason, approver, and regenerated outputs when an approved run changes. |
| PAY-036 | Reconcile employee totals, employer costs, deduction liabilities, bank totals, government totals, and accounting-journal totals. |
| PAY-037 | Generate payslips only from the approved version and publish them according to configured release timing. |
| PAY-038 | Support a payroll-run comparison and sign-off checklist retained with the run. |

#### 9.12.4 Statutory and external outputs

| ID | Requirement |
|---|---|
| PAY-040 | Generate current required BIR compensation withholding forms/data outputs, including supported BIR Form 1601-C, annual information return/alphalist outputs, and BIR Form 2316 data/forms as applicable. |
| PAY-041 | Generate SSS, PhilHealth, and Pag-IBIG employer contribution/remittance reports and electronic files in supported current formats. |
| PAY-042 | Store the output schema/version and generation timestamp with each government report batch. |
| PAY-043 | Validate required identifiers, totals, lengths, formats, and cross-footing before an output is marked ready. |
| PAY-044 | Generate client-configured bank payroll files from approved payroll with masked preview, control totals, dual authorization, and encrypted delivery package where supported. |
| PAY-045 | Generate balanced accounting journal exports by legal entity, branch, department, cost center, payroll group, and configured account mapping. |
| PAY-046 | Regenerating an output never changes the underlying approved payroll; changed data requires a controlled payroll version. |

**Payroll acceptance criteria**

- Every net-pay amount can be traced from payslip line to calculation step, source input, rule version, and approval.
- Payroll results reconcile exactly with bank, accounting, and statutory control totals subject only to explicitly documented format rounding.
- A rule change with a future effective date does not alter closed historical payroll.
- The system can run weekly, semi-monthly, and monthly payroll groups concurrently for the same legal entity.
- A 10,000-employee reference payroll completes within the approved performance target and produces repeatable results.
- Before production launch, client-approved parallel payroll produces reconciled results for at least two full pay cycles.

### 9.13 Employee self-service

| ID | Requirement |
|---|---|
| ESS-001 | Employees can view their profile, employment information permitted by policy, documents, contracts, benefits, schedules, attendance, requests, performance tasks, payslips, and tax certificates. |
| ESS-002 | Employees can propose personal-information changes and upload evidence; sensitive changes require HR review. |
| ESS-003 | Employees can clock in/out on enabled channels and see whether each event is received, pending sync, or rejected. |
| ESS-004 | Employees can request attendance corrections, leave, and overtime and follow approval status. |
| ESS-005 | Employees can download their own authorized records and see the applicable privacy/contact information. |
| ESS-006 | Payslips and tax documents require authenticated access and must not be attached unprotected to ordinary email. |
| ESS-007 | Mobile and web experiences must meet the same authorization rules. |

### 9.14 Integrations, API, and webhooks

| ID | Requirement |
|---|---|
| INT-001 | Provide a versioned REST/JSON API for approved organization, employee, time, request, payroll-summary, and reference-data use cases. |
| INT-002 | Use scoped service accounts, expiring credentials or keys, rate limits, idempotency controls, and complete access logs. |
| INT-003 | Provide signed webhooks with event identifiers, retry policy, replay protection, delivery history, and disable controls. |
| INT-004 | Never expose fields through API that the service account lacks permission to access. |
| INT-005 | Provide bank-format profiles with versioning, test files, control totals, and client acceptance records. |
| INT-006 | Provide accounting export profiles with configurable account and dimension mapping. |
| INT-007 | Provide government output adapters that can be versioned independently from core payroll calculation rules. |
| INT-008 | Provide biometric connector monitoring, identity mapping, import reconciliation, and safe retries. |
| INT-009 | Publish API documentation, examples, error codes, version/deprecation policy, and a non-production test environment where deployment permits. |

---

## 10. End-to-end workflows

### 10.1 Applicant to active employee

1. Recruiter creates or receives an approved requisition.
2. Applicant submits data and acknowledges the privacy notice.
3. Recruiter moves the applicant through screening, interviews, assessment, and offer.
4. Accepted applicant converts to an employee draft.
5. HR verifies identity, employment, contract, payroll, government, bank, schedule, and required-document data.
6. Authorized approver confirms compensation-sensitive information.
7. HR activates the employee on the effective hire date.
8. The employee receives self-service access and completes permitted data/document tasks.

### 10.2 Time event to payroll input

1. Employee follows a published schedule.
2. Time events arrive from mobile, web, kiosk, biometric device, API, or import.
3. ZylHR normalizes and matches events to the employee and schedule.
4. Attendance rules produce payable time and exceptions.
5. Employee or administrator requests necessary corrections.
6. Manager approves, then HR approves.
7. Time administrator resolves remaining exceptions and locks the attendance period.
8. Payroll imports the approved attendance snapshot.

### 10.3 Leave request

1. Employee selects leave type, dates/hours, reason, and evidence.
2. ZylHR checks policy, balance, overlaps, schedule, and holidays.
3. Manager approves, rejects, or returns the request.
4. HR performs final approval, rejection, or return.
5. Approved leave updates the leave ledger and attendance.
6. Payroll consumes the approved paid/unpaid result.

### 10.4 Payroll run

1. Payroll period opens with rule and source versions identified.
2. Approved employee, compensation, benefit, attendance, leave, overtime, and adjustment inputs are snapshotted.
3. Processor calculates payroll.
4. Validation identifies blocking errors and review warnings.
5. Processor resolves issues and reruns affected employees.
6. Processor reviews gross-to-net and variance reports.
7. Independent payroll approver signs off.
8. ZylHR locks the approved version and generates payslips, bank files, government reports, and accounting journals.
9. Authorized teams release outputs and record external reference numbers where applicable.
10. Payroll is posted and closed after reconciliation.

### 10.5 Post-approval correction

1. Authorized user identifies an error and opens a correction case.
2. ZylHR determines whether the affected period is open, approved, released, or closed.
3. The user records reason, evidence, and intended correction.
4. Authorized approver permits a reopening, adjustment, off-cycle result, or next-period recovery according to policy.
5. New versions and outputs are generated without deleting the prior history.

---

## 11. Philippine compliance design

### 11.1 Rule-pack architecture

The Philippine payroll rule pack must separate legislation and agency schedules from general calculation code.

Every rule-pack release must contain:

- Rule name and category
- Official source and document reference
- Publication and effectivity dates
- Applicable employee/entity conditions
- Calculation formula, brackets, rates, floors, ceilings, caps, and rounding
- Superseded version
- Golden test cases and expected results
- Reviewer and approval evidence
- Deployments using the version

The system must support overlapping effective dates where a correction or agency clarification requires controlled selection. No production rule may be activated without review and test evidence.

### 11.2 Philippine areas represented

- Regional/sector minimum-wage configuration
- Hours of work and configured workday rules
- Regular holiday, special day, rest-day, overtime, and night-shift treatment
- Service incentive leave and other applicable statutory monetary benefits
- 13th-month pay
- BIR withholding tax on compensation and year-end adjustment
- BIR compensation certificates, returns, and alphalist outputs
- SSS employee/employer contributions and related administered components
- PhilHealth employee/employer premium shares
- Pag-IBIG employee/employer contributions and applicable loans
- Company, benefit, court-ordered, union, and authorized deductions subject to policy and law
- Final pay, retroactive adjustments, and prior-employer data where applicable

### 11.3 Compliance maintenance

- A designated product owner monitors official DOLE/NWPC, BIR, SSS, PhilHealth, Pag-IBIG, and NPC issuances.
- Statutory updates are released as signed, versioned packages with release notes.
- Clients can test future packages in a non-production environment before effectivity.
- Emergency updates follow controlled expedited review.
- ZylHR must display the rule-pack version on payroll-run evidence and statutory outputs.

---

## 12. Security, privacy, and audit requirements

### 12.1 Privacy

- Support compliance with the Philippine Data Privacy Act and client privacy policies.
- Record data purpose, lawful basis or required notice/consent where applicable, classification, retention, and access owner.
- Apply transparency, legitimate-purpose, and proportionality principles to applicant and employee data.
- Allow authorized handling of data-subject access and correction requests without disclosing confidential third-party or evaluative information improperly.
- Retain records required for contractual, employment, tax, contribution, audit, or legal obligations; do not promise immediate deletion where retention is required.
- Provide configurable anonymization or deletion workflows after retention expires and no legal hold applies.
- Treat government identifiers, compensation, bank data, health/benefit information, biometrics, and certain performance/disciplinary data as sensitive.

### 12.2 Technical security

- Encrypt data in transit and at rest using deployment-approved current standards.
- Store passwords using a modern adaptive password hash.
- Store secrets in the deployment's approved secret manager, never in source code or ordinary configuration exports.
- Require MFA for system administration, payroll approval, unrestricted HR access, and sensitive exports.
- Apply session expiry, device/session revocation, login throttling, and suspicious-login monitoring.
- Scan uploaded files and limit file type and size.
- Protect against common web/mobile/API vulnerabilities and complete independent penetration testing before launch.
- Redact or tokenize sensitive identifiers in ordinary logs and support output masking.
- Encrypt backups and test restoration.

### 12.3 Audit

- Audit records are append-only to application users.
- Audit search supports actor, action, record, employee, module, date, entity, source, and risk level.
- Viewing highly sensitive records and generating exports are themselves auditable.
- Authorized auditors can export a signed or integrity-verifiable evidence package.
- Audit retention is separately configurable and cannot be shorter than applicable legal/client requirements.

---

## 13. Deployment and operations

### 13.1 Isolation model

Each client receives:

- A separate application deployment or isolated workload boundary
- Separate database and object/file storage
- Separate secrets and encryption configuration
- Separate domain and branding
- Separate backup, monitoring, retention, and release records

There must be no shared operational database containing multiple clients' employee or payroll records.

### 13.2 Supported deployment modes

| Mode | ZylHR responsibility | Client responsibility |
|---|---|---|
| Vendor-managed dedicated cloud | Operate application, infrastructure, monitoring, backups, and upgrades under contract | Identity/contact setup, business configuration, user governance, and client-side integrations |
| Client-owned cloud | Provide deployable product, infrastructure specification, upgrade tooling, and support | Cloud account, network, keys, operations responsibility as contracted |
| Client on-premise | Provide supported installation package, offline documentation, health checks, backup/restore tooling, and controlled updates | Servers, network, operating environment, physical security, and approved maintenance windows |

The exact responsibility matrix must be documented per client contract.

### 13.3 Release and upgrade requirements

- Maintain one compatible product line across deployment modes.
- Publish versioned database migrations, rollback/forward-recovery guidance, compatibility notes, and checksums.
- Back up before material upgrades and verify recovery procedures.
- Support staged rollout through development/test, client UAT, and production environments.
- On-premise and client-cloud clients control production maintenance windows.
- Statutory updates must be deployable independently or on an accelerated schedule where technically safe.

### 13.4 Observability

- Health checks for application, database, storage, queue, notification, API, biometric connectors, and scheduled jobs.
- Metrics for response time, errors, queue depth, failed imports, punch lag, payroll-job progress, webhook delivery, storage, and backup status.
- Structured logs with correlation identifiers but without exposed sensitive payroll or identity values.
- Actionable alerts with runbooks and ownership.

---

## 14. Non-functional requirements

### 14.1 Reference scale targets

These proposed targets must be confirmed through client sizing and load testing:

| Area | Reference target |
|---|---|
| Active employees | 10,000 per deployment |
| Historical employee records | 50,000 per deployment |
| Concurrent employee sessions | 2,000 during shift/payday peaks |
| Attendance burst | 10,000 accepted punch events within 10 minutes |
| Payroll | 10,000 employees calculated within 30 minutes, excluding external transfers |
| Standard interactive response | p95 under 2 seconds for ordinary reads and updates under reference load |
| Search/report preview | First useful result under 5 seconds for supported standard reports |
| Availability | Proposed 99.9% monthly for vendor-managed production, excluding agreed maintenance |

### 14.2 Reliability and recovery

- No acknowledged time event, approval, payroll input, or payroll result may be silently lost.
- All retryable imports, jobs, and webhooks must be idempotent.
- Proposed vendor-managed targets: RPO ≤ 1 hour and RTO ≤ 4 hours; client-hosted targets are agreed per deployment.
- Backup restoration must be tested before go-live and at scheduled intervals.
- Partial batch failure must identify successful and failed records without ambiguous duplication.

### 14.3 Accessibility and usability

- Target WCAG 2.2 AA for responsive web and applicable mobile experiences.
- Support keyboard use, visible focus, screen-reader labels, scalable text, adequate contrast, and non-color-only status cues.
- Use plain language and explain HR/payroll terms where employees encounter them.
- Destructive or financially significant actions require clear scope and confirmation.
- Lists for 500+ employees require search, filters, saved views, bulk actions, and pagination or virtualization.

### 14.4 Localization

- First release language: English.
- Philippine locale defaults: PHP, Philippine date/address conventions, and Asia/Manila where appropriate.
- Store all timestamps timezone-safely for clients with employees or systems outside the Philippines.
- Architecture must support future translated labels and country rule packs without embedding text in calculation rules.

---

## 15. Data migration and implementation

### 15.1 Migration scope

- Organization structure
- Employees and employment history
- Compensation and payroll groups
- Government and bank identifiers
- Contracts and selected documents
- Schedules and holiday calendars
- Opening leave balances with ledger source
- Benefit enrollments
- Outstanding loans/deductions
- Year-to-date payroll, tax, and contribution balances
- Prior payslips where included by contract
- Biometric identity mappings

### 15.2 Migration controls

- Use client-approved templates and data dictionaries.
- Validate required fields, identifiers, dates, duplicates, relationships, and totals before import.
- Run dry migrations and provide row-level error files.
- Reconcile record counts, compensation totals, leave balances, loan balances, and year-to-date payroll totals.
- HR and payroll owners sign off migrated data before production cutover.
- Preserve source-file checksum, import version, mapping, operator, date, and reconciliation evidence.

### 15.3 Payroll implementation controls

- Configure policies and rule versions in a non-production environment.
- Validate representative employee cases, including edge cases.
- Conduct at least two complete parallel payroll cycles against the client's incumbent process.
- Investigate and sign off every difference; do not accept unexplained net-pay variances.
- Complete bank, accounting, and government-output acceptance tests before live payroll.

---

## 16. Notifications and work queues

### 16.1 Notification events

- Account activation and security events
- Missing/expiring documents or contracts
- Published or changed schedules
- Missed punch and attendance exception
- Request submitted, returned, approved, rejected, cancelled, or escalated
- Approver task and aging reminder
- Benefit enrollment event
- Performance task and deadline
- Payroll validation issue assigned to an owner
- Payslip or tax document published
- Integration or device failure for administrators

### 16.2 Notification rules

- Notifications must not expose full salary, bank, government-ID, medical, or disciplinary information on a lock screen or email subject.
- Every actionable notification opens the exact authorized task.
- Users can configure non-critical channels; security and required workflow notices cannot be disabled entirely.
- Duplicate notifications from retried jobs must be suppressed.

### 16.3 Work queues

Each responsible role receives prioritized queues for:

- Approvals
- Attendance exceptions
- Employee data changes
- Missing documents
- Contract expirations
- Recruitment tasks
- Benefit exceptions
- Performance tasks
- Payroll blockers/warnings
- Failed integrations and output batches

Queues must show owner, due date, age, status, relevant organization scope, and next action.

---

## 17. Reporting catalogue

### 17.1 Organization and people

- Headcount and full-time-equivalent summary
- Headcount by entity, branch, department, position, employment type, and payroll group
- Hires, transfers, promotions, regularizations, separations, and turnover
- Contract and probation status
- Missing/expiring documents
- Data-quality exceptions

### 17.2 Recruitment

- Open requisitions and aging
- Applicant pipeline and conversion
- Time-to-fill and time-to-hire
- Candidate source
- Offer acceptance
- Hiring by organization and employment type

### 17.3 Time, leave, and overtime

- Daily attendance and exceptions
- Late, undertime, absence, and missing punch
- Overtime requested, rendered, approved, and paid
- Schedule coverage
- Leave balances, usage, liability, expiry, and pending requests
- Device/import reconciliation

### 17.4 Benefits and performance

- Benefit eligibility, enrollment, employee deductions, and employer cost
- Performance-cycle completion and overdue tasks
- Rating distribution and goal progress with access controls

### 17.5 Payroll

- Payroll register and summary
- Gross-to-net by employee and organizational dimensions
- Payroll variance
- Earnings and deduction detail
- Employer-cost and liability summary
- Bank control totals
- Accounting journal reconciliation
- BIR, SSS, PhilHealth, and Pag-IBIG supporting reports
- Year-to-date compensation, tax, and contribution summaries
- 13th-month and final-pay calculation support

### 17.6 Security and audit

- Role and permission assignments
- Privileged access
- Sensitive-record views and exports
- Configuration changes
- Approval history
- Payroll reopenings and adjustments
- Failed and suspicious login events

---

## 18. Product analytics and success measures

Product analytics must use minimized, non-payroll-sensitive event data and respect deployment/privacy policies.

### 18.1 Operational metrics

- Percentage of employees with complete required records
- Attendance events synchronized within target time
- Attendance exception rate and median resolution time
- Leave/overtime approval turnaround time
- Payroll blockers per 1,000 employees
- Payroll adjustments after approval
- Payroll completed on or before scheduled release
- Bank/accounting/government output reconciliation success
- Employee self-service adoption
- Payslip publication/view success
- Failed integration rate

### 18.2 Initial success targets

Targets are established during client discovery. Recommended launch objectives:

- 100% of active employees assigned to a valid entity, manager, schedule, and payroll group before payroll.
- 100% of approved payrolls have complete sign-off and reconciliation evidence.
- Zero unexplained net-pay differences during final parallel run.
- Zero critical authorization or cross-deployment data-isolation defects.
- At least 95% of ordinary employee requests completed without offline HR re-entry after stabilization.

---

## 19. Release acceptance and go-live gates

The first sellable release is ready only when all applicable gates pass.

### 19.1 Functional gate

- All first-release modules meet approved acceptance tests.
- All critical end-to-end workflows pass on web and relevant mobile/kiosk surfaces.
- Permission tests cover all standard roles and scopes.
- Required standard reports reconcile with source transactions.

### 19.2 Payroll/compliance gate

- Philippine rule pack reviewed and approved by qualified specialists.
- Golden calculation tests cover ordinary and edge cases.
- Two complete client parallel payrolls reconcile with all differences explained and approved.
- Payslip, bank, accounting, BIR, SSS, PhilHealth, and Pag-IBIG outputs pass client acceptance.
- Statutory rule and output versions appear in audit evidence.

### 19.3 Security/privacy gate

- Threat model and privacy impact assessment completed.
- Independent penetration test has no unresolved critical/high findings.
- Role, field, export, API, and audit controls pass authorization tests.
- Retention, access-request, incident, and breach-response procedures are documented.

### 19.4 Operational gate

- Reference load tests pass or client-specific capacity is approved.
- Backup and full restoration test succeeds.
- Monitoring, alerting, and runbooks are operational.
- Upgrade and rollback/forward-recovery rehearsal succeeds.
- Support ownership, escalation, maintenance window, and deployment responsibility matrix are signed off.

### 19.5 Migration gate

- Production migration reconciliation is approved by HR and payroll owners.
- Year-to-date payroll, leave, loan, and statutory balances match accepted source totals.
- Client UAT and cutover checklist are signed.

---

## 20. Delivery milestones

These are scope milestones, not calendar estimates.

### Milestone 0 — Product foundation

- Dedicated deployment baseline
- Authentication, MFA, RBAC, audit, branding, configuration, imports, notifications
- Security/privacy foundation and automated delivery pipeline

### Milestone 1 — Organization and recruitment

- Multi-entity organization model
- Branches, departments, positions, cost centers, reporting lines
- Requisitions, applicants, interviews, offers, conversion

### Milestone 2 — Core HR, documents, and benefits

- Employee record and employment history
- Contracts, documents, self-service data changes
- Benefit plans, enrollments, and payroll deductions

### Milestone 3 — Scheduling, attendance, leave, and approvals

- All required schedule types
- Web/mobile/kiosk/biometric attendance
- Exceptions and attendance locking
- Leave, overtime, corrections, Manager → HR approval

### Milestone 4 — Performance and enterprise reporting

- Performance cycles, goals, reviews, acknowledgement
- Cross-module dashboards, reports, exports, and audit reporting

### Milestone 5 — Philippine payroll

- Payroll groups, calculations, statutory rules, controls, payslips
- BIR/SSS/PhilHealth/Pag-IBIG outputs
- Bank and accounting outputs
- Payroll API/webhook events

### Milestone 6 — Certification and general release

- Scale, security, privacy, deployment, migration, backup, and recovery validation
- Client integrations and file-format acceptance
- Parallel payroll and UAT
- Production documentation, training, support, and go-live

---

## 21. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Philippine rules or file formats change | Incorrect payroll or rejected filing | Versioned rule/output adapters, official-source monitoring, future-effective testing, emergency release process |
| Attendance devices provide poor or inconsistent data | Incorrect payable time | Preserve raw events, reconcile imports, idempotency, device monitoring, exception queues |
| Client policies conflict or are poorly documented | Delays and calculation disputes | Policy discovery workbook, approved configuration, golden cases, explicit precedence rules |
| Separate deployment modes drift | Support and upgrade failures | One product line, automated conformance tests, supported-environment matrix, release manifests |
| Overbroad HR access | Privacy breach | Scoped RBAC, field permissions, MFA, export controls, view audit, periodic access review |
| Payroll scope overwhelms first release | Delayed launch and quality risk | Dependency-based milestones, strict non-goals, parallel payroll gates, no unsupported custom formulas without review |
| Client data is incomplete | Bad attendance/payroll results | Migration validation, readiness dashboards, blocking pre-payroll checks, signed reconciliation |
| Bank/accounting/government formats vary | Output rejection | Versioned profiles, sample certification, control totals, client acceptance per integration |
| Manager approval becomes a bottleneck | Delayed requests and payroll | Delegation, reminders, escalation queues, aging reports, HR-controlled exception process |

---

## 22. Open decisions before implementation

These items do not block the master specification but must be resolved before detailed design or client commitment:

1. Supported cloud providers, operating systems, databases, and on-premise environment matrix.
2. Contracted support hours, availability, RTO, RPO, backup retention, and disaster-recovery model per deployment type.
3. Maximum certified employee volume beyond the 10,000-employee reference target.
4. First supported biometric manufacturers, models, protocols, and file formats.
5. First supported banks and their payroll file specifications.
6. First supported accounting systems and journal schemas.
7. Exact government electronic-file formats and form versions at implementation time.
8. Client-configurable rule boundaries versus changes requiring a certified payroll rule release.
9. Final data-retention schedule by record class.
10. Whether native SSO, advanced configurable approvals, onboarding/offboarding checklists, training, and e-signature enter the next release.
11. Whether the mobile application is distributed as ZylHR-branded with client theme or as separately packaged client-branded builds.
12. Commercial licensing, environment limits, update entitlement, and support responsibility.

---

## 23. Glossary

| Term | Meaning in ZylHR |
|---|---|
| Attendance event | An original clock/punch record received from a source |
| Attendance result | Interpreted work time and exceptions produced from events, schedule, and policy |
| Effective-dated | A record whose validity starts and optionally ends on defined dates |
| Employee | A worker with an employment relationship represented in ZylHR; exact legal classification remains client-controlled |
| Legal entity | A registered employer responsible for employment and payroll obligations |
| Payroll group | Employees processed together under one pay frequency/calendar and rule configuration |
| Payroll rule pack | Versioned set of statutory calculations, tables, thresholds, and tests |
| Raw event | Unmodified source record retained for evidence and reprocessing |
| Reopening | Controlled creation of a new editable version after prior approval/lock |
| Source snapshot | Identified set of approved upstream records consumed by a payroll run |
| Worker arrangement | Regular, probationary, contractual, project-based, or part-time classification configured for an employment |

---

## 24. Official reference baseline

The sources below are the initial official baseline reviewed for this specification. Implementation must verify the latest issuances and exact effective dates again before configuring production rules.

- [DOLE Bureau of Working Conditions — Workers' Statutory Monetary Benefits Handbook, 2024 Edition](https://bwc.dole.gov.ph/wp-content/uploads/2024/10/Workers-Statutory-Monetary-Benefits-Handbook-2024-Edition.pdf)
- [DOLE — Labor Code of the Philippines](https://dole.gov.ph/labor-code-of-the-philippines-2/)
- [BIR — Withholding Tax on Compensation](https://www.bir.gov.ph/WithHoldingTax)
- [BIR — Forms, including 1601-C and 1604-C](https://www.bir.gov.ph/bir-forms)
- [BIR — Form 2316](https://bir-cdn.bir.gov.ph/local/pdf/2316%20Sep%202021%20ENCS_Final_corrected.pdf)
- [BIR — Alphalist Data Entry and Validation Module](https://www.bir.gov.ph/Downloadables)
- [SSS — Contribution Table](https://www.sss.gov.ph/sss-contribution-table/)
- [SSS — 2025 Employer and Employee Contribution Schedule](https://www.sss.gov.ph/wp-content/uploads/2024/12/2025-SSS-Contribution-Table-rev.pdf)
- [PhilHealth — Formal Economy Registration and Premium Sharing](https://www.philhealth.gov.ph/members/formal/registration.php)
- [PhilHealth — Employer Payment and Reporting Procedures](https://www.philhealth.gov.ph/partners/employers/pay_procedures.php)
- [Pag-IBIG Fund — Official website and employer resources](https://www.pagibigfund.gov.ph/)
- [National Privacy Commission — Data Privacy Act of 2012](https://privacy.gov.ph/data-privacy-act/)
- [National Privacy Commission — Implementing Rules and Regulations](https://privacy.gov.ph/implementing-rules-regulations-data-privacy-act-2012/)
- [National Privacy Commission — Advisory Opinion on Employee Access to Employment Records](https://privacy.gov.ph/wp-content/uploads/2022/01/AONo_2018-042.pdf)

---

## 25. Product-spec approval

| Reviewer | Responsibility | Status | Date |
|---|---|---|---|
| Product owner | Scope and business direction | Pending | — |
| HR domain reviewer | Core HR, recruitment, benefits, performance, and workflows | Pending | — |
| Philippine payroll specialist | Payroll rules, calculations, forms, and outputs | Pending | — |
| Labor/tax reviewer | Statutory interpretation | Pending | — |
| Privacy/Data Protection Officer | Privacy, retention, rights, and sensitive-data handling | Pending | — |
| Security reviewer | Architecture and security controls | Pending | — |
| Engineering lead | Feasibility, sequence, performance, and operations | Pending | — |
| QA lead | Testability, acceptance criteria, and release gates | Pending | — |
