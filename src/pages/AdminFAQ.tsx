import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import FAQImageUpload from '@/components/admin/FAQImageUpload';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  page_category: string;
  image_url?: string;
  image_alignment?: 'left' | 'right';
  show_open_by_default?: boolean;
}

interface FAQForm {
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  page_category: string;
  image_url?: string;
  image_alignment?: 'left' | 'right';
  show_open_by_default: boolean;
}

const AdminFAQ = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<FAQForm>({
    question: '',
    answer: '',
    display_order: 0,
    is_active: true,
    page_category: 'general',
    image_url: '',
    image_alignment: 'left',
    show_open_by_default: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/admin/login');
        return;
      }
      
      if (!isAdmin) {
        const timeout = setTimeout(() => {
          if (!isAdmin) {
            navigate('/admin');
          }
        }, 1000);
        
        return () => clearTimeout(timeout);
      }
      
      loadFAQs();
    }
  }, [user, isAdmin, isLoading, navigate]);

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      setFaqs((data || []).map(item => ({
        ...item,
        image_alignment: (item.image_alignment as 'left' | 'right') || 'left'
      })));
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
            is_active: formData.is_active,
            page_category: formData.page_category,
            image_url: formData.image_url || null,
            image_alignment: formData.image_alignment,
            show_open_by_default: formData.show_open_by_default
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
            is_active: formData.is_active,
            page_category: formData.page_category,
            image_url: formData.image_url || null,
            image_alignment: formData.image_alignment,
            show_open_by_default: formData.show_open_by_default
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
    console.log('Edit button clicked for FAQ:', faq.id);
    
    if (!user || !isAdmin) {
      toast.error('You must be logged in as an admin to edit FAQs');
      return;
    }
    
    setFormData({
      question: faq.question,
      answer: faq.answer,
      display_order: faq.display_order,
      is_active: faq.is_active,
      page_category: faq.page_category,
      image_url: faq.image_url || '',
      image_alignment: faq.image_alignment || 'left',
      show_open_by_default: faq.show_open_by_default || false
    });
    setEditingId(faq.id);
    setShowAddForm(true);
    
    console.log('Edit form should now be visible');
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
      is_active: true,
      page_category: 'general',
      image_url: '',
      image_alignment: 'left',
      show_open_by_default: false
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>FAQ Management | Admin</title>
      </Helmet>

      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-accent-green hover:opacity-80 transition-opacity">
            FastNow
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">FAQ Management</h1>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Admin
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">
                Manage frequently asked questions for your website.
              </p>
            </div>
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

              {/* FAQ Image Upload */}
              <FAQImageUpload
                currentImageUrl={formData.image_url || ''}
                onImageChange={(url) => handleInputChange('image_url', url)}
              />

              <div className="grid grid-cols-5 gap-4">
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
                  <Label htmlFor="page_category">Page Category</Label>
                  <Select value={formData.page_category} onValueChange={(value) => handleInputChange('page_category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="app">About App</SelectItem>
                      <SelectItem value="protocol">Protocol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_alignment">Image Alignment</Label>
                  <Select value={formData.image_alignment || 'left'} onValueChange={(value) => handleInputChange('image_alignment', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
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

                <div className="space-y-2">
                  <Label htmlFor="show_open_by_default">Open by Default</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show_open_by_default"
                      checked={formData.show_open_by_default}
                      onCheckedChange={(checked) => handleInputChange('show_open_by_default', checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.show_open_by_default ? 'Opens automatically' : 'Closed by default'}
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
                        <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          {faq.page_category}
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
      </main>
    </div>
  );
};

export default AdminFAQ;