import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useCMS } from '../context/CMSContext';

export const FooterSocial: React.FC = () => {
  const { socialLinks, footer, updateSocialLinks, updateFooter } = useCMS();
  const [socialData, setSocialData] = useState(socialLinks);
  const [footerData, setFooterData] = useState(footer);

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFooterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFooterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSocial = () => {
    updateSocialLinks(socialData);
    toast.success('Social links updated successfully!');
  };

  const handleSaveFooter = () => {
    updateFooter(footerData);
    toast.success('Footer updated successfully!');
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Footer & Social</h1>
        <p className="text-muted-foreground">Manage social media links and footer content</p>
      </div>

      {/* Social Links */}
      <Card className="mb-6">
        <h3 className="mb-4 text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
          Social Media Links
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Facebook size={20} className="text-blue-500" />
            </div>
            <Input
              name="facebook"
              value={socialData.facebook || ''}
              onChange={handleSocialChange}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Twitter size={20} className="text-sky-500" />
            </div>
            <Input
              name="twitter"
              value={socialData.twitter || ''}
              onChange={handleSocialChange}
              placeholder="https://twitter.com/..."
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Instagram size={20} className="text-pink-500" />
            </div>
            <Input
              name="instagram"
              value={socialData.instagram || ''}
              onChange={handleSocialChange}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Youtube size={20} className="text-red-500" />
            </div>
            <Input
              name="youtube"
              value={socialData.youtube || ''}
              onChange={handleSocialChange}
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setSocialData(socialLinks)}>
            Reset
          </Button>
          <Button onClick={handleSaveSocial}>Save Social Links</Button>
        </div>
      </Card>

      {/* Footer Content */}
      <Card>
        <h3 className="mb-4 text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
          Footer Content
        </h3>
        <div className="space-y-4">
          <Input
            label="Copyright Text"
            name="copyrightText"
            value={footerData.copyrightText}
            onChange={handleFooterChange}
            placeholder="© 2025 KTSA. All rights reserved."
          />
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setFooterData(footer)}>
            Reset
          </Button>
          <Button onClick={handleSaveFooter}>Save Footer</Button>
        </div>
      </Card>
    </div>
  );
};