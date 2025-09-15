"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Calendar,
  Tag,
  User,
  Archive,
  TrendingUp,
  Clock,
  Hash,
  BookOpen
} from 'lucide-react';

interface BlogSidebarProps {
  tags?: Array<{ id: string; name: string; count: number }>;
  authors?: Array<{ name: string; count: number; avatar?: string }>;
  categories?: Array<{ id: string; name: string; count: number; children?: Array<{ id: string; name: string; count: number }> }>;
  archives?: Array<{ year: number; months: Array<{ month: string; count: number; slug: string }> }>;
  popularPosts?: Array<{ title: string; slug: string; views: number }>;
}

interface ExpandableItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  count?: number;
}

function ExpandableItem({ title, icon, children, defaultExpanded = false, count }: ExpandableItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-2 text-left rounded-lg hover:bg-muted/50 transition-colors group"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
            {isExpanded && (icon === <Folder className="h-4 w-4" />) ? <FolderOpen className="h-4 w-4" /> : icon}
          </span>
          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
            {title}
          </span>
        </div>
        {count !== undefined && (
          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="ml-6 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function NavItem({
  href,
  children,
  icon,
  count,
  isActive = false
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between p-2 rounded-lg transition-colors group ${
        isActive
          ? 'bg-primary/10 text-primary border border-primary/20'
          : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
      }`}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-inherit">{icon}</span>}
        <span className="text-sm">{children}</span>
      </div>
      {count !== undefined && (
        <span className={`text-xs px-2 py-1 rounded-full ${
          isActive
            ? 'bg-primary/20 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}>
          {count}
        </span>
      )}
    </Link>
  );
}

export function BlogSidebar({
  tags = [],
  authors = [],
  categories = [],
  archives = [],
  popularPosts = []
}: BlogSidebarProps) {
  const pathname = usePathname();

  // Only show sections that have actual data

  return (
    <aside className="w-full lg:w-80 bg-card border-r border-border p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Quick Navigation */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            Blog Navigation
          </h3>
          <div className="space-y-1">
            <NavItem href="/blog" isActive={pathname === '/blog'}>
              All Posts
            </NavItem>
            <NavItem href="/blog/featured" icon={<TrendingUp className="h-4 w-4" />}>
              Featured Articles
            </NavItem>
            <NavItem href="/blog/recent" icon={<Clock className="h-4 w-4" />}>
              Recent Posts
            </NavItem>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <ExpandableItem
              title="Categories"
              icon={<Folder className="h-4 w-4" />}
              defaultExpanded={true}
              count={categories.reduce((sum, cat) => sum + cat.count, 0)}
            >
              <div className="space-y-1">
                {categories.map((category) => (
                  <div key={category.id}>
                    <ExpandableItem
                      title={category.name}
                      icon={<Folder className="h-4 w-4" />}
                      count={category.count}
                    >
                      <div className="space-y-1">
                        {category.children?.map((child) => (
                          <NavItem
                            key={child.id}
                            href={`/blog/category/${child.id}`}
                            count={child.count}
                          >
                            {child.name}
                          </NavItem>
                        ))}
                      </div>
                    </ExpandableItem>
                  </div>
                ))}
              </div>
            </ExpandableItem>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <ExpandableItem
              title="Tags"
              icon={<Tag className="h-4 w-4" />}
              count={tags.length}
            >
              <div className="space-y-1">
                {tags.slice(0, 10).map((tag) => (
                  <NavItem
                    key={tag.id}
                    href={`/blog/tag/${tag.id}`}
                    icon={<Hash className="h-3 w-3" />}
                    count={tag.count}
                  >
                    {tag.name}
                  </NavItem>
                ))}
                {tags.length > 10 && (
                  <NavItem href="/blog/tags">
                    View All Tags ({tags.length})
                  </NavItem>
                )}
              </div>
            </ExpandableItem>
          </div>
        )}

        {/* Authors */}
        {authors.length > 0 && (
          <div>
            <ExpandableItem
              title="Authors"
              icon={<User className="h-4 w-4" />}
              count={authors.length}
            >
              <div className="space-y-1">
                {authors.map((author) => (
                  <NavItem
                    key={author.name}
                    href={`/blog/author/${author.name.toLowerCase().replace(/\s+/g, '-')}`}
                    icon={<User className="h-3 w-3" />}
                    count={author.count}
                  >
                    {author.name}
                  </NavItem>
                ))}
              </div>
            </ExpandableItem>
          </div>
        )}

        {/* Archives */}
        {archives.length > 0 && (
          <div>
            <ExpandableItem
              title="Archives"
              icon={<Archive className="h-4 w-4" />}
              count={archives.reduce((sum, year) =>
                sum + year.months.reduce((monthSum, month) => monthSum + month.count, 0), 0
              )}
            >
              <div className="space-y-1">
                {archives.map((year) => (
                  <ExpandableItem
                    key={year.year}
                    title={year.year.toString()}
                    icon={<Calendar className="h-4 w-4" />}
                    count={year.months.reduce((sum, month) => sum + month.count, 0)}
                  >
                    <div className="space-y-1">
                      {year.months.map((month) => (
                        <NavItem
                          key={month.slug}
                          href={`/blog/archive/${month.slug}`}
                          count={month.count}
                        >
                          {month.month}
                        </NavItem>
                      ))}
                    </div>
                  </ExpandableItem>
                ))}
              </div>
            </ExpandableItem>
          </div>
        )}

        {/* Popular Posts */}
        {popularPosts.length > 0 && (
          <div>
            <ExpandableItem
              title="Popular Posts"
              icon={<TrendingUp className="h-4 w-4" />}
              defaultExpanded={true}
            >
              <div className="space-y-3">
                {popularPosts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block p-3 bg-muted/30 hover:bg-muted/60 rounded-lg transition-colors group"
                  >
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {post.views.toLocaleString()} views
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </ExpandableItem>
          </div>
        )}
      </div>
    </aside>
  );
}