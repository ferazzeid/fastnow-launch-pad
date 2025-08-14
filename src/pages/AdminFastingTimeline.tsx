import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Download, 
  Search,
  Clock,
  Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { fastingHoursService } from '@/services/FastingHoursService';
import { FastingHour, FastingHourUpdate } from '@/types/fastingHours';
import { useAuth } from '@/hooks/useAuth';

const AdminFastingTimeline = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading, user } = useAuth();
  const [hours, setHours] = useState<FastingHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingHour, setEditingHour] = useState<FastingHour | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  console.log('AdminFastingTimeline - Auth state:', {
    user: !!user,
    userEmail: user?.email,
    isAdmin, 
    isLoading,
    currentPath: window.location.pathname
  });

  useEffect(() => {
    console.log('AdminFastingTimeline - useEffect triggered', { user: !!user, isAdmin, isLoading });
    
    if (!isLoading) {
      if (!user) {
        console.log('AdminFastingTimeline - No user, redirecting to login');
        navigate('/admin/login');
        return;
      }
      
      if (!isAdmin) {
        console.log('AdminFastingTimeline - Not admin, redirecting to admin');
        navigate('/admin');
        return;
      }
      
      console.log('AdminFastingTimeline - Admin access granted, loading hours');
      loadHours();
    }
  }, [user, isAdmin, isLoading, navigate]);

  const loadHours = async () => {
    setLoading(true);
    try {
      const fastingHours = await fastingHoursService.getAllHours();
      console.log('Fasting hours loaded:', fastingHours.length);
      setHours(fastingHours);
      
      if (fastingHours.length > 0) {
        toast.success(`Loaded ${fastingHours.length} fasting timeline hours successfully!`);
      }
    } catch (error) {
      console.error('Error loading fasting hours:', error);
      toast.error('Failed to load fasting timeline hours');
    } finally {
      setLoading(false);
    }
  };

  const createMissingHours = async () => {
    const existingHours = new Set(hours.map(h => h.hour));
    const missingHours: number[] = [];
    
    for (let hour = 1; hour <= 72; hour++) {
      if (!existingHours.has(hour)) {
        missingHours.push(hour);
      }
    }
    
    if (missingHours.length > 0) {
      let successCount = 0;
      for (const hour of missingHours) {
        const success = await fastingHoursService.createHour(hour, {
          title: `Hour ${hour}`,
          body_state: 'Details coming soon',
          encouragement: "You're doing great — keep going!"
        });
        if (success) successCount++;
      }
      toast.success(`Created ${successCount} missing hour entries`);
      loadHours();
    } else {
      toast.info('All hours (1-72) already exist');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Hour', 'Title', 'Body State', 'Encouragement', 'Positive Symptoms', 
      'Challenging Symptoms', 'Common Feelings', 'Tips', 'Difficulty', 'Phase',
      'Scientific Info', 'Created At', 'Updated At'
    ];
    
    const csvContent = [
      headers.join(','),
      ...hours.map(hour => [
        hour.hour,
        `"${hour.title.replace(/"/g, '""')}"`,
        `"${hour.body_state.replace(/"/g, '""')}"`,
        `"${(hour.encouragement || '').replace(/"/g, '""')}"`,
        `"${hour.positive_symptoms.join('; ')}"`,
        `"${hour.challenging_symptoms.join('; ')}"`,
        `"${hour.common_feelings.join('; ')}"`,
        `"${hour.tips.join('; ')}"`,
        hour.difficulty,
        hour.phase,
        `"${(hour.scientific_info || '').replace(/"/g, '""')}"`,
        hour.created_at,
        hour.updated_at
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fasting-hours-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Fasting hours data exported to CSV');
  };

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(hours, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fasting-hours-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Fasting hours data exported to JSON');
  };

  const saveHour = async (hour: FastingHour, updates: FastingHourUpdate) => {
    try {
      const success = await fastingHoursService.updateHour(hour.id, updates);
      if (success) {
        toast.success('Hour updated successfully');
        loadHours();
        setIsDialogOpen(false);
        setEditingHour(null);
      } else {
        toast.error('Failed to update hour');
      }
    } catch (error) {
      console.error('Error saving hour:', error);
      toast.error('Failed to update hour');
    }
  };

  const deleteHour = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hour?')) return;
    
    try {
      const success = await fastingHoursService.deleteHour(id);
      if (success) {
        toast.success('Hour deleted successfully');
        loadHours();
      } else {
        toast.error('Failed to delete hour');
      }
    } catch (error) {
      console.error('Error deleting hour:', error);
      toast.error('Failed to delete hour');
    }
  };

  const filteredHours = hours.filter(hour =>
    hour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hour.hour.toString().includes(searchTerm) ||
    hour.body_state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hour.phase.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.hour - b.hour);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft size={20} />
              Back to Admin
            </Link>
            <h1 className="text-2xl font-bold">Fasting Timeline Management</h1>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="space-y-6">
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Total Hours</p>
                  <p className="text-2xl font-bold">{hours.length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Badge variant="secondary" className="mx-auto">Complete</Badge>
                  <p className="text-sm font-medium">Hours with Content</p>
                  <p className="text-2xl font-bold">{hours.filter(h => h.body_state !== 'Details coming soon').length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Badge variant="outline" className="mx-auto">Incomplete</Badge>
                  <p className="text-sm font-medium">Hours Need Content</p>
                  <p className="text-2xl font-bold">{hours.filter(h => h.body_state === 'Details coming soon').length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Badge variant="destructive" className="mx-auto">Missing</Badge>
                  <p className="text-sm font-medium">Missing Hours</p>
                  <p className="text-2xl font-bold">{72 - new Set(hours.map(h => h.hour)).size}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={createMissingHours} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Missing Hours
            </Button>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={exportToJSON} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by hour, title, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Hours Table */}
          <Card>
            <CardHeader>
              <CardTitle>Fasting Timeline Hours ({filteredHours.length}) - {hours.length === 0 ? 'No data found.' : `Found ${hours.length} hours in database!`}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Hour</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-24">Day</TableHead>
                    <TableHead className="w-32">Content Status</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHours.map((hour) => (
                    <TableRow key={hour.id}>
                      <TableCell className="font-mono">{hour.hour}</TableCell>
                      <TableCell className="font-medium">{hour.title}</TableCell>
                      <TableCell>Day {hour.day}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {hour.body_state !== 'Details coming soon' && <Badge variant="outline" className="text-xs">Body State</Badge>}
                          {hour.encouragement && <Badge variant="outline" className="text-xs">Encouragement</Badge>}
                          {hour.tips.length > 0 && <Badge variant="outline" className="text-xs">Tips</Badge>}
                          {hour.positive_symptoms.length > 0 && <Badge variant="outline" className="text-xs">Symptoms</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog open={isDialogOpen && editingHour?.id === hour.id} onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) setEditingHour(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingHour(hour)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <FastingHourEditor 
                              hour={editingHour}
                              onSave={saveHour}
                              onCancel={() => {
                                setIsDialogOpen(false);
                                setEditingHour(null);
                              }}
                            />
                          </Dialog>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteHour(hour.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Fasting Hour Editor Component
const FastingHourEditor: React.FC<{
  hour: FastingHour | null;
  onSave: (hour: FastingHour, updates: FastingHourUpdate) => void;
  onCancel: () => void;
}> = ({ hour, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<FastingHour>>({});

  useEffect(() => {
    if (hour) {
      setFormData({ ...hour });
    }
  }, [hour]);

  if (!hour || !formData) return null;

  const handleSave = () => {
    const updates: FastingHourUpdate = {
      title: formData.title,
      body_state: formData.body_state,
      encouragement: formData.encouragement,
      positive_symptoms: formData.positive_symptoms,
      challenging_symptoms: formData.challenging_symptoms,
      common_feelings: formData.common_feelings,
      tips: formData.tips,
      difficulty: formData.difficulty,
      phase: formData.phase,
      scientific_info: formData.scientific_info,
      image_url: formData.image_url,
      autophagy_milestone: formData.autophagy_milestone,
      ketosis_milestone: formData.ketosis_milestone,
      fat_burning_milestone: formData.fat_burning_milestone
    };
    onSave(hour, updates);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Hour {hour.hour} - {hour.title}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select 
              value={formData.difficulty || ''} 
              onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="body_state">What's Happening in Your Body</Label>
          <Textarea
            id="body_state"
            value={formData.body_state || ''}
            onChange={(e) => setFormData({ ...formData, body_state: e.target.value })}
            rows={4}
            placeholder="Describe what's happening in the body during this hour..."
          />
        </div>

        <div>
          <Label htmlFor="encouragement">Encouragement Message</Label>
          <Textarea
            id="encouragement"
            value={formData.encouragement || ''}
            onChange={(e) => setFormData({ ...formData, encouragement: e.target.value })}
            rows={2}
            placeholder="Motivational message for this hour..."
          />
        </div>

        <div>
          <Label htmlFor="scientific_info">Scientific Information</Label>
          <Textarea
            id="scientific_info"
            value={formData.scientific_info || ''}
            onChange={(e) => setFormData({ ...formData, scientific_info: e.target.value })}
            rows={4}
            placeholder="Scientific details about this stage of fasting..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autophagy_milestone"
              checked={formData.autophagy_milestone || false}
              onChange={(e) => setFormData({ ...formData, autophagy_milestone: e.target.checked })}
            />
            <Label htmlFor="autophagy_milestone">Autophagy Milestone</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ketosis_milestone"
              checked={formData.ketosis_milestone || false}
              onChange={(e) => setFormData({ ...formData, ketosis_milestone: e.target.checked })}
            />
            <Label htmlFor="ketosis_milestone">Ketosis Milestone</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="fat_burning_milestone"
              checked={formData.fat_burning_milestone || false}
              onChange={(e) => setFormData({ ...formData, fat_burning_milestone: e.target.checked })}
            />
            <Label htmlFor="fat_burning_milestone">Fat Burning Milestone</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default AdminFastingTimeline;