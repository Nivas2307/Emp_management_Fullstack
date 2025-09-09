import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import PageHeader from "../components/PageHeader";
import "../style/employee.css";
import { gsap } from "gsap";

export default function AddEmployee() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    project: "",
    work_type: "",
    status: "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [newEmployeeId, setNewEmployeeId] = useState("");

  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handle = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      setForm({ ...form, photo: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
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
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v || ""));
      const res = await api.post("/employees", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data && res.data.id) setNewEmployeeId(res.data.id);
      alert(`Employee Added! ID: ${res.data.id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to add employee");
    }
  };

  // GSAP animation: fade + slide in
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll(".form-with-photo, .form-actions"),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
        }
      );
    }
  }, []);

  return (
    <div className="form-container" ref={containerRef}>
      <PageHeader title="Add Employee" />
      <div className="form-with-photo">
        <div className="photo-preview-edit">
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" />
          ) : (
            <div className="photo-placeholder">Preview</div>
          )}
        </div>

        <form onSubmit={submit} className="form-grid">
          {newEmployeeId && (
            <input value={newEmployeeId} placeholder="Employee ID" readOnly />
          )}
          <input name="name" placeholder="Name" onChange={handle} required />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handle}
            required
          />
          <input name="department" placeholder="Department" onChange={handle} />
          <input
            name="designation"
            placeholder="Designation"
            onChange={handle}
          />
          <input name="project" placeholder="Project" onChange={handle} />
          <select name="work_type" onChange={handle} defaultValue="">
            <option value="" disabled>
              Work Type
            </option>
            <option value="Office">Office</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <select name="status" onChange={handle} defaultValue="">
            <option value="" disabled>
              Status
            </option>
            <option value="Permanent">Permanent</option>
            <option value="Temporary">Temporary</option>
            <option value="Intern">Intern</option>
          </select>
          <input
            name="photo"
            type="file"
            accept="image/*"
            onChange={handle}
          />

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
