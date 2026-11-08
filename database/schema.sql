CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    department VARCHAR,
    email VARCHAR NOT NULL UNIQUE,
    phone VARCHAR,
    hire_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS attendance (
    attendance_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(employee_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR CHECK (status IN ('Present', 'Absent', 'Late'))
);

CREATE TABLE IF NOT EXISTS payroll (
    payroll_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(employee_id) ON DELETE CASCADE,
    base_salary NUMERIC NOT NULL,
    bonus NUMERIC DEFAULT 0,
    deductions NUMERIC DEFAULT 0,
    pay_date DATE DEFAULT CURRENT_DATE
);