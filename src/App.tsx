
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";
import { SecurityHeaders } from "./components/SecurityHeaders";
import { SiteSettingsService } from "@/services/SiteSettingsService";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminResetPassword from "./pages/AdminResetPassword";
import AdminGeneral from "./pages/AdminGeneral";
import AdminFAQEditor from "./pages/AdminFAQEditor";
import FAQ from "./pages/FAQ";
import AdminFAQ from "./pages/AdminFAQ";
import ContentPage from "./pages/ContentPage";
import UserManagement from "./pages/UserManagement";
import FastingTimeline from "./pages/FastingTimeline";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminBlog from "./pages/AdminBlog";
import BlogEditor from "./pages/BlogEditor";
import FastingTimelineBlog from "./pages/FastingTimelineBlog";
import FastingTimelinePost from "./pages/FastingTimelinePost";
import FastNowProtocol from "./pages/FastNowProtocol";
import AboutFastNowApp from "./pages/AboutFastNowApp";
import AboutMe from "./pages/AboutMe";
import AdminFastingTimeline from "./pages/AdminFastingTimeline";
import AdminFastingTimelineExport from "./pages/AdminFastingTimelineExport";
import AdminUnifiedHomepage from "./pages/AdminUnifiedHomepage";
import AdminProtocolEditor from "./pages/AdminProtocolEditor";
import AdminAboutAppEditor from "./pages/AdminAboutAppEditor";
import AdminUnifiedProtocol from "./pages/AdminUnifiedProtocol";
import AdminUnifiedAboutApp from "./pages/AdminUnifiedAboutApp";
import AdminStaticContentEditor from "./pages/AdminStaticContentEditor";
import AdminRingBellGallery from "./pages/AdminRingBellGallery";
import AdminSitemapGenerator from "./pages/AdminSitemapGenerator";
import AdminContactSettings from "./pages/AdminContactSettings";
import AdminAuthorProfile from "./pages/AdminAuthorProfile";
import AdminSEOAnalytics from "./pages/AdminSEOAnalytics";

const queryClient = new QueryClient();

const AppRoutes = () => {
  useGoogleAnalytics();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Blog routes */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      
      {/* FastNow Protocol */}
      <Route path="/fast-now-protocol" element={<FastNowProtocol />} />
      <Route path="/about-fastnow-app" element={<AboutFastNowApp />} />
      <Route path="/about-me" element={<AboutMe />} />
      <Route path="/faq" element={<FAQ />} />
      
      {/* Fasting Timeline routes */}
      <Route path="/fasting-timeline" element={<FastingTimelineBlog />} />
      <Route path="/fasting-timeline/:slug" element={<FastingTimelinePost />} />
      
      
      {/* Admin routes */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/reset-password" element={<AdminResetPassword />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/general" element={<AdminGeneral />} />
      <Route path="/admin/homepage-unified" element={<AdminUnifiedHomepage />} />
      <Route path="/admin/protocol" element={<AdminProtocolEditor />} />
      <Route path="/admin/protocol-unified" element={<AdminUnifiedProtocol />} />
      <Route path="/admin/about-app" element={<AdminAboutAppEditor />} />
      <Route path="/admin/about-app-unified" element={<AdminUnifiedAboutApp />} />
      <Route path="/admin/static-content" element={<AdminStaticContentEditor />} />
      <Route path="/admin/contact" element={<AdminContactSettings />} />
      <Route path="/admin/blog" element={<AdminBlog />} />
      <Route path="/admin/blog/new" element={<BlogEditor />} />
      <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
      <Route path="/admin/author-profile" element={<AdminAuthorProfile />} />
      <Route path="/admin/faq" element={<AdminFAQ />} />
      <Route path="/admin/fasting-timeline" element={<AdminFastingTimeline />} />
      <Route path="/admin/fasting-timeline/export" element={<AdminFastingTimelineExport />} />
      <Route path="/admin/ring-bell-gallery" element={<AdminRingBellGallery />} />
      <Route path="/admin/sitemap" element={<AdminSitemapGenerator />} />
      <Route path="/admin/seo-analytics" element={<AdminSEOAnalytics />} />
      
      {/* Content pages */}
      <Route path="/privacy" element={<ContentPage />} />
      <Route path="/terms" element={<ContentPage />} />
      <Route path="/contact" element={<ContentPage />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Apply default colors immediately, then load database colors asynchronously
  useEffect(() => {
    // Apply defaults immediately to prevent blocking
    SiteSettingsService.applyDesignColors({
      primary: '#000000',
      secondary: '#6B7280'
    });
    
    // Load database colors asynchronously without blocking render
    SiteSettingsService.loadAndApplyDesignColors().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <SecurityHeaders />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
