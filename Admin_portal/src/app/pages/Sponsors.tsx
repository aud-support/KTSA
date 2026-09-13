import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Upload, X, Image } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import {
  getSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  type Sponsor,
} from '../../services/sponsorService';

const emptyForm = { name: '', imageUrl: '' };

export const Sponsors: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding]   = useState(false);
  const [form, setForm]           = useState({ ...emptyForm });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview]     = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Load
  useEffect(() => {
    (async () => {
      try { setLoading(true); setSponsors(await getSponsors()); }
      catch { toast.error('Failed to load sponsors'); }
      finally { setLoading(false); }
    })();
  }, []);

  // Preview
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(form.imageUrl);
  }, [imageFile, form.imageUrl]);

  const reset = () => {
    setForm({ ...emptyForm });
    setImageFile(null);
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleEdit = (id: string) => {
    const s = sponsors.find((x) => x.id === id);
    if (!s) return;
    setForm({ name: s.name, imageUrl: s.imageUrl || '' });
    setImageFile(null);
    setEditingId(id);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    try {
      setSaving(true);
      if (editingId) {
        const updated = await updateSponsor(editingId, form, imageFile);
        setSponsors((prev) => prev.map((s) => s.id === editingId ? updated : s));
        toast.success('Sponsor updated!');
        setEditingId(null);
      } else {
        const created = await createSponsor(form, imageFile);
        setSponsors((prev) => [...prev, created]);
        toast.success('Sponsor added!');
        setIsAdding(false);
      }
      reset();
    } catch { toast.error('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSponsor(id);
      setSponsors((prev) => prev.filter((s) => s.id !== id));
      toast.success('Sponsor deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const handleCancel = () => { setEditingId(null); setIsAdding(false); reset(); };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Sponsors</h1>
          <p className="text-muted-foreground">Manage sponsor logos shown on the homepage</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={18} className="mr-2" /> Add Sponsor
          </Button>
        )}
      </div>

      {/* ── Add / Edit form ── */}
      {(isAdding || editingId) && (
        <Card className="mb-8">
          <h3 className="mb-5">{editingId ? 'Edit Sponsor' : 'Add New Sponsor'}</h3>
          <div className="space-y-5">

            {/* Name */}
            <Input
              label="Sponsor Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Nike, Red Bull, Stiga..."
            />

            {/* Logo upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium block">Logo Image</label>

              {/* Preview box */}
              <div
                className="relative w-full h-36 rounded-xl border-2 border-dashed border-border bg-muted/10 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-ktsa-primary/50 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain p-4"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setImageFile(null); setPreview(''); setForm((p) => ({ ...p, imageUrl: '' })); if (fileRef.current) fileRef.current.value = ''; }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-destructive transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload size={28} className="text-muted-foreground/50" />
                    <span className="text-sm">Click to upload logo</span>
                    <span className="text-xs text-muted-foreground/50">PNG, JPG, SVG — transparent background recommended</span>
                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setImageFile(f);
                  if (f) setForm((p) => ({ ...p, imageUrl: '' }));
                }}
              />

              {/* OR paste URL */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex-1 h-px bg-border" />
                or paste an image URL
                <div className="flex-1 h-px bg-border" />
              </div>
              <Input
                name="imageUrl"
                value={form.imageUrl}
                onChange={(e) => { setForm({ ...form, imageUrl: e.target.value }); if (imageFile) { setImageFile(null); if (fileRef.current) fileRef.current.value = ''; } }}
                placeholder="https://..."
                disabled={!!imageFile}
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Sponsor'}
              </Button>
              <Button variant="ghost" onClick={handleCancel} disabled={saving}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-center text-muted-foreground py-10 text-sm">Loading sponsors...</p>
      )}

      {/* ── Sponsors grid ── */}
      {!loading && sponsors.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="relative group">
              <Card className="p-3 flex flex-col items-center gap-3 hover:border-ktsa-primary/40 transition-colors">
                {/* Logo */}
                <div className="w-full h-16 flex items-center justify-center rounded-lg bg-muted/20 overflow-hidden">
                  {sponsor.imageUrl ? (
                    <img
                      src={sponsor.imageUrl}
                      alt={sponsor.name}
                      className="max-h-full max-w-full object-contain p-1"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <Image size={24} className="text-muted-foreground/30" />
                  )}
                </div>
                <p className="text-xs font-semibold text-center text-muted-foreground leading-tight line-clamp-2">
                  {sponsor.name}
                </p>
              </Card>
              {/* Hover actions */}
              <div className="absolute inset-0 rounded-xl bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(sponsor.id)}
                  className="p-2 rounded-lg bg-ktsa-primary/80 hover:bg-ktsa-primary text-white transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(sponsor.id)}
                  className="p-2 rounded-lg bg-destructive/80 hover:bg-destructive text-white transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && sponsors.length === 0 && !isAdding && (
        <Card className="text-center py-14">
          <div className="w-14 h-14 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
            <Image size={24} className="text-muted-foreground/50" />
          </div>
          <h3 className="mb-2">No sponsors yet</h3>
          <p className="text-muted-foreground mb-6 text-sm">Add sponsor logos to showcase on the homepage.</p>
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={18} className="mr-2" /> Add Sponsor
          </Button>
        </Card>
      )}
    </div>
  );
};
