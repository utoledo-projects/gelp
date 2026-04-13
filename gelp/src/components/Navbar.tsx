"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface User {
  username?: string;
  email?: string;
  isAdmin?: boolean;
}

export default function Navbar({ user }: { user: User | null }) {
  const pathname = usePathname();

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const initial = user?.username 
    ? getInitials(user.username) 
    : user?.email 
      ? user.email[0].toUpperCase() 
      : "?";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-8">
          <Link href="/" className="group">
            <div className="flex items-center gap-4">
              <span className="text-indigo-500 font-black text-2xl tracking-tighter group-hover:text-indigo-400 transition-colors">
                GELP
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-6 font-sans text-[11px] font-bold">
          
          {user?.isAdmin && (
            <div className="flex items-center gap-3">
              <Link 
                href="/admin/content" 
                className="px-3 py-1.5 border border-zinc-800 rounded text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 hover:bg-zinc-900/50 transition-all uppercase tracking-wider"
              >
                Post
              </Link>
              <Link 
                href="/admin/import" 
                className="px-3 py-1.5 border border-zinc-800 rounded text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 hover:bg-zinc-900/50 transition-all uppercase tracking-wider"
              >
                Import
              </Link>
            </div>
          )}

          <div className="flex items-center gap-4 pl-6 border-l border-zinc-800 h-8">
            {user ? (
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition-all text-zinc-100 font-bold text-[11px] uppercase">
                    {initial}
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:block">
                    {user.username}
                  </span>
                </div>
                <Link 
                  href="/auth/logout" 
                  className="text-[10px] text-zinc-400 hover:text-red-400 transition-all uppercase tracking-widest font-medium border-b border-transparent hover:border-red-400/30 pb-0.5"
                >
                  Logout
                </Link>
              </div>
            ) : (
              <Link 
                href={`/auth/login?redirect=${pathname}`} 
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}