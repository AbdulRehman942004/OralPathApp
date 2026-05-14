import { useState } from "react";
import { navigate } from "../utils/router.js";
import { setUser } from "../utils/storage.js";

export default function Login({ onLogin }) {
  const [role, setRole] = useState("student");
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    const email = form.email.trim().toLowerCase();
    const name = form.name.trim() || email.split("@")[0];
    if (!email || !form.password) { setErr("Enter your email and password."); return; }
    if (mode === "register" && !form.name.trim()) { setErr("Enter your full name."); return; }

    const user = { name, email, role, since: new Date().toISOString() };
    setUser(user);
    onLogin(user);
    navigate(role === "faculty" ? "/faculty" : "/student");
  };

  const demoFill = () => {
    setForm({
      name: role === "faculty" ? "Dr. Ayesha Khan" : "Hamza Ali",
      email: role === "faculty" ? "ayesha.khan@bahria.edu.pk" : "hamza.bscs@bahria.edu.pk",
      password: "demo123"
    });
    setMode("login");
  };

  return (
    <section className="container auth-wrap fade-in">
      <div className="bg-orbs" aria-hidden="true" />
      <div className="auth-card">
        <span className="hero__chip"><span className="dot" />Sign in or register</span>
        <h2 className="mt-12">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p>
          {mode === "login"
            ? "Sign in to continue your OralPath learning journey."
            : "Register as a student or faculty member to access the modules."}
        </p>

        <div className="auth-tabs" role="tablist" aria-label="Role">
          <button type="button" className={role === "student" ? "active" : ""} onClick={() => setRole("student")}>
            🎓 Student
          </button>
          <button type="button" className={role === "faculty" ? "active" : ""} onClick={() => setRole("faculty")}>
            🧑‍🏫 Faculty
          </button>
        </div>

        <form className="form" onSubmit={submit}>
          {mode === "register" && (
            <div className="field">
              <label>Full name</label>
              <input value={form.name} onChange={change("name")} placeholder="e.g. Dr. Ayesha Khan" />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={change("email")} placeholder="you@bahria.edu.pk" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={change("password")} placeholder="••••••••" />
          </div>
          {err && <div className="notice notice--warn">{err}</div>}
          <button className="btn btn--primary btn--block btn--lg" type="submit">
            {mode === "login" ? "Sign in →" : "Create account →"}
          </button>

          <div className="row" style={{ justifyContent: "space-between", fontSize: 13 }}>
            <span className="muted">
              {mode === "login" ? (
                <>New here? <a href="#" onClick={(e) => { e.preventDefault(); setMode("register"); }}>Create an account</a></>
              ) : (
                <>Already registered? <a href="#" onClick={(e) => { e.preventDefault(); setMode("login"); }}>Sign in</a></>
              )}
            </span>
            <button type="button" className="btn btn--sm btn--ghost" onClick={demoFill}>
              ✨ Fill demo credentials
            </button>
          </div>

          <div className="notice" style={{ fontSize: 12 }}>
            Demo build · credentials are stored locally on this device — no server.
            Use any email + password to enter.
          </div>
        </form>
      </div>
    </section>
  );
}
