
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, Users, FileText, BookOpen, Calendar, Heart, Clock } from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Link to="/">
            <Button variant="outline">Back to Site</Button>
          </Link>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Content Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/general">
                <Button variant="outline" className="w-full justify-start">
                  <Settings size={16} className="mr-2" />
                  General Settings
                </Button>
              </Link>
              <Link to="/admin/pages">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  Page Content
                </Button>
              </Link>
              <Link to="/admin/features">
                <Button variant="outline" className="w-full justify-start">
                  <Heart size={16} className="mr-2" />
                  Features
                </Button>
              </Link>
              <Link to="/admin/design">
                <Button variant="outline" className="w-full justify-start">
                  <Settings size={16} className="mr-2" />
                  Design Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users size={16} className="mr-2" />
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Blog Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} />
                Blog Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/blog">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen size={16} className="mr-2" />
                  Manage Posts
                </Button>
              </Link>
              <Link to="/admin/blog/new">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  Create New Post
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* App Content Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                Fasting Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/fasting-hours">
                <Button variant="outline" className="w-full justify-start">
                  <Clock size={16} className="mr-2" />
                  Hourly Fasting Content
                </Button>
              </Link>
              <Link to="/admin/motivators">
                <Button variant="outline" className="w-full justify-start">
                  <Heart size={16} className="mr-2" />
                  Motivators
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                API Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/api/app-content" target="_blank">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  App Content API
                </Button>
              </Link>
              <Link to="/api/fasting-hours" target="_blank">
                <Button variant="outline" className="w-full justify-start">
                  <Clock size={16} className="mr-2" />
                  Fasting Hours API
                </Button>
              </Link>
              <Link to="/api/motivators" target="_blank">
                <Button variant="outline" className="w-full justify-start">
                  <Heart size={16} className="mr-2" />
                  Motivators API
                </Button>
              </Link>
              <Link to="/api/blog" target="_blank">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen size={16} className="mr-2" />
                  Blog API
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* SEO Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                SEO & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/admin/seo">
                <Button variant="outline" className="w-full justify-start">
                  <Settings size={16} className="mr-2" />
                  SEO Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
