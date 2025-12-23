import { NavLink, Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Header() {
  /** Renders the top navigation header with app branding and nav links. */
  return (
    <header className="header">
      <div className="container navbar">
        <Link to="/" className="brand" aria-label="Hallmarking Center Home">
          <span className="brand-badge" />
          <span>Hallmarking Center</span>
        </Link>
        <nav className="nav" aria-label="Main Navigation">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined}>Center</NavLink>
          <NavLink to="/portfolio" className={({ isActive }) => isActive ? 'active' : undefined}>Portfolio</NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : undefined}>Register</NavLink>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : undefined}>Login</NavLink>
        </nav>
      </div>
    </header>
  );
}
