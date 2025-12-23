import { useEffect, useState } from 'react';
import { fetchCenterInfo } from '../services/apiClient';
import { useToast } from '../components/Toast';

// Placeholder fetch states, with API call and graceful fallback
function useCenterInfo() {
  const [state, setState] = useState({ loading: true, error: null, data: null });
  const { notify } = useToast();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setState({ loading: true, error: null, data: null });
      const resp = await fetchCenterInfo();
      if (!resp.ok) {
        // Fallback to placeholder data
        const fallback = {
          name: 'National Gold Hallmarking & Assay Center',
          description:
            'Accredited hallmarking services ensuring purity and authenticity of precious metals. We serve retail jewelers, bullion traders, and consumers.',
          highlights: [
            'BIS certified facility',
            'Same-day certification options',
            'Advanced spectrometry and fire assay',
          ],
          cta: 'Explore Services',
        };
        if (!cancelled) {
          setState({ loading: false, error: resp.error || 'Backend not available; showing sample info.', data: fallback });
        }
        notify(resp.error || 'Unable to fetch center info; showing sample info.', 'error');
        return;
      }
      if (!cancelled) {
        setState({ loading: false, error: null, data: resp.data });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [notify]);

  return state;
}

// PUBLIC_INTERFACE
export default function CenterInfo() {
  /** Center info page with API integration and graceful placeholder fallback. */
  const { loading, error, data } = useCenterInfo();

  return (
    <main className="main">
      <section className="hero">
        <div className="container hero-inner">
          <h1 className="title">Gold Hallmarking Center</h1>
          <p className="subtitle">
            Accurate, accredited, and efficient hallmarking services for your precious metals.
          </p>
          <div>
            <a href="/portfolio" className="btn btn-primary" aria-label="View services and certifications">
              View Portfolio
            </a>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '1.5rem 0' }}>
        {loading && <div className="status" role="status">Loading center information…</div>}
        {error && <div className="status error" role="alert">{error}</div>}
        {data && (
          <div className="grid" aria-live="polite">
            <div className="card">
              <span className="badge">About</span>
              <h3>{data.name}</h3>
              <p>{data.description}</p>
            </div>
            <div className="card">
              <span className="badge">Highlights</span>
              <ul style={{ marginTop: '.5rem', paddingLeft: '1rem', listStyle: 'disc' }}>
                {(data.highlights || []).map((h, i) => (<li key={i}>{h}</li>))}
              </ul>
            </div>
            <div className="card">
              <span className="badge">Get Started</span>
              <p>Register an account to book hallmarking slots and manage certificates.</p>
              <div style={{ marginTop: '.75rem', display: 'flex', gap: '.5rem' }}>
                <a href="/register" className="btn btn-primary">Register</a>
                <a href="/login" className="btn">Login</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
