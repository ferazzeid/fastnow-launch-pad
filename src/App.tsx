
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";
import { SecurityHeaders } from "./components/SecurityHeaders";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminPageEditor from "./pages/AdminPageEditor";
import AdminGeneral from "./pages/AdminGeneral";
import AdminPages from "./pages/AdminPages";
import AdminDesign from "./pages/AdminDesign";
import AdminSeo from "./pages/AdminSeo";
import AdminContactSettings from "./pages/AdminContactSettings";
import AdminPageImages from "./pages/AdminPageImages";
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
import MyWeightStory from "./pages/MyWeightStory";
import MyFoodSelection from "./pages/MyFoodSelection";

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
      <Route path="/about-fast-now-app" element={<AboutFastNowApp />} />
      <Route path="/my-weight-story" element={<MyWeightStory />} />
      <Route path="/my-food-selection" element={<MyFoodSelection />} />
      
      {/* Fasting Timeline routes */}
      <Route path="/fasting-timeline" element={<FastingTimelineBlog />} />
      <Route path="/fasting-timeline/:slug" element={<FastingTimelinePost />} />
      
      
      {/* Admin routes */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/general" element={<AdminGeneral />} />
      <Route path="/admin/pages" element={<AdminPages />} />
      <Route path="/admin/design" element={<AdminDesign />} />
      <Route path="/admin/seo" element={<AdminSeo />} />
      <Route path="/admin/contact" element={<AdminContactSettings />} />
      <Route path="/admin/page-images" element={<AdminPageImages />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/blog" element={<AdminBlog />} />
      <Route path="/admin/blog/new" element={<BlogEditor />} />
      <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
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

const App = () => (
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

export default App;
