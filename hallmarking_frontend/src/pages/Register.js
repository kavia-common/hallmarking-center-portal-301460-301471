import { useState } from 'react';
import { registerUser } from '../services/apiClient';
import { useToast } from '../components/Toast';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration form with API integration and graceful fallback errors. */
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });
  const { notify } = useToast();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    if (!form.name || !form.email || !form.password) {
      setStatus({ loading: false, error: 'Please fill all fields.', success: null });
      return;
    }

    const resp = await registerUser(form);
    if (!resp.ok) {
      const msg = resp.error || 'Failed to register.';
      setStatus({ loading: false, error: msg, success: null });
      notify(msg, 'error');
      return;
    }

    setStatus({
      loading: false,
      error: null,
      success: 'Registered successfully. You can login now.',
    });
  }

  return (
    <main className="main">
      <div className="container" style={{ padding: '1.5rem 0' }}>
        <h1 className="title">Create your account</h1>
        <p className="subtitle">Register to book hallmarking slots and manage your certificates.</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          {status.loading && <div className="status" role="status">Creating account…</div>}
          {status.error && <div className="status error" role="alert">{status.error}</div>}
          {status.success && <div className="status" role="status">{status.success}</div>}

          <div className="field">
            <label className="label" htmlFor="name">Full name</label>
            <input className="input" id="name" name="name" value={form.name} onChange={onChange} placeholder="e.g., Priya Sharma" />
            <div className="help">Your legal name as on ID.</div>
          </div>

          <div className="field">
            <label className="label" htmlFor="email">Email address</label>
            <input className="input" id="email" type="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input className="input" id="password" type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••••" />
          </div>

          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={status.loading}>Register</button>
            <a className="btn" href="/login">I already have an account</a>
          </div>
        </form>
      </div>
    </main>
  );
}
