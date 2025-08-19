
'use client';

import BookmarkCard from './bookmark-card';
import type { Bookmark } from '@/lib/bookmarks';

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  onDeleteBookmark: (id: string) => void;
  globalIndexOffset?: number;
}

export default function BookmarkGrid({ bookmarks, onDeleteBookmark, globalIndexOffset = 0 }: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center rounded-lg bg-muted/50">
        <div className="rounded-full bg-primary/10 p-4 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-slash"><path d="m13.5 8.5-5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <h2 className="mt-4 text-2xl font-semibold">No Bookmarks Found</h2>
        <p className="mt-2 text-muted-foreground">
          There are no bookmarks in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
      {bookmarks.map((bookmark, index) => (
        <BookmarkCard 
            key={bookmark.id} 
            bookmark={bookmark} 
            onDelete={onDeleteBookmark} 
            priority={globalIndexOffset + index < 4}
        />
      ))}
    </div>
  );
}
