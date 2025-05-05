
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';

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
    <PageLayout>
      <Helmet>
        <title>{title} | fastnow.app</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <article className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-6">{title}</h1>
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        </div>
      </main>
    </PageLayout>
  );
};

export default ContentPage;
