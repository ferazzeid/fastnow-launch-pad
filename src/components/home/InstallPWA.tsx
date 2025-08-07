import React from 'react';

export const InstallPWA: React.FC = () => {
  return (
    <section aria-labelledby="install" className="py-12 border-t animate-fade-in">
      <div className="container max-w-4xl mx-auto">
        <h2 id="install" className="text-2xl md:text-3xl font-semibold mb-4">Install FastNow to your home screen</h2>
        <p className="text-muted-foreground mb-6">Get the app-like experience on your phone. No app store needed.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">iOS (Safari)</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Tap the Share icon in Safari.</li>
              <li>Choose “Add to Home Screen”.</li>
              <li>Tap Add. FastNow appears on your home screen.</li>
            </ol>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Android (Chrome)</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Open the menu (⋮) in Chrome.</li>
              <li>Select “Install app” or “Add to Home screen”.</li>
              <li>Confirm. FastNow appears on your home screen.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstallPWA;
