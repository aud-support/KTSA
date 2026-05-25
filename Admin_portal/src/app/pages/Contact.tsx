import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useCMS } from '../context/CMSContext';

export const Contact: React.FC = () => {
  const { contactInfo, updateContactInfo } = useCMS();
  const [formData, setFormData] = useState(contactInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateContactInfo(formData);
    toast.success('Contact information updated successfully!');
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Contact</h1>
        <p className="text-muted-foreground">Manage contact information</p>
      </div>

      {/* Form */}
      <Card>
        <div className="space-y-6">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@example.com"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
          />
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street, City, State"
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={() => setFormData(contactInfo)}>
          Reset
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};