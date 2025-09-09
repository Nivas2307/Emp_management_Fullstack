// src/pages/EditEmployee.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import api from "../api/api";
import "../style/employee.css";
import PageHeader from "../components/PageHeader";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const photoRef = useRef(null);
  const formRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    project: "",
    work_type: "",
    status: "",
    photo: null,
    existingPhoto: "",
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- Load Employee ----------------
  useEffect(() => {
    let cancelled = false;
    const loadEmployee = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/employees/${id}`);
        const data = res?.data?.data ?? res?.data ?? {};
        if (cancelled) return;

        setForm((prev) => ({
          ...prev,
          name: data.name ?? "",
          email: data.email ?? "",
          department: data.department ?? "",
          designation: data.designation ?? "",
          project: data.project ?? "",
          work_type: data.work_type ?? "",
          status: data.status ?? "",
          existingPhoto: data.photo ?? "",
          photo: null,
        }));

        // Fix preview path
        if (data.photo) {
          const uploadsBase = (import.meta.env.VITE_API || "http://localhost:5000").replace("/api", "");
          const cleanPhoto = data.photo.replace(/^uploads[\\/]/, "").replace(/\\/g, "/");
          setPhotoPreview(`${uploadsBase}/uploads/${cleanPhoto}`);
        } else {
          setPhotoPreview(null);
        }
      } catch (err) {
        console.error("Failed to load employee:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadEmployee();
    return () => { cancelled = true; };
  }, [id]);

  // ---------------- GSAP Animations ----------------
  useEffect(() => {
    if (loading) return;
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );

      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { scale: 0.9, autoAlpha: 0.9 },
          { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(1.2)" }
        );
      }

      if (formRef.current) {
        gsap.fromTo(
          formRef.current.querySelectorAll(".form-group, .form-actions"),
          { y: 12, autoAlpha: 0.95 },
          { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, photoPreview]);

  // ---------------- Handle Input ----------------
  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (name === "photo") {
      const file = files?.[0] ?? null;
      setForm((s) => ({ ...s, photo: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  // ---------------- Submit Update ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      ["name","email","department","designation","project","work_type","status"].forEach(k => {
        fd.append(k, form[k] ?? "");
      });
      if (form.photo) fd.append("photo", form.photo);

      await api.put(`/employees/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Employee updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update employee — check console.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  // ---------------- JSX ----------------
  return (
    <div className="form-container" ref={containerRef}>
      <PageHeader title="Edit Employee" />
      <div className="form-with-photo">
        <div className="photo-preview-edit" ref={photoRef}>
          {photoPreview ? (
            <img src={photoPreview} alt="Employee" />
          ) : (
            <div className="photo-placeholder">Preview</div>
          )}
        </div>

        <form className="form-grid" ref={formRef} onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="photo">Photo :</label>
            <input type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="name">Name :</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Enter name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter email" required />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department :</label>
            <input id="department" name="department" value={form.department} onChange={handleChange} placeholder="Enter department" />
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation :</label>
            <input id="designation" name="designation" value={form.designation} onChange={handleChange} placeholder="Enter designation" />
          </div>

          <div className="form-group">
            <label htmlFor="project">Project :</label>
            <input id="project" name="project" value={form.project} onChange={handleChange} placeholder="Enter project" />
          </div>

          <div className="form-group">
            <label htmlFor="work_type">Work Type :</label>
            <select id="work_type" name="work_type" value={form.work_type} onChange={handleChange}>
              <option value="" disabled>Select work type</option>
              <option value="Office">Office</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status :</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              <option value="" disabled>Select status</option>
              <option value="Permanent">Permanent</option>
              <option value="Temporary">Temporary</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate("/dashboard")}>Cancel</button>
            <button type="submit" className="btn-save">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}
