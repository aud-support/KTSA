import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Star, Link, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input, Textarea, Select } from "../components/Input";
import { useCMS } from "../context/CMSContext";
import type { ArticleLink } from "../context/CMSContext";
import {
  getArticles,
  createArticle,
  updateArticle as updateArticleApi,
  deleteArticle as deleteArticleApi,
} from "../../services/articlesService";

const CATEGORY_OPTIONS = [
  { value: "KTSA", label: "KTSA" },
  { value: "Events", label: "Events" },
  { value: "Global", label: "Global" },
];

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "KTSA Admin",
  publishedDate: new Date().toISOString().split("T")[0],
  imageUrl: "",
  category: "KTSA",
  featured: false,
  links: [] as ArticleLink[],
};

export const Articles: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle, setAllArticles } =
    useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);

  // ── Load articles from backend on mount ───────────────────────
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const data = await getArticles();
        setAllArticles(data);
      } catch (error) {
        console.error("Failed to load articles", error);
        toast.error("Failed to load articles from server");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Link helpers ──────────────────────────────────────────────
  const addLink = () =>
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { label: "", url: "" }],
    }));

  const removeLink = (idx: number) =>
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== idx),
    }));

  const updateLink = (idx: number, field: keyof ArticleLink, value: string) =>
    setFormData((prev) => {
      const links = [...prev.links];
      links[idx] = { ...links[idx], [field]: value };
      return { ...prev, links };
    });

  // ── CRUD handlers ─────────────────────────────────────────────
  const handleEdit = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (article) {
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        publishedDate: article.publishedDate,
        imageUrl: article.imageUrl || "",
        category: article.category || "KTSA",
        featured: article.featured || false,
        links: article.links || [],
      });
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    // Strip empty link rows before saving
    const payload = {
      ...formData,
      links: formData.links.filter((l) => l.label.trim() && l.url.trim()),
    };

    setLoading(true);
    try {
      if (editingId) {
        const updated = await updateArticleApi(editingId, payload);
        updateArticle(editingId, updated);
        toast.success("Article updated successfully!", { duration: 2000 });
        setEditingId(null);
      } else {
        const created = await createArticle(payload);
        addArticle(created);
        toast.success("Article published successfully!", { duration: 2000 });
        setIsAdding(false);
      }
      setFormData({ ...emptyForm });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteArticleApi(id);
      deleteArticle(id);
      toast.success("Article deleted", { duration: 2000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ ...emptyForm });
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">News / Articles</h1>
          <p className="text-muted-foreground">
            Manage news articles and announcements
          </p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} disabled={loading}>
            <Plus size={20} className="mr-2" />
            Write Article
          </Button>
        )}
      </div>

      {/* ── Add / Edit Form ──────────────────────────────────────── */}
      {(isAdding || editingId) && (
        <Card className="mb-6">
          <h3 className="mb-4">
            {editingId ? "Edit Article" : "Write New Article"}
          </h3>
          <div className="space-y-4">
            {/* Title */}
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Article title"
            />

            {/* Excerpt */}
            <Input
              label="Excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Short summary shown on listing pages"
            />

            {/* Content */}
            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full article content..."
              rows={8}
            />

            {/* Author + Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
              />
              <Input
                label="Published Date"
                type="date"
                value={formData.publishedDate}
                onChange={(e) =>
                  setFormData({ ...formData, publishedDate: e.target.value })
                }
              />
            </div>

            {/* Category + Featured */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={CATEGORY_OPTIONS}
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Featured Article</label>
                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="h-4 w-4 accent-ktsa-primary"
                  />
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Star size={14} className="text-yellow-400" />
                    Show as featured on the news page
                  </span>
                </label>
              </div>
            </div>

            {/* Image URL */}
            <Input
              label="Image URL (optional)"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
            />
            {formData.imageUrl && (
              <div className="rounded-lg overflow-hidden border border-border h-40">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}

            {/* ── Hyperlinks section ─────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Link size={15} className="text-ktsa-primary" />
                  Article Links
                  <span className="text-xs text-muted-foreground font-normal">
                    — displayed as buttons at the bottom of the article
                  </span>
                </label>
                <Button variant="secondary" size="sm" onClick={addLink} type="button">
                  <Plus size={14} className="mr-1" /> Add Link
                </Button>
              </div>

              {formData.links.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No links added yet. Click "Add Link" to attach a hyperlink to this article.
                </p>
              ) : (
                <div className="space-y-2">
                  {formData.links.map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-end gap-2 p-3 bg-secondary/30 rounded-lg border border-border"
                    >
                      <div className="flex-1">
                        <label className="block text-xs text-muted-foreground mb-1">
                          Label (button text)
                        </label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateLink(idx, "label", e.target.value)}
                          placeholder="e.g. Watch Highlights"
                          className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ktsa-accent text-foreground"
                        />
                      </div>
                      <div className="flex-[2]">
                        <label className="block text-xs text-muted-foreground mb-1">
                          URL
                        </label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateLink(idx, "url", e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ktsa-accent text-foreground"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLink(idx)}
                        className="p-2 hover:bg-destructive/10 rounded-md transition-colors flex-shrink-0 mb-0.5"
                        title="Remove link"
                      >
                        <Trash2 size={14} className="text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : editingId ? "Save Changes" : "Publish"}
              </Button>
              <Button variant="ghost" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Loading state */}
      {loading && !isAdding && !editingId && (
        <p className="text-muted-foreground text-sm mb-4">Loading articles...</p>
      )}

      {/* ── Articles List ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="relative overflow-hidden">
            {/* Featured badge */}
            {article.featured && (
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-semibold">
                  <Star size={11} />
                  Featured
                </span>
              </div>
            )}

            {/* Thumbnail */}
            {article.imageUrl && (
              <div className="h-32 -mx-4 -mt-4 mb-4 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}

            <div className="flex items-start justify-between mb-2">
              <h3 className="flex-1 pr-10 leading-snug">{article.title}</h3>
            </div>

            {/* Category */}
            {article.category && (
              <span className="inline-block mb-2 px-2 py-0.5 bg-ktsa-primary/10 text-ktsa-primary border border-ktsa-primary/20 rounded-full text-xs font-semibold">
                {article.category}
              </span>
            )}

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {article.excerpt}
            </p>

            {/* Links preview */}
            {article.links && article.links.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {article.links.map((link, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2 py-0.5 bg-ktsa-accent/10 text-ktsa-accent border border-ktsa-accent/20 rounded-full text-xs font-medium"
                  >
                    <ExternalLink size={10} />
                    {link.label}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{article.author}</span>
              <span>
                {new Date(article.publishedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-1">
              {!article.featured && (
                <button
                  onClick={() => handleEdit(article.id)}
                  className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} className="text-ktsa-primary" />
                </button>
              )}
              {article.featured && (
                <button
                  onClick={() => handleEdit(article.id)}
                  className="p-1.5 hover:bg-secondary rounded-lg transition-colors mt-6"
                  title="Edit"
                >
                  <Pencil size={15} className="text-ktsa-primary" />
                </button>
              )}
              <button
                onClick={() => handleDelete(article.id)}
                className={`p-1.5 hover:bg-destructive/10 rounded-lg transition-colors ${article.featured ? "mt-6" : ""}`}
                title="Delete"
                disabled={loading}
              >
                <Trash2 size={15} className="text-destructive" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-semibold mb-2">No articles yet</p>
          <p className="text-sm">
            Click "Write Article" to publish your first article.
          </p>
        </div>
      )}
    </div>
  );
};
