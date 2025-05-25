
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminPageEditor from "./pages/AdminPageEditor";
import AdminGeneral from "./pages/AdminGeneral";
import AdminPages from "./pages/AdminPages";
import AdminFeatures from "./pages/AdminFeatures";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Blog routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            
            {/* API routes */}
            <Route path="/api/blog" element={<BlogApi />} />
            <Route path="/api/app-content" element={<AppContentApi />} />
            <Route path="/api/fasting-slots" element={<FastingSlotsApi />} />
            <Route path="/api/fasting-hours" element={<FastingHoursApi />} />
            <Route path="/api/motivators" element={<MotivatorsApi />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/general" element={<AdminGeneral />} />
            <Route path="/admin/pages" element={<AdminPages />} />
            <Route path="/admin/features" element={<AdminFeatures />} />
            <Route path="/admin/design" element={<AdminDesign />} />
            <Route path="/admin/seo" element={<AdminSeo />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/blog/new" element={<BlogEditor />} />
            <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
            <Route path="/admin/motivators" element={<AdminMotivators />} />
            <Route path="/admin/fasting-hours" element={<AdminFastingHours />} />
            <Route path="/admin/:pageType" element={<AdminPageEditor />} />
            
            {/* Content pages */}
            <Route path="/privacy" element={<ContentPage />} />
            <Route path="/terms" element={<ContentPage />} />
            <Route path="/contact" element={<ContentPage />} />
            <Route path="/fasting-timeline" element={<FastingTimeline />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
