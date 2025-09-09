import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import "../style/global.css";

export default function NoRecords() {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const hrRef = useRef(null);
  const paraRef = useRef(null);

  useEffect(() => {
    // Heading: subtle scale + rotation + color pulse
    gsap.to(headingRef.current, {
      duration: 2,
      scale: 1.05,
      rotation: 2,
      color: "#007bff",
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // HR: draw line + glow pulse
    gsap.fromTo(
      hrRef.current,
      { scaleX: 0, opacity: 0.5 },
      {
        scaleX: 1,
        opacity: 1,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        transformOrigin: "left center",
        ease: "power1.inOut",
      }
    );

    // Paragraph: gentle floating + opacity
    gsap.to(paraRef.current, {
      duration: 2.5,
      y: 5,
      opacity: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Container: slow floating & slight rotation
    gsap.to(containerRef.current, {
      duration: 5,
      y: 5,
      x: 3,
      rotation: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="norecords" ref={containerRef}>
      <h2 ref={headingRef} className="norecords-heading">
        🙋🏻‍♂️ Hey Guys, Please Do It 👇🏻
      </h2>
      <hr ref={hrRef} className="norecords-hr" />
      <p ref={paraRef} className="norecords-para">
        😎 Please <Link to="/login" className="norecords-link">Login </Link> or{" "}
        <Link to="/signup" className="norecords-link">Signup </Link> to continue 🧑🏻‍💻.......
      </p>
    </div>
  );
}
