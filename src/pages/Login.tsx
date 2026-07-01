import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  // Strings strictly bound to schema requirements
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' // Tells the server to expect JSON format
        },
        // Match the required JSON body schema: {"username": "string", "password": "string"}
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password.trim() 
        })
      });

      if (!response.ok) {
        throw new Error('Invalid username or password credentials.');
      }

      const data = await response.json();
      
      if (data.token) {
        login(data.token);
        navigate('/products'); // Forward upon matching verification
      } else {
        throw new Error('Token structure missing from API response context.');
      }

    } catch (err) {
      const errorObject = err as Error;
      setError(errorObject.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Welcome Back</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Sign in to your POC Dashboard</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username (string)</label>
            <input 
              type="text" 
              required 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="e.g., mor_2314"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password (string)</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:bg-gray-400 mt-2 cursor-pointer"
          >
            {loading ? 'Validating Schema...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 font-medium mb-1">💡 Required Test Credentials:</p>
          <p className="text-xs text-gray-500"><strong>username:</strong> mor_2314</p>
          <p className="text-xs text-gray-500"><strong>password:</strong> 83r5^_</p>
        </div>
      </div>
    </div>
  );
};
