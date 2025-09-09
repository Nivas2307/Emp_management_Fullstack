// src/pages/Signup.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { gsap } from "gsap";
import "../style/auth.css";

export default function Signup() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [err, setErr] = useState("");

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);
  const previewRef = useRef(null);

  const handle = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      setForm({ ...form, photo: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("phone", form.phone);
      if (form.photo) fd.append("photo", form.photo);

      const res = await api.post("/auth/signup", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (error) {
      setErr(error.response?.data?.message || "Signup failed");
    }
  };

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        formRef.current.querySelectorAll("h2, input, button, p, .photo-preview"),
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15, ease: "power2.out", delay: 0.3 }
      );

      // Button hover effect
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
  }, [photoPreview]);

  return (
    <div className="auth-container" ref={containerRef}>
      <form
        className="auth-form"
        onSubmit={submit}
        encType="multipart/form-data"
        ref={formRef}
      >
        <h2>Signup</h2>
        {err && <div className="error">{err}</div>}

        {/* Photo Preview */}
        {photoPreview && (
          <div className="photo-preview" ref={previewRef}>
            <img src={photoPreview} alt="Preview" />
          </div>
        )}

        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handle}
          required
        />
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
        <input
          name="phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={handle}
        />
        <input name="photo" type="file" accept="image/*" onChange={handle} />

        <button type="submit" ref={buttonRef}>
          Signup
        </button>
        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
