import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import EmployeeCard from "../components/EmployeeCard";
import ConfirmModal from "../components/ConfirmModal";
import "../style/employee.css";
import { FiSearch } from "react-icons/fi";
import { gsap } from "gsap";
import { IoMdAddCircleOutline } from "react-icons/io";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [delId, setDelId] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const listRef = useRef(null);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();

    const input = document.getElementById("globalSearch");
    const handler = (e) => setQuery(e.target.value);
    if (input) input.addEventListener("input", handler);
    return () => input && input.removeEventListener("input", handler);
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
    setDelId(null);
  };

  // Real-time GSAP animation
  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.querySelectorAll(".employee-row"),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }
  }, [employees]); // runs whenever employee list changes (refresh, login, logout)

  // Filter list
  const filtered = employees.filter((emp) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (emp.name || "").toLowerCase().includes(q) ||
      (emp.email || "").toLowerCase().includes(q) ||
      (emp.department || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Top Section */}
      <div className="list-top">
        <h2>Employee</h2>
        <div className="list-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search ..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            <FiSearch className="search-icon" />
          </div>

          <button
            className="btn-add"
            onClick={() => navigate("/dashboard/add")}
          >
            <div className="btn-add-content">
              <IoMdAddCircleOutline size={20} />
              <span>Add New Employee</span>
            </div>
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="table-card" ref={listRef}>
        <div className="employee-row header">
          <div className="emp-col emp-info">Employee Name</div>
          <div className="emp-col">Employee ID</div>
          <div className="emp-col">Department</div>
          <div className="emp-col">Designation</div>
          <div className="emp-col">Project</div>
          <div className="emp-col">Type</div>
          <div className="emp-col">Status</div>
          <div className="emp-col">Action</div>
        </div>

        {filtered.length ? (
          filtered.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onDelete={(id) => setDelId(id)}
            />
          ))
        ) : (
          <div className="no-record">No employees found.</div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={!!delId}
        onClose={() => setDelId(null)}
        onConfirm={() => handleDelete(delId)}
        title="Are you sure you want to Delete?"
      />
    </div>
  );
}
