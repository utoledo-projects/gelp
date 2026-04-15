"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DatabaseSearchBar from "./util/DatabaseSearchBar";
import useUser from "@/hooks/useUser";

export default function Navbar() {
  const user = useUser();

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
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black backdrop-blur-md">
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

        <div className="hidden md:block w-full max-w-sm px-4">
          <DatabaseSearchBar />
        </div>

        <div className="flex items-center gap-6 font-sans text-[11px] font-bold">
          
          {user?.isAdministrator && (
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
              <div className="flex items-center relative">
                <Link className="flex items-center gap-3" href='/profile'>
                  {user.avatar && <div className='w-8 h-8 cursor-pointer border border-zinc-700 hover:border-zinc-400 rounded-full transition-all shrink-0'>
                    <img className='w-full h-full rounded-full' src={user.avatar} alt='user avatar'/>
                  </div>}
                  {!user.avatar && <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition-all text-zinc-100 font-bold text-[11px] uppercase shrink-0">
                    {initial}
                  </div>}
                </Link>
                
                <div className="absolute left-11 flex items-center gap-5 whitespace-nowrap">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:block">
                    {user.username}
                  </span>
                  <Link 
                    href="/auth/logout" 
                    className="text-[10px] text-zinc-400 hover:text-red-400 transition-all uppercase tracking-widest font-medium border-b border-transparent hover:border-red-400/30"
                  >
                    Logout
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center relative">
                <div className="w-8 h-8 shrink-0" />

                <div className="absolute left-1 whitespace-nowrap">
                  <Link 
                    href={`/auth/login?redirect=${pathname}`} 
                    className="text-[10px] text-zinc-400 hover:text-indigo-400 transition-all uppercase tracking-widest font-medium border-b border-transparent hover:border-indigo-400/30 pb-0.5"
                  >
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}