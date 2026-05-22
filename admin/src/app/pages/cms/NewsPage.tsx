import { useState } from "react";
import { mockNews } from "../../mock/data";

type Status = "draft" | "published";
interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  status: Status;
  publishedAt: string;
}

const emptyArticle: Omit<Article, "id"> = {
  title: "",
  content: "",
  author: "",
  status: "draft",
  publishedAt: "",
};

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>(mockNews);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (editing.id) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editing.id ? ({ ...a, ...editing } as Article) : a,
        ),
      );
    } else {
      const newArticle: Article = {
        ...emptyArticle,
        ...editing,
        id: Date.now(),
        publishedAt:
          editing.status === "published"
            ? new Date().toISOString().split("T")[0]
            : "",
      } as Article;
      setArticles((prev) => [newArticle, ...prev]);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setEditing(null);
    }, 800);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this article?")) return;
    setArticles((prev) => prev.filter((a) => a.id !== id));
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
          <h1 className="page-title">News & Articles</h1>
          <p className="page-subtitle">Manage all published content</p>
        </div>
        <button
          className="ktsa-btn-primary"
          onClick={() => setEditing(emptyArticle)}
        >
          + New Article
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
            style={{
              width: "100%",
              maxWidth: 660,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>
                {editing.id ? "Edit Article" : "New Article"}
              </h2>
              <button
                onClick={() => setEditing(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--ktsa-text-muted)",
                  cursor: "pointer",
                  fontSize: 22,
                  lineHeight: 1,
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
                  key: "title",
                  label: "Title *",
                  type: "text",
                  placeholder: "Article title...",
                  required: true,
                },
                {
                  key: "author",
                  label: "Author",
                  type: "text",
                  placeholder: "Author name",
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
                    required={f.required}
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
                  Content *
                </label>
                <textarea
                  className="ktsa-input"
                  value={editing.content || ""}
                  required
                  rows={9}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, content: e.target.value }))
                  }
                  placeholder="Write article content here..."
                  style={{ resize: "vertical", lineHeight: 1.7 }}
                />
              </div>
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
                  Status
                </label>
                <select
                  className="ktsa-input"
                  value={editing.status || "draft"}
                  onChange={(e) =>
                    setEditing((p) => ({
                      ...p,
                      status: e.target.value as Status,
                    }))
                  }
                  style={{ appearance: "none", cursor: "pointer" }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 4,
                }}
              >
                <button type="submit" className="ktsa-btn-primary">
                  {saved
                    ? "✓ Saved!"
                    : editing.id
                      ? "Update Article"
                      : "Create Article"}
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
        {articles.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📰</div>
            <div style={{ color: "var(--ktsa-text-muted)" }}>
              No articles yet.
            </div>
          </div>
        ) : (
          <table className="ktsa-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600, color: "#fff" }}>{a.title}</td>
                  <td style={{ color: "var(--ktsa-text-muted)" }}>
                    {a.author || "—"}
                  </td>
                  <td>
                    <span
                      className={`ktsa-badge ${a.status === "published" ? "ktsa-badge-success" : "ktsa-badge-warning"}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--ktsa-text-muted)", fontSize: 12 }}>
                    {a.publishedAt || "—"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="ktsa-btn-ghost"
                        style={{ fontSize: 12, padding: "5px 12px" }}
                        onClick={() => setEditing(a)}
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
                        onClick={() => handleDelete(a.id)}
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
