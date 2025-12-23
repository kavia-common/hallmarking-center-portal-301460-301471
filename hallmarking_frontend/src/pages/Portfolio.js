import { useEffect, useState } from 'react';

function usePortfolio() {
  const [state, setState] = useState({ loading: true, error: null, items: [] });
  useEffect(() => {
    const t = setTimeout(() => {
      setState({
        loading: false,
        error: null,
        items: [
          { id: 'srv-101', title: 'Gold Purity Assay', kind: 'Service', note: 'Fire Assay & XRF', badge: 'BIS' },
          { id: 'srv-102', title: 'Silver Purity Assay', kind: 'Service', note: 'XRF', badge: 'ISO' },
          { id: 'cert-001', title: 'BIS Accreditation', kind: 'Certification', note: 'Valid 2025', badge: 'BIS' },
          { id: 'srv-103', title: 'Platinum Testing', kind: 'Service', note: 'XRF', badge: 'Accredited' },
          { id: 'cert-002', title: 'ISO/IEC 17025', kind: 'Certification', note: 'Laboratory Competence', badge: 'ISO' },
        ]
      });
    }, 450);
    return () => clearTimeout(t);
  }, []);
  return state;
}

// PUBLIC_INTERFACE
export default function Portfolio() {
  /** Portfolio grid showing services and certifications using placeholder data. */
  const { loading, error, items } = usePortfolio();

  return (
    <main className="main">
      <div className="container" style={{ padding: '1.5rem 0' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h1 className="title">Portfolio</h1>
          <p className="subtitle">Browse hallmarking services and certifications.</p>
        </div>

        {loading && <div className="status" role="status">Loading portfolio…</div>}
        {error && <div className="status error" role="alert">Failed to load portfolio.</div>}

        {!loading && !error && (
          <div className="grid" role="list">
            {items.map(item => (
              <article key={item.id} className="card" role="listitem" aria-label={`${item.kind}: ${item.title}`}>
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
