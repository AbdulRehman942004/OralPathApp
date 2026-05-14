import { useEffect, useState } from "react";
import { getUser } from "./utils/storage.js";
import { navigate, useRoute } from "./utils/router.js";
import Header from "./components/Header.jsx";
import Chatbot from "./components/Chatbot.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import StudentHome from "./pages/StudentHome.jsx";
import FacultyHome from "./pages/FacultyHome.jsx";
import Reading from "./pages/Reading.jsx";
import ARView from "./pages/ARView.jsx";
import Quiz from "./pages/Quiz.jsx";
import Results from "./pages/Results.jsx";
import Prompting from "./pages/Prompting.jsx";
import FacultyUpload from "./pages/FacultyUpload.jsx";
import FacultyReports from "./pages/FacultyReports.jsx";
import FacultyBlog from "./pages/FacultyBlog.jsx";
import Blog from "./pages/Blog.jsx";
import CVAnalysis from "./pages/CVAnalysis.jsx";
import UserGuide from "./pages/UserGuide.jsx";
import Settings from "./pages/Settings.jsx";

const requireAuth = (user, allowedRoles) => {
  if (!user) { navigate("/login"); return false; }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    navigate(user.role === "faculty" ? "/faculty" : "/student");
    return false;
  }
  return true;
};

export default function App() {
  const { path } = useRoute();
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    if (!window.location.hash) window.location.hash = "/";
  }, []);

  let page = null;
  switch (path) {
    case "/":
      page = user
        ? (user.role === "faculty" ? <FacultyHome user={user} /> : <StudentHome user={user} />)
        : <Landing />;
      break;
    case "/login":
      page = user
        ? (user.role === "faculty" ? <FacultyHome user={user} /> : <StudentHome user={user} />)
        : <Login onLogin={setUser} />;
      break;

    // ----- Student-only -----
    case "/student":
      if (requireAuth(user, ["student"])) page = <StudentHome user={user} />;
      break;

    // ----- Faculty-only -----
    case "/faculty":
      if (requireAuth(user, ["faculty"])) page = <FacultyHome user={user} />;
      break;
    case "/upload":
      if (requireAuth(user, ["faculty"])) page = <FacultyUpload user={user} />;
      break;
    case "/reports":
      if (requireAuth(user, ["faculty"])) page = <FacultyReports />;
      break;
    case "/faculty/blog":
      if (requireAuth(user, ["faculty"])) page = <FacultyBlog user={user} />;
      break;

    // ----- Shared (both roles) -----
    case "/reading":
      if (requireAuth(user, ["student", "faculty"])) page = <Reading user={user} />;
      break;
    case "/quiz":
      if (requireAuth(user, ["student", "faculty"])) page = <Quiz user={user} />;
      break;
    case "/results":
      if (requireAuth(user, ["student", "faculty"])) page = <Results user={user} />;
      break;
    case "/prompting":
      if (requireAuth(user, ["student", "faculty"])) page = <Prompting />;
      break;
    case "/blog":
      page = <Blog user={user} />;
      break;
    case "/cv":
      page = <CVAnalysis />;
      break;
    case "/settings":
      if (requireAuth(user, ["student", "faculty"])) page = <Settings />;
      break;

    // ----- Public -----
    case "/ar":
      page = <ARView />;
      break;
    case "/guide":
      page = <UserGuide />;
      break;

    default:
      page = (
        <section className="container section center">
          <h2 className="section__title">404 · Page not found</h2>
          <p className="muted">The requested page <span className="kbd">{path}</span> does not exist.</p>
          <button className="btn btn--primary mt-12" onClick={() => navigate("/")}>Back to home</button>
        </section>
      );
  }

  return (
    <div className="app" data-role={user?.role || "guest"}>
      <Header user={user} onLogout={() => setUser(null)} />
      {page}
      <footer className="footer">
        <div className="container footer__inner">
          <div>
            © {new Date().getFullYear()} <b>OralPath Learn</b> — Computer Vision Assignment 3 · BSCS-8 · Bahria University Lahore
          </div>
          <div className="footer__links">
            <a className="u-link" href="#/guide">User guide</a>
            <a className="u-link" href="#/ar">AR demo</a>
            <a className="u-link" href="#/cv">CV demo</a>
            <a className="u-link" href="#/blog">Blog</a>
            <a className="u-link" href="https://3dprint.nih.gov/" target="_blank" rel="noreferrer">3D source (NIH)</a>
          </div>
        </div>
        <div className="container muted center mt-8" style={{ fontSize: 12 }}>
          Built with React 18 · model-viewer · pdf.js · OpenAI gpt-4o-mini (chat + vision) · canvas-based CV pipeline · 100% client-side · installable PWA
        </div>
      </footer>
      <Chatbot />
    </div>
  );
}
