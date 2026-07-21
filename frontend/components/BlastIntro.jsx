"use client";

import { useEffect, useState } from "react";

export default function BlastIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("blastIntroShown");

    if (!shown) {
      setShow(true);
      sessionStorage.setItem("blastIntroShown", "true");

      const timer = setTimeout(() => {
        setShow(false);
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="blast-overlay">
      <div className="firework firework1"></div>
      <div className="firework firework2"></div>
      <div className="firework firework3"></div>

      <div className="blast-content">
        <p className="blast-subtitle">✨ Welcome To ✨</p>

        <h1>SIVAKASI</h1>

        <h2>MUTHU CRACKERS</h2>

        <p className="blast-text">
          Factory Price • Premium Quality • Up To 80% Discount
        </p>
      </div>
    </div>
  );
}
