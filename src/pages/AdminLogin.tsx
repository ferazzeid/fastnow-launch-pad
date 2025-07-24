
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/admin/LoginForm';
import { AuthService } from '@/services/AuthService';
import { toast } from "@/components/ui/sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const session = AuthService.getCurrentSession();
    if (session) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Sanitize inputs
    const sanitizedUsername = AuthService.sanitizeInput(username);
    const sanitizedPassword = AuthService.sanitizeInput(password);
    
    try {
      const result = await AuthService.authenticate(sanitizedUsername, sanitizedPassword);
      
      if (result.success) {
        // Set legacy auth for backward compatibility
        localStorage.setItem('fastingApp_auth', 'true');
        localStorage.setItem('fastingApp_currentUser', sanitizedUsername.toLowerCase());
        
        toast.success("Login successful!");
        navigate('/admin');
      } else {
        toast.error(result.error || "Authentication failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
      isLoading={isLoading}
    />
  );
};

export default AdminLogin;
