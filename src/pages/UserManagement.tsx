
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  username: string;
  role: string;
  dateAdded: string;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('viewer');

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem('fastingApp_auth');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    setIsAuthenticated(true);

    // Load users from localStorage
    const savedUsers = localStorage.getItem('fastingApp_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with default admin user if no users exist
      const defaultUsers = [
        {
          id: '1',
          username: 'admin',
          role: 'admin',
          dateAdded: new Date().toISOString()
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('fastingApp_users', JSON.stringify(defaultUsers));
    }
  }, [navigate]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUsername || !newPassword) {
      toast.error("Username and password are required");
      return;
    }

    // Check if username already exists
    if (users.some(user => user.username.toLowerCase() === newUsername.toLowerCase())) {
      toast.error("Username already exists");
      return;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username: newUsername,
      role: newRole,
      dateAdded: new Date().toISOString()
    };

    // Add user to localStorage with password
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('fastingApp_users', JSON.stringify(updatedUsers));
    
    // Store user credentials (in a real app, passwords should be hashed)
    localStorage.setItem(`fastingApp_user_${newUsername.toLowerCase()}`, newPassword);
    
    toast.success("User added successfully");
    
    // Clear form
    setNewUsername('');
    setNewPassword('');
    setNewRole('viewer');
  };

  const handleDeleteUser = (userId: string, username: string) => {
    // Prevent deleting the main admin account
    if (username.toLowerCase() === 'admin') {
      toast.error("Cannot delete the main admin account");
      return;
    }
    
    // Remove user from state and localStorage
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('fastingApp_users', JSON.stringify(updatedUsers));
    
    // Remove user credentials
    localStorage.removeItem(`fastingApp_user_${username.toLowerCase()}`);
    
    toast.success("User deleted successfully");
  };

  const handleChangeRole = (userId: string, newRole: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('fastingApp_users', JSON.stringify(updatedUsers));
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
                    placeholder="Enter password"
                    required
                  />
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
                          onClick={() => handleDeleteUser(user.id, user.username)}
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
