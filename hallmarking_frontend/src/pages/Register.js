import { useState } from 'react';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration form scaffold with basic validation and loading/error placeholders. */
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    // Placeholder: simulate request
    setTimeout(() => {
      if (!form.name || !form.email || !form.password) {
        setStatus({ loading: false, error: 'Please fill all fields.', success: null });
      } else {
        setStatus({ loading: false, error: null, success: 'Registered successfully (placeholder). You can login now.' });
      }
    }, 600);
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
            <button type="submit" className="btn btn-primary">Register</button>
            <a className="btn" href="/login">I already have an account</a>
          </div>
        </form>
      </div>
    </main>
  );
}
