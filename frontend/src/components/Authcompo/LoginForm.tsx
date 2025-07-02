import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { HiOutlineUser, HiOutlineOfficeBuilding } from 'react-icons/hi';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [committee, setCommittee] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const input = username.trim().toLowerCase();
    const validUsers = ['demo_deo', 'demo_supervisor', 'demo_ad'];

    if (validUsers.includes(input) && committee.trim() !== '') {
      await new Promise(resolve => setTimeout(resolve, 500));
      login(input, committee.trim());

      if (input === 'demo_deo') navigate('/deo');
      else if (input === 'demo_supervisor') navigate('/supervisor');
      else if (input === 'demo_ad') navigate('/ad');
    } else {
      setError('Invalid username or committee. Please check your credentials.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900">
            Welcome Back
          </h2>
          <p className="text-neutral-600">
            Sign in to your account to continue
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="demo_deo, demo_supervisor, or demo_ad"
            leftIcon={<HiOutlineUser size={16} />}
          />

          <Input
            label="Committee"
            type="text"
            value={committee}
            onChange={(e) => setCommittee(e.target.value)}
            required
            placeholder="Enter your committee name"
            leftIcon={<HiOutlineOfficeBuilding size={16} />}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            helperText="Password is optional for demo accounts"
          />

          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            disabled={!username || !committee}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-neutral-500">
              Demo environment - No password required
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;