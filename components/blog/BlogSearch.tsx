"use client";

import { useState, useCallback } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

interface BlogSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: { tag?: string; author?: string }) => void;
  placeholder?: string;
  tags?: Array<{ id: string; name: string; count: number }>;
  authors?: string[];
  isLoading?: boolean;
}

export function BlogSearch({
  onSearch,
  onFilterChange,
  placeholder = "Search blog posts...",
  tags = [],
  authors = [],
  isLoading = false,
}: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search to avoid too many API calls
  const debouncedSearch = useDebouncedCallback(
    (query: string) => {
      onSearch(query);
    },
    300
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleTagChange = useCallback((tagId: string) => {
    setSelectedTag(tagId);
    onFilterChange({
      tag: tagId || undefined,
      author: selectedAuthor || undefined,
    });
  }, [selectedAuthor, onFilterChange]);

  const handleAuthorChange = useCallback((author: string) => {
    setSelectedAuthor(author);
    onFilterChange({
      tag: selectedTag || undefined,
      author: author || undefined,
    });
  }, [selectedTag, onFilterChange]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    onSearch('');
  }, [onSearch]);

  const clearFilters = useCallback(() => {
    setSelectedTag('');
    setSelectedAuthor('');
    onFilterChange({});
  }, [onFilterChange]);

  const hasActiveFilters = selectedTag || selectedAuthor;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          disabled={isLoading}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted hover:text-foreground transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              {(selectedTag ? 1 : 0) + (selectedAuthor ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-6 bg-card border border-border rounded-lg space-y-6">
          {/* Tags Filter */}
          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Filter by Topic
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTagChange('')}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    !selectedTag
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                  }`}
                >
                  All Topics
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagChange(tag.id)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      selectedTag === tag.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {tag.name} ({tag.count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Authors Filter */}
          {authors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Filter by Author
              </label>
              <select
                value={selectedAuthor}
                onChange={(e) => handleAuthorChange(e.target.value)}
                className="block w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                <option value="">All Authors</option>
                {authors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}