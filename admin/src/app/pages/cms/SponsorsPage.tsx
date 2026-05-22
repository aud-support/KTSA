import { useState } from "react";
import { mockSponsors } from "../../mock/data";

type Tier = "title" | "gold" | "silver" | "partner";
interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  tier: Tier;
  active: boolean;
}

const emptyS: Omit<Sponsor, "id"> = {
  name: "",
  logoUrl: "",
  websiteUrl: "",
  tier: "partner",
  active: true,
};

const tierColors: Record<Tier, string> = {
  title: "#00ffea",
  gold: "#fbbf24",
  silver: "#94a3b8",
  partner: "#8b5cf6",
};

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(mockSponsors);
  const [editing, setEditing] = useState<Partial<Sponsor> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (editing.id) {
      setSponsors((prev) =>
        prev.map((s) =>
          s.id === editing.id ? ({ ...s, ...editing } as Sponsor) : s,
        ),
      );
    } else {
      setSponsors((prev) => [
        ...prev,
        { ...emptyS, ...editing, id: Date.now() } as Sponsor,
      ]);
    }
    setEditing(null);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div>
          <h1 className="page-title">Sponsors & Partners</h1>
          <p className="page-subtitle">
            Manage sponsorship listings shown on the site
          </p>
        </div>
        <button className="ktsa-btn-primary" onClick={() => setEditing(emptyS)}>
          + Add Sponsor
        </button>
      </div>

      {/* Modal */}
      {editing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
        >
          <div
            className="ktsa-card"
            style={{ width: "100%", maxWidth: 480, padding: 28 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>
                {editing.id ? "Edit Sponsor" : "Add Sponsor"}
              </h2>
              <button
                onClick={() => setEditing(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--ktsa-text-muted)",
                  cursor: "pointer",
                  fontSize: 22,
                }}
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleSave}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              {[
                {
                  key: "name",
                  label: "Sponsor Name *",
                  type: "text",
                  placeholder: "Company name",
                  req: true,
                },
                {
                  key: "logoUrl",
                  label: "Logo URL",
                  type: "url",
                  placeholder: "https://...",
                  req: false,
                },
                {
                  key: "websiteUrl",
                  label: "Website URL",
                  type: "url",
                  placeholder: "https://...",
                  req: false,
                },
              ].map((f) => (
                <div key={f.key}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--ktsa-text-muted)",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    className="ktsa-input"
                    required={f.req}
                    value={(editing as Record<string, string>)[f.key] || ""}
                    onChange={(e) =>
                      setEditing((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--ktsa-text-muted)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Tier
                </label>
                <select
                  className="ktsa-input"
                  value={editing.tier || "partner"}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, tier: e.target.value as Tier }))
                  }
                  style={{ appearance: "none", cursor: "pointer" }}
                >
                  <option value="title">Title Sponsor</option>
                  <option value="gold">Gold Sponsor</option>
                  <option value="silver">Silver Sponsor</option>
                  <option value="partner">Partner</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  id="active"
                  checked={editing.active ?? true}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, active: e.target.checked }))
                  }
                  style={{
                    accentColor: "var(--ktsa-primary)",
                    width: 16,
                    height: 16,
                  }}
                />
                <label
                  htmlFor="active"
                  style={{ fontSize: 13, color: "#fff", cursor: "pointer" }}
                >
                  Active (visible on site)
                </label>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button type="submit" className="ktsa-btn-primary">
                  {editing.id ? "Update" : "Add Sponsor"}
                </button>
                <button
                  type="button"
                  className="ktsa-btn-ghost"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="ktsa-card" style={{ overflow: "hidden" }}>
        {sponsors.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤝</div>
            <div style={{ color: "var(--ktsa-text-muted)" }}>
              No sponsors yet.
            </div>
          </div>
        ) : (
          <table className="ktsa-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Tier</th>
                <th>Website</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sponsors.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: "#fff" }}>{s.name}</td>
                  <td>
                    <span
                      className="ktsa-badge"
                      style={{
                        background: `${tierColors[s.tier]}15`,
                        color: tierColors[s.tier],
                        border: `1px solid ${tierColors[s.tier]}30`,
                      }}
                    >
                      {s.tier}
                    </span>
                  </td>
                  <td>
                    {s.websiteUrl ? (
                      <a
                        href={s.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--ktsa-primary)", fontSize: 12 }}
                      >
                        Visit ↗
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <span
                      className={`ktsa-badge ${s.active ? "ktsa-badge-success" : ""}`}
                      style={
                        !s.active
                          ? {
                              background: "rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.35)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }
                          : {}
                      }
                    >
                      {s.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="ktsa-btn-ghost"
                        style={{ fontSize: 12, padding: "5px 12px" }}
                        onClick={() => setEditing(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="ktsa-btn-ghost"
                        style={{
                          fontSize: 12,
                          padding: "5px 12px",
                          color: "#ef4444",
                          borderColor: "rgba(239,68,68,0.3)",
                        }}
                        onClick={() => {
                          if (confirm("Delete?"))
                            setSponsors((p) => p.filter((x) => x.id !== s.id));
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
