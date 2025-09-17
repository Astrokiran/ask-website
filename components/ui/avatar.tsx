"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & {
    onLoadingStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
  }
>(({ className, onLoadingStatusChange, ...props }, ref) => {
  const [imageStatus, setImageStatus] = React.useState<'loading' | 'loaded' | 'error'>('loading');

  React.useEffect(() => {
    if (props.src) {
      setImageStatus('loading');
      onLoadingStatusChange?.(
        'loading');
    }
  }, [props.src, onLoadingStatusChange]);

  const handleLoad = React.useCallback(() => {
    setImageStatus('loaded');
    onLoadingStatusChange?.('loaded');
  }, [onLoadingStatusChange]);

  const handleError = React.useCallback(() => {
    setImageStatus('error');
    onLoadingStatusChange?.('error');
  }, [onLoadingStatusChange]);

  if (!props.src || imageStatus === 'error') {
    return null;
  }

  return (
    <img
      ref={ref}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }