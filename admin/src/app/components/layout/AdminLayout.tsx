import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", path: "/", icon: "▤" }],
  },
  {
    group: "Tournaments",
    items: [
      { label: "All Tournaments", path: "/tournaments", icon: "🏆" },
      { label: "Rules", path: "/tournaments/rules", icon: "📋" },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Homepage", path: "/cms/homepage", icon: "🏠" },
      { label: "About Us", path: "/cms/about", icon: "👥" },
      { label: "Contact", path: "/cms/contact", icon: "✉️" },
      { label: "News / Articles", path: "/cms/news", icon: "📰" },
      { label: "Sponsors", path: "/cms/sponsors", icon: "🤝" },
      { label: "Footer & Social", path: "/cms/footer", icon: "🔗" },
    ],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--ktsa-bg)",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: collapsed ? 60 : 232,
          background: "var(--ktsa-surface)",
          borderRight: "1px solid var(--ktsa-border)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.22s ease",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: collapsed ? "18px 12px" : "18px 16px",
            borderBottom: "1px solid var(--ktsa-border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            minHeight: 68,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              flexShrink: 0,
              background:
                "linear-gradient(135deg, rgba(0,255,234,0.15), rgba(8,134,124,0.3))",
              border: "1px solid rgba(0,255,234,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
            }}
          >
            ⚡
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--ktsa-primary)",
                  whiteSpace: "nowrap",
                }}
              >
                KTSA
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ktsa-text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                Admin Portal
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "10px 6px",
          }}
        >
          {navItems.map((group) => (
            <div key={group.group} style={{ marginBottom: 18 }}>
              {!collapsed && (
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--ktsa-text-muted)",
                    padding: "0 8px 6px",
                  }}
                >
                  {group.group}
                </div>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  title={collapsed ? item.label : undefined}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: collapsed ? "9px 0" : "8px 10px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderRadius: 8,
                    marginBottom: 2,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    background: isActive
                      ? "rgba(0,255,234,0.08)"
                      : "transparent",
                    color: isActive
                      ? "var(--ktsa-primary)"
                      : "var(--ktsa-text-muted)",
                    border: isActive
                      ? "1px solid rgba(0,255,234,0.15)"
                      : "1px solid transparent",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  })}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {!collapsed && item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div
          style={{
            padding: "10px 6px",
            borderTop: "1px solid var(--ktsa-border)",
          }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand" : "Collapse"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 10,
              width: "100%",
              padding: collapsed ? "8px 0" : "8px 10px",
              borderRadius: 8,
              background: "transparent",
              border: "1px solid transparent",
              color: "var(--ktsa-text-muted)",
              cursor: "pointer",
              fontSize: 13,
              marginBottom: 4,
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 14, flexShrink: 0 }}>
              {collapsed ? "▶" : "◀"}
            </span>
            {!collapsed && "Collapse"}
          </button>

          {!collapsed && user && (
            <div
              style={{
                padding: 10,
                borderRadius: 8,
                background: "rgba(0,255,234,0.04)",
                border: "1px solid var(--ktsa-border)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 2,
                  color: "#fff",
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ktsa-text-muted)",
                  marginBottom: 10,
                }}
              >
                {user.email}
              </div>
              <button
                onClick={handleLogout}
                className="ktsa-btn-ghost"
                style={{ width: "100%", fontSize: 12, padding: "6px 12px" }}
              >
                Sign out
              </button>
            </div>
          )}

          {collapsed && (
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "8px 0",
                borderRadius: 8,
                background: "transparent",
                border: "1px solid transparent",
                color: "var(--ktsa-text-muted)",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ⎋
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Topbar */}
        <header
          style={{
            height: 60,
            padding: "0 24px",
            borderBottom: "1px solid var(--ktsa-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--ktsa-surface)",
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 13, color: "var(--ktsa-text-muted)" }}>
            Karnataka Table Soccer Association
          </div>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
              background: "rgba(0,255,234,0.1)",
              color: "var(--ktsa-primary)",
              border: "1px solid rgba(0,255,234,0.2)",
            }}
          >
            Admin
          </span>
        </header>

        {/* Page */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
