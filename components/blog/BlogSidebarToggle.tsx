"use client";

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BlogSidebar } from './BlogSidebar';

interface BlogSidebarToggleProps {
  tags?: Array<{ id: string; name: string; count: number }>;
  authors?: Array<{ name: string; count: number; avatar?: string }>;
  categories?: Array<{ id: string; name: string; count: number; children?: Array<{ id: string; name: string; count: number }> }>;
  archives?: Array<{ year: number; months: Array<{ month: string; count: number; slug: string }> }>;
  popularPosts?: Array<{ title: string; slug: string; views: number }>;
}

export function BlogSidebarToggle(props: BlogSidebarToggleProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Open blog navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-80 flex-shrink-0">
        <div className="sticky top-8">
          <BlogSidebar {...props} />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative flex w-full max-w-sm transform bg-background shadow-xl transition-transform">
            <div className="flex flex-col w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Blog Navigation</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                <BlogSidebar {...props} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}