import React from 'react';
import { Search, Bell, ShoppingCart, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline/10">
      <nav className="max-w-screen-2xl mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <span className="text-2xl font-black tracking-tighter text-on-surface font-headline">Digital Curator</span>
          <div className="hidden md:flex items-center gap-8 font-headline text-sm font-medium">
            <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors">Home</a>
            <a href="#" className="text-primary border-b-2 border-primary pb-1 font-bold">Browse</a>
            <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors">Blog</a>
          </div>
        </div>
      </nav>
    </header>
  );
};
