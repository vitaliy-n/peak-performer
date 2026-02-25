import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../components/ui';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useStore((state) => state.login);
  const loadSeedData = useStore((state) => state.loadSeedData);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Authenticate
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // 2. Try to load existing data for this user
        try {
          const dataResponse = await fetch(`http://localhost:3001/api/data/${data.user.id}`);
          const persistenceData = await dataResponse.json();
          
          if (persistenceData && persistenceData.state) {
            // Restore full state
            useStore.setState(persistenceData.state);
            // Ensure we are authenticated (token might need refresh)
            useStore.getState().login(persistenceData.state.user || data.user, data.user.token);
          } else {
            // New Admin User: Seed and Initialize
            loadSeedData();
            
            // Get the seeded user and merge with admin details
            const currentUser = useStore.getState().user;
            if (currentUser) {
              const adminUser = {
                ...currentUser,
                id: data.user.id,
                name: data.user.name,
                role: data.user.role,
                email: 'admin@peakperformer.com', // Default admin email
              };
              // Set the user and auth status
              login(adminUser, data.user.token);
            }
          }
        } catch (err) {
          console.error('Failed to load user data', err);
          // Fallback: Just login with what we have + seed
          loadSeedData();
          login(data.user, data.user.token); 
        }

        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Ensure server is running (npm run server).');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login to Peak Performer</CardTitle>
          <p className="text-center text-gray-500">Enter your credentials to access your workspace</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••"
                required
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Or continue as guest</p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/guest')}>
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
