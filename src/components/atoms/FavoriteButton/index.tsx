import { FC, useCallback } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Tooltip } from '@/components/atoms/Tooltip';
import { Launch } from '@/lib/types';
import { useFavorites } from '@/lib/hooks/useFavorites';

interface FavoriteButtonProps {
  launch: Launch;
  variant?: 'default' | 'icon' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FavoriteButton: FC<FavoriteButtonProps> = ({
  launch,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();
  const isLaunchFavorite = isFavorite(launch.id);
  const isLoadingState = isLoading(launch.id);

  const handleToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(launch);
  }, [launch, toggleFavorite]);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  if (variant === 'icon') {
    const tooltipContent = isLaunchFavorite 
      ? 'Remove from favorites' 
      : 'Add to favorites';

    return (
      <Tooltip content={tooltipContent} disabled={isLoadingState}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          disabled={isLoadingState}
          className={`${sizeClasses[size]} rounded-full p-0 hover:bg-red-50 transition-colors cursor-pointer ${isLoadingState ? 'opacity-75' : ''} ${className}`}
          aria-label={isLaunchFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isLoadingState ? (
            <Loader2
              className={`${iconSizes[size]} animate-spin text-gray-500`}
            />
          ) : (
            <Heart
              className={`${iconSizes[size]} transition-colors ${
                isLaunchFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400 hover:text-red-400'
              }`}
            />
          )}
        </Button>
      </Tooltip>
    );
  }

  if (variant === 'compact') {
    const tooltipContent = isLaunchFavorite 
      ? 'Remove from favorites' 
      : 'Add to favorites';

    return (
      <Tooltip content={tooltipContent} disabled={isLoadingState}>
        <Button
          variant={isLaunchFavorite ? 'default' : 'outline'}
          size="sm"
          onClick={handleToggle}
          disabled={isLoadingState}
          className={`gap-1 cursor-pointer ${isLoadingState ? 'opacity-75' : ''} ${
            isLaunchFavorite 
              ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
              : 'hover:bg-red-50 hover:border-red-200'
          } ${className}`}
        >
          {isLoadingState ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Heart
              className={`h-3 w-3 ${
                isLaunchFavorite ? 'fill-current' : ''
              }`}
            />
          )}
          {isLoadingState ? 'Loading...' : (isLaunchFavorite ? 'Favorited' : 'Favorite')}
        </Button>
      </Tooltip>
    );
  }

  const tooltipContent = isLaunchFavorite 
    ? 'Remove from favorites' 
    : 'Add to favorites';

  return (
    <Tooltip content={tooltipContent} disabled={isLoadingState}>
      <Button
        variant={isLaunchFavorite ? 'default' : 'outline'}
        onClick={handleToggle}
        disabled={isLoadingState}
        className={`gap-2 cursor-pointer ${isLoadingState ? 'opacity-75' : ''} ${
          isLaunchFavorite 
            ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
            : 'hover:bg-red-50 hover:border-red-200'
        } ${className}`}
      >
        {isLoadingState ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart
            className={`h-4 w-4 ${
              isLaunchFavorite ? 'fill-current' : ''
            }`}
          />
        )}
        {isLoadingState ? 'Loading...' : (isLaunchFavorite ? 'Remove from Favorites' : 'Add to Favorites')}
      </Button>
    </Tooltip>
  );
};

export default FavoriteButton;
