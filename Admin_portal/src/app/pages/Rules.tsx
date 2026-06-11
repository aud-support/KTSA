import React, { useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { useCMS } from '../context/CMSContext';

export const Rules: React.FC = () => {
  const { rules, addRule, updateRule, deleteRule } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const handleEdit = (id: string) => {
    const rule = rules.find((r) => r.id === id);
    if (rule) {
      setFormData({ title: rule.title, content: rule.content });
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleSave = () => {
    if (editingId) {
      updateRule(editingId, formData);
      toast.success('Rule updated successfully!');
      setEditingId(null);
    } else {
      addRule({ ...formData, order: rules.length + 1 });
      toast.success('Rule added successfully!');
      setIsAdding(false);
    }
    setFormData({ title: '', content: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ title: '', content: '' });
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Rules</h1>
          <p className="text-muted-foreground">Manage tournament rules and regulations</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={20} className="mr-2" />
            Add Rule
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="mb-6">
          <h3 className="mb-4">{editingId ? 'Edit Rule' : 'Add New Rule'}</h3>
          <div className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Player Registration"
            />
            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Describe the rule in detail..."
              rows={4}
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

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <div className="flex items-start gap-4">
              <button className="mt-1 text-muted-foreground cursor-move">
                <GripVertical size={20} />
              </button>
              <div className="flex-1">
                <h3 className="mb-2">{rule.title}</h3>
                <p className="text-muted-foreground">{rule.content}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(rule.id)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil size={16} className="text-ktsa-primary" />
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-destructive" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {rules.length === 0 && !isAdding && (
        <Card className="text-center py-12">
          <h3 className="mb-2">No rules yet</h3>
          <p className="text-muted-foreground mb-6">Add your first rule to get started.</p>
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={20} className="mr-2" />
            Add Rule
          </Button>
        </Card>
      )}
    </div>
  );
};