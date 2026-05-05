import { useEffect, useState } from "react";

interface Props {
  name: string;
  onEnterKingdom: () => void;
}

export default function StepComplete({ name, onEnterKingdom }: Props) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 150); return () => clearTimeout(t); }, []);

  return (
    <div style={{ textAlign: "center", paddingTop: 56, paddingBottom: 40 }}>
      {show && (
        <>
          <div className="pop" style={{ fontSize: 72, marginBottom: 24 }}>👑</div>

          <h2 className="heading-gold fade-up" style={{ fontSize: 30, marginBottom: 10, animationDelay: "100ms" }}>
            Your Kingdom is ready
          </h2>

          <p className="fade-up" style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 12, lineHeight: 1.6, animationDelay: "180ms" }}>
            Welcome, <strong style={{ color: "var(--text-primary)" }}>{name}</strong>.
          </p>
          <p className="fade-up" style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 48, animationDelay: "240ms" }}>
            Your games. Your vault. Your rules.
          </p>

          <button
            className="btn btn-primary fade-up"
            style={{ animationDelay: "340ms", fontSize: 16 }}
            onClick={onEnterKingdom}
          >
            Enter My Kingdom →
          </button>
        </>
      )}
    </div>
  );
}
