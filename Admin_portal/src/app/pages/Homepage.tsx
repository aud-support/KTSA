import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { useCMS } from '../context/CMSContext';

export const Homepage: React.FC = () => {
  const { homePage, updateHomePage } = useCMS();
  const [formData, setFormData] = useState(homePage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateHomePage(formData);
    toast.success('Homepage updated successfully!');
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Homepage</h1>
        <p className="text-muted-foreground">Manage homepage content and hero section</p>
      </div>

      {/* Form */}
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2 mb-4">
              Hero Section
            </h3>
            <div className="space-y-4">
              <Input
                label="Hero Title"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                placeholder="Main headline"
              />
              <Textarea
                label="Hero Subtitle"
                name="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={handleChange}
                placeholder="Supporting text"
                rows={2}
              />
              <Input
                label="Hero Image URL"
                name="heroImageUrl"
                value={formData.heroImageUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={() => setFormData(homePage)}>
          Reset
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};