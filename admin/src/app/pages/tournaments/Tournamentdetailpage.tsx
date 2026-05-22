import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";

// ─── Types ────────────────────────────────────────────────────────────────────

type MatchStatus = "SCHEDULED" | "ONGOING" | "COMPLETED";
type TournamentStatus = "UPCOMING" | "ONGOING" | "COMPLETED";

interface Player {
  id: number;
  name: string;
}

interface Match {
  id: number;
  round: number;
  player1: Player;
  player2: Player;
  score1: number | null;
  score2: number | null;
  winnerId: number | null;
  status: MatchStatus;
  scheduledAt: string | null;
}

interface Standing {
  rank: number;
  player: Player;
  points: number;
  wins: number;
  losses: number;
  matchesPlayed: number;
}

interface Tournament {
  id: number;
  tournamentName: string;
  description: string;
  format: string;
  status: TournamentStatus;
  startDate: string;
  endDate: string | null;
  venue: string | null;
  pricePool: number | null;
  maxParticipants: number | null;
  challongeLink: string | null;
  participants: Player[];
  matches: Match[];
  standings: Standing[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusBadge = (status: TournamentStatus) => {
  const map: Record<TournamentStatus, { cls: string; label: string }> = {
    UPCOMING: { cls: "ktsa-badge-warning", label: "Upcoming" },
    ONGOING: { cls: "ktsa-badge-success", label: "Live" },
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

const matchStatusBadge = (status: MatchStatus) => {
  const map = {
    SCHEDULED: {
      bg: "rgba(251,191,36,0.12)",
      color: "#fbbf24",
      label: "Scheduled",
    },
    ONGOING: { bg: "rgba(34,197,94,0.12)", color: "#22c55e", label: "Live" },
    COMPLETED: {
      bg: "rgba(255,255,255,0.05)",
      color: "rgba(255,255,255,0.4)",
      label: "Done",
    },
  };
  const s = map[status];
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.color}33`,
      }}
    >
      {s.label}
    </span>
  );
};

const formatLabel = (f: string) =>
  f
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const InfoChip = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 4,
      padding: "12px 16px",
      background: "rgba(255,255,255,0.04)",
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.07)",
      minWidth: 120,
    }}
  >
    <span style={{ fontSize: 11, color: "var(--ktsa-text-muted)" }}>
      {icon} {label}
    </span>
    <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
      {value}
    </span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<
    "overview" | "matches" | "standings" | "participants"
  >("overview");
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const res = await fetch(`/api/tournaments/${id}`);
        if (!res.ok)
          throw new Error(`Failed to load tournament (${res.status})`);
        const data = await res.json();
        setTournament(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          padding: 60,
          textAlign: "center",
          color: "var(--ktsa-text-muted)",
        }}
      >
        Loading tournament…
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div style={{ padding: 40 }}>
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          ⚠ {error ?? "Tournament not found"}
        </div>
        <button
          className="ktsa-btn-ghost"
          onClick={() => navigate("/tournaments")}
        >
          ← Back to Tournaments
        </button>
      </div>
    );
  }

  // Group matches by round
  const rounds = tournament.matches.reduce<Record<number, Match[]>>(
    (acc, m) => {
      (acc[m.round] = acc[m.round] ?? []).push(m);
      return acc;
    },
    {},
  );

  const tabs: { key: typeof tab; label: string; count?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "matches", label: "Matches", count: tournament.matches.length },
    {
      key: "standings",
      label: "Standings",
      count: tournament.standings.length,
    },
    {
      key: "participants",
      label: "Participants",
      count: tournament.participants.length,
    },
  ];

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => navigate("/tournaments")}
            className="ktsa-btn-ghost"
            style={{ fontSize: 12, padding: "6px 12px", flexShrink: 0 }}
          >
            ← Back
          </button>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 4,
              }}
            >
              <h1 className="page-title" style={{ margin: 0 }}>
                {tournament.tournamentName}
              </h1>
              {statusBadge(tournament.status)}
            </div>
            <p className="page-subtitle" style={{ margin: 0 }}>
              {tournament.venue ?? "Venue TBD"} · {tournament.startDate}
              {tournament.endDate ? ` → ${tournament.endDate}` : ""}
            </p>
          </div>
        </div>
        <Link to={`/tournaments/${id}/edit`}>
          <button
            className="ktsa-btn-ghost"
            style={{ fontSize: 12, padding: "6px 14px" }}
          >
            ✏ Edit
          </button>
        </Link>
      </div>

      {/* Info chips */}
      <div
        style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}
      >
        <InfoChip
          icon="🏆"
          label="Format"
          value={formatLabel(tournament.format)}
        />
        {tournament.pricePool != null && (
          <InfoChip
            icon="💰"
            label="Prize Pool"
            value={`₹${tournament.pricePool.toLocaleString("en-IN")}`}
          />
        )}
        {tournament.maxParticipants != null && (
          <InfoChip
            icon="👥"
            label="Participants"
            value={`${tournament.participants.length} / ${tournament.maxParticipants}`}
          />
        )}
        {tournament.challongeLink && (
          <a
            href={tournament.challongeLink}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              background: "rgba(0,255,234,0.08)",
              color: "var(--ktsa-primary)",
              border: "1px solid rgba(0,255,234,0.2)",
              textDecoration: "none",
            }}
          >
            🔗 Live Bracket ↗
          </a>
        )}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          marginBottom: 20,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: tab === t.key ? 600 : 400,
              background: "none",
              border: "none",
              borderBottom:
                tab === t.key
                  ? "2px solid var(--ktsa-primary)"
                  : "2px solid transparent",
              color:
                tab === t.key
                  ? "var(--ktsa-primary)"
                  : "var(--ktsa-text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: -1,
            }}
          >
            {t.label}
            {t.count != null && (
              <span
                style={{
                  fontSize: 11,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: "1px 7px",
                  color: "var(--ktsa-text-muted)",
                }}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {tournament.description && (
            <div className="ktsa-card" style={{ padding: 20 }}>
              <div className="section-label">About</div>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--ktsa-text-muted)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {tournament.description}
              </p>
            </div>
          )}

          {/* Top 3 standings preview */}
          {tournament.standings.length > 0 && (
            <div className="ktsa-card" style={{ padding: 20 }}>
              <div className="section-label">Top Standings</div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {tournament.standings.slice(0, 3).map((s) => {
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div
                      key={s.player.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span style={{ fontSize: 18 }}>
                          {medals[s.rank - 1]}
                        </span>
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#fff",
                            fontSize: 14,
                          }}
                        >
                          {s.player.name}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          fontSize: 13,
                          color: "var(--ktsa-text-muted)",
                        }}
                      >
                        <span>
                          W:{" "}
                          <strong style={{ color: "#22c55e" }}>{s.wins}</strong>
                        </span>
                        <span>
                          L:{" "}
                          <strong style={{ color: "#ef4444" }}>
                            {s.losses}
                          </strong>
                        </span>
                        <span className="ktsa-badge ktsa-badge-success">
                          {s.points} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {tournament.standings.length > 3 && (
                <button
                  className="ktsa-btn-ghost"
                  onClick={() => setTab("standings")}
                  style={{ marginTop: 12, fontSize: 12 }}
                >
                  View all standings →
                </button>
              )}
            </div>
          )}

          {/* Recent matches preview */}
          {tournament.matches.length > 0 && (
            <div className="ktsa-card" style={{ padding: 20 }}>
              <div className="section-label">Recent Matches</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {tournament.matches
                  .filter((m) => m.status !== "SCHEDULED")
                  .slice(-3)
                  .reverse()
                  .map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                {tournament.matches.filter((m) => m.status !== "SCHEDULED")
                  .length === 0 && (
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--ktsa-text-muted)",
                      margin: 0,
                    }}
                  >
                    No matches played yet.
                  </p>
                )}
              </div>
              <button
                className="ktsa-btn-ghost"
                onClick={() => setTab("matches")}
                style={{ marginTop: 12, fontSize: 12 }}
              >
                View all matches →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Matches Tab ── */}
      {tab === "matches" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.keys(rounds).length === 0 && (
            <div
              className="ktsa-card"
              style={{ padding: 40, textAlign: "center" }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>🎮</div>
              <p
                style={{
                  color: "var(--ktsa-text-muted)",
                  fontSize: 14,
                  margin: 0,
                }}
              >
                No matches scheduled yet.
              </p>
            </div>
          )}
          {Object.entries(rounds)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([round, matches]) => (
              <div key={round}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--ktsa-text-muted)",
                    marginBottom: 10,
                  }}
                >
                  Round {round}
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {matches.map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ── Standings Tab ── */}
      {tab === "standings" && (
        <div className="ktsa-card" style={{ overflow: "hidden" }}>
          {tournament.standings.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📊</div>
              <p
                style={{
                  color: "var(--ktsa-text-muted)",
                  fontSize: 14,
                  margin: 0,
                }}
              >
                Standings will appear once matches are played.
              </p>
            </div>
          ) : (
            <table className="ktsa-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>W</th>
                  <th>L</th>
                  <th>Played</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {tournament.standings
                  .sort((a, b) => a.rank - b.rank)
                  .map((s) => (
                    <tr key={s.player.id}>
                      <td
                        style={{ color: "var(--ktsa-text-muted)", width: 40 }}
                      >
                        {s.rank <= 3 ? ["🥇", "🥈", "🥉"][s.rank - 1] : s.rank}
                      </td>
                      <td style={{ fontWeight: 600, color: "#fff" }}>
                        {s.player.name}
                      </td>
                      <td style={{ color: "#22c55e", fontWeight: 600 }}>
                        {s.wins}
                      </td>
                      <td style={{ color: "#ef4444", fontWeight: 600 }}>
                        {s.losses}
                      </td>
                      <td style={{ color: "var(--ktsa-text-muted)" }}>
                        {s.matchesPlayed}
                      </td>
                      <td>
                        <span className="ktsa-badge ktsa-badge-success">
                          {s.points}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Participants Tab ── */}
      {tab === "participants" && (
        <div className="ktsa-card" style={{ overflow: "hidden" }}>
          {tournament.participants.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>👥</div>
              <p
                style={{
                  color: "var(--ktsa-text-muted)",
                  fontSize: 14,
                  margin: 0,
                }}
              >
                No participants registered yet.
              </p>
            </div>
          ) : (
            <table className="ktsa-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Matches</th>
                  <th>W / L</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {tournament.participants.map((p, i) => {
                  const standing = tournament.standings.find(
                    (s) => s.player.id === p.id,
                  );
                  return (
                    <tr key={p.id}>
                      <td style={{ color: "var(--ktsa-text-muted)" }}>
                        {i + 1}
                      </td>
                      <td style={{ fontWeight: 600, color: "#fff" }}>
                        {p.name}
                      </td>
                      <td style={{ color: "var(--ktsa-text-muted)" }}>
                        {standing?.matchesPlayed ?? 0}
                      </td>
                      <td>
                        <span style={{ color: "#22c55e" }}>
                          {standing?.wins ?? 0}
                        </span>
                        {" / "}
                        <span style={{ color: "#ef4444" }}>
                          {standing?.losses ?? 0}
                        </span>
                      </td>
                      <td>
                        <span className="ktsa-badge ktsa-badge-success">
                          {standing?.points ?? 0}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Match Card ───────────────────────────────────────────────────────────────

function MatchCard({ match }: { match: Match }) {
  const p1Won = match.winnerId === match.player1.id;
  const p2Won = match.winnerId === match.player2.id;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Player 1 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: "flex-end",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: p1Won ? 700 : 400,
            color: p1Won ? "#fff" : "var(--ktsa-text-muted)",
          }}
        >
          {match.player1.name}
        </span>
        {p1Won && <span style={{ fontSize: 12 }}>🏆</span>}
      </div>

      {/* Score */}
      <div style={{ textAlign: "center" }}>
        {match.status === "COMPLETED" || match.status === "ONGOING" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: p1Won ? "var(--ktsa-primary)" : "#fff",
                minWidth: 20,
                textAlign: "center",
              }}
            >
              {match.score1 ?? 0}
            </span>
            <span style={{ color: "var(--ktsa-text-muted)", fontSize: 13 }}>
              —
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: p2Won ? "var(--ktsa-primary)" : "#fff",
                minWidth: 20,
                textAlign: "center",
              }}
            >
              {match.score2 ?? 0}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 13, color: "var(--ktsa-text-muted)" }}>
            vs
          </span>
        )}
        <div style={{ marginTop: 4 }}>{matchStatusBadge(match.status)}</div>
      </div>

      {/* Player 2 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {p2Won && <span style={{ fontSize: 12 }}>🏆</span>}
        <span
          style={{
            fontSize: 14,
            fontWeight: p2Won ? 700 : 400,
            color: p2Won ? "#fff" : "var(--ktsa-text-muted)",
          }}
        >
          {match.player2.name}
        </span>
      </div>
    </div>
  );
}
