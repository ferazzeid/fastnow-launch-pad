import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ProofRow {
  id?: string;
  source_name: string;
  metric_value: string;
  metric_label: string;
  logo_url?: string | null;
  url?: string | null;
  display_order: number;
  is_active: boolean;
}

const SocialProofSettings: React.FC = () => {
  const [rows, setRows] = useState<ProofRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from('social_proof')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data) setRows(data as ProofRow[]);
  };

  useEffect(() => { load(); }, []);

  const addRow = () => {
    setRows((r) => [
      ...r,
      { source_name: '', metric_value: '', metric_label: '', logo_url: '', url: '', display_order: r.length, is_active: true },
    ]);
  };

  const updateRow = (idx: number, patch: Partial<ProofRow>) => {
    setRows((r) => r.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  };

  const save = async () => {
    setLoading(true);
    try {
      const upserts = rows.map((row) => {
        const payload: any = { ...row };
        if (!payload.id) delete payload.id;
        return payload;
      });
      const { error } = await supabase.from('social_proof').upsert(upserts, { onConflict: 'id' });
      if (error) throw error;
      toast.success('Social proof saved');
      await load();
    } catch (e) {
      console.error(e);
      toast.error('Failed to save social proof');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id?: string, idx?: number) => {
    try {
      if (id) {
        const { error } = await supabase.from('social_proof').delete().eq('id', id);
        if (error) throw error;
      } else if (idx !== undefined) {
        setRows((r) => r.filter((_, i) => i !== idx));
      }
      toast.success('Entry removed');
      await load();
    } catch (e) {
      toast.error('Failed to remove');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Proof Strip</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {rows.map((row, idx) => (
          <div key={row.id || idx} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end border-b pb-4">
            <div>
              <Label>Source</Label>
              <Input value={row.source_name} onChange={(e) => updateRow(idx, { source_name: e.target.value })} />
            </div>
            <div>
              <Label>Value</Label>
              <Input value={row.metric_value} onChange={(e) => updateRow(idx, { metric_value: e.target.value })} />
            </div>
            <div>
              <Label>Label</Label>
              <Input value={row.metric_label} onChange={(e) => updateRow(idx, { metric_label: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Logo URL</Label>
              <Input value={row.logo_url || ''} onChange={(e) => updateRow(idx, { logo_url: e.target.value })} />
            </div>
            <div>
              <Label>Link URL</Label>
              <Input value={row.url || ''} onChange={(e) => updateRow(idx, { url: e.target.value })} />
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={row.display_order} onChange={(e) => updateRow(idx, { display_order: Number(e.target.value) })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={row.is_active} onCheckedChange={(v) => updateRow(idx, { is_active: v })} />
              <span className="text-sm">Active</span>
            </div>
            <div className="flex justify-end md:col-span-6">
              <Button variant="destructive" onClick={() => remove(row.id, idx)} size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <Button variant="secondary" onClick={addRow}>
            <Plus className="h-4 w-4 mr-2" /> Add Entry
          </Button>
          <Button onClick={save} disabled={loading}>
            <Save className="h-4 w-4 mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialProofSettings;
