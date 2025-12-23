import { useState } from 'react';
import { registerUser } from '../services/apiClient';
import { useToast } from '../components/Toast';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration form with API integration and graceful fallback errors. */
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });
  const { notify } = useToast();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    if (!form.username || !form.email || !form.password || !form.password2) {
      setStatus({ loading: false, error: 'Please fill all fields.', success: null });
      return;
    }

    if (form.password !== form.password2) {
      setStatus({ loading: false, error: 'Passwords do not match.', success: null });
      return;
    }

    const resp = await registerUser(form);
    if (!resp.ok) {
      // DRF returns validation errors as { field: [errors] }
      let errorMsg = 'Failed to register.';
      if (resp.data) {
        const errors = [];
        if (resp.data.username) errors.push(`Username: ${resp.data.username.join(', ')}`);
        if (resp.data.email) errors.push(`Email: ${resp.data.email.join(', ')}`);
        if (resp.data.password) errors.push(`Password: ${resp.data.password.join(', ')}`);
        if (resp.data.password2) errors.push(`Password2: ${resp.data.password2.join(', ')}`);
        if (errors.length > 0) errorMsg = errors.join(' ');
      }
      setStatus({ loading: false, error: errorMsg, success: null });
      notify(errorMsg, 'error');
      return;
    }

    setStatus({
      loading: false,
      error: null,
      success: 'Registered successfully. You can login now.',
    });
    notify('Registration successful! Please login.', 'success');
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }

  return (
    <main className="main">
      <div className="container" style={{ padding: '1.5rem 0' }}>
        <h1 className="title">Create your account</h1>
        <p className="subtitle">Register to access hallmarking services and manage your certificates.</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          {status.loading && <div className="status" role="status">Creating account…</div>}
          {status.error && <div className="status error" role="alert">{status.error}</div>}
          {status.success && <div className="status" role="status">{status.success}</div>}

          <div className="field">
            <label className="label" htmlFor="username">Username</label>
            <input 
              className="input" 
              id="username" 
              name="username" 
              value={form.username} 
              onChange={onChange} 
              placeholder="e.g., priya_sharma" 
            />
            <div className="help">Choose a unique username (letters, digits, @/./+/-/_ only).</div>
          </div>

          <div className="field">
            <label className="label" htmlFor="email">Email address</label>
            <input 
              className="input" 
              id="email" 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={onChange} 
              placeholder="you@example.com" 
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

          <div className="field">
            <label className="label" htmlFor="password2">Confirm Password</label>
            <input 
              className="input" 
              id="password2" 
              type="password" 
              name="password2" 
              value={form.password2} 
              onChange={onChange} 
              placeholder="••••••••" 
            />
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
