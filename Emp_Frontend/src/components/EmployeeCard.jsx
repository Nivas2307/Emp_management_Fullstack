import React from "react";
import { Link } from "react-router-dom";
import { LuEye } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { GoTrash } from "react-icons/go";

export default function EmployeeCard({ employee, onDelete }) {
  const uploadsBase = (
    import.meta.env.VITE_API || "http://localhost:5000/api"
  ).replace("/api", "");

  return (
    <div className="employee-row">
      {/* Employee Name + Photo */}
      <div className="emp-col emp-info">
        <img
          src={
            employee.photo
              ? `${uploadsBase}/${employee.photo}`
              : `${uploadsBase}/default.png`
          }
          alt={employee.name}
          className="emp-thumb"
        />
        <div>
          <div className="emp-name">{employee.name || "-"}</div>
          <div className="emp-sub">{employee.email || "-"}</div>
        </div>
      </div>

      {/* Employee ID */}
      <div className="emp-col">{employee.id || "-"}</div>

      {/* Other Details */}
      <div className="emp-col">{employee.department || "-"}</div>
      <div className="emp-col">{employee.designation || "-"}</div>
      <div className="emp-col">{employee.project || "-"}</div>
      <div className="emp-col">{employee.work_type || "-"}</div>
      <div className="emp-col">{employee.status || "-"}</div>

      {/* Actions */}
      <div className="emp-col emp-actions">
        <Link
          to={`/dashboard/employees/${employee.id}`}
          className="action"
          title="View"
        >
          <LuEye size={18} />
        </Link>
        <Link
          to={`/dashboard/edit/${employee.id}`}
          className="action"
          title="Edit"
        >
          <CiEdit size={18} />
        </Link>
        <button
          className="action"
          onClick={() => onDelete(employee.id)}
          title="Delete"
        >
          <GoTrash size={18} />
        </button>
      </div>
    </div>
  );
}
