
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const ContentPage = () => {
  const { pageType } = useParams<{ pageType: string }>();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Load the content from localStorage
    const savedContent = localStorage.getItem(`fastingApp_${pageType}Content`);
    
    if (savedContent) {
      setContent(savedContent);
    } else {
      // Set some default content if nothing is saved
      setContent('Content for this page has not been created yet.');
    }

    // Set the page title based on the page type
    switch(pageType) {
      case 'privacy':
        setTitle('Privacy Policy');
        break;
      case 'terms':
        setTitle('Terms of Service');
        break;
      case 'contact':
        setTitle('Contact Us');
        break;
      default:
        setTitle('fastnow.app');
    }
  }, [pageType]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 border-b">
        <div className="container flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">fastnow.app</Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <article className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} fastnow.app. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContentPage;
