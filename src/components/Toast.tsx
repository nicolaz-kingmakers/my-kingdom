import { useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toast, clearToast } = useApp();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3500);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div style={{
      position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
      background: "var(--bg-card-raised)", border: "1px solid var(--green)",
      borderRadius: 12, padding: "12px 18px",
      color: "#fff", fontSize: 13, fontWeight: 600,
      boxShadow: "0 4px 24px rgba(0,196,140,0.25)",
      zIndex: 999, whiteSpace: "nowrap",
      animation: "fadeUp 220ms ease",
    }}>
      <span style={{ color: "var(--green)", marginRight: 8 }}>✓</span>
      {toast}
    </div>
  );
}
