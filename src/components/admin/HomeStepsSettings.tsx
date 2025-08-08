import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface StepRow {
  id?: string;
  title: string;
  description: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
}

const HomeStepsSettings: React.FC = () => {
  const [rows, setRows] = useState<StepRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from('home_steps')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data) setRows(data as StepRow[]);
  };

  useEffect(() => { load(); }, []);

  const addRow = () => {
    setRows((r) => [
      ...r,
      { title: '', description: '', icon_name: '', display_order: r.length, is_active: true },
    ]);
  };

  const updateRow = (idx: number, patch: Partial<StepRow>) => {
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
      const { error } = await supabase.from('home_steps').upsert(upserts, { onConflict: 'id' });
      if (error) throw error;
      toast.success('Steps saved');
      await load();
    } catch (e) {
      console.error(e);
      toast.error('Failed to save steps');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id?: string, idx?: number) => {
    try {
      if (id) {
        const { error } = await supabase.from('home_steps').delete().eq('id', id);
        if (error) throw error;
      } else if (idx !== undefined) {
        setRows((r) => r.filter((_, i) => i !== idx));
      }
      toast.success('Step removed');
      await load();
    } catch (e) {
      toast.error('Failed to remove');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>How It Works — Steps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {rows.map((row, idx) => (
          <div key={row.id || idx} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end border-b pb-4">
            <div className="md:col-span-2">
              <Label>Title</Label>
              <Input value={row.title} onChange={(e) => updateRow(idx, { title: e.target.value })} />
            </div>
            <div className="md:col-span-3">
              <Label>Description</Label>
              <Textarea rows={2} value={row.description} onChange={(e) => updateRow(idx, { description: e.target.value })} />
            </div>
            <div>
              <Label>Icon Name</Label>
              <Input placeholder="rocket, timer, target..." value={row.icon_name || ''} onChange={(e) => updateRow(idx, { icon_name: e.target.value })} />
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
            <Plus className="h-4 w-4 mr-2" /> Add Step
          </Button>
          <Button onClick={save} disabled={loading}>
            <Save className="h-4 w-4 mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeStepsSettings;
