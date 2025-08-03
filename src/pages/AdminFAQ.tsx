import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

interface FAQForm {
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<FAQForm>({
    question: '',
    answer: '',
    display_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      setFaqs(data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FAQForm, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        // Update existing FAQ
        const { error } = await supabase
          .from('faqs')
          .update({
            question: formData.question,
            answer: formData.answer,
            display_order: formData.display_order,
            is_active: formData.is_active
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('FAQ updated successfully');
      } else {
        // Create new FAQ
        const { error } = await supabase
          .from('faqs')
          .insert({
            question: formData.question,
            answer: formData.answer,
            display_order: formData.display_order,
            is_active: formData.is_active
          });

        if (error) throw error;
        toast.success('FAQ created successfully');
      }

      // Reset form and reload data
      resetForm();
      loadFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Failed to save FAQ');
    }
  };

  const handleEdit = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      display_order: faq.display_order,
      is_active: faq.is_active
    });
    setEditingId(faq.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('FAQ deleted successfully');
      loadFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      display_order: faqs.length,
      is_active: true
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Helmet>
        <title>FAQ Management | Admin</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New FAQ
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit FAQ' : 'Add New FAQ'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => handleInputChange('question', e.target.value)}
                  placeholder="Enter the FAQ question"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Answer *</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => handleInputChange('answer', e.target.value)}
                  placeholder="Enter the FAQ answer"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                    placeholder="Order"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="is_active">Active</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.is_active ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update FAQ' : 'Save FAQ'}
                </Button>
                <Button variant="outline" onClick={resetForm} className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Existing FAQs</h2>
          {faqs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No FAQs created yet. Click "Add New FAQ" to get started.</p>
              </CardContent>
            </Card>
          ) : (
            faqs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{faq.question}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          faq.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {faq.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Order: {faq.display_order}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {faq.answer}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(faq)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(faq.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFAQ;