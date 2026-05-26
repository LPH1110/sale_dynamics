import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  // Reset image error state if src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-16 h-16 text-lg font-semibold',
    xl: 'w-24 h-24 text-2xl font-semibold',
  };

  const hasImage = src && !imageError;

  return (
    <div
      className={clsx(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none border border-neutral-200 dark:border-neutral-800',
        hasImage ? 'bg-transparent' : 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300',
        sizes[size],
        className
      )}
    >
      {hasImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
