import React, { useState } from "react";
import { toast } from "sonner";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input, Textarea } from "../components/Input";
import { useCMS } from "../context/CMSContext";
import { saveHomepageContent } from "../../services/homepageService";

export const Homepage: React.FC = () => {
  const { homePage, updateHomePage } = useCMS();
  const [formData, setFormData] = useState(homePage);
  const [imageFile, setImageFile] = useState<File | null>(null); // ✅ track image separately
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleVideoChange = (index: number, value: string) => {
    const updatedVideos = [...formData.videoUrls];
    updatedVideos[index] = value;
    setFormData((prev) => ({ ...prev, videoUrls: updatedVideos }));
  };

  const addVideoField = () => {
    setFormData((prev) => ({
      ...prev,
      videoUrls: [...prev.videoUrls, ""],
    }));
  };

  const removeVideoField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      videoUrls: prev.videoUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const { heroImageUrl, ...dataWithoutImage } = formData; // ✅ correct field name

      await saveHomepageContent(dataWithoutImage, imageFile);

      updateHomePage(formData);
      toast.success("Homepage updated successfully!");
    } catch (error) {
      toast.error("Failed to update homepage. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Homepage</h1>
        <p className="text-muted-foreground">
          Manage homepage content and hero section
        </p>
      </div>

      {/* Form */}
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm text-ktsa-highlight uppercase tracking-wider border-b border-border pb-2 mb-4">
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
              <div>
                <label className="block text-sm mb-2">Upload Image</label>
                <input
                  type="file"
                  name="heroImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                />
              </div>
            </div>
          </div>
        </div>

        <br />

        <div className="space-y-6">
          <div>
            <h3 className="text-sm text-ktsa-highlight uppercase tracking-wider border-b border-border pb-2 mb-4">
              Videos Section
            </h3>

            <div className="space-y-6">
              {/* Video */}
              <div className="border border-border rounded-lg p-4 space-y-4">
                <h4 className="text-sm font-semibold text-ktsa-highlight uppercase">
                  Youtube
                </h4>

                <div className="space-y-4">
                  {formData.videoUrls?.map((video, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Input
                          label={`Video ${index + 1}`}
                          value={video}
                          onChange={(e) =>
                            handleVideoChange(index, e.target.value)
                          }
                          placeholder="Enter YouTube Video URL"
                        />
                      </div>

                      {formData.videoUrls.length > 1 && (
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => removeVideoField(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addVideoField}
                  >
                    + Add Video
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={() => setFormData(homePage)}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {" "}
          {/* disabled while loading */}
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
