import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Select } from '../components/Input';
import { useCMS } from '../context/CMSContext';

export const Sponsors: React.FC = () => {
  const { sponsors, addSponsor, updateSponsor, deleteSponsor } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    websiteUrl: '',
    tier: 'bronze' as 'platinum' | 'gold' | 'silver' | 'bronze',
  });

  const handleEdit = (id: string) => {
    const sponsor = sponsors.find((s) => s.id === id);
    if (sponsor) {
      setFormData({
        name: sponsor.name,
        logoUrl: sponsor.logoUrl,
        websiteUrl: sponsor.websiteUrl,
        tier: sponsor.tier,
      });
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleSave = () => {
    if (editingId) {
      updateSponsor(editingId, formData);
      toast.success('Sponsor updated successfully!');
      setEditingId(null);
    } else {
      addSponsor(formData);
      toast.success('Sponsor added successfully!');
      setIsAdding(false);
    }
    setFormData({ name: '', logoUrl: '', websiteUrl: '', tier: 'bronze' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', logoUrl: '', websiteUrl: '', tier: 'bronze' });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-gray-300/10 text-gray-300 border-gray-300/20';
      case 'gold':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'silver':
        return 'bg-gray-400/10 text-gray-400 border-gray-400/20';
      case 'bronze':
        return 'bg-orange-600/10 text-orange-600 border-orange-600/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Sponsors</h1>
          <p className="text-muted-foreground">Manage sponsors and partnerships</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={20} className="mr-2" />
            Add Sponsor
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="mb-6">
          <h3 className="mb-4">{editingId ? 'Edit Sponsor' : 'Add New Sponsor'}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Sponsor Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Company name"
              />
              <Select
                label="Tier"
                value={formData.tier}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tier: e.target.value as 'platinum' | 'gold' | 'silver' | 'bronze',
                  })
                }
                options={[
                  { value: 'platinum', label: 'Platinum' },
                  { value: 'gold', label: 'Gold' },
                  { value: 'silver', label: 'Silver' },
                  { value: 'bronze', label: 'Bronze' },
                ]}
              />
            </div>
            <Input
              label="Logo URL"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://..."
            />
            <Input
              label="Website URL"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              placeholder="https://..."
            />
            <div className="flex items-center gap-3">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsors.map((sponsor) => (
          <Card key={sponsor.id}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="mb-1">{sponsor.name}</h3>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs border ${getTierColor(
                    sponsor.tier
                  )}`}
                >
                  {sponsor.tier}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(sponsor.id)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil size={16} className="text-ktsa-primary" />
                </button>
                <button
                  onClick={() => deleteSponsor(sponsor.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-destructive" />
                </button>
              </div>
            </div>
            {sponsor.websiteUrl && (
              <a
                href={sponsor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ktsa-primary hover:underline block truncate"
              >
                {sponsor.websiteUrl}
              </a>
            )}
          </Card>
        ))}
      </div>

      {sponsors.length === 0 && !isAdding && (
        <Card className="text-center py-12">
          <h3 className="mb-2">No sponsors yet</h3>
          <p className="text-muted-foreground mb-6">Add your first sponsor to get started.</p>
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={20} className="mr-2" />
            Add Sponsor
          </Button>
        </Card>
      )}
    </div>
  );
};