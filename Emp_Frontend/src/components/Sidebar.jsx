import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../style/Sidebar.css";
import { TbMessageFilled } from "react-icons/tb";
import { HiMiniSquares2X2,HiMiniUsers } from "react-icons/hi2";
import { FaCalendarAlt } from "react-icons/fa";
import { gsap } from "gsap";

export default function Sidebar() {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (sidebarRef.current) {
      const navItems = sidebarRef.current.querySelectorAll(".nav-link");

      // Massive entrance animation without disappearing
      gsap.fromTo(
        sidebarRef.current,
        { x: -50, opacity: 0 }, // small offset, won't hide
        { x: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
      );

      // Stagger nav items fade in
      gsap.fromTo(
        navItems,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <aside className="sidebar" ref={sidebarRef}>
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" end className="nav-link">
              <HiMiniSquares2X2 size={20} className="icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/employees" className="nav-link">
              <HiMiniUsers size={20} className="icon" />
              <span>Employee</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/calendar" className="nav-link">
              < FaCalendarAlt size={20} className="icon" />
              <span>Calendar</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/messages" className="nav-link">
              <TbMessageFilled size={20} className="icon" />
              <span>Messages</span>
            </NavLink>
          </li>
        </ul> 
      </nav>
    </aside>
  );
}
