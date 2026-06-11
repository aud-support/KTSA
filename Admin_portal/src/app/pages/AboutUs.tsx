import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { useCMS } from '../context/CMSContext';

export const AboutUs: React.FC = () => {
  const { aboutUs, updateAboutUs } = useCMS();
  const [formData, setFormData] = useState(aboutUs);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateAboutUs(formData);
    toast.success('About Us updated successfully!');
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">About Us</h1>
        <p className="text-muted-foreground">Manage about page content</p>
      </div>

      {/* Form */}
      <Card>
        <div className="space-y-6">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Page title"
          />
          <Textarea
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Main about content"
            rows={6}
          />
          <Textarea
            label="Mission"
            name="mission"
            value={formData.mission}
            onChange={handleChange}
            placeholder="Our mission statement"
            rows={3}
          />
          <Textarea
            label="Vision"
            name="vision"
            value={formData.vision}
            onChange={handleChange}
            placeholder="Our vision statement"
            rows={3}
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={() => setFormData(aboutUs)}>
          Reset
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};