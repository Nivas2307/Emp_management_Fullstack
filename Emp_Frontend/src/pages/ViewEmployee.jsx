// src/pages/ViewEmployee.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import api from "../api/api";
import "../style/employee.css";
import PageHeader from "../components/PageHeader";

export default function ViewEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);

  const containerRef = useRef(null);
  const photoRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        setEmp(res.data?.data ?? res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  // Animate after emp loads
  useEffect(() => {
    if (!emp) return;

    const ctx = gsap.context(() => {
      // Animate container
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );

      // Animate photo
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { scale: 0.9, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.4)", delay: 0.2 }
        );
      }

      // Animate fields
      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current.querySelectorAll(".form-group"),
          { y: 15, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.3 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [emp]);

  if (!emp) return <div className="loading">Loading...</div>;

  const uploadsBase = (
    import.meta.env.VITE_API || "http://localhost:5000/api"
  ).replace("/api", "");

  return (
    <div className="form-container" ref={containerRef}>
      <PageHeader title="View Employee" back={() => navigate(-1)} />

      <div className="form-with-photo">
        {/* Photo */}
        <div className="photo-preview-edit" ref={photoRef}>
          {emp.photo ? (
            <img src={`${uploadsBase}/${emp.photo}`} alt={emp.name} />
          ) : (
            <div className="photo-placeholder">No Photo</div>
          )}
        </div>

        {/* Employee Details */}
        <div className="emp-info-grid" ref={infoRef}>
          <div className="form-group">
            <label>Employee ID :</label>
            <input value={emp.id || "-"} readOnly />
          </div>
          <div className="form-group">
            <label>Name :</label>
            <input value={emp.name || "-"} readOnly />
          </div>
          <div className="form-group">
            <label>Email :</label>
            <input value={emp.email || "-"} readOnly />
          </div>
          <div className="form-group">
            <label>Department :</label>
            <input value={emp.department || "-"} readOnly />
          </div>
          <div className="form-group">
            <label>Designation :</label>
            <input value={emp.designation || "-"} readOnly />
          </div>
          <div className="form-group">
            <label>Project :</label>
            <input value={emp.project || "-"} readOnly />
          </div>
          <div className="form-group">
            <label>Work Type :</label>
            <input value={emp.work_type || "-"} readOnly />
          </div>
          <div className="form-group">
            <label>Status :</label>
            <input value={emp.status || "-"} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}
