"use client";

import Image from 'next/image';
import { getToken, logoutUser } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from "react";
import {User, LogOut, MessageSquare, MoreVertical, Copy, Check} from "lucide-react" 

interface JwtPayload {
  sub: number;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#1b0a4d] rounded-xl shadow-2xl p-6 ${className}`}>
    {children}
  </div>
);

export default function DashboardHome() {
  const router = useRouter();

  const [username, setUsername] = useState("Guest");
  const [copySuccess, setCopySuccess] = useState(false);
  
  const token = getToken();

  const handleLogout = useCallback(() => {
    logoutUser();
    router.push('/login');
  }, [router]);

  const handleCopyToken = useCallback(async () => {
    if (!token) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(token);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = token;
        textArea.style.position = 'fixed'; 
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!successful) {
          throw new Error('Fallback copy failed');
        }
      }

      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      console.log("Token copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy token:", err);
      alert("Error: Could not automatically copy token.");
    }
  }, [token]);
  useEffect(() => {
    if (!token) {
      console.log("No token found. Redirecting to login.");
      router.push('/login');
      return; 
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp * 1000 < Date.now()) {
         throw new Error("Token expired");
      }

      setUsername(decoded.username || 'User');
    } catch (e) {
      console.error("Token invalid or expired. Redirecting.", e);
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router, token]);

  return (
    <div className="p-8 bg-gradient-to-br from-[#0c0a1e] to-[#1b0a4d] min-h-screen text-white font-sans">
      
     <header  className="flex justify-between items-center pb-4 border-b border-white/10 mb-8"> 
      <div className="flex items-center space-x-3">
          <Image 
            src="/gweb.png"
            alt="GRPWEB Logo"
            width={32}
            height={32}
            priority
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-3xl font-extrabold tracking-tight">GRPWEB</h1> 
        </div> 

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost"
              size="icon" 
              aria-label="More Options" 
              className="hover:bg-white/10 text-white rounded-full transition-colors"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 bg-[#0c0a1e] border border-white/20 text-white shadow-2xl">
            <DropdownMenuGroup>
 
              <DropdownMenuItem 
                onClick={() => router.push('/profile')} 
                className="cursor-pointer focus:bg-white/10" 
              >
                <User className="mr-2 h-4 w-4 text-sky-400"/>
                <span className="text-white">Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-white/10"/>

              <DropdownMenuItem 
                onClick={() => window.location.href = 'https://gregprado-website-nu.vercel.app'} 
                className="cursor-pointer focus:bg-white/10"
              >
                <MessageSquare className="mr-2 h-4 w-4 text-purple-400"/>
                <span className="text-white">Creator Website</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-white/10"/>

              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer focus:bg-red-900/50 text-red-400" 
              >
                <LogOut className="mr-2 h-4 w-4 text-red-400"/>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      
      <main className="mt-8">
        <h2 className="text-4xl font-light mb-8">
          Welcome, <span className="font-medium text-purple-300">{username}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <Card className="md:col-span-1">
            <h3 className="text-xl font-bold mb-3">🗝️ Your Bearer Token</h3>
            <p className="text-white/70 text-sm mb-4">
              This token grants access to your account APIs. **Keep this secure and do not share it.**
            </p>
            
            <div className="flex items-center space-x-2">
              <input
                value={token || 'Not logged in or token expired...'}
                readOnly
                className="flex-1 px-4 py-3 border border-white/10 rounded-lg bg-[#0c0a1e] text-green-300 text-xs font-mono truncate shadow-inner focus:outline-none"
                />
              
              <Button
                onClick={handleCopyToken}
                variant="ghost" 
                size="icon"
                aria-label="Copy Token"
                className={`w-10 h-10 rounded-lg transition-all duration-300 ${copySuccess ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[#0c0a1e] text-white hover:bg-white/10'}`}
              >
                {copySuccess ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
              
            </div>
            <div className="h-4 mt-2">
              {copySuccess && <span className="text-green-400 text-xs flex items-center">✅ Token Copied!</span>}
            </div>
          </Card>

        </div>
      </main>

      <footer className="absolute bottom-4 right-8 text-white/30 text-xs">
        &copy; {new Date().getFullYear()} GRPWEB. All rights reserved.
      </footer>
    </div>
  );
}