import { useEffect, useState } from 'react';
import { fetchPortfolio } from '../services/apiClient';
import { useToast } from '../components/Toast';

function usePortfolio() {
  const [state, setState] = useState({ loading: true, error: null, items: [] });
  const { notify } = useToast();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setState({ loading: true, error: null, items: [] });
      const resp = await fetchPortfolio();
      if (!resp.ok) {
        const fallback = [
          { id: 'srv-101', title: 'Gold Purity Assay', kind: 'Service', note: 'Fire Assay & XRF', badge: 'BIS' },
          { id: 'srv-102', title: 'Silver Purity Assay', kind: 'Service', note: 'XRF', badge: 'ISO' },
          { id: 'cert-001', title: 'BIS Accreditation', kind: 'Certification', note: 'Valid 2025', badge: 'BIS' },
          { id: 'srv-103', title: 'Platinum Testing', kind: 'Service', note: 'XRF', badge: 'Accredited' },
          { id: 'cert-002', title: 'ISO/IEC 17025', kind: 'Certification', note: 'Laboratory Competence', badge: 'ISO' },
        ];
        if (!cancelled) {
          setState({ loading: false, error: resp.error || 'Backend not available; showing sample portfolio.', items: fallback });
        }
        notify(resp.error || 'Unable to fetch portfolio; showing sample items.', 'error');
        return;
      }
      
      // Transform backend data to frontend format
      const backendData = resp.data;
      const items = [];
      
      // Add services
      if (backendData.services && Array.isArray(backendData.services)) {
        backendData.services.forEach(service => {
          items.push({
            id: `srv-${service.id}`,
            title: service.name,
            kind: 'Service',
            note: service.description || `Price: ₹${service.price}`,
            badge: service.is_active ? 'Active' : 'Inactive'
          });
        });
      }
      
      // Add certifications
      if (backendData.certifications && Array.isArray(backendData.certifications)) {
        backendData.certifications.forEach(cert => {
          items.push({
            id: `cert-${cert.id}`,
            title: cert.title,
            kind: 'Certification',
            note: cert.certificate_number || cert.description,
            badge: cert.issued_date ? new Date(cert.issued_date).getFullYear() : 'Certified'
          });
        });
      }
      
      if (!cancelled) {
        setState({ loading: false, error: null, items });
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
export default function Portfolio() {
  /** Portfolio grid fetching from API with graceful fallback to sample items. */
  const { loading, error, items } = usePortfolio();

  return (
    <main className="main">
      <div className="container" style={{ padding: '1.5rem 0' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h1 className="title">Portfolio</h1>
          <p className="subtitle">Browse hallmarking services and certifications.</p>
        </div>

        {loading && <div className="status" role="status">Loading portfolio…</div>}
        {error && <div className="status error" role="alert">{error}</div>}

        {!loading && !error && (
          <div className="grid" role="list">
            {items.map(item => (
              <article key={item.id || item.title} className="card" role="listitem" aria-label={`${item.kind}: ${item.title}`}>
                <span className="badge">{item.badge}</span>
                <h3 style={{ marginTop: '.5rem' }}>{item.title}</h3>
                <p>{item.kind} — {item.note}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
