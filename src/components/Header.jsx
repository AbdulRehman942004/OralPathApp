import { useEffect, useState } from "react";
import { Link, navigate, useRoute } from "../utils/router.js";
import { clearUser } from "../utils/storage.js";
import { useTheme } from "../utils/theme.js";

export default function Header({ user, onLogout }) {
  const { path } = useRoute();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useTheme();
  const isActive = (p) => (path === p ? "active" : "");
  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  useEffect(() => { setOpen(false); }, [path]);

  const logout = () => { clearUser(); onLogout(); navigate("/"); };

  const themeBtn = (
    <button
      className="icon-btn"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );

  return (
    <header className="header" data-role={user?.role || "guest"}>
      <div className="container header__inner">
        <Link to="/" className="brand">
          <div className="brand__mark">OP</div>
          <div>
            <div className="brand__name">OralPath Learn</div>
            <div className="brand__sub">
              {user?.role === "faculty"
                ? "Faculty portal · content & analytics"
                : user?.role === "student"
                ? "Student portal · learn · practise · master"
                : "Odontogenic Oral Pathology · AI-assisted"}
            </div>
          </div>
        </Link>

        <button
          className="icon-btn menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen(v => !v)}
        >
          {open ? "✕" : "☰"}
        </button>

        <nav className={"nav" + (open ? " open" : "")}>
          {!user && (
            <>
              <Link to="/" className={isActive("/")}>Home</Link>
              <Link to="/ar" className={isActive("/ar")}>3D / AR</Link>
              <Link to="/cv" className={isActive("/cv")}>CV Lab</Link>
              <Link to="/blog" className={isActive("/blog")}>Blog</Link>
              <Link to="/guide" className={isActive("/guide")}>User Guide</Link>
              {themeBtn}
              <Link to="/login" className={isActive("/login")}>
                <button className="btn btn--primary btn--sm">Sign in</button>
              </Link>
            </>
          )}

          {user?.role === "student" && (
            <>
              <span className="role-badge role-badge--student">🎓 Student</span>
              <Link to="/student" className={isActive("/student")}>Dashboard</Link>
              <Link to="/reading" className={isActive("/reading")}>Reading</Link>
              <Link to="/ar" className={isActive("/ar")}>3D / AR</Link>
              <Link to="/cv" className={isActive("/cv")}>CV Lab</Link>
              <Link to="/blog" className={isActive("/blog")}>Blog</Link>
              <Link to="/quiz" className={isActive("/quiz")}>Quiz</Link>
              <Link to="/prompting" className={isActive("/prompting")}>Prompting</Link>
              <Link to="/results" className={isActive("/results")}>Results</Link>
              <Link to="/guide" className={isActive("/guide")}>Guide</Link>
              {themeBtn}
              <Link to="/settings" className={"icon-btn " + isActive("/settings")} title="Settings" aria-label="Settings">⚙️</Link>
              <span className="user-chip">
                <span className="user-chip__avatar">{initials}</span>
                {user.name || user.email}
              </span>
              <button className="btn btn--sm" onClick={logout}>Logout</button>
            </>
          )}

          {user?.role === "faculty" && (
            <>
              <span className="role-badge role-badge--faculty">🧑‍🏫 Faculty</span>
              <Link to="/faculty" className={isActive("/faculty")}>Dashboard</Link>
              <Link to="/upload" className={isActive("/upload")}>PDF → Quiz</Link>
              <Link to="/faculty/blog" className={isActive("/faculty/blog")}>Blog manager</Link>
              <Link to="/reports" className={isActive("/reports")}>Reports</Link>
              <Link to="/cv" className={isActive("/cv")}>CV Lab</Link>
              <Link to="/ar" className={isActive("/ar")}>3D / AR</Link>
              <Link to="/guide" className={isActive("/guide")}>Guide</Link>
              {themeBtn}
              <Link to="/settings" className={"icon-btn " + isActive("/settings")} title="Settings" aria-label="Settings">⚙️</Link>
              <span className="user-chip">
                <span className="user-chip__avatar">{initials}</span>
                {user.name || user.email}
              </span>
              <button className="btn btn--sm" onClick={logout}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
