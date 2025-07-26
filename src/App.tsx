
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
import ContentPage from "./pages/ContentPage";
import UserManagement from "./pages/UserManagement";
import FastingTimeline from "./pages/FastingTimeline";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminBlog from "./pages/AdminBlog";
import BlogEditor from "./pages/BlogEditor";
import BlogApi from "./pages/BlogApi";
import AdminMotivators from "./pages/AdminMotivators";
import AdminFastingHours from "./pages/AdminFastingHours";
import AppContentApi from "./pages/AppContentApi";
import FastingSlotsApi from "./pages/FastingSlotsApi";
import FastingHoursApi from "./pages/FastingHoursApi";
import MotivatorsApi from "./pages/MotivatorsApi";
import FastingTimelineBlog from "./pages/FastingTimelineBlog";
import FastingTimelinePost from "./pages/FastingTimelinePost";
import AdminFastingTimeline from "./pages/AdminFastingTimeline";
import FastingTimelineEditor from "./pages/FastingTimelineEditor";
import FastingTimelineApi from "./pages/FastingTimelineApi";
import FastNowProtocol from "./pages/FastNowProtocol";
import AboutFastNowApp from "./pages/AboutFastNowApp";

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
      
      {/* Fasting Timeline routes */}
      <Route path="/fasting-timeline" element={<FastingTimelineBlog />} />
      <Route path="/fasting-timeline/:slug" element={<FastingTimelinePost />} />
      
      {/* API routes */}
      <Route path="/api/blog" element={<BlogApi />} />
      <Route path="/api/fasting-timeline" element={<FastingTimelineApi />} />
      <Route path="/api/app-content" element={<AppContentApi />} />
      <Route path="/api/fasting-slots" element={<FastingSlotsApi />} />
      <Route path="/api/fasting-hours" element={<FastingHoursApi />} />
      <Route path="/api/motivators" element={<MotivatorsApi />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/general" element={<AdminGeneral />} />
      <Route path="/admin/pages" element={<AdminPages />} />
      <Route path="/admin/design" element={<AdminDesign />} />
      <Route path="/admin/seo" element={<AdminSeo />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/blog" element={<AdminBlog />} />
      <Route path="/admin/blog/new" element={<BlogEditor />} />
      <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
      <Route path="/admin/fasting-timeline" element={<AdminFastingTimeline />} />
      <Route path="/admin/fasting-timeline/new" element={<FastingTimelineEditor />} />
      <Route path="/admin/fasting-timeline/edit/:id" element={<FastingTimelineEditor />} />
      <Route path="/admin/motivators" element={<AdminMotivators />} />
      <Route path="/admin/fasting-hours" element={<AdminFastingHours />} />
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
