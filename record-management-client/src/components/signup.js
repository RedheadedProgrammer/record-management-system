import React, { useState } from 'react';
import api from '../api';

function Signup({ onSignup }) {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    if (form.username.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        username: form.username.trim(),
        password: form.password
      });
      onSignup();
    } catch (requestError) {
      const message = requestError.response?.data;
      setError(typeof message === 'string'
        ? message
        : requestError.response?.status === 409
          ? 'That username is already in use. Try another one.'
          : 'Unable to create your account. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label" htmlFor="signup-username">Username</label>
        <input
          className="form-control form-control-lg"
          id="signup-username"
          name="username"
          type="text"
          autoComplete="username"
          minLength="3"
          maxLength="64"
          placeholder="Choose a username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <div className="form-text">At least 3 characters.</div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="signup-password">Password</label>
        <div className="input-group input-group-lg">
          <input
            className="form-control"
            id="signup-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            minLength="8"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            className="btn btn-outline-secondary password-toggle"
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(visible => !visible)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="form-text">At least 8 characters.</div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="signup-confirm-password">Confirm password</label>
        <input
          className="form-control form-control-lg"
          id="signup-confirm-password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Enter your password again"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
      <button className="btn btn-primary btn-lg w-100 auth-submit" type="submit" disabled={loading}>
        {loading ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Creating account...</> : 'Create account'}
      </button>
    </form>
  );
}

export default Signup;
