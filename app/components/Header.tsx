'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Điều hướng người dùng tới trang search với từ khóa
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'NBA', href: '/category/nba' },
    { name: 'LEGENDS', href: '/category/legends' },
    { name: 'MINDSET', href: '/category/mindset' },
  ];

  return (
    <header className="w-full bg-white border-b-2 border-amber-600 pt-8 pb-4 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Main Brand Title */}
        <Link href="/" className="no-underline">
          <h1 className="text-3xl md:text-5xl font-black tracking-wider text-black text-center uppercase font-serif">
            THE GRIND CHRONICLE
          </h1>
        </Link>

        {/* Tagline */}
        <p className="text-gray-500 italic text-sm md:text-base mt-2 mb-6 font-serif">
          Stories Behind Greatness.
        </p>

        {/* Navigation & Search Container */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
          
          {/* Spacer giúp căn giữa menu trên màn hình lớn */}
          <div className="hidden md:block w-64"></div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6 md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm md:text-base font-bold text-gray-800 hover:text-amber-600 transition-colors uppercase tracking-wider"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar Form */}
          <form 
            onSubmit={handleSearch}
            className="flex items-center w-full md:w-64 border border-gray-300 rounded-full overflow-hidden focus-within:border-amber-600 transition-colors"
          >
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-1.5 text-sm text-gray-800 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-transparent hover:bg-gray-100 text-gray-600 transition-colors flex items-center justify-center border-l border-gray-200"
              title="Search"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2.5" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          </form>

        </div>

      </div>
    </header>
  );
}