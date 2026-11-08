import React, { useEffect, useState } from 'react';
import Employees from './components/employees.js';
import Payroll from './components/payroll.js';
import Attendance from './components/attendance.js';
import Login from './components/login.js';
import Signup from './components/signup.js';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [activeSection, setActiveSection] = useState('employees');
  const [authMode, setAuthMode] = useState('login');
  const [signupNotice, setSignupNotice] = useState('');

  useEffect(() => {
    const handleExpiredSession = () => {
      setLoggedIn(false);
      setAuthMode('login');
      setSignupNotice('Your session expired. Please sign in again.');
    };

    window.addEventListener('auth:expired', handleExpiredSession);
    return () => window.removeEventListener('auth:expired', handleExpiredSession);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setActiveSection('employees');
    setAuthMode('login');
  };

  if (!loggedIn) {
    return (
      <main className="auth-page">
        <section className="auth-intro" aria-label="Record Management introduction">
          <div className="auth-intro-brand">
            <span className="auth-brand-mark" aria-hidden="true">RM</span>
            <span>Record Management</span>
          </div>
          <div className="auth-intro-copy">
            <span className="auth-kicker">PEOPLE. OPERATIONS. SIMPLIFIED.</span>
            <h1>Everything your team needs, in one clear view.</h1>
            <p>Keep employee records, attendance, and payroll organized with a workspace built for your day-to-day.</p>
            <div className="auth-feature-list">
              <div><span aria-hidden="true">✓</span> Employee records at your fingertips</div>
              <div><span aria-hidden="true">✓</span> Clear attendance tracking</div>
              <div><span aria-hidden="true">✓</span> Payroll details in one place</div>
            </div>
          </div>
          <div className="auth-intro-footer">A calmer way to manage the work behind your work.</div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-mobile-brand">
            <span className="auth-brand-mark" aria-hidden="true">RM</span>
            <span>Record Management</span>
          </div>
          <div className="auth-form-content">
            <div className="auth-form-heading">
              <span className="auth-kicker">YOUR WORKSPACE</span>
              <h2>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
              <p>{authMode === 'login'
                ? 'Sign in to continue to your management dashboard.'
                : 'Get started by creating your workspace account.'}</p>
            </div>

            {signupNotice && authMode === 'login' && (
              <div className="alert alert-success" role="status">{signupNotice}</div>
            )}

            {authMode === 'login' ? (
              <Login onLogin={() => { setSignupNotice(''); setLoggedIn(true); }} />
            ) : (
              <Signup onSignup={() => {
                setSignupNotice('Account created. Sign in with your new credentials.');
                setAuthMode('login');
              }} />
            )}

            <p className="auth-switch-prompt">
              {authMode === 'login' ? 'New to Record Management?' : 'Already have an account?'}{' '}
              <button
                className="auth-switch-button"
                type="button"
                onClick={() => {
                  setSignupNotice('');
                  setAuthMode(authMode === 'login' ? 'signup' : 'login');
                }}
              >
                {authMode === 'login' ? 'Create an account' : 'Sign in'}
              </button>
            </p>
            <p className="auth-privacy-note">Your account keeps your workspace protected.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container app-header-content">
          <div className="app-brand-mark" aria-hidden="true">RM</div>
          <div>
            <p className="app-eyebrow">ADMINISTRATION</p>
            <h1 className="app-title">Record Management</h1>
            <p className="app-subtitle">Manage your people, attendance, and payroll in one place.</p>
          </div>
          <button className="btn btn-outline-light ms-auto" type="button" onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <main className="container app-main">
        <nav className="section-navigation" aria-label="Management sections" role="tablist">
          <button
            className={`section-tab ${activeSection === 'employees' ? 'active' : ''}`}
            id="employees-tab"
            type="button"
            role="tab"
            aria-selected={activeSection === 'employees'}
            aria-controls="section-panel"
            onClick={() => setActiveSection('employees')}
          >
            Employees
          </button>
          <button
            className={`section-tab ${activeSection === 'attendance' ? 'active' : ''}`}
            id="attendance-tab"
            type="button"
            role="tab"
            aria-selected={activeSection === 'attendance'}
            aria-controls="section-panel"
            onClick={() => setActiveSection('attendance')}
          >
            Attendance
          </button>
          <button
            className={`section-tab ${activeSection === 'payroll' ? 'active' : ''}`}
            id="payroll-tab"
            type="button"
            role="tab"
            aria-selected={activeSection === 'payroll'}
            aria-controls="section-panel"
            onClick={() => setActiveSection('payroll')}
          >
            Payroll
          </button>
        </nav>

        <div className="section-content" id="section-panel" role="tabpanel" aria-labelledby={`${activeSection}-tab`}>
          {activeSection === 'employees' && <Employees />}
          {activeSection === 'attendance' && <Attendance />}
          {activeSection === 'payroll' && <Payroll />}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">Record Management System</div>
      </footer>
    </div>
  );
}

export default App;
