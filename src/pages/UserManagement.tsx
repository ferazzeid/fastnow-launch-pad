
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { AuthService, User } from "@/services/AuthService";
import { Eye, EyeOff } from "lucide-react";

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    console.log('UserManagement: Component mounted');
    
    // Check legacy authentication first
    const legacyAuth = localStorage.getItem('fastingApp_auth');
    console.log('UserManagement: Legacy auth status:', legacyAuth);
    
    // Check modern session authentication
    const session = AuthService.getCurrentSession();
    console.log('UserManagement: Current session:', session);
    
    const hasAdminPermission = AuthService.hasPermission('admin');
    console.log('UserManagement: Has admin permission:', hasAdminPermission);
    
    // Allow access if either legacy auth OR session auth is valid
    if (legacyAuth !== 'true' && (!session || !hasAdminPermission)) {
      console.log('UserManagement: Authentication failed, redirecting to admin');
      navigate('/admin');
      return;
    }
    
    console.log('UserManagement: Authentication successful');
    setIsAuthenticated(true);

    // Load current admin user
    const users = AuthService.getUsers();
    console.log('UserManagement: All users:', users);
    const adminUser = users.find(user => user.role === 'admin');
    console.log('UserManagement: Admin user found:', adminUser);
    setCurrentUser(adminUser || null);
  }, [navigate]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("No admin user found");
      return;
    }

    console.log('Password validation:', {
      newPassword: `"${newPassword}"`,
      confirmPassword: `"${confirmPassword}"`,
      newPasswordLength: newPassword.length,
      confirmPasswordLength: confirmPassword.length,
      areEqual: newPassword === confirmPassword,
      trimmedEqual: newPassword.trim() === confirmPassword.trim()
    });

    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // Update the admin user's password
    try {
      const users = AuthService.getUsers();
      const updatedUsers = await Promise.all(users.map(async (user) => {
        if (user.id === currentUser.id) {
          const hashedPassword = await AuthService.hashPassword(newPassword);
          return { ...user, password: hashedPassword };
        }
        return user;
      }));

      AuthService.saveUsers(updatedUsers);
      toast.success("Password updated successfully");
      
      // Clear form
      setNewPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error('Password update error:', error);
      toast.error("Failed to update password");
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">Admin Account Management</h1>
          <Button variant="outline" onClick={handleBack}>Back to Admin</Button>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Admin Account Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Current Admin Account</CardTitle>
            </CardHeader>
            <CardContent>
              {currentUser ? (
                <div className="space-y-2">
                  <p><strong>Username:</strong> {currentUser.username}</p>
                  <p><strong>Role:</strong> {currentUser.role}</p>
                  <p><strong>Account Created:</strong> {new Date(currentUser.dateAdded).toLocaleDateString()}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No admin account found</p>
              )}
            </CardContent>
          </Card>

          {/* Change Password Form */}
          <Card>
            <CardHeader>
              <CardTitle>Change Admin Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 8 characters)"
                      required
                      minLength={8}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      minLength={8}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
