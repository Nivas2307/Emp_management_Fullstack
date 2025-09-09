import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/employee.css";

export default function PageHeader({ title }) {
  const navigate = useNavigate();
  return (
    <div className="page-header">
      <span className="back-icon" onClick={() => navigate("/dashboard")}>
        &#60;
      </span>
      <h3>{title}</h3>
    </div>
  );
}
