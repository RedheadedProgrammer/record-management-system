import React, { useState } from 'react';
import api from '../api';

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
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
    setLoading(true);
    try {
      const response = await api.post('/auth/login', form);
      if (!response.data?.token) {
        throw new Error('The server did not return a sign-in token.');
      }
      localStorage.setItem('token', response.data.token);
      onLogin();
    } catch (requestError) {
      const message = requestError.response?.data;
      setError(typeof message === 'string'
        ? message
        : requestError.response?.status === 401 || requestError.response?.status === 400
          ? 'The username or password is incorrect.'
          : 'Unable to sign in. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label" htmlFor="login-username">Username</label>
        <input
          className="form-control form-control-lg"
          id="login-username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Enter your username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="login-password">Password</label>
        <div className="input-group input-group-lg">
          <input
            className="form-control"
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
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
      </div>
      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
      <button className="btn btn-primary btn-lg w-100 auth-submit" type="submit" disabled={loading}>
        {loading ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Signing in...</> : 'Sign in'}
      </button>
    </form>
  );
}

export default Login;
