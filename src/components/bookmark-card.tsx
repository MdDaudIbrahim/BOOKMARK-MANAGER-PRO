
'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, ExternalLink, Sparkles, Eye, Trash2 } from 'lucide-react';
import type { Bookmark } from '@/lib/bookmarks';
import { summarizeUrlAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { getBestImageSrc, getFallbackImageSources } from '@/lib/favicon';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  priority?: boolean;
}

export default function BookmarkCard({ bookmark, onDelete, priority = false }: BookmarkCardProps) {
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary(null);
    const result = await summarizeUrlAction(bookmark.url);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: result.error,
      });
    } else {
      setSummary(result.summary ?? 'Could not generate a summary.');
    }
    setIsLoading(false);
  };
  
  // Get fallback sources for this bookmark
  const fallbackSources = React.useMemo(() => getFallbackImageSources(bookmark.url), [bookmark.url]);
  const [currentFallbackIndex, setCurrentFallbackIndex] = React.useState(0);
  const [imageSrc, setImageSrc] = React.useState(() => getBestImageSrc(bookmark.image, bookmark.url));

  React.useEffect(() => {
    setImageSrc(getBestImageSrc(bookmark.image, bookmark.url));
    setCurrentFallbackIndex(0);
  }, [bookmark.image, bookmark.url]);

  const handleImageError = () => {
    // Try next fallback source
    if (currentFallbackIndex < fallbackSources.length - 1) {
      const nextIndex = currentFallbackIndex + 1;
      setCurrentFallbackIndex(nextIndex);
      setImageSrc(fallbackSources[nextIndex]);
    }
  };


  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card">
      <CardHeader className="p-0">
        <div className="aspect-[16/9] relative bg-muted">
             <Image
                src={imageSrc}
                alt={bookmark.title}
                fill
                className="object-cover"
                data-ai-hint={bookmark['data-ai-hint'] as string | undefined}
                onError={handleImageError}
                priority={priority}
              />
        </div>
        <div className="p-4">
          <CardTitle className="text-lg">{bookmark.title}</CardTitle>
          {bookmark.description && <CardDescription className='h-12 overflow-hidden mt-2'>{bookmark.description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        {isLoading && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Summarizing...</span>
          </div>
        )}
        {summary && (
          <div className="p-3 text-sm border rounded-md bg-secondary">
            <h4 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent-foreground fill-accent" /> AI Summary</h4>
            <p className="text-muted-foreground">{summary}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-wrap gap-2 justify-end bg-card/50 dark:bg-muted/20 p-4 mt-auto">
         <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="mr-auto text-destructive hover:text-destructive-foreground hover:bg-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                bookmark for "{bookmark.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(bookmark.id)}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button size="sm" onClick={handleSummarize} disabled={isLoading} variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          Summarize
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
            <DialogHeader>
               <DialogTitle>{bookmark.title}</DialogTitle>
                <DialogDescription>
                  <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {bookmark.url}
                  </a>
                </DialogDescription>
            </DialogHeader>
            <div className="flex-1 rounded-md overflow-hidden border">
                <iframe src={bookmark.url} title={bookmark.title} className="w-full h-full" />
            </div>
          </DialogContent>
        </Dialog>
        <Button asChild size="sm">
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
