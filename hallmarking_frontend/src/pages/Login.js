import { useState } from 'react';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login form scaffold with local loading and error placeholders. */
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null });

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: null });

    setTimeout(() => {
      if (!form.email || !form.password) {
        setStatus({ loading: false, error: 'Please provide email and password.' });
      } else {
        // Placeholder - success path
        setStatus({ loading: false, error: null });
        window.location.href = '/';
      }
    }, 500);
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
            <button type="submit" className="btn btn-primary">Login</button>
            <a className="btn" href="/register">Create account</a>
          </div>
        </form>
      </div>
    </main>
  );
}
