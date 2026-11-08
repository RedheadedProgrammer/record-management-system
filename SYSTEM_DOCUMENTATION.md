# Record Management System
## System Overview, User Guide, and Software Development Life Cycle

**Document purpose:** This guide explains what the application does, how to install and use it, how its main parts fit together, and how a development team can take it through a complete software development life cycle (SDLC). It is written for end users, students, maintainers, and project reviewers.

**Project status:** The current application is a local, browser-based record-management system. It includes account registration and sign-in, employee records, attendance records, and payroll record entry and viewing. It is a useful working foundation, but should not be treated as a complete production HR or payroll platform without the additional security, testing, operational, and policy work described below.

---

## 1. What the Application Does

The system provides one web interface for organizing three kinds of workplace information:

- **Employees:** Maintain names, department, email address, and phone number. Employee rows can be added, edited, or deleted. Email addresses are unique in the database.
- **Attendance:** Record an employee, a work date, and an attendance status. The current database accepts exactly `Present`, `Absent`, or `Late` for status. The page lists attendance records and allows adding a record.
- **Payroll records:** Record an employee, base salary, bonus, deductions, and pay date. The page lists records and allows adding a record.
- **Accounts and access:** Users can create an account and sign in. The application issues a signed JSON Web Token (JWT) after successful login and requires it for employee, attendance, and payroll API requests.

The system records payroll values; it does **not** calculate wages, taxes, overtime, benefits, payslips, or bank transfers. It also does not currently include attendance or payroll edit/delete controls in the user interface, even though corresponding backend routes exist.

### Intended users

- A small organization or team that needs a straightforward place to manage staff records.
- A developer or student learning how a React interface, an Express API, PostgreSQL, and authentication work together.

### Main benefits

- A shared interface instead of separate ad hoc lists.
- Structured records that can be searched or extended by future development.
- Basic account-based access to the record APIs.
- Related attendance and payroll records refer to employees by employee ID.

---

## 2. Application at a Glance

The project has two applications and a database:

| Part | Technology | Responsibility |
|---|---|---|
| Web client | React, Create React App, Bootstrap, Axios | Login/signup, navigation, forms, tables, user feedback |
| API server | Node.js, Express, JWT, bcryptjs | Authentication, validation, database requests, JSON responses |
| Database | PostgreSQL | Persistent account, employee, attendance, and payroll data |

### Request flow

1. A person opens the React client in a browser.
2. The browser sends an HTTP request to the Express API.
3. The API validates account credentials or checks the JWT for a protected data request.
4. The API uses parameterized SQL through the PostgreSQL client to read or write data.
5. PostgreSQL returns rows; the API returns JSON; React updates the displayed screen.

The development client is configured to use `http://localhost:5000` for API calls. The API enables CORS for the client origin `http://localhost:3000`.

---

## 3. User Guide

### 3.1 Start the application

Prerequisites:

- Node.js and npm installed.
- PostgreSQL installed and running.
- A PostgreSQL database named `record_management` with the tables described in Section 5.
- Project dependencies installed in both the root project and the client folder.

The current database connection values are in `db.js`. They are configured for a local PostgreSQL server, database `record_management`, user `postgres`, port `5432`, and a password currently set in the source file. Make sure these values match your local database before starting. Do not use a committed source-code password in a shared or production environment.

Install dependencies from the project root and client folder if this is a fresh checkout:

```sh
npm install
npm --prefix record-management-client install
```

Open **two terminals** from the project root. Start the API in the first terminal:

```sh
npm start
```

Start the React client in the second terminal:

```sh
npm --prefix record-management-client start
```

Open `http://localhost:3000`. Keep both terminal processes running while using the application. The API listens on port `5000`.

> If the client reports that port 3000 is already in use, another development server may already be running. Use that running client rather than starting duplicate servers, or stop it before starting a new one.

### 3.2 Create an account

1. On the welcome page, choose **Create an account**.
2. Enter a username (3–64 characters) and password (at least 8 characters).
3. Re-enter the password in the confirmation field.
4. Choose **Create account**.
5. On success, the app returns to sign-in and displays a confirmation. Use the new credentials to sign in.

Usernames must be unique. If the name is already registered, choose another. Passwords are hashed by the backend with bcrypt before storage; the original password is not stored as plain text by this implementation.

### 3.3 Sign in and sign out

1. Enter the username and password used at registration.
2. Choose **Sign in**. The page shows progress while the server checks the credentials.
3. On success, the app saves the JWT in browser local storage and opens the management dashboard.
4. Choose **Sign out** in the dashboard header to remove the saved token and return to login.

The token expires after one hour. When an API request detects an invalid or expired token, the client clears it and returns to the sign-in page. The application currently does not provide password recovery or multi-factor authentication.

### 3.4 Navigate the dashboard

Use the **Employees**, **Attendance**, and **Payroll** tabs to switch sections. Each tab displays the selected section; the section tables are responsive on narrower screens.

### 3.5 Manage employees

The Employees section shows a table with name, department, email, phone, and row actions.

**Add an employee**

1. Enter first name, last name, department, email, and phone in the form.
2. Choose **Add Employee**.
3. On success, the new row is added to the table and the form is cleared.

All five form fields are required by the current user interface. The database requires first name, last name, and email; email must be unique.

**Edit an employee**

1. Choose **Edit** on that employee's row.
2. Update the form values.
3. Choose **Save Changes**. Choose **Cancel** to abandon editing.

**Delete an employee**

Choose **Delete** on the row. Employee deletion has a database-level cascade to that employee's attendance and payroll rows in the current database. Treat this as a destructive action: related history may be removed too. A production design should add a clear confirmation and consider retaining historical records instead.

### 3.6 Record attendance

1. Open **Attendance**.
2. Select an employee from the employee dropdown. The dropdown is loaded from the employee list.
3. Choose a date.
4. Enter a status that matches one of the current database values: `Present`, `Absent`, or `Late` (including capitalization).
5. Choose **Add Attendance**.

Successful entries appear in the attendance table. An employee must already exist. Invalid status text, a missing employee, or a database/API issue will cause an error message.

### 3.7 Record payroll

1. Open **Payroll**.
2. Enter the employee ID for an existing employee.
3. Enter base salary, bonus, deductions, and pay date.
4. Choose **Add Payroll**.

The database requires base salary; bonus and deductions default to zero if omitted by an API caller. The current form requires all fields and accepts numeric amounts. Currency and payroll calculations are not configured, so the organization must define units, tax rules, rounding, and review procedures before using these records operationally.

### 3.8 Understand messages

- A loading message means the browser is waiting for the API.
- An empty-state message means the API returned no records for the selected section.
- A red error message means the API, authentication, or database rejected the operation. Check that the API is running, credentials are correct, and input matches the database requirements.

---

## 4. Functional Scope and Current Limits

| Area | Currently available | Not currently provided by the UI / project |
|---|---|---|
| Authentication | Register, sign in, sign out, one-hour JWT, protected record APIs | Password reset, email verification, MFA, refresh-token workflow, roles/permissions, account administration |
| Employees | List, add, edit, delete | Search, pagination, export, profile photos, archival/restore, employee-level access control |
| Attendance | List and add with employee, date, status | Edit/delete controls, calendars/reports, absence policy, time clock, hours worked |
| Payroll | List and add base salary, bonus, deductions, pay date | Edit/delete controls, payroll calculation, taxes, deductions policy, payslips, approvals, payment execution |
| Operations | Local development commands and React production build | Production deployment configuration, backups/restore automation, monitoring, audit log, formal migration framework |

This distinction matters: an API route existing does not necessarily mean a matching button or workflow is available in the web interface.

---

## 5. Data Model

The current PostgreSQL database was inspected and contains these tables and constraints. A fresh installation should create equivalent structures; this repository currently does not include a versioned schema migration file.

### `users`

| Column | Type | Rules / use |
|---|---|---|
| `user_id` | integer | Primary key, generated sequence value |
| `username` | varchar | Required and unique |
| `password` | varchar | Required; stores the bcrypt password hash |

### `employees`

| Column | Type | Rules / use |
|---|---|---|
| `employee_id` | integer | Primary key, generated sequence value |
| `first_name` | varchar | Required |
| `last_name` | varchar | Required |
| `department` | varchar | Optional in database |
| `email` | varchar | Required and unique |
| `phone` | varchar | Optional in database |
| `hire_date` | date | Optional; defaults to current date |

### `attendance`

| Column | Type | Rules / use |
|---|---|---|
| `attendance_id` | integer | Primary key, generated sequence value |
| `employee_id` | integer | Foreign key to employee; database currently allows null; delete of parent cascades |
| `date` | date | Required |
| `status` | varchar | Current check constraint allows only `Present`, `Absent`, or `Late` |

### `payroll`

| Column | Type | Rules / use |
|---|---|---|
| `payroll_id` | integer | Primary key, generated sequence value |
| `employee_id` | integer | Foreign key to employee; database currently allows null; delete of parent cascades |
| `base_salary` | numeric | Required |
| `bonus` | numeric | Optional; defaults to zero |
| `deductions` | numeric | Optional; defaults to zero |
| `pay_date` | date | Optional; defaults to current date |

### Relationships

- One employee may be associated with many attendance records.
- One employee may be associated with many payroll records.
- Employee foreign keys currently use `ON DELETE CASCADE`; deleting an employee removes associated rows.
- User accounts currently have no role field or relationship to specific employee records. Any signed-in account can access the shared records.

### Fresh database setup (example)

The following SQL represents the observed schema's essential shape. Run it only on a new/empty database. Do not run it over an existing database without first checking, backing up, and adapting it. For production, use tracked migrations rather than manually reapplying SQL.

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    department VARCHAR,
    email VARCHAR NOT NULL UNIQUE,
    phone VARCHAR,
    hire_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(employee_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR CHECK (status IN ('Present', 'Absent', 'Late'))
);

CREATE TABLE payroll (
    payroll_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(employee_id) ON DELETE CASCADE,
    base_salary NUMERIC NOT NULL,
    bonus NUMERIC DEFAULT 0,
    deductions NUMERIC DEFAULT 0,
    pay_date DATE DEFAULT CURRENT_DATE
);
```

The example schema captures important existing constraints but is not a substitute for reviewing the live database before a migration. A future schema should consider making employee foreign keys non-null, adding non-negative amount checks, documenting currency, and defining data-retention behavior.

---

## 6. API Reference

All endpoints are served from `http://localhost:5000`. Requests and responses use JSON where applicable. The client API helper attaches the saved token to protected requests as `Authorization: Bearer <token>`.

| Method | Path | Auth required? | Purpose |
|---|---|---:|---|
| `POST` | `/auth/register` | No | Create a user account from `username` and `password` |
| `POST` | `/auth/login` | No | Verify credentials and return JWT/user information |
| `GET` | `/employees` | Yes | List employees |
| `POST` | `/employees` | Yes | Add employee (`first_name`, `last_name`, `department`, `email`, `phone`) |
| `PUT` | `/employees/:id` | Yes | Replace employee fields for an ID |
| `DELETE` | `/employees/:id` | Yes | Delete employee by ID (related rows cascade) |
| `GET` | `/attendance` | Yes | List attendance rows |
| `POST` | `/attendance` | Yes | Add (`employee_id`, `date`, `status`) |
| `PUT` | `/attendance/:id` | Yes | Update attendance row (API route available; no client UI yet) |
| `DELETE` | `/attendance/:id` | Yes | Delete attendance row (API route available; no client UI yet) |
| `GET` | `/payroll` | Yes | List payroll rows |
| `POST` | `/payroll` | Yes | Add (`employee_id`, `base_salary`, `bonus`, `deductions`, `pay_date`) |
| `PUT` | `/payroll/:id` | Yes | Update payroll row (API route available; no client UI yet) |
| `DELETE` | `/payroll/:id` | Yes | Delete payroll row (API route available; no client UI yet) |

Authentication errors typically return HTTP `401`. Signup input errors return `400`, and duplicate usernames return `409`. Data routes currently return a server error if PostgreSQL rejects an insert/update. The exact response behavior is implemented by the route files and may be refined as validation and API conventions mature.

---

## 7. System Development Life Cycle (SDLC)

An SDLC is the repeatable process used to turn a need into dependable software and maintain it after release. The phases below describe a complete lifecycle suitable for this system. The project already implements parts of these phases; recommendations are identified as future work rather than existing features.

### Phase 1 — Initiation and planning

**Purpose:** Decide why the system is needed, who will use it, what success means, and whether the work is feasible.

**Activities:**

- Identify the problem: employee, attendance, and payroll details are difficult to keep consistent when scattered across documents.
- Identify stakeholders: administrators, HR staff, payroll staff, employees (if access is later added), developers, and database operators.
- Define project goals, boundaries, schedule, risks, responsibilities, and cost.
- Assess technical feasibility (browser client, API, PostgreSQL), operational feasibility (who will maintain it), legal/privacy requirements, and financial feasibility.
- Decide what information is sensitive and who is allowed to view or change it.

**Useful deliverables:** Project charter, stakeholder list, scope statement, initial risk register, schedule, success criteria.

**Project-specific success examples:** A permitted user can sign in; valid employee records persist; attendance and payroll entries are linked to existing employees; invalid requests are rejected; data survives a restart.

### Phase 2 — Requirements elicitation and analysis

**Purpose:** Convert user needs into explicit, testable behavior.

**Activities:**

- Interview users and observe current processes.
- Specify functional requirements such as account creation, employee CRUD, attendance entry, payroll record entry, and record listing.
- Specify non-functional requirements such as response time, accessibility, reliability, supported browsers, privacy, backup objectives, and security controls.
- Define roles, permissions, field formats, validation, error behavior, data retention, and reporting needs.
- Prioritize requirements into a minimum viable product and later releases.

**Current implemented examples:** Registration username length 3–64; password minimum 8; employee first/last name and email are required in the database; email is unique; attendance status is constrained; data APIs require a valid JWT.

**Useful deliverables:** Requirements specification, user stories, acceptance criteria, data dictionary, privacy and threat assessment.

### Phase 3 — System and UX design

**Purpose:** Decide how users accomplish tasks and how software components work together before adding more features.

**Activities:**

- Design page flows, navigation, responsive layouts, accessible forms and table headings.
- Design API contracts, request validation, authentication, authorization, error responses, and logging.
- Design the relational model, constraints, indexes, deletion/retention behavior, and migration approach.
- Review wireframes with representative users and refine them before coding.

**Current design:** React + Bootstrap UI; tabs for the three record areas; an Express JSON API; PostgreSQL; bcrypt password hashing; JWT bearer authentication.

**Useful deliverables:** Wireframes, component/API diagrams, API specification, schema diagram, security architecture, test plan.

### Phase 4 — Implementation and configuration

**Purpose:** Build the planned behavior in small, reviewable changes.

**Activities:**

- Implement React components, API endpoints, database queries, and validation.
- Use parameterized SQL for values to reduce SQL injection risk.
- Keep secrets and environment-specific settings outside version control.
- Use migrations to record schema changes; separate development, test, and production configuration.
- Review code, document decisions, and keep dependency versions controlled.

**Current project structure:** `record-management-client/src` contains the React interface; `server.js` and `routes/` contain the API; `db.js` contains the PostgreSQL pool configuration; `authConfig.js` reads JWT secret configuration.

**Useful deliverables:** Reviewed source changes, migration scripts, configuration templates without secrets, implementation notes.

### Phase 5 — Verification and testing

**Purpose:** Demonstrate that the system meets requirements and fails safely when it should.

**Test levels:**

1. **Unit tests:** Validate individual form rules, utility functions, and components.
2. **Integration tests:** Verify endpoint behavior with a test database, including constraints and JWT requirements.
3. **End-to-end tests:** Exercise registration, sign-in, navigation, employee editing, attendance entry, payroll entry, and sign-out in a browser.
4. **Security tests:** Try missing, expired, malformed, and unauthorized tokens; test duplicate usernames, SQL injection inputs, brute-force controls, and access boundaries.
5. **Usability/accessibility tests:** Keyboard navigation, screen reader labels, contrast, mobile layout, understandable errors.
6. **Regression tests:** Rerun previously passing tests after each change.
7. **Performance/reliability tests:** Test realistic record counts, database outages, restart/recovery, and backups.

**Current verification available:** `npm --prefix record-management-client run build` creates the React production bundle. The client test file includes tests for the initial login screen and password-mismatch validation. These tests do not replace integration or end-to-end coverage.

**Useful deliverables:** Test cases, test data, automated test results, defect log, release sign-off.

### Phase 6 — Release and deployment

**Purpose:** Make a tested version available to its intended users without losing data or exposing secrets.

**Activities:**

- Review the release checklist, test results, schema migration, rollback plan, and backup status.
- Set production database credentials and a strong random `JWT_SECRET` in a secure environment/secret manager.
- Configure HTTPS, production CORS origins, production API URL, secure hosting, and database network restrictions.
- Build the client and deploy the API and static client using a documented process.
- Apply migrations in a controlled way and verify health checks, login, access control, and representative records.
- Have a rollback plan for both code and schema.

**Current setup is development-oriented:** client and API use localhost addresses; database settings are embedded in `db.js`; JWT has a local-development fallback secret. Do not expose this configuration to the public internet as-is. The root `npm start` runs the API; the client has separate start/build scripts.

**Useful deliverables:** Versioned release, deployment instructions, migration/rollback plan, release notes, operations handover.

### Phase 7 — Operation and maintenance

**Purpose:** Keep the service secure, available, accurate, and useful after release.

**Activities:**

- Monitor errors, response times, database health, and authentication anomalies.
- Back up the database on a schedule and regularly test restoration.
- Apply security fixes and dependency updates after review/testing.
- Review access, retire accounts, rotate secrets, and document incidents.
- Collect user feedback and fix defects; maintain requirements and tests.
- Audit changes to sensitive employee and payroll records when that capability is added.

**Useful deliverables:** Monitoring dashboard, backup/restore records, incident runbooks, patch logs, user support process, maintenance releases.

### Phase 8 — Evaluation and continuous improvement

**Purpose:** Measure whether the system achieves its goals and choose improvements based on evidence.

**Activities:**

- Compare actual outcomes with the success criteria from planning.
- Review user feedback, usability problems, errors, performance, and security findings.
- Prioritize work such as search, pagination, import/export, reports, payroll calculations, audit history, or role-based permissions.
- Reassess risks and legal/privacy obligations when features or data usage changes.

### Phase 9 — Retirement or replacement

**Purpose:** Close the system responsibly if it is no longer needed or is replaced.

**Activities:**

- Decide the lawful retention period and export/transfer records to the replacement system.
- Verify exports and preserve required audit/evidence records.
- Revoke accounts, tokens, and secrets; stop services; remove network access.
- Archive or securely destroy personal/payroll data according to policy and law.
- Document the retirement and confirm the new system is operating correctly.

---

## 8. Testing and Maintenance Commands

Run commands from the project root unless a step says otherwise.

```sh
# Build the React client for production
npm --prefix record-management-client run build

# Run React tests once (non-watch mode)
npm --prefix record-management-client test -- --watchAll=false

# Start backend API
npm start

# Start frontend in a separate terminal
npm --prefix record-management-client start
```

For a code change, a practical minimum is to run relevant client tests, build the client, verify API behavior against a non-production database, and inspect the browser console/server logs. Avoid running destructive tests against real employee or payroll data.

---

## 9. Security, Privacy, and Data Handling

This system contains personally identifiable information and potentially sensitive compensation records. Treat the database and backups as confidential.

### Current safeguards

- Passwords are hashed with bcrypt before being stored.
- Data API routes check a signed JWT.
- SQL values are passed as query parameters in the database routes.
- Signup rejects short usernames/passwords and duplicate usernames.
- JWT expiration is set to one hour.

### Current risks and recommended work before production

- **JWT secret:** Set a long, random `JWT_SECRET`; do not rely on the development fallback in production. Rotate it using a planned process.
- **Database credentials:** `db.js` currently contains a local password in source. Move host, database, user, password, and port to validated environment configuration; revoke/rotate exposed credentials; never commit real secrets.
- **Browser token storage:** The token is stored in `localStorage`, which can be read by injected scripts. For higher assurance, consider secure, HttpOnly, SameSite cookies and robust CSRF protections, plus a strong Content Security Policy.
- **Authorization granularity:** Any authenticated account currently has access to shared employee, attendance, and payroll data. Add roles and least-privilege authorization before multiple user groups or production use.
- **Registration:** Signup is publicly available and creates a general account; there is no invitation, email verification, approval, rate limit, or account lockout.
- **Sensitive data exposure:** API error handling and logging should be reviewed to ensure secrets, hashes, and personal data are never exposed in responses or logs.
- **Transport security:** Use HTTPS outside localhost.
- **Deletion:** Employee delete cascades into related attendance/payroll history. Add confirmation, authorization, audit logging, and a retention/archive policy.
- **Payroll correctness:** Define currency and business/tax rules; do not treat the current data-entry screen as a payroll calculation or payment system.
- **Privacy/compliance:** Define lawful purposes, access controls, retention, user notice, incident response, and jurisdiction-specific compliance with qualified advisors.
- **Operational resilience:** Add tested backups, monitoring, dependency scanning, vulnerability response, and restore drills.

---

## 10. Troubleshooting

| Symptom | Likely cause | What to check |
|---|---|---|
| Browser cannot reach the page | React client is not running or port differs | Start the client and use the URL printed in its terminal |
| “Unable to sign in” / request error | API stopped, database unavailable, wrong API origin | Check API terminal, port 5000, PostgreSQL status, and `db.js` settings |
| Signup reports duplicate username | A user already owns that username | Choose a different username |
| Sign-in returns invalid username/password | Credentials do not match an account | Check spelling/case and create an account if needed |
| Dashboard data returns unauthorized | Token missing/expired or server/client secrets differ | Sign in again; restart API after configuration changes; ensure both processes use the same `JWT_SECRET` |
| Employee cannot be saved | Required field missing or email already exists | Provide first and last name and a unique valid email; inspect API error and server logs |
| Attendance insert is rejected | Employee ID is not valid or status is not allowed | Choose an existing employee and use exactly `Present`, `Absent`, or `Late` |
| Payroll insert is rejected | Employee ID is invalid or base salary is missing/not numeric | Use an existing employee and enter a valid base salary and date |
| Existing data appears to vanish after deleting employee | Cascading delete removed that employee's related rows | Restore from a backup if appropriate; consider archive/soft-delete behavior before further use |
| Port already in use | Another server process is already listening | Reuse the existing process or stop it before starting another instance |

---

## 11. Glossary

- **API:** The backend interface the browser uses to request and change data.
- **CRUD:** Create, Read, Update, Delete—the common set of record operations.
- **CORS:** Browser rule that controls which web origins can call an API.
- **Foreign key:** A database rule that makes a child row refer to a valid parent row, such as attendance referring to an employee.
- **JWT:** A signed token used by this system to identify a successfully authenticated session to protected API routes.
- **Migration:** A versioned, repeatable database schema change.
- **PostgreSQL:** The relational database storing application records.
- **React:** The JavaScript library used to build the interactive browser interface.
- **SDLC:** Software Development Life Cycle—the planned steps for specifying, building, testing, releasing, operating, and eventually retiring software.

---

## 12. Suggested Future Roadmap

A sensible staged roadmap would be:

1. Move database configuration to environment variables and remove all source-code credentials.
2. Add a schema migration tool and reproducible database setup scripts.
3. Add role-based access controls, registration policy, rate limiting, and account recovery.
4. Add confirmation and audit trails for employee and financial data changes; consider soft-delete/archive instead of cascade deletion.
5. Add employee dropdowns and consistent validation to payroll; use controlled status options for attendance.
6. Add edit/delete workflows for attendance and payroll, with appropriate permissions and history.
7. Add search, pagination, filtering, export, and summary reporting.
8. Define payroll currency and rules, then implement calculation and approval workflows only after domain requirements are signed off.
9. Expand automated tests to include API integration, authorization, database constraints, and browser end-to-end paths.
10. Add production deployment, HTTPS, monitoring, backups, recovery tests, and a documented incident response plan.

---

**End of document.**
