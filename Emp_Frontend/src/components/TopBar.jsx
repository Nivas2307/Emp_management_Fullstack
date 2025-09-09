import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/RS-logo_vijdj0.webp";
import "../style/TopBar.css";

// Icons
import { FiSettings, FiBell } from "react-icons/fi";
import { gsap } from "gsap";

export default function TopBar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const logoRef = useRef(null);

  const uploadsBase = (import.meta.env.VITE_API || "http://localhost:5000/api").replace("/api", "");

  // Massive, simple GSAP logo animation
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { scale: 0, opacity: 0, y: -100 },
        { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }
  }, []);

  // Animate dropdown when open
  useEffect(() => {
    if (dropdownRef.current && open) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [open]);

  return (
    <div className="topbar">
      {/* Left: Logo */}
      <div className="topbar-left">
        <img
          src={logo}
          className="brand-logo"
          alt="RS-TECH Logo"
          ref={logoRef}
        />
      </div>

      {/* Right: Icons & Profile */}
      <div className="topbar-right">
        <button className="icon-btn" title="Settings">
          <FiSettings size={22} />
        </button>
        <button className="icon-btn" title="Notifications">
          <FiBell size={22} />
        </button>

        <div className="profile-area">
          <img
            src={user?.photo ? `${uploadsBase}/uploads/${user.photo}` : `${uploadsBase}/default.png`}
            alt="profile"
            className="profile-pic"
            onClick={() => setOpen(v => !v)}
          />

          {open && (
            <div className="profile-dropdown" ref={dropdownRef}>
              <div className="profile-row">
                <img
                  src={user?.photo ? `${uploadsBase}/uploads/${user.photo}` : `${uploadsBase}/default.png`}
                  alt="profile-large"
                  className="profile-lg"
                />
                <div className="profile-info">
                  <div className="pd-name">{user?.name || "-"}</div>
                  <div className="pd-email">{user?.email || "-"}</div>
                  <div className="pd-phone">{user?.phone || "-"}</div>
                </div>
              </div>
              <div className="pd-actions">
                <button className="btn-logout" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
