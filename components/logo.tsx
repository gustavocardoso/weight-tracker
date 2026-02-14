'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity } from 'lucide-react';

export function Logo() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/';

  return (
    <Link 
      href={isAuthPage ? '/' : '/dashboard'} 
      className="flex flex-col gap-1 group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          {/* Logo container with gradient background */}
          <div className="p-3 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
            <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          {/* Pulse effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
        </div>
        
        {/* Logo text - single line */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Weight
          </span>
          <span className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-400">
            Tracker
          </span>
        </div>
      </div>
      
      {/* Slogan */}
      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 ml-16 italic">
        Your Journey to a Healthier You
      </p>
    </Link>
  );
}
