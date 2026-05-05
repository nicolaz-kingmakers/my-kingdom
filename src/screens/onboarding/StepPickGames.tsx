import { ALL_GAMES, PinnedGame } from "../../data/mockData";

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export default function StepPickGames({ selected, onChange }: Props) {
  const toggle = (game: PinnedGame) => {
    if (selected.includes(game.id)) {
      onChange(selected.filter((id) => id !== game.id));
    } else if (selected.length < 6) {
      onChange([...selected, game.id]);
    }
  };

  return (
    <div className="fade-up">
      <h2 className="heading-gold" style={{ marginBottom: 8 }}>
        Pick your games
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
        Choose up to 6 sports for your Kingdom shelf.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {ALL_GAMES.map((game) => {
          const isSelected = selected.includes(game.id);
          return (
            <button
              key={game.id}
              onClick={() => toggle(game)}
              style={{
                background: isSelected ? "var(--bg-card-raised)" : "var(--bg-card)",
                border: `2px solid ${isSelected ? "var(--gold)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                padding: "16px 8px",
                cursor: "pointer",
                color: "var(--text-primary)",
                textAlign: "center",
                transition: "all var(--transition)",
                boxShadow: isSelected ? "var(--shadow-gold)" : "none",
              }}
            >
              <div style={{ fontSize: 28 }}>{game.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 6 }}>{game.name}</div>
              {isSelected && (
                <div style={{ fontSize: 10, color: "var(--gold)", marginTop: 4 }}>✓</div>
              )}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 20 }}>
        {selected.length} of 6 selected
      </p>
    </div>
  );
}
