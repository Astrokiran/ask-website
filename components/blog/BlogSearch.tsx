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
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-orange-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="block w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 border-2 border-orange-200/50 dark:border-orange-800/50 rounded-xl sm:rounded-2xl bg-card/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 shadow-lg text-base sm:text-lg"
          disabled={isLoading}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-orange-500 transition-colors"
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
          className="inline-flex items-center gap-3 px-6 py-3 text-sm font-bold bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
        >
          <Filter className="h-4 w-4" />
          <span>Cosmic Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full">
              {(selectedTag ? 1 : 0) + (selectedAuthor ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-orange-500 hover:text-purple-600 transition-colors underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-6 lg:p-8 bg-card/80 backdrop-blur-sm border-2 border-orange-200/50 dark:border-orange-800/50 rounded-2xl shadow-xl space-y-6">
          {/* Tags Filter */}
          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Filter by Topic
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTagChange('')}
                  className={`px-4 py-2 text-sm font-medium rounded-full border-2 transition-all duration-300 ${
                    !selectedTag
                      ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white border-transparent shadow-lg'
                      : 'bg-card/50 text-muted-foreground border-orange-200/50 dark:border-orange-800/50 hover:bg-orange-100/50 dark:hover:bg-orange-900/30 hover:text-orange-600 hover:border-orange-300'
                  }`}
                >
                  All Cosmic Topics
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagChange(tag.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-full border-2 transition-all duration-300 ${
                      selectedTag === tag.id
                        ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white border-transparent shadow-lg'
                        : 'bg-card/50 text-muted-foreground border-orange-200/50 dark:border-orange-800/50 hover:bg-orange-100/50 dark:hover:bg-orange-900/30 hover:text-orange-600 hover:border-orange-300'
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
                className="block w-full px-4 py-3 border-2 border-orange-200/50 dark:border-orange-800/50 rounded-xl bg-card/80 backdrop-blur-sm text-foreground focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 shadow-lg"
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