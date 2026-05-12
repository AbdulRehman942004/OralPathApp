import { Link, navigate, useRoute } from "../utils/router.js";
import { clearUser } from "../utils/storage.js";

export default function Header({ user, onLogout }) {
  const { path } = useRoute();
  const isActive = (p) => (path === p ? "active" : "");
  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand">
          <div className="brand__mark">OP</div>
          <div>
            <div className="brand__name">OralPath Learn</div>
            <div className="brand__sub">Odontogenic Oral Pathology</div>
          </div>
        </Link>
        <nav className="nav">
          {!user && (
            <>
              <Link to="/" className={isActive("/")}>Home</Link>
              <Link to="/guide" className={isActive("/guide")}>User Guide</Link>
              <Link to="/login" className={isActive("/login")}>
                <button className="btn btn--primary btn--sm">Sign in</button>
              </Link>
            </>
          )}
          {user?.role === "student" && (
            <>
              <Link to="/student" className={isActive("/student")}>Dashboard</Link>
              <Link to="/reading" className={isActive("/reading")}>Reading</Link>
              <Link to="/ar" className={isActive("/ar")}>AR</Link>
              <Link to="/quiz" className={isActive("/quiz")}>Quiz</Link>
              <Link to="/results" className={isActive("/results")}>Results</Link>
              <Link to="/guide" className={isActive("/guide")}>Guide</Link>
              <Link to="/settings" className={isActive("/settings")} title="Settings" aria-label="Settings">⚙️</Link>
              <span className="user-chip">
                <span className="user-chip__avatar">{initials}</span>
                {user.name || user.email}
              </span>
              <button className="btn btn--sm" onClick={() => { clearUser(); onLogout(); navigate("/"); }}>Logout</button>
            </>
          )}
          {user?.role === "faculty" && (
            <>
              <Link to="/faculty" className={isActive("/faculty")}>Dashboard</Link>
              <Link to="/upload" className={isActive("/upload")}>Upload &amp; Generate</Link>
              <Link to="/reports" className={isActive("/reports")}>Reports</Link>
              <Link to="/guide" className={isActive("/guide")}>Guide</Link>
              <Link to="/settings" className={isActive("/settings")} title="Settings" aria-label="Settings">⚙️</Link>
              <span className="user-chip">
                <span className="user-chip__avatar">{initials}</span>
                {user.name || user.email}
              </span>
              <button className="btn btn--sm" onClick={() => { clearUser(); onLogout(); navigate("/"); }}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
