import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import PageFeaturedImage from '@/components/PageFeaturedImage';

const AboutMe = () => {
  const title = "Close Not Scales";
  const subtitle = "My measure of progress is clothes, not numbers. Real-world results over daily weight fluctuations.";
  const content = `I spent years bouncing between diets, tracking every macro, and obsessing over daily weight fluctuations. The scale would go up after a good day, down after a bad one, and I'd lose motivation when the numbers didn't match my effort.

Everything changed when I stopped weighing myself entirely. Now I use clothes as my measurement system. I keep a rack of clothes in different sizes - some brand new with tags, others I haven't worn in years. They're arranged in order of what I want to fit into next.

This approach works because clothes don't lie. They either fit or they don't. There's no water weight confusion, no wondering if muscle gain is masking fat loss, no daily fluctuations that mess with your head. Just clear, visual progress.

When I can zip up something that was too tight last month, that's real progress. When I move to the next smaller size on my rack, that's a victory worth celebrating. The scale can't capture that feeling of putting on clothes that actually fit well and feeling confident.

My protocol isn't about reaching some arbitrary number on a scale. It's about getting my body to a place where I feel good in my clothes, where I have energy, and where I'm not constantly thinking about food. The clothes on my rack represent those goals - not a number that changes for dozens of reasons I can't control.`;

  return (
    <PageLayout>
      <Helmet>
        <title>Close Not Scales - My Weight Loss Journey | FastNow</title>
        <meta name="description" content="My measure of progress is clothes, not numbers. Learn why I track real-world results over daily weight fluctuations and how it changed my approach to weight loss." />
      </Helmet>

      {/* Hero Background Image */}
      <div className="absolute inset-0 w-full h-screen z-0">
        <PageFeaturedImage pageKey="about-me" className="w-full h-full object-cover" showDarkBackground={true} />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-start pt-28 md:pt-32">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-left max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 drop-shadow-lg">
              {title}
            </h1>
            <p className="text-xl text-white/90 mb-8 drop-shadow-md">
              {subtitle}
            </p>
            <div className="mt-6 text-white/90 space-y-4 drop-shadow-md">
              <p>
                I don't use a scale. I don't care about a number that changes for a hundred reasons. I care about real-world results.
              </p>
              <p>
                My measure of progress is clothes. Some are brand new with tags still on. Others I haven't fit into for years. I keep them on a rack, in order of which I want to wear next. No numbers. No "target weight." Just the moment I can walk outside in something I couldn't even close a few weeks ago.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="relative z-10 bg-background">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
              
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
                <div className="space-y-6">
                  {content.split('\n\n').map((paragraph, index) => (
                    <div key={index} className="relative">
                      <div className="absolute left-0 top-2 w-2 h-2 bg-primary/20 rounded-full"></div>
                      <p className="pl-6 leading-relaxed">
                        {paragraph}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutMe;