import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ktsa-bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,255,234,0.05) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          backgroundImage:
            "linear-gradient(var(--ktsa-primary) 1px, transparent 1px), linear-gradient(90deg, var(--ktsa-primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 380,
          padding: "0 20px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              margin: "0 auto 14px",
              background:
                "linear-gradient(135deg, rgba(0,255,234,0.12), rgba(8,134,124,0.25))",
              border: "1px solid rgba(0,255,234,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              boxShadow: "0 0 30px rgba(0,255,234,0.08)",
            }}
          >
            ⚡
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: 4,
            }}
          >
            KTSA Admin
          </h1>
          <p style={{ fontSize: 13, color: "var(--ktsa-text-muted)" }}>
            Karnataka Table Soccer Association
          </p>
        </div>

        <div className="ktsa-card" style={{ padding: 26 }}>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 18,
              color: "#fff",
            }}
          >
            Sign in
          </h2>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--ktsa-text-muted)",
                  marginBottom: 6,
                }}
              >
                Email address
              </label>
              <input
                type="email"
                className="ktsa-input"
                placeholder="admin@ktsaofficial.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--ktsa-text-muted)",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <input
                type="password"
                className="ktsa-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#ef4444",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="ktsa-btn-primary"
              disabled={loading}
              style={{ marginTop: 4, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p
            style={{
              marginTop: 16,
              fontSize: 12,
              color: "var(--ktsa-text-muted)",
              textAlign: "center",
            }}
          >
            Use{" "}
            <code style={{ color: "var(--ktsa-primary)", fontSize: 11 }}>
              admin@ktsaofficial.in
            </code>{" "}
            /{" "}
            <code style={{ color: "var(--ktsa-primary)", fontSize: 11 }}>
              admin123
            </code>
          </p>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 12,
            color: "var(--ktsa-text-muted)",
          }}
        >
          Access restricted to authorised administrators only.
        </p>
      </div>
    </div>
  );
}
