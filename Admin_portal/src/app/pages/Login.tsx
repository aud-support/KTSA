import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

// Dummy credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.username === ADMIN_CREDENTIALS.username &&
        formData.password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error('Invalid credentials. Use admin/admin123');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-ktsa-primary to-ktsa-accent mb-4">
            <Lock size={32} className="text-black" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-ktsa-primary to-ktsa-accent bg-clip-text text-transparent">
            KTSA Admin Portal
          </h1>
          <p className="text-muted-foreground">Sign in to manage your content</p>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute left-3 top-[38px] text-muted-foreground">
                <User size={18} />
              </div>
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-[38px] text-muted-foreground">
                <Lock size={18} />
              </div>
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="pl-10"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          {/* Hint */}
          <div className="mt-6 p-3 bg-ktsa-accent/10 border border-ktsa-accent/20 rounded-lg">
            <p className="text-xs text-ktsa-accent text-center">
              Default credentials: <span className="font-semibold">admin / admin123</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2026 KTSA. All rights reserved.
        </p>
      </div>
    </div>
  );
};
