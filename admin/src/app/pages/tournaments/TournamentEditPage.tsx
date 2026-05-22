import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { mockTournaments } from "../../mock/data";

type Status = "UPCOMING" | "ONGOING" | "COMPLETED";
type Format =
  | "SINGLE_ELIMINATION"
  | "DOUBLE_ELIMINATION"
  | "ROUND_ROBIN"
  | "SWISS";

interface TournamentForm {
  tournamentName: string;
  description: string;
  format: Format;
  status: Status;
  startDate: string;
  endDate: string;
  venue: string;
  pricePool: number | "";
  maxParticipants: number | "";
  challongeLink: string;
}

const empty: TournamentForm = {
  tournamentName: "",
  description: "",
  format: "SINGLE_ELIMINATION",
  status: "UPCOMING",
  startDate: "",
  endDate: "",
  venue: "",
  pricePool: "",
  maxParticipants: "",
  challongeLink: "",
};

export default function TournamentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const existing = !isNew
    ? mockTournaments.find((t) => t.id === Number(id))
    : null;

  const [form, setForm] = useState<TournamentForm>(
    existing
      ? {
          ...empty,
          ...existing,
          tournamentName: existing.name ?? "",
          status: (existing.status?.toUpperCase() as Status) ?? "UPCOMING",
        }
      : empty,
  );
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof TournamentForm, value: unknown) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      tournamentName: form.tournamentName,
      description: form.description,
      format: form.format,
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate || null,
      venue: form.venue || null,
      pricePool: form.pricePool === "" ? null : Number(form.pricePool),
      maxParticipants:
        form.maxParticipants === "" ? null : Number(form.maxParticipants),
      challongeLink: form.challongeLink || null,
    };

    try {
      const url = isNew ? "/api/tournaments" : `/api/tournaments/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? `Request failed (${res.status})`);
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate("/tournaments");
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const DateInput = ({
    value,
    onChange,
    required,
  }: {
    value: string;
    onChange: (v: string) => void;
    required?: boolean;
  }) => {
    const ref = useRef<HTMLInputElement>(null);
    return (
      <div style={{ position: "relative" }}>
        <input
          ref={ref}
          type="date"
          className="ktsa-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          style={{ paddingRight: 40 }}
        />
        <button
          type="button"
          onClick={() => ref.current?.showPicker?.()}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--ktsa-text-muted)",
            fontSize: 16,
            lineHeight: 1,
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Show date picker"
        >
          📅
        </button>
      </div>
    );
  };

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
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
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: 760 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <button
          onClick={() => navigate("/tournaments")}
          className="ktsa-btn-ghost"
          style={{ fontSize: 12, padding: "6px 12px" }}
        >
          ← Back
        </button>
        <div>
          <h1 className="page-title">
            {isNew ? "Create Tournament" : "Edit Tournament"}
          </h1>
          <p className="page-subtitle">
            {isNew
              ? "Add a new tournament entry"
              : `Editing: ${form.tournamentName}`}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 18 }}
      >
        <div className="ktsa-card" style={{ padding: 24 }}>
          <div className="section-label">Basic Information</div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <Field label="Tournament Name *">
              <input
                className="ktsa-input"
                value={form.tournamentName}
                onChange={(e) => set("tournamentName", e.target.value)}
                required
                placeholder="e.g. Bengaluru Open 2026"
              />
            </Field>
            <Field label="Venue">
              <input
                className="ktsa-input"
                value={form.venue}
                onChange={(e) => set("venue", e.target.value)}
                placeholder="e.g. Koramangala Indoor Stadium"
              />
            </Field>
            <Field label="Start Date *">
              <DateInput
                value={form.startDate}
                onChange={(v) => set("startDate", v)}
                required
              />
            </Field>
            <Field label="End Date">
              <DateInput
                value={form.endDate}
                onChange={(v) => set("endDate", v)}
              />
            </Field>
            <Field label="Format">
              <select
                className="ktsa-input"
                value={form.format}
                onChange={(e) => set("format", e.target.value as Format)}
                style={{ appearance: "none", cursor: "pointer" }}
              >
                <option value="SINGLE_ELIMINATION">Single Elimination</option>
                <option value="DOUBLE_ELIMINATION">Double Elimination</option>
                <option value="ROUND_ROBIN">Round Robin</option>
                <option value="SWISS">Swiss</option>
              </select>
            </Field>
            <Field label="Status">
              <select
                className="ktsa-input"
                value={form.status}
                onChange={(e) => set("status", e.target.value as Status)}
                style={{ appearance: "none", cursor: "pointer" }}
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing / Live</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </Field>
            <Field label="Max Participants">
              <input
                type="number"
                className="ktsa-input"
                value={form.maxParticipants}
                onChange={(e) =>
                  set(
                    "maxParticipants",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="e.g. 16"
                min={2}
              />
            </Field>
            <Field label="Prize Pool (₹)">
              <input
                type="number"
                className="ktsa-input"
                value={form.pricePool}
                onChange={(e) =>
                  set(
                    "pricePool",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="e.g. 50000"
                min={0}
              />
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Challonge Bracket URL">
                <input
                  className="ktsa-input"
                  value={form.challongeLink}
                  onChange={(e) => set("challongeLink", e.target.value)}
                  placeholder="https://challonge.com/..."
                />
              </Field>
            </div>
          </div>

          {form.challongeLink && (
            <div style={{ marginTop: 12 }}>
              <a
                href={form.challongeLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  background: "rgba(0,255,234,0.08)",
                  color: "var(--ktsa-primary)",
                  border: "1px solid rgba(0,255,234,0.2)",
                  textDecoration: "none",
                }}
              >
                🔗 View Live Bracket ↗
              </a>
            </div>
          )}

          <div style={{ marginTop: 14 }}>
            <Field label="Description">
              <textarea
                className="ktsa-input"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Tournament description, rules, format details..."
                rows={3}
                style={{ resize: "vertical" }}
              />
            </Field>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
              fontSize: 13,
            }}
          >
            ⚠ {error}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button type="submit" className="ktsa-btn-primary" disabled={loading}>
            {loading ? "Saving…" : isNew ? "Create Tournament" : "Save Changes"}
          </button>
          <button
            type="button"
            className="ktsa-btn-ghost"
            onClick={() => navigate("/tournaments")}
            disabled={loading}
          >
            Cancel
          </button>
          {saved && (
            <span style={{ fontSize: 13, color: "var(--ktsa-primary)" }}>
              ✓ Saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
