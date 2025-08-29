import { 
  useQuery, 
  useInfiniteQuery, 
  useMutation, 
  useQueryClient,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData
} from '@tanstack/react-query';
import { launchService } from '../api/services/launchService';
import { queryKeys } from './query-keys';
import { Launch, LaunchFilters, LaunchQueryResponse } from '../types';
import { apiUtils } from '../api/client';

const defaultRetryFn = (failureCount: number, error: unknown) => {
  if (apiUtils.isApiError(error) && error.statusCode) {
    if (error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
      return false;
    }
  }
  return failureCount < 3;
};

export const useLaunchQuery = (
  filters: LaunchFilters,
  options?: Omit<UseQueryOptions<LaunchQueryResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.launch.list(filters),
    queryFn: async ({ signal }) => {
      return launchService.queryLaunches(filters, { signal });
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: defaultRetryFn,
    ...options,
  });
};

export const useInfiniteLaunches = (
  filters: Omit<LaunchFilters, 'page'>,
  options?: Omit<UseInfiniteQueryOptions<LaunchQueryResponse>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'>
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.launch.infinite(filters),
    queryFn: async ({ pageParam = 1, signal }) => {
      return launchService.queryLaunches(
        { ...filters, page: pageParam },
        { signal }
      );
    },
    getNextPageParam: (lastPage) => 
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: defaultRetryFn,
    ...options,
  });
};

export const useLaunch = (
  id: string,
  options?: Omit<UseQueryOptions<Launch>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.launch.detail(id),
    queryFn: async ({ signal }) => {
      return launchService.getLaunchById(id, { signal });
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: defaultRetryFn,
    ...options,
  });
};

export const useLaunches = (
  options?: Omit<UseQueryOptions<Launch[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.launch.all(),
    queryFn: async ({ signal }) => {
      return launchService.getAllLaunches({ signal });
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: defaultRetryFn,
    ...options,
  });
};

export const useUpcomingLaunches = (
  limit?: number,
  options?: Omit<UseQueryOptions<Launch[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...queryKeys.launch.upcoming(), limit],
    queryFn: async ({ signal }) => {
      return launchService.getUpcomingLaunches(limit, { signal });
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};

export const usePastLaunches = (
  limit?: number,
  options?: Omit<UseQueryOptions<Launch[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...queryKeys.launch.past(), limit],
    queryFn: async ({ signal }) => {
      return launchService.getPastLaunches(limit, { signal });
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    ...options,
  });
};

export const useLatestLaunches = (
  limit: number = 10,
  options?: Omit<UseQueryOptions<Launch[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.launch.recent(limit),
    queryFn: async ({ signal }) => {
      return launchService.getLatestLaunches(limit, { signal });
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};

export const useNextLaunch = (
  options?: Omit<UseQueryOptions<Launch>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...queryKeys.launch.upcoming(), 'next'],
    queryFn: async ({ signal }) => {
      return launchService.getNextLaunch({ signal });
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useSearchLaunches = (
  searchTerm: string,
  limit: number = 20,
  options?: Omit<UseQueryOptions<LaunchQueryResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...queryKeys.launch.lists(), 'search', searchTerm, limit],
    queryFn: async ({ signal }) => {
      return launchService.searchLaunches(searchTerm, limit, { signal });
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};

export const useLaunchesByRocket = (
  rocketId: string,
  options?: Omit<UseQueryOptions<LaunchQueryResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...queryKeys.launch.lists(), 'rocket', rocketId],
    queryFn: async ({ signal }) => {
      return launchService.getLaunchesByRocket(rocketId, { signal });
    },
    enabled: !!rocketId,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    ...options,
  });
};

export const useLaunchesByLaunchpad = (
  launchpadId: string,
  options?: Omit<UseQueryOptions<LaunchQueryResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...queryKeys.launch.lists(), 'launchpad', launchpadId],
    queryFn: async ({ signal }) => {
      return launchService.getLaunchesByLaunchpad(launchpadId, { signal });
    },
    enabled: !!launchpadId,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    ...options,
  });
};

export const useLaunchCacheHelpers = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAllLaunches: () => 
      queryClient.invalidateQueries({ queryKey: queryKeys.launches() }),
    
    invalidateLaunch: (id: string) => 
      queryClient.invalidateQueries({ queryKey: queryKeys.launch.detail(id) }),
    
    invalidateLaunchLists: () => 
      queryClient.invalidateQueries({ queryKey: queryKeys.launch.lists() }),
    
    prefetchLaunch: (id: string) => 
      queryClient.prefetchQuery({
        queryKey: queryKeys.launch.detail(id),
        queryFn: () => launchService.getLaunchById(id),
        staleTime: 10 * 60 * 1000,
      }),
    
    setLaunchData: (id: string, data: Launch) => 
      queryClient.setQueryData(queryKeys.launch.detail(id), data),
    
    getLaunchData: (id: string) => 
      queryClient.getQueryData<Launch>(queryKeys.launch.detail(id)),
    
    removeLaunch: (id: string) => 
      queryClient.removeQueries({ queryKey: queryKeys.launch.detail(id) }),
  };
};