
'use client';

import * as React from 'react';
import { FilePlus2, Upload } from 'lucide-react';
import { bookmarks as initialBookmarks, categories } from '@/lib/bookmarks';
import type { Bookmark as BookmarkType } from '@/lib/bookmarks';
import BookmarkGrid from '@/components/bookmark-grid';
import AppHeader from '@/components/app-header';
import AppSidebar from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AddBookmarkSheet from '@/components/add-bookmark-sheet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';


export default function Home() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [bookmarks, setBookmarks] = React.useState<BookmarkType[]>(initialBookmarks);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Create a dynamic list of categories including "All"
  const allCategories = React.useMemo(() => {
    const bookmarkCategories = Array.from(new Set(bookmarks.map(b => b.category))).sort();
    return ['All', ...bookmarkCategories];
  }, [bookmarks]);


  const handleAddBookmark = (newBookmark: Omit<BookmarkType, 'id' | 'image'>) => {
    const newBookmarkWithId: BookmarkType = {
      ...newBookmark,
      id: (bookmarks.length + 1).toString(),
      image: `https://placehold.co/600x400.png`,
      'data-ai-hint': 'new bookmark',
    };
    const updatedBookmarks = [...bookmarks, newBookmarkWithId];
    setBookmarks(updatedBookmarks);
    // Switch to the category of the newly added bookmark
    setSelectedCategory(newBookmark.category);
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
    toast({
        title: 'Bookmark Deleted',
        description: 'The bookmark has been successfully removed.',
    });
  };
  
  const parseBookmarks = (htmlContent: string): Omit<BookmarkType, 'id'>[] => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const links: Omit<BookmarkType, 'id'>[] = [];

      const traverse = (element: Element, currentCategory: string) => {
          for (const childNode of Array.from(element.children)) {
              if (childNode.tagName === 'DL') {
                  traverse(childNode, currentCategory);
              } else if (childNode.tagName === 'DT') {
                  const h3 = childNode.querySelector('H3');
                  const a = childNode.querySelector('A');
                  if (h3) {
                      const categoryName = h3.textContent?.trim() || 'Uncategorized';
                      const nextDl = childNode.querySelector('dl');
                       if(nextDl) {
                          traverse(nextDl, categoryName);
                      }
                  } else if (a) {
                      const title = a.textContent?.trim() || 'No Title';
                      links.push({
                          title,
                          url: a.getAttribute('href') || '',
                          description: '', // HTML doesn't typically contain a description
                          category: currentCategory,
                          image: `https://placehold.co/600x400.png`,
                          'data-ai-hint': title.split(' ').slice(0,2).join(' ').toLowerCase(),
                      });
                  }
              }
          }
      };

      const topDl = doc.querySelector('DL');
      if (topDl) {
          traverse(topDl, 'Imported');
      }

      return links;
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const parsed = parseBookmarks(content);
          if (parsed.length === 0) {
            toast({
              variant: 'destructive',
              title: 'Import Failed',
              description: 'No valid bookmarks found in the selected file.',
            });
            return;
          }
          const newBookmarksWithIds: BookmarkType[] = parsed.map((bm, index) => ({
            ...bm,
            id: `imported-${Date.now()}-${index}`,
          }));
          setBookmarks(prev => [...prev, ...newBookmarksWithIds]);
          toast({
            title: 'Import Successful',
            description: `Successfully imported ${newBookmarksWithIds.length} bookmarks.`,
          });
          // Reset file input value to allow re-uploading the same file
          if(fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
           toast({
              variant: 'destructive',
              title: 'Import Failed',
              description: 'The file format is invalid. Please select a valid Netscape bookmarks HTML file.',
            });
        }
      };
      reader.readAsText(file);
    }
  };


  const filteredBookmarks = React.useMemo(() => {
    let result = bookmarks;
    if (selectedCategory !== 'All') {
      result = bookmarks.filter((b) => b.category === selectedCategory);
    }

    if (searchQuery) {
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return result;
  }, [selectedCategory, searchQuery, bookmarks]);
  
  const groupedBookmarks = React.useMemo(() => {
    if (selectedCategory !== 'All') {
        return { [selectedCategory]: filteredBookmarks };
    }
    
    return filteredBookmarks.reduce((acc, bookmark) => {
        const { category } = bookmark;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(bookmark);
        return acc;
    }, {} as Record<string, BookmarkType[]>);

  }, [filteredBookmarks, selectedCategory]);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  let overallBookmarkIndex = 0;

  return (
    <SidebarProvider>
      <AppSidebar
        categories={allCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <SidebarInset>
        <div className="min-h-screen bg-background flex flex-col">
          <AppHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          >
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".html"
            />
            <Button variant="outline" onClick={handleFileUpload}>
              <Upload className="mr-2 h-4 w-4" />
              Import Bookmarks
            </Button>
            <AddBookmarkSheet
              categories={Array.from(new Set(bookmarks.map(b => b.category))).sort()}
              onAddBookmark={handleAddBookmark}
            >
              <FilePlus2 />
              <span>Add Bookmark</span>
            </AddBookmarkSheet>
          </AppHeader>
          <main className="flex-1 p-4 md:p-6 lg:p-8 pt-20 md:pt-24">
             {Object.entries(groupedBookmarks).sort(([a], [b]) => a.localeCompare(b)).map(([category, bookmarksInCategory]) => {
                 const gridContent = (
                    <section key={category} className="mb-12">
                        <h2 className="text-2xl font-bold tracking-tight mb-6 pb-2 border-b">
                            {category}
                        </h2>
                        <BookmarkGrid 
                            bookmarks={bookmarksInCategory} 
                            onDeleteBookmark={handleDeleteBookmark}
                            globalIndexOffset={overallBookmarkIndex}
                        />
                    </section>
                );
                overallBookmarkIndex += bookmarksInCategory.length;
                return gridContent;
             })}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
