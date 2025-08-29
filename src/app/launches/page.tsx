'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { 
  Typography, 
  Button, 
  Card, 

  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components';
import { LaunchCard } from '@/components/molecules';
import { useInfiniteLaunches } from '@/lib/queries/launches';
import { LaunchFilters, Launch, LaunchQueryResponse } from '@/lib/types';
import { 
  Search, 
  Calendar,
  Loader2,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';

const INITIAL_FILTERS: Omit<LaunchFilters, 'page'> = {
  limit: 12,
  sortBy: 'date_utc',
  sortOrder: 'desc',
};

const BOOLEAN_PARAM_MAP = {
  upcoming: { true: true, false: false },
  success: { true: true, false: false }
} as const;

const SORT_PARAM_MAP = {
  sortBy: ['date_utc', 'name', 'flight_number'] as const,
  sortOrder: ['asc', 'desc'] as const
} as const;

const parseUrlFilters = (searchParams: URLSearchParams) => {
  const urlFilters: Partial<Omit<LaunchFilters, 'page'>> = { ...INITIAL_FILTERS };
  
  Object.entries(BOOLEAN_PARAM_MAP).forEach(([key, valueMap]) => {
    const param = searchParams.get(key);
    if (param && param in valueMap) {
      urlFilters[key as keyof typeof BOOLEAN_PARAM_MAP] = valueMap[param as keyof typeof valueMap];
    }
  });

  const sortBy = searchParams.get('sortBy');
  if (sortBy && SORT_PARAM_MAP.sortBy.includes(sortBy as typeof SORT_PARAM_MAP.sortBy[number])) {
    urlFilters.sortBy = sortBy as typeof SORT_PARAM_MAP.sortBy[number];
  }

  const sortOrder = searchParams.get('sortOrder');
  if (sortOrder && SORT_PARAM_MAP.sortOrder.includes(sortOrder as typeof SORT_PARAM_MAP.sortOrder[number])) {
    urlFilters.sortOrder = sortOrder as typeof SORT_PARAM_MAP.sortOrder[number];
  }

  return urlFilters;
};

function LaunchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Omit<LaunchFilters, 'page'>>(INITIAL_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading, 
    isError,
    refetch
  } = useInfiniteLaunches(
    debouncedSearch 
      ? { ...filters, search: debouncedSearch }
      : filters
  );

  useEffect(() => {
    const urlFilters = parseUrlFilters(searchParams);
    setFilters(urlFilters as Omit<LaunchFilters, 'page'>);

    const search = searchParams.get('search');
    if (search) {
      setSearchInput(search);
      setDebouncedSearch(search);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFilterChange = useCallback((key: keyof typeof filters, value: LaunchFilters[keyof LaunchFilters]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchInput('');
    setDebouncedSearch('');
  }, []);

  const handleLaunchClick = useCallback((launchId: string) => {
    router.push(`/launches/${launchId}`);
  }, [router]);

  const memoizedData = useMemo(() => {
    const dataPages = (data as { pages?: LaunchQueryResponse[] })?.pages;
    return {
      allLaunches: dataPages?.flatMap((page: LaunchQueryResponse) => page.docs) ?? [],
      totalResults: dataPages?.[0]?.totalDocs ?? 0,
      hasLoadedData: !!dataPages && dataPages.length > 0
    };
  }, [data]);

  const activeFiltersCount = useMemo(() => {
    const filterChecks = [
      filters.upcoming !== undefined,
      filters.success !== undefined,
      !!debouncedSearch,
      filters.sortBy !== INITIAL_FILTERS.sortBy || filters.sortOrder !== INITIAL_FILTERS.sortOrder
    ];
    return filterChecks.filter(Boolean).length;
  }, [filters.upcoming, filters.success, debouncedSearch, filters.sortBy, filters.sortOrder]);

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <Typography variant="h3" className="mb-2">Failed to load launches</Typography>
            <Typography variant="body1" className="text-gray-600 mb-6">
              We couldn&apos;t load the launches data. Please check your connection and try again.
        </Typography>
            <Button onClick={() => refetch()} className="gap-2 cursor-pointer">
              <RefreshCw className="h-4 w-4" />
              Try Again
        </Button>
    </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href="/" className="cursor-pointer">
                <Typography variant="h1" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  SpaceX Launches
                </Typography>
              </Link>
              <Typography variant="body1" className="text-gray-600 text-sm">
                Explore {memoizedData.totalResults.toLocaleString()} SpaceX missions and launches
          </Typography>
            </div>
        </div>

            <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search launches by mission name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 h-10"
          />
        </div>

            <div className="flex gap-3">
              <Select
                value={filters.upcoming?.toString() || 'all'}
                onValueChange={(value) => 
                  handleFilterChange('upcoming', value === 'all' ? undefined : value === 'true')
                }
              >
                <SelectTrigger className="w-32 h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Upcoming</SelectItem>
                  <SelectItem value="false">Past</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.success?.toString() || 'all'}
                onValueChange={(value) => 
                  handleFilterChange('success', value === 'all' ? undefined : value === 'true')
                }
              >
                <SelectTrigger className="w-32 h-10">
                  <SelectValue placeholder="Result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Success</SelectItem>
                  <SelectItem value="false">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
              >
                <SelectTrigger className="w-36 h-10">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_utc-desc">Latest</SelectItem>
                  <SelectItem value="date_utc-asc">Oldest</SelectItem>
                  <SelectItem value="name-asc">A-Z</SelectItem>
                  <SelectItem value="name-desc">Z-A</SelectItem>
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <Button variant="outline" onClick={clearFilters} className="gap-2 h-10 cursor-pointer">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {(debouncedSearch || activeFiltersCount > 0) && (
            <div className="mt-3 text-center">
              <span className="text-sm text-gray-600">
                {memoizedData.allLaunches.length} of {memoizedData.totalResults.toLocaleString()} launches
                {debouncedSearch && ` matching "${debouncedSearch}"`}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading || !memoizedData.hasLoadedData ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading launches...</p>
            </div>
          </div>
        ) : memoizedData.allLaunches.length === 0 ? (
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto p-8 shadow-sm">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <Typography variant="h3" className=" text-xl">No launches found</Typography>
              <Typography variant="body1" className="text-gray-600 mb-6 !mt-0">
                No launches match your current filters. Try adjusting your search criteria.
              </Typography>
              <Button variant="outline" onClick={clearFilters} className="mx-auto cursor-pointer">
                Clear all filters
              </Button>
            </Card>
          </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {memoizedData.allLaunches.map((launch: Launch) => (
                  <LaunchCard
                    key={launch.id}
                    launch={launch}
                  onViewDetails={handleLaunchClick}
                  />
                ))}
              </div>

            {hasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading more launches...</span>
                  </div>
                )}
                </div>
              )}

            {!hasNextPage && memoizedData.allLaunches.length > 12 && (
              <div className="text-center py-8 text-gray-500">
                <Typography variant="body2">
                  You&apos;ve reached the end of the launches list
                </Typography>
              </div>
            )}
            </>
          )}
      </div>
    </div>
  );
}

export default function LaunchesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading launches...</span>
        </div>
      </div>
    }>
      <LaunchesContent />
    </Suspense>
  );
}