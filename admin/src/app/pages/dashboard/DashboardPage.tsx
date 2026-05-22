import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import {
  mockTournaments,
  mockNews,
  mockSponsors,
  //   type TournamentStatus,
} from "../../mock/data";
// import { mockTournaments, mockNews, mockSponsors,  } from '../mock/data';

export default function DashboardPage() {
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  const stats = [
    {
      label: "Tournaments",
      value: mockTournaments.length,
      icon: "🏆",
      color: "#00ffea",
      link: "/tournaments",
    },
    {
      label: "News Articles",
      value: mockNews.filter((n) => n.status === "published").length,
      icon: "📰",
      color: "#14b8a6",
      link: "/cms/news",
    },
    {
      label: "CMS Sections",
      value: 6,
      icon: "📄",
      color: "#2dd4bf",
      link: "/cms/homepage",
    },
    {
      label: "Sponsors",
      value: mockSponsors.filter((s) => s.active).length,
      icon: "🤝",
      color: "#08867c",
      link: "/cms/sponsors",
    },
  ];

  const quickLinks = [
    {
      label: "Add Tournament",
      path: "/tournaments/new",
      icon: "➕",
      desc: "Create a new tournament entry",
    },
    {
      label: "Write Article",
      path: "/cms/news",
      icon: "✍️",
      desc: "Publish news or announcements",
    },
    {
      label: "Edit Homepage",
      path: "/cms/homepage",
      icon: "🏠",
      desc: "Update homepage sections",
    },
    {
      label: "Manage Sponsors",
      path: "/cms/sponsors",
      icon: "🤝",
      desc: "Add or update sponsors",
    },
  ];

  const recentTournaments = [...mockTournaments].slice(0, 3);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">
          Good {greeting},{" "}
          <span className="glow-text">
            {user?.name?.split(" ")[0] ?? "Admin"}
          </span>
        </h1>
        <p className="page-subtitle">Here's what's happening with KTSA.</p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            style={{ textDecoration: "none" }}
          >
            <div
              className="ktsa-card"
              style={{ padding: 20, cursor: "pointer" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>{stat.icon}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: `${stat.color}15`,
                    color: stat.color,
                    border: `1px solid ${stat.color}25`,
                  }}
                >
                  view
                </span>
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: stat.color,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ktsa-text-muted)",
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Quick actions */}
        <div>
          <div className="section-label">Quick actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {quickLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="ktsa-card"
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,255,234,0.06)",
                      border: "1px solid var(--ktsa-border)",
                    }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#fff",
                        marginBottom: 2,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "var(--ktsa-text-muted)" }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent tournaments */}
        <div>
          <div className="section-label">Recent Tournaments</div>
          <div className="ktsa-card" style={{ overflow: "hidden" }}>
            {recentTournaments.map((t, i) => (
              <Link
                key={t.id}
                to={`/tournaments/${t.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom:
                      i < recentTournaments.length - 1
                        ? "1px solid rgba(0,255,234,0.06)"
                        : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(0,255,234,0.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#fff",
                        marginBottom: 2,
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "var(--ktsa-text-muted)" }}
                    >
                      {t.date}
                    </div>
                  </div>
                  <span
                    className={`ktsa-badge ${
                      t.status === "completed"
                        ? ""
                        : (t.status as string) === "ongoing"
                          ? "ktsa-badge-success"
                          : "ktsa-badge-warning"
                    }`}
                    style={
                      t.status === "completed"
                        ? {
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.4)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }
                        : {}
                    }
                  >
                    {t.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          marginTop: 24,
          padding: "14px 18px",
          borderRadius: 10,
          background: "rgba(0,255,234,0.04)",
          border: "1px solid rgba(0,255,234,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 16 }}>ℹ️</span>
        <div style={{ fontSize: 13, color: "var(--ktsa-text-muted)" }}>
          Currently running with mock data. Connect the Spring Boot API to go
          live.
        </div>
      </div>
    </div>
  );
}
