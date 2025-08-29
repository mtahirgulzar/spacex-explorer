"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const isActive = (path: string, status?: string) => {
    if (pathname !== path) return false;
    if (!status) return !searchParams.get('status');
    return searchParams.get('status') === status;
  };

  const getLinkClass = (isActive: boolean) => 
    `relative transition-all duration-300 ease-in-out group ${isActive ? 'text-foreground font-medium' : 'text-foreground/60 hover:text-foreground/80'}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
      isScrolled 
        ? 'bg-white shadow-sm' 
        : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight">SpaceX Explorer</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm">
              <Link 
                href="/launches" 
                className={`${getLinkClass(isActive('/launches'))} group relative`}
              >
                <span className="relative">
                  All Launches
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
              <Link 
                href="/launches?upcoming=true" 
                className={`${getLinkClass(isActive('/launches', 'upcoming'))} group relative`}
              >
                <span className="relative">
                  Upcoming
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
              <Link 
                href="/launches?upcoming=false" 
                className={`${getLinkClass(isActive('/launches', 'past'))} group relative`}
              >
                <span className="relative">
                  Past Launches
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
              <Link 
                href="/favorites" 
                className={`${getLinkClass(pathname === '/favorites')} group relative`}
              >
                <span className="relative">
                  Favorites
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}