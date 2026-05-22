import { useState } from "react";
import { useNavigate } from "react-router";
import { mockTournaments } from "../../mock/data";

type Tournament = (typeof mockTournaments)[0];

export default function TournamentListPage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>(mockTournaments);

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("Delete this tournament?")) return;
    setTournaments((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigate(`/tournaments/${id}/edit`);
  };

  const statusBadge = (status: Tournament["status"]) => {
    const map: Record<string, { cls: string; label: string }> = {
      upcoming: { cls: "ktsa-badge-warning", label: "Upcoming" },
      UPCOMING: { cls: "ktsa-badge-warning", label: "Upcoming" },
      ongoing: { cls: "ktsa-badge-success", label: "Live" },
      ONGOING: { cls: "ktsa-badge-success", label: "Live" },
      completed: { cls: "", label: "Completed" },
      COMPLETED: { cls: "", label: "Completed" },
    };
    const s = map[status] ?? { cls: "", label: status };
    return (
      <span
        className={`ktsa-badge ${s.cls}`}
        style={
          !s.cls
            ? {
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.1)",
              }
            : {}
        }
      >
        {s.label}
      </span>
    );
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
          <h1 className="page-title">Tournaments</h1>
          <p className="page-subtitle">Manage all KTSA tournament entries</p>
        </div>
        <button
          className="ktsa-btn-primary"
          onClick={() => navigate("/tournaments/new")}
        >
          + Create Tournament
        </button>
      </div>

      <div className="ktsa-card" style={{ overflow: "hidden" }}>
        {tournaments.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏆</div>
            <div style={{ color: "var(--ktsa-text-muted)", fontSize: 14 }}>
              No tournaments yet. Create one to get started.
            </div>
          </div>
        ) : (
          <table className="ktsa-table">
            <thead>
              <tr>
                <th>Tournament</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Format</th>
                <th>Venue</th>
                <th>Prize Pool</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/tournaments/${t.id}`)}
                  style={{ cursor: "pointer" }}
                  title="Click to view details"
                >
                  <td style={{ fontWeight: 600, color: "#fff" }}>{t.name}</td>
                  <td style={{ color: "var(--ktsa-text-muted)", fontSize: 12 }}>
                    <div>{(t as any).startDate ?? t.date ?? "—"}</div>
                    {(t as any).endDate && (
                      <div style={{ opacity: 0.6 }}>→ {(t as any).endDate}</div>
                    )}
                  </td>
                  <td>{statusBadge(t.status)}</td>
                  <td style={{ color: "var(--ktsa-text-muted)", fontSize: 12 }}>
                    {(t as any).format
                      ? (t as any).format
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (c: string) => c.toUpperCase())
                      : "—"}
                  </td>
                  <td style={{ color: "var(--ktsa-text-muted)", fontSize: 12 }}>
                    {(t as any).venue ?? "—"}
                  </td>
                  <td style={{ color: "var(--ktsa-text-muted)", fontSize: 12 }}>
                    {(t as any).pricePool != null
                      ? `₹${Number((t as any).pricePool).toLocaleString("en-IN")}`
                      : "—"}
                  </td>
                  <td>
                    <div
                      style={{ display: "flex", gap: 8 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="ktsa-btn-ghost"
                        style={{ fontSize: 12, padding: "5px 12px" }}
                        onClick={(e) => handleEdit(e, t.id)}
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
                        onClick={(e) => handleDelete(e, t.id)}
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
