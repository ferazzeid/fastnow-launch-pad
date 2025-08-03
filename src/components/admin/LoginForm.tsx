
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface LoginFormProps {
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleForgotPassword?: () => void;
  rememberMe?: boolean;
  setRememberMe?: (remember: boolean) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  handleForgotPassword,
  rememberMe = false,
  setRememberMe,
  isLoading = false
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />
            </div>
            {setRememberMe && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </form>
          {handleForgotPassword && (
            <div className="mt-4 text-center">
              <Button variant="link" onClick={handleForgotPassword} className="text-sm">
                Forgot your password?
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
