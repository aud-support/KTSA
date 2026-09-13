import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const API_BASE = import.meta.env.VITE_ADMIN_BACKEND_BASE_URL;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, {
        identifier: formData.username === 'admin' ? 'admin@gmail.com' : formData.username,
        password: formData.password,
      });
      const data = response.data?.data;
      if (data?.role === 'ADMIN' && data?.token) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('adminToken', data.token);
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error('Access denied. Admin credentials required.');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
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
