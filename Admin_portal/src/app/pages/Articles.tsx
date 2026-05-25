import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { useCMS } from '../context/CMSContext';

export const Articles: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'KTSA Admin',
    publishedDate: new Date().toISOString().split('T')[0],
    imageUrl: '',
  });

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
      });
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleSave = () => {
    if (editingId) {
      updateArticle(editingId, formData);
      toast.success('Article updated successfully!');
      setEditingId(null);
    } else {
      addArticle(formData);
      toast.success('Article published successfully!');
      setIsAdding(false);
    }
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'KTSA Admin',
      publishedDate: new Date().toISOString().split('T')[0],
      imageUrl: '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'KTSA Admin',
      publishedDate: new Date().toISOString().split('T')[0],
      imageUrl: '',
    });
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
            <Input
              label="Image URL (optional)"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
            />
            <div className="flex items-center gap-3">
              <Button onClick={handleSave}>Publish</Button>
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
          <Card key={article.id}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="flex-1 pr-4">{article.title}</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(article.id)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil size={16} className="text-ktsa-primary" />
                </button>
                <button
                  onClick={() => deleteArticle(article.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-destructive" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
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