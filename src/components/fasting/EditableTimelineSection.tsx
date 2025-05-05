
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Clock, Edit, Save } from "lucide-react";
import { type TimelineEntry } from '@/pages/FastingTimeline';
import { Label } from "@/components/ui/label";

interface EditableTimelineSectionProps {
  dayNumber: number;
  entries: TimelineEntry[];
  isAdmin: boolean;
  onUpdateContent: (hour: number, whatsHappening: string, howYoureFeeling: string) => void;
}

const EditableTimelineSection: React.FC<EditableTimelineSectionProps> = ({ 
  dayNumber, 
  entries, 
  isAdmin,
  onUpdateContent 
}) => {
  const [editingHour, setEditingHour] = useState<number | null>(null);
  const [whatsHappening, setWhatsHappening] = useState("");
  const [howYoureFeeling, setHowYoureFeeling] = useState("");
  
  const handleEdit = (entry: TimelineEntry) => {
    setEditingHour(entry.hour);
    setWhatsHappening(entry.whatsHappening || entry.content || '');
    setHowYoureFeeling(entry.howYoureFeeling || '');
  };
  
  const handleSave = () => {
    if (editingHour !== null) {
      onUpdateContent(editingHour, whatsHappening, howYoureFeeling);
      setEditingHour(null);
    }
  };

  return (
    <section className="timeline-day mb-20">
      <div className="sticky top-0 z-10 bg-background pt-6 pb-4">
        <div className="flex items-center">
          <div className="bg-[#A3D9B1] text-white h-12 w-12 rounded-xl flex items-center justify-center text-xl font-semibold shadow-md mr-4">
            {dayNumber}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#6A8D74]">
              Fasting Day {dayNumber}
            </h2>
            <p className="text-sm text-muted-foreground">
              Hours {(dayNumber - 1) * 24 + 1}-{dayNumber * 24}
            </p>
          </div>
        </div>
        <Separator className="mt-6 bg-[#A3D9B1] h-1 rounded-full" />
      </div>
      
      <div className="pl-6 border-l-2 border-[#A3D9B1] mt-8">
        {entries.map((entry) => (
          <div key={entry.hour} className="relative mb-12">
            <div className="absolute -left-[21px] bg-background p-2">
              <div className="h-8 w-8 rounded-full bg-[#F2F0E6] border-2 border-[#A3D9B1] flex items-center justify-center shadow-md">
                <Clock className="h-4 w-4 text-[#6A8D74]" />
              </div>
            </div>
            <Card className="ml-6 transition-all hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium mb-2 text-[#6A8D74] flex items-center">
                    Fasting Hour {entry.hour}
                  </h3>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(entry)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit hour {entry.hour}</span>
                    </Button>
                  )}
                </div>
                
                {(entry.whatsHappening || entry.content) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-mint-500 mb-1">What's happening:</h4>
                    <p className="text-muted-foreground">
                      {entry.whatsHappening || entry.content}
                    </p>
                  </div>
                )}
                
                {entry.howYoureFeeling && (
                  <div>
                    <h4 className="text-sm font-medium text-mint-500 mb-1">How you're feeling:</h4>
                    <p className="text-muted-foreground">
                      {entry.howYoureFeeling}
                    </p>
                  </div>
                )}
                
                {!entry.whatsHappening && !entry.content && !entry.howYoureFeeling && (
                  <p className="italic text-muted-foreground/60">
                    {isAdmin ? "Click edit to add content" : "No content for this hour yet"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingHour !== null} onOpenChange={(open) => !open && setEditingHour(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Fasting Hour {editingHour}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="whats-happening">What's happening:</Label>
              <Textarea
                id="whats-happening"
                value={whatsHappening}
                onChange={(e) => setWhatsHappening(e.target.value)}
                placeholder="Describe what happens in the body during this hour of fasting..."
                className="min-h-[120px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="how-youre-feeling">How you're feeling:</Label>
              <Textarea
                id="how-youre-feeling"
                value={howYoureFeeling}
                onChange={(e) => setHowYoureFeeling(e.target.value)}
                placeholder="Describe how someone might feel during this hour of fasting..."
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingHour(null)}>Cancel</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EditableTimelineSection;
