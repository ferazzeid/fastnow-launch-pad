import React from 'react';

export const PANsExplainer: React.FC = () => {
  return (
    <section aria-labelledby="pans" className="py-12 animate-fade-in">
      <div className="container max-w-4xl mx-auto">
        <h2 id="pans" className="text-2xl md:text-3xl font-semibold mb-4">Progress Awareness Numbers (PANs)</h2>
        <p className="text-muted-foreground mb-6">
          PANs help you see progress without obsessing over the scale. They capture the big picture and keep you motivated.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4 hover-scale">
            <h3 className="font-medium mb-1">Consistency</h3>
            <p className="text-sm text-muted-foreground">How often you follow the protocol. Small wins add up.</p>
          </div>
          <div className="rounded-lg border p-4 hover-scale">
            <h3 className="font-medium mb-1">Fasting Rhythm</h3>
            <p className="text-sm text-muted-foreground">Your practical fasting window trend over time.</p>
          </div>
          <div className="rounded-lg border p-4 hover-scale">
            <h3 className="font-medium mb-1">Energy Intake (EI)</h3>
            <p className="text-sm text-muted-foreground">A simplified look at how you’re fueling—no obsession.</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          In FastNow, PANs are visual, simple, and designed to reduce friction—so you keep going.
        </p>
      </div>
    </section>
  );
};

export default PANsExplainer;
