import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Pencil, UploadCloud, X, Check, Image } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Textarea } from "../components/Input";
import {
  getGalleryItems,
  uploadGalleryImage,
  updateGalleryItem,
  deleteGalleryItem,
  GalleryItem,
} from "../../services/galleryService";

// Dynamic year list: 2 years ahead of current, back 10 years
// e.g. in 2026 → [2028, 2027, 2026, 2025 … 2016]
const buildYearOptions = (): string[] => {
  const now = new Date().getFullYear();
  return Array.from({ length: 13 }, (_, i) => String(now + 2 - i));
};

const YEAR_OPTIONS = buildYearOptions();
const DEFAULT_YEAR = String(new Date().getFullYear());

const emptyForm = { caption: "", year: DEFAULT_YEAR };

export const Gallery: React.FC = () => {
  const [items, setItems]         = useState<GalleryItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isAdding, setIsAdding]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm]           = useState({ ...emptyForm });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]     = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      setItems(await getGalleryItems());
    } catch {
      toast.error("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  // ── File picker ───────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file"); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB"); return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetAdd = () => {
    setIsAdding(false);
    setForm({ ...emptyForm });
    clearFile();
  };

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile) { toast.error("Please select an image first"); return; }
    setUploading(true);
    try {
      const created = await uploadGalleryImage(selectedFile, form.caption, form.year);
      setItems(prev => [...prev, created]);
      toast.success("Image uploaded successfully!", { duration: 2000 });
      resetAdd();
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setForm({ caption: item.caption, year: item.year || DEFAULT_YEAR });
    setIsAdding(false);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setUploading(true);
    try {
      const updated = await updateGalleryItem(editingId, form.caption, form.year);
      setItems(prev => prev.map(i => i.id === editingId ? { ...i, ...updated } : i));
      toast.success("Updated successfully!", { duration: 2000 });
      setEditingId(null);
      setForm({ ...emptyForm });
    } catch {
      toast.error("Failed to update. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this image from the gallery?")) return;
    try {
      await deleteGalleryItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success("Image deleted", { duration: 2000 });
    } catch {
      toast.error("Failed to delete. Please try again.");
    }
  };

  // ── Year select helper ─────────────────────────────────────────────────────
  const YearSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">Year</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ktsa-primary"
      >
        {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Gallery</h1>
          <p className="text-muted-foreground">Manage gallery images shown on the public site</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} disabled={loading}>
            <Plus size={20} className="mr-2" /> Add Image
          </Button>
        )}
      </div>

      {/* ── Upload Form ───────────────────────────────────────────────────── */}
      {isAdding && (
        <Card className="mb-6">
          <h3 className="mb-4">Upload New Image</h3>
          <div className="space-y-4">
            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-ktsa-primary/60 hover:bg-ktsa-primary/5 transition-colors"
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-xl" />
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); clearFile(); }}
                    className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </>
              ) : (
                <>
                  <UploadCloud size={36} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">Click to select an image</p>
                  <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP · max 5 MB</p>
                </>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            <Textarea
              label="Caption (optional)"
              value={form.caption}
              onChange={e => setForm({ ...form, caption: e.target.value })}
              placeholder="Describe the image or moment…"
              rows={2}
            />

            <YearSelect value={form.year} onChange={v => setForm({ ...form, year: v })} />

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleUpload} disabled={uploading || !selectedFile}>
                {uploading ? "Uploading…" : "Upload Image"}
              </Button>
              <Button variant="ghost" onClick={resetAdd} disabled={uploading}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Loading */}
      {loading && <p className="text-muted-foreground text-sm mb-4">Loading gallery…</p>}

      {/* ── Gallery Grid ──────────────────────────────────────────────────── */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <Card key={item.id} className="relative overflow-hidden p-0">
              <div className="h-48 overflow-hidden bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.caption || "Gallery image"}
                  className="w-full h-full object-cover"
                  onError={e => (e.currentTarget.style.display = "none")}
                />
              </div>

              {editingId === item.id ? (
                <div className="p-4 space-y-3">
                  <Textarea
                    label="Caption"
                    value={form.caption}
                    onChange={e => setForm({ ...form, caption: e.target.value })}
                    rows={2}
                  />
                  <YearSelect value={form.year} onChange={v => setForm({ ...form, year: v })} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit} disabled={uploading}>
                      <Check size={14} className="mr-1" />
                      {uploading ? "Saving…" : "Save"}
                    </Button>
                    <Button size="sm" variant="ghost"
                      onClick={() => { setEditingId(null); setForm({ ...emptyForm }); }}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {item.year && (
                    <span className="inline-block mb-2 px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs font-semibold">
                      {item.year}
                    </span>
                  )}
                  {item.caption && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.caption}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors" title="Edit">
                      <Pencil size={15} className="text-ktsa-primary" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={15} className="text-destructive" />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && !isAdding && (
        <div className="text-center py-16 text-muted-foreground">
          <Image size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold mb-2">No images yet</p>
          <p className="text-sm">Click "Add Image" to upload the first gallery photo.</p>
        </div>
      )}
    </div>
  );
};
