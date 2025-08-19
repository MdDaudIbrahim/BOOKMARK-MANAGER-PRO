'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Bookmark } from '@/lib/bookmarks';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string(),
  category: z.string().min(1, { message: 'Category is required.' }),
});

type AddBookmarkFormValues = z.infer<typeof formSchema>;

interface AddBookmarkSheetProps {
  children: React.ReactNode;
  categories: string[];
  onAddBookmark: (bookmark: Omit<Bookmark, 'id' | 'image' | 'data-ai-hint'>) => void;
}

export default function AddBookmarkSheet({
  children,
  categories,
  onAddBookmark,
}: AddBookmarkSheetProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<AddBookmarkFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      title: '',
      description: '',
      category: '',
    },
  });

  function onSubmit(values: AddBookmarkFormValues) {
    onAddBookmark(values);
    toast({
      title: 'Bookmark Added!',
      description: `"${values.title}" has been successfully added.`,
    });
    form.reset();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>{children}</Button>
      </SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>Add a New Bookmark</SheetTitle>
              <SheetDescription>
                Fill in the details below to add a new bookmark to your collection.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 space-y-4 py-4 overflow-y-auto">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Bookmark" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short description of the bookmark."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose an existing category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Add Bookmark</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
