import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { useCMS } from '../context/CMSContext';
import {
  getServices,
  createService,
  updateService as updateServiceApi,
  deleteService as deleteServiceApi,
} from '../../services/servicesService';

const emptyForm = {
  name: '',
  description: '',
  icon: 'Zap',
  features: [''],
  pricing: 'Contact for pricing',
  imageUrl: '',
  displayOrder: 0,
};

export const Services: React.FC = () => {
  const { services, addService, updateService, deleteService, setAllServices } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);

  // ── Load services from backend on mount ──────────────────────
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await getServices();
        setAllServices(data);
      } catch (error) {
        console.error('Failed to load services', error);
        toast.error('Failed to load services from server');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (id: string) => {
    const service = services.find((s) => s.id === id);
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        icon: service.icon,
        features: service.features || [''],
        pricing: service.pricing,
        imageUrl: service.imageUrl || '',
        displayOrder: service.displayOrder || 0,
      });
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Service name is required');
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        features: formData.features.filter((f) => f.trim()),
      };

      if (editingId) {
        const updated = await updateServiceApi(editingId, dataToSave);
        updateService(editingId, updated);
        toast.success('Service updated successfully!');
        setEditingId(null);
      } else {
        const created = await createService(dataToSave);
        addService(created);
        toast.success('Service created successfully!');
        setIsAdding(false);
      }
      setFormData({ ...emptyForm });
    } catch (error) {
      console.error(error);
      toast.error('Failed to save service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setLoading(true);
      try {
        await deleteServiceApi(id);
        deleteService(id);
        toast.success('Service deleted');
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete service. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ ...emptyForm });
  };

  const addFeatureField = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const removeFeatureField = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Services</h1>
          <p className="text-muted-foreground">Manage KTSA services and offerings</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} disabled={loading}>
            <Plus size={20} className="mr-2" />
            Add Service
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="mb-6">
          <h3 className="mb-4">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
          <div className="space-y-4">
            <Input
              label="Service Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Table Rental Services"
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the service"
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Icon (name or emoji)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., Zap, Trophy, Users, Trophy"
              />
              <Input
                label="Pricing"
                value={formData.pricing}
                onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                placeholder="e.g., ₹5,000/day or Contact for pricing"
              />
            </div>

            <Input
              label="Image URL (optional)"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
            />

            {/* Image preview */}
            {formData.imageUrl && (
              <div className="rounded-lg overflow-hidden border border-border h-40">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}

            {/* Features */}
            <div>
              <label className="block text-sm font-medium mb-3">Features/Highlights</label>
              <div className="space-y-2">
                {formData.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(idx, e.target.value)}
                      placeholder="Add a feature"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFeatureField(idx)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={addFeatureField}
                className="mt-2"
              >
                + Add Feature
              </Button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Save Changes' : 'Create Service'}
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
        <p className="text-muted-foreground text-sm mb-4">Loading services...</p>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="relative overflow-hidden">
            {/* Thumbnail */}
            {service.imageUrl && (
              <div className="h-32 -mx-4 -mt-4 mb-4 overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}

            <div className="flex items-start justify-between mb-2">
              <h3 className="flex-1 pr-10 leading-snug text-lg font-bold">
                {service.name}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {service.description}
            </p>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div className="mb-3 space-y-1">
                {service.features.slice(0, 2).map((feature, idx) => (
                  <div key={idx} className="text-xs text-ktsa-text/70 flex items-start gap-2">
                    <span className="text-ktsa-accent mt-1">•</span>
                    <span>{feature}</span>
                  </div>
                ))}
                {service.features.length > 2 && (
                  <p className="text-xs text-ktsa-text/50 italic">
                    +{service.features.length - 2} more features
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span className="font-semibold text-ktsa-primary">{service.pricing}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(service.id)}
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                title="Edit"
                disabled={loading}
              >
                <Pencil size={15} className="text-ktsa-primary" />
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
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
      {!loading && services.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-semibold mb-2">No services yet</p>
          <p className="text-sm">Click "Add Service" to add your first service offering.</p>
        </div>
      )}
    </div>
  );
};
