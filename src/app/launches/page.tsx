'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Typography, 
  Button, 
  Skeleton, 
  Card, 
  CardContent
} from '@/components';
import { LaunchCard, LaunchFiltersBar } from '@/components/molecules';
import { useLaunchQuery } from '@/lib/hooks/useLaunches';
import { LaunchFilters, Launch } from '@/lib/types';
import { Rocket, AlertCircle, RefreshCw } from 'lucide-react';

const INITIAL_FILTERS: LaunchFilters = {
  page: 1,
  limit: 12,
  sortBy: 'date_utc',
  sortOrder: 'desc',
};

export default function LaunchesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<LaunchFilters>(INITIAL_FILTERS);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { 
    data: launchData, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = useLaunchQuery(filters);

  // Load favorites from localStorage
  React.useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('spacex-favorites');
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
    } catch (error) {
      // console.error('Failed to load favorites:', error);
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: Set<string>) => {
    try {
      localStorage.setItem('spacex-favorites', JSON.stringify([...newFavorites]));
      setFavorites(newFavorites);
    } catch (error) {
      // console.error('Failed to save favorites:', error);
    }
  };

  const handleToggleFavorite = (launchId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(launchId)) {
      newFavorites.delete(launchId);
    } else {
      newFavorites.add(launchId);
    }
    saveFavorites(newFavorites);
  };

  const handleViewDetails = (launchId: string) => {
    router.push(`/launches/${launchId}`);
  };

  const handleLoadMore = () => {
    if (launchData?.hasNextPage) {
      setFilters(prev => ({
        ...prev,
        page: (prev.page || 1) + 1
      }));
    }
  };

  const totalLaunches = launchData?.totalDocs || 0;
  const currentLaunches = launchData?.docs || [];

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="h-80">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-20" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ErrorState = () => (
    <Card className="text-center py-12">
      <CardContent>
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <Typography variant="h4" className="mb-2">
          Failed to load launches
        </Typography>
        <Typography variant="body1" color="muted" className="mb-6">
          There was an error loading the launches. Please try again.
        </Typography>
        <Button onClick={() => refetch()} disabled={isRefetching} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          {isRefetching ? 'Retrying...' : 'Try again'}
        </Button>
      </CardContent>
    </Card>
  );

  const EmptyState = () => (
    <Card className="text-center py-12">
      <CardContent>
        <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <Typography variant="h4" className="mb-2">
          No launches found
        </Typography>
        <Typography variant="body1" color="muted" className="mb-6">
          No launches match your current filters. Try adjusting your search criteria.
        </Typography>
        <Button 
          variant="outline" 
          onClick={() => setFilters(INITIAL_FILTERS)}
        >
          Clear filters
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h1" className="mb-4">
            SpaceX Launches
          </Typography>
          <Typography variant="subtitle1" color="secondary" className="max-w-2xl">
            Explore SpaceX&apos;s mission history and upcoming launches. Filter by mission status, 
            search by name, and discover the details of space exploration.
          </Typography>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <LaunchFiltersBar
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={totalLaunches}
            isLoading={isLoading}
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {error ? (
            <ErrorState />
          ) : isLoading ? (
            <LoadingSkeleton />
          ) : currentLaunches.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Launch Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentLaunches.map((launch: Launch) => (
                  <LaunchCard
                    key={launch.id}
                    launch={launch}
                    onViewDetails={handleViewDetails}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.has(launch.id)}
                  />
                ))}
              </div>

              {/* Load More / Pagination */}
              {launchData?.hasNextPage && (
                <div className="text-center pt-8">
                  <Button
                    onClick={handleLoadMore}
                    size="lg"
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load more launches'
                    )}
                  </Button>
                </div>
              )}

              {/* Results Summary */}
              <div className="text-center pt-6 border-t">
                <Typography variant="body2" color="muted">
                  Showing {currentLaunches.length} of {totalLaunches.toLocaleString()} launches
                </Typography>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
