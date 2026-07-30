import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Textarea, Select } from '../components/Input';
import { useCMS } from '../context/CMSContext';

const CATEGORY_OPTIONS = [
  { value: 'KTSA', label: 'KTSA' },
  { value: 'Events', label: 'Events' },
  { value: 'Global', label: 'Global' },
];

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  author: 'KTSA Admin',
  publishedDate: new Date().toISOString().split('T')[0],
  imageUrl: '',
  category: 'KTSA',
  featured: false,
};

export const Articles: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });

  const handleEdit = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (article) {
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        publishedDate: article.publishedDate,
        imageUrl: article.imageUrl || '',
        category: article.category || 'KTSA',
        featured: article.featured || false,
      });
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (editingId) {
      updateArticle(editingId, formData);
      toast.success('Article updated successfully!');
      setEditingId(null);
    } else {
      addArticle(formData);
      toast.success('Article published successfully!');
      setIsAdding(false);
    }
    setFormData({ ...emptyForm });
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
          <p className="text-muted-foreground">Manage news articles and announcements</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={20} className="mr-2" />
            Write Article
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="mb-6">
          <h3 className="mb-4">{editingId ? 'Edit Article' : 'Write New Article'}</h3>
          <div className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Article title"
            />
            <Input
              label="Excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Short summary"
            />
            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full article content..."
              rows={8}
            />
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
                onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
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

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSave}>
                {editingId ? 'Save Changes' : 'Publish'}
              </Button>
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Articles List */}
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
                  onError={(e) => (e.currentTarget.style.display = 'none')}
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

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{article.excerpt}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{article.author}</span>
              <span>
                {new Date(article.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
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
                onClick={() => deleteArticle(article.id)}
                className={`p-1.5 hover:bg-destructive/10 rounded-lg transition-colors ${article.featured ? 'mt-6' : ''}`}
                title="Delete"
              >
                <Trash2 size={15} className="text-destructive" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {articles.length === 0 && !isAdding && (
        <Card className="text-center py-12">
          <h3 className="mb-2">No articles yet</h3>
          <p className="text-muted-foreground mb-6">Write your first article to get started.</p>
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={20} className="mr-2" />
            Write Article
          </Button>
        </Card>
      )}
    </div>
  );
};
