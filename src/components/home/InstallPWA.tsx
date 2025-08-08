import React from 'react';

export const InstallPWA: React.FC = () => {
  return (
    <section aria-labelledby="add-to-home" className="py-12">
      <div className="container max-w-4xl mx-auto">
        <article className="rounded-xl border bg-card p-6 shadow-sm">
          <header className="mb-4">
            <h2 id="add-to-home" className="text-2xl md:text-3xl font-semibold">Add FastNow to your Home Screen</h2>
            <p className="text-muted-foreground">Get the app-like experience on your phone. No app store needed.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-muted/40 p-4">
              <h3 className="font-medium mb-2">Android (Chrome)</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                <li>Open the menu (⋮) in Chrome.</li>
                <li>Tap “Add to Home screen”.</li>
                <li>Confirm. FastNow appears on your home screen.</li>
              </ol>
            </div>
            <div className="rounded-lg bg-muted/40 p-4">
              <h3 className="font-medium mb-2">iOS (Safari)</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                <li>Tap the Share icon in Safari.</li>
                <li>Choose “Add to Home Screen”.</li>
                <li>Tap Add. FastNow appears on your home screen.</li>
              </ol>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default InstallPWA;
