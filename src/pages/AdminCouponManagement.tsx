import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Edit3, Trash2, Users, Calendar, Gift } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CouponCode {
  id: string;
  code: string;
  duration_days: number;
  description: string;
  is_active: boolean;
  expires_at: string | null;
  usage_limit: number | null;
  used_count: number;
  created_at: string;
}

const AdminCouponManagement = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState<CouponCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    duration_days: 90,
    description: '',
    is_active: true,
    expires_at: '',
    usage_limit: null as number | null,
  });

  // Auth protection
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, isLoading, navigate]);

  // Load coupons
  useEffect(() => {
    if (user && isAdmin) {
      loadCoupons();
    }
  }, [user, isAdmin]);

  const loadCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupon_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Coupons",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const handleSaveCoupon = async () => {
    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        duration_days: formData.duration_days,
        description: formData.description,
        is_active: formData.is_active,
        expires_at: formData.expires_at || null,
        usage_limit: formData.usage_limit,
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupon_codes')
          .update(couponData)
          .eq('id', editingCoupon.id);
        
        if (error) throw error;
        toast({ title: "Coupon Updated", description: "Coupon code updated successfully." });
      } else {
        const { error } = await supabase
          .from('coupon_codes')
          .insert(couponData);
        
        if (error) throw error;
        toast({ title: "Coupon Created", description: "New coupon code created successfully." });
      }

      // Reset form and reload
      setFormData({
        code: '',
        duration_days: 90,
        description: '',
        is_active: true,
        expires_at: '',
        usage_limit: null,
      });
      setEditingCoupon(null);
      loadCoupons();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditCoupon = (coupon: CouponCode) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      duration_days: coupon.duration_days,
      description: coupon.description || '',
      is_active: coupon.is_active,
      expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
      usage_limit: coupon.usage_limit,
    });
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase
        .from('coupon_codes')
        .delete()
        .eq('id', couponId);

      if (error) throw error;
      toast({ title: "Coupon Deleted", description: "Coupon code deleted successfully." });
      loadCoupons();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleCouponStatus = async (couponId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('coupon_codes')
        .update({ is_active: !isActive })
        .eq('id', couponId);

      if (error) throw error;
      toast({ 
        title: isActive ? "Coupon Deactivated" : "Coupon Activated",
        description: `Coupon has been ${isActive ? 'deactivated' : 'activated'}.`
      });
      loadCoupons();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading || isLoadingCoupons) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-gray-600 mt-2">
            Create and manage coupon codes for trial promotions and user acquisition.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coupon Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingCoupon ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    placeholder="FASTNOW90"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="uppercase"
                  />
                </div>

                <div>
                  <Label htmlFor="duration_days">Duration (Days)</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    min="1"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 90 })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Universal 90-day trial promotion code"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="usage_limit">Usage Limit (Optional)</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    min="1"
                    placeholder="Leave empty for unlimited"
                    value={formData.usage_limit || ''}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <Button onClick={handleSaveCoupon} className="w-full">
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </Button>

                {editingCoupon && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingCoupon(null);
                      setFormData({
                        code: '',
                        duration_days: 90,
                        description: '',
                        is_active: true,
                        expires_at: '',
                        usage_limit: null,
                      });
                    }}
                    className="w-full"
                  >
                    Cancel Edit
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coupon List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Existing Coupons
                </CardTitle>
              </CardHeader>
              <CardContent>
                {coupons.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No coupon codes created yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coupons.map((coupon) => (
                      <div key={coupon.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                              {coupon.code}
                            </code>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {coupon.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCoupon(coupon)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                            >
                              <Switch checked={coupon.is_active} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCoupon(coupon.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Description:</strong> {coupon.description || 'No description'}</p>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {coupon.duration_days} days
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {coupon.used_count} used
                              {coupon.usage_limit && ` / ${coupon.usage_limit} limit`}
                            </span>
                          </div>
                          {coupon.expires_at && (
                            <p><strong>Expires:</strong> {new Date(coupon.expires_at).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCouponManagement;