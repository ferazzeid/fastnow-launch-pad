
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { AuthService, User } from "@/services/AuthService";

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('viewer');

  useEffect(() => {
    // Check authentication with secure session
    const session = AuthService.getCurrentSession();
    if (!session || !AuthService.hasPermission('admin')) {
      navigate('/admin');
      return;
    }
    setIsAuthenticated(true);

    // Load users securely
    const users = AuthService.getUsers();
    setUsers(users);
  }, [navigate]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize inputs
    const sanitizedUsername = AuthService.sanitizeInput(newUsername);
    const sanitizedPassword = AuthService.sanitizeInput(newPassword);
    
    const result = await AuthService.addUser(sanitizedUsername, sanitizedPassword, newRole);
    
    if (result.success) {
      // Refresh user list
      setUsers(AuthService.getUsers());
      toast.success("User added successfully");
      
      // Clear form
      setNewUsername('');
      setNewPassword('');
      setNewRole('viewer');
    } else {
      toast.error(result.error || "Failed to add user");
    }
  };

  const handleDeleteUser = (userId: string) => {
    const result = AuthService.deleteUser(userId);
    
    if (result.success) {
      setUsers(AuthService.getUsers());
      toast.success("User deleted successfully");
    } else {
      toast.error(result.error || "Failed to delete user");
    }
  };

  const handleChangeRole = (userId: string, newRole: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    AuthService.saveUsers(updatedUsers);
    toast.success("User role updated");
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
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button variant="outline" onClick={handleBack}>Back to Admin</Button>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Add User Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newRole}
                    onValueChange={setNewRole}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Add User</Button>
              </form>
            </CardContent>
          </Card>
          
          {/* User List */}
          <Card>
            <CardHeader>
              <CardTitle>User List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={user.role}
                          onValueChange={(value) => handleChangeRole(user.id, value)}
                          disabled={user.username.toLowerCase() === 'admin'}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder={user.role} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.username.toLowerCase() === 'admin'}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {users.length === 0 && (
                <p className="text-center py-4 text-muted-foreground">No users found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
