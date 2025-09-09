// src/pages/Login.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { gsap } from "gsap";
import "../style/auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
    }
  };

  // Run GSAP animations when component loads
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        formRef.current.querySelectorAll("h2, input, button, p"),
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15, ease: "power2.out", delay: 0.3 }
      );

      // Button hover animation
      if (buttonRef.current) {
        const btn = buttonRef.current;
        btn.addEventListener("mouseenter", () => {
          gsap.to(btn, { scale: 1.05, duration: 0.2 });
        });
        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, { scale: 1, duration: 0.2 });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="auth-container" ref={containerRef}>
      <form className="auth-form" onSubmit={submit} ref={formRef}>
        <h2>Login</h2>
        {err && <div className="error">{err}</div>}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handle}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handle}
          required
        />
        <button type="submit" ref={buttonRef}>
          Login
        </button>
        <p className="muted">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}
