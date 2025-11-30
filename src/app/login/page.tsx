'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { saveToken } from '@/lib/auth';
import { API_BASE } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle  } from '@/components/ui/card';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {

  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPassword(''); 
        setError(data.message || 'Login Failed');
        return; 
      }
      
      saveToken(data.accessToken);
      router.push('/dashboard');
    
    } catch (err) {
      setError('Invalid Credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-[#0c0a1e] via-[#1b0a4d] to-[#2d1b69] 
      px-4 relative p-8"
    >
      <Card 
        className="w-full max-w-sm 
          bg-[#1b0a4d] border border-purple-500/30 
          text-white shadow-3xl rounded-xl relative overflow-hidden 
          transition-all duration-300 transform hover:scale-[1.01]" 
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none opacity-50"></div>
        
        <CardHeader className="text-center pt-8 pb-4 relative border-b border-white/10">
          <div className="mx-auto mb-4 h-20 w-20 
            bg-purple-600 border-4 border-purple-400 
            rounded-full flex items-center justify-center shadow-xl"
          >
            <Image 
                        src="/gweb.png"
                        alt="GRPWEB Logo"
                        width={50}
                        height={50}
                        priority
                        className="w-20 h-20 object-contain"
                      />
          </div>
          
          <CardTitle className="text-3xl font-extrabold text-white tracking-tight mb-2">
            GRPWEB
          </CardTitle>
          <p className="text-purple-300/80 text-sm">Log In to access your dashboard.</p>
        </CardHeader>
        
        <CardContent className="px-8 pb-8 relative">
          <form onSubmit={handleLogin} className="space-y-6">

            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 pr-4 bg-[#0c0a1e] border border-white/10 text-white placeholder-white/50 focus-visible:ring-2 focus-visible:ring-purple-500/50"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-[#0c0a1e] border border-white/10 text-white placeholder-white/50 focus-visible:ring-2 focus-visible:ring-purple-500/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
              </button>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 
                transition-all duration-200 shadow-lg shadow-purple-900/50
                disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Authenticating...
                </>
              ) : (
                'Log In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              className="text-purple-400 hover:text-purple-300 text-sm" 
              onClick={() => router.push('/register')}
            >
              Don't have an account? Create one
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}