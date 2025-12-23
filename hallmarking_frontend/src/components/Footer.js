import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Footer() {
  /** Renders the site footer. */
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>© {year} Hallmarking Assay Testing Center</div>
        <div>
          <Link to="/portfolio">Services</Link>
        </div>
      </div>
    </footer>
  );
}
