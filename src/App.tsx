
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";
import { SecurityHeaders } from "./components/SecurityHeaders";
import { SiteSettingsService } from "@/services/SiteSettingsService";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminAboutFastNowApp from "./pages/AdminAboutFastNowApp";
import AdminPageEditor from "./pages/AdminPageEditor";
import AdminGeneral from "./pages/AdminGeneral";
import AdminPages from "./pages/AdminPages";
import AdminDesign from "./pages/AdminDesign";
import AdminSeo from "./pages/AdminSeo";
import AdminContactSettings from "./pages/AdminContactSettings";
import AdminPageImages from "./pages/AdminPageImages";
import AdminHomepageSettings from "./pages/AdminHomepageSettings";
import FAQ from "./pages/FAQ";
import AdminFAQ from "./pages/AdminFAQ";
import AdminEmail from "./pages/AdminEmail";
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
      <Route path="/fastnow-protocol" element={<FastNowProtocol />} />
      <Route path="/about-fastnow-app" element={<AboutFastNowApp />} />
      <Route path="/about-me" element={<AboutMe />} />
      
      {/* Fasting Timeline routes */}
      <Route path="/fasting-timeline" element={<FastingTimelineBlog />} />
      <Route path="/fasting-timeline/:slug" element={<FastingTimelinePost />} />
      
      
      {/* Admin routes */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/general" element={<AdminGeneral />} />
      <Route path="/admin/pages" element={<AdminPages />} />
      <Route path="/admin/design" element={<AdminDesign />} />
      <Route path="/admin/seo" element={<AdminSeo />} />
      <Route path="/admin/contact" element={<AdminContactSettings />} />
      <Route path="/admin/page-images" element={<AdminPageImages />} />
      <Route path="/admin/homepage-settings" element={<AdminHomepageSettings />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/admin/faq" element={<AdminFAQ />} />
        <Route path="/admin/email" element={<AdminEmail />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/blog" element={<AdminBlog />} />
      <Route path="/admin/blog/new" element={<BlogEditor />} />
      <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
      <Route path="/admin/about-fastnow-app" element={<AdminAboutFastNowApp />} />
      <Route path="/admin/:pageType" element={<AdminPageEditor />} />
      
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
  useEffect(() => {
    // Load and apply design colors on app startup
    SiteSettingsService.loadAndApplyDesignColors();
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
