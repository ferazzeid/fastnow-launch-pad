
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/admin/LoginForm';
import { toast } from "@/components/ui/sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem('fastingApp_auth');
    if (authStatus === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Login attempt:', { username, password });
    
    // Check default admin credentials
    if (username.toLowerCase() === 'admin' && password === 'admin') {
      localStorage.setItem('fastingApp_auth', 'true');
      localStorage.setItem('fastingApp_currentUser', 'admin');
      toast.success("Login successful!");
      navigate('/admin');
      return;
    }
    
    // Check against stored users
    const savedUsers = localStorage.getItem('fastingApp_users');
    if (savedUsers) {
      try {
        const users = JSON.parse(savedUsers);
        const user = users.find((u: any) => u.username.toLowerCase() === username.toLowerCase());
        
        if (user) {
          const storedPassword = localStorage.getItem(`fastingApp_user_${username.toLowerCase()}`);
          if (storedPassword === password) {
            localStorage.setItem('fastingApp_auth', 'true');
            localStorage.setItem('fastingApp_currentUser', username.toLowerCase());
            toast.success("Login successful!");
            navigate('/admin');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking user credentials:', error);
      }
    }
    
    toast.error("Invalid username or password");
  };

  return (
    <LoginForm
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  );
};

export default AdminLogin;
