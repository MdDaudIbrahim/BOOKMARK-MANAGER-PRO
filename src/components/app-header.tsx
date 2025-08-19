'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

interface AppHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  children?: React.ReactNode;
}

export default function AppHeader({
  searchQuery,
  onSearchChange,
  children
}: AppHeaderProps) {
  const { isVisible } = useScrollDirection({ threshold: 10 });

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 flex h-auto min-h-16 flex-wrap items-center gap-4 border-b bg-background/80 px-4 py-2 backdrop-blur-sm transition-transform duration-300 ease-in-out md:flex-nowrap md:px-6 md:py-0 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
        <SidebarTrigger className="md:hidden"/>
        <div className="relative flex-1 basis-full md:grow-0 md:basis-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Search bookmarks..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
        <div className="ml-auto flex items-center gap-2 md:gap-4">
            {children}
        </div>
    </header>
  );
}
