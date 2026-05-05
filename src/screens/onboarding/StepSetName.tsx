import { useState, useEffect } from "react";

interface Props {
  value: string;
  onChange: (name: string) => void;
}

export default function StepSetName({ value, onChange }: Props) {
  const [local, setLocal] = useState(value);

  useEffect(() => { onChange(local); }, [local]);

  return (
    <div className="fade-up">
      <h2 className="heading-gold" style={{ marginBottom: 8 }}>
        What should we call you?
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 32 }}>
        Your name appears at the top of your Kingdom every time you open the app.
      </p>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
          autoFocus
          style={{
            width: "100%",
            background: "var(--bg-card)",
            border: `2px solid ${local ? "var(--gold)" : "var(--border)"}`,
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            fontSize: 18,
            fontWeight: 700,
            color: "var(--text-primary)",
            outline: "none",
            transition: "border-color var(--transition)",
          }}
        />
        {local && (
          <div
            style={{
              position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
              color: "var(--gold)", fontSize: 18,
            }}
          >
            👑
          </div>
        )}
      </div>

      {local && (
        <p className="fade-up" style={{ marginTop: 20, color: "var(--text-secondary)", fontSize: 15 }}>
          Welcome back, <strong style={{ color: "var(--gold)" }}>{local}</strong>. 👋
        </p>
      )}
    </div>
  );
}
