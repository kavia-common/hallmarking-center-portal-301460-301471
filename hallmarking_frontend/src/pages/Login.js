import { useState } from 'react';
import { loginUser } from '../services/apiClient';
import { useToast } from '../components/Toast';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login form integrated with DRF session-based authentication. */
  const [form, setForm] = useState({ username: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null });
  const { notify } = useToast();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: null });

    if (!form.username || !form.password) {
      setStatus({ loading: false, error: 'Please provide username and password.' });
      return;
    }

    const resp = await loginUser(form);
    if (!resp.ok) {
      const msg = resp.error || 'Failed to login.';
      setStatus({ loading: false, error: msg });
      notify(msg, 'error');
      return;
    }

    // DRF session-based auth - session cookie is set automatically
    // Response contains user data
    setStatus({ loading: false, error: null });
    notify(`Welcome back, ${resp.data?.user?.username || 'User'}!`, 'success');
    
    // Navigate to home after successful login
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
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
            <label className="label" htmlFor="username">Username</label>
            <input 
              className="input" 
              id="username" 
              type="text" 
              name="username" 
              value={form.username} 
              onChange={onChange} 
              placeholder="your_username" 
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input 
              className="input" 
              id="password" 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={onChange} 
              placeholder="••••••••" 
            />
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
