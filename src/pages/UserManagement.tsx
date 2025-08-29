import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { SupabaseAuthService } from "@/services/SupabaseAuthService";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/admin/login');
        return;
      }
      
      if (user && isAdmin === false) {
        navigate('/admin');
        toast.error("Access denied. Admin privileges required.");
        return;
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("No user found");
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsUpdating(true);
    
    try {
      const result = await SupabaseAuthService.updatePassword(newPassword);
      
      if (result.success) {
        toast.success("Password updated successfully!");
        
        // Clear the form
        setNewPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
      } else {
        toast.error(result.error || "Failed to update password");
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error("Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || isAdmin !== true) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">Change Password</h1>
          <Button variant="outline" onClick={handleBack}>Back to Admin</Button>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Admin Account Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Current Admin User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> Admin</p>
                <p><strong>User ID:</strong> {user.id}</p>
              </div>
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
                      placeholder="Enter new password (min 6 characters)"
                      required
                      minLength={6}
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
                      minLength={6}
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
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Change Password'}
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