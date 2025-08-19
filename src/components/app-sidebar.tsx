'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Bookmark } from 'lucide-react';

interface AppSidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function AppSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Bookmark className="w-6 h-6"/>
                </div>
                <h2 className="text-lg font-semibold">Categories</h2>
            </div>
        </SidebarHeader>
        <SidebarMenu>
          {categories.map((category) => (
            <SidebarMenuItem key={category}>
              <SidebarMenuButton
                onClick={() => onSelectCategory(category)}
                isActive={selectedCategory === category}
                className="justify-start"
              >
                {category}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
