import { useState } from 'react';
import { loginUser, setToken } from '../services/apiClient';
import { useToast } from '../components/Toast';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login form integrated with API; stores JWT on success. */
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null });
  const { notify } = useToast();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: null });

    if (!form.email || !form.password) {
      setStatus({ loading: false, error: 'Please provide email and password.' });
      return;
    }

    const resp = await loginUser(form);
    if (!resp.ok) {
      const msg = resp.error || 'Failed to login.';
      setStatus({ loading: false, error: msg });
      notify(msg, 'error');
      return;
    }

    // Expect token in response: accessToken or token
    const token = resp.data?.accessToken || resp.data?.token;
    if (!token) {
      const msg = 'Login response missing token.';
      setStatus({ loading: false, error: msg });
      notify(msg, 'error');
      return;
    }

    setToken(token);
    setStatus({ loading: false, error: null });
    // Navigate to home
    window.location.href = '/';
  }

  return (
    <main className="main">
      <div className="container" style={{ padding: '1.5rem 0' }}>
        <h1 className="title">Sign in</h1>
        <p className="subtitle">Access your hallmarking dashboard.</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          {status.loading && <div className="status" role="status">Signing in…</div>}
          {status.error && <div className="status error" role="alert">{status.error}</div>}

          <div className="field">
            <label className="label" htmlFor="email">Email address</label>
            <input className="input" id="email" type="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input className="input" id="password" type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••••" />
          </div>

          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={status.loading}>Login</button>
            <a className="btn" href="/register">Create account</a>
          </div>
        </form>
      </div>
    </main>
  );
}
