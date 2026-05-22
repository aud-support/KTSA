import { useState } from "react";
import { mockCMS } from "../../mock/data";

interface Field {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "email" | "richtext";
  placeholder?: string;
}

interface CMSEditorProps {
  section: string;
  title: string;
  subtitle: string;
  fields: Field[];
}

export default function CMSEditor({
  section,
  title,
  subtitle,
  fields,
}: CMSEditorProps) {
  const [data, setData] = useState<Record<string, string>>(
    mockCMS[section] || {},
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: string, value: string) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // TODO: replace with API call
    setTimeout(() => {
      mockCMS[section] = { ...data }; // update mock in memory
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="ktsa-card" style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {fields.map((field) => (
              <div key={field.key}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--ktsa-text-muted)",
                    marginBottom: 6,
                  }}
                >
                  {field.label}
                </label>
                {field.type === "textarea" || field.type === "richtext" ? (
                  <textarea
                    className="ktsa-input"
                    value={data[field.key] || ""}
                    onChange={(e) => set(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={field.type === "richtext" ? 8 : 4}
                    style={{ resize: "vertical", lineHeight: 1.7 }}
                  />
                ) : (
                  <input
                    type={field.type}
                    className="ktsa-input"
                    value={data[field.key] || ""}
                    onChange={(e) => set(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button type="submit" className="ktsa-btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && (
            <span
              style={{
                fontSize: 13,
                color: "var(--ktsa-primary)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ✓ Saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
