import React, { useEffect, useRef } from "react";
import "../style/modal.css";
import { gsap } from "gsap";
import { FiTrash2 } from "react-icons/fi";
export default function ConfirmModal({
  show,
  onClose,
  onConfirm,
  title = "Are you sure you want to Delete",
}) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (show && modalRef.current && overlayRef.current) {
      // Animate overlay fade in
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power3.out" }
      );

      // Animated modal card scale & fade in
      gsap.fromTo(
        modalRef.current,
        { scale: 0, opacity: 0, y: -50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="modal-overlay" ref={overlayRef}>
      <div className="modal-card" ref={modalRef}>
        <div className="modal-icon"><FiTrash2 size={50}/></div>
        <div className="modal-title">{title}</div>
        <div className="modal-actions">
          <button
            className="btn-cancel"
            onClick={onClose}
            onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.2 })}
            onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.2 })}
          >
            Cancel
          </button>
          <button
            className="btn-confirm"
            onClick={onConfirm}
            onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.2 })}
            onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.2 })}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
