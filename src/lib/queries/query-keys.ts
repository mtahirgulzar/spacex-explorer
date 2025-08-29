import { LaunchFilters } from '../types';

export const queryKeys = {
  all: ['spacex'] as const,
  
  launches: () => [...queryKeys.all, 'launches'] as const,
  rockets: () => [...queryKeys.all, 'rockets'] as const,
  launchpads: () => [...queryKeys.all, 'launchpads'] as const,
  payloads: () => [...queryKeys.all, 'payloads'] as const,
  cores: () => [...queryKeys.all, 'cores'] as const,
  
  launch: {
    all: () => [...queryKeys.launches(), 'list'] as const,
    lists: () => [...queryKeys.launch.all(), 'list'] as const,
    list: (filters: LaunchFilters) => [...queryKeys.launch.lists(), filters] as const,
    details: () => [...queryKeys.launches(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.launch.details(), id] as const,
    infinite: (filters: Omit<LaunchFilters, 'page'>) => 
      [...queryKeys.launches(), 'infinite', filters] as const,
    upcoming: () => [...queryKeys.launches(), 'upcoming'] as const,
    past: () => [...queryKeys.launches(), 'past'] as const,
    recent: (limit?: number) => [...queryKeys.launches(), 'recent', limit] as const,
  },
  
  rocket: {
    all: () => [...queryKeys.rockets(), 'list'] as const,
    lists: () => [...queryKeys.rocket.all(), 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.rocket.lists(), filters] as const,
    details: () => [...queryKeys.rockets(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.rocket.details(), id] as const,
  },
  
  launchpad: {
    all: () => [...queryKeys.launchpads(), 'list'] as const,
    lists: () => [...queryKeys.launchpad.all(), 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.launchpad.lists(), filters] as const,
    details: () => [...queryKeys.launchpads(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.launchpad.details(), id] as const,
  },
  
  payload: {
    all: () => [...queryKeys.payloads(), 'list'] as const,
    lists: () => [...queryKeys.payload.all(), 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.payload.lists(), filters] as const,
    details: () => [...queryKeys.payloads(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.payload.details(), id] as const,
  },
  
  core: {
    all: () => [...queryKeys.cores(), 'list'] as const,
    lists: () => [...queryKeys.core.all(), 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.core.lists(), filters] as const,
    details: () => [...queryKeys.cores(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.core.details(), id] as const,
  },
  
  stats: {
    all: () => [...queryKeys.all, 'stats'] as const,
    launches: () => [...queryKeys.stats.all(), 'launches'] as const,
    rockets: () => [...queryKeys.stats.all(), 'rockets'] as const,
    success: () => [...queryKeys.stats.all(), 'success'] as const,
  },
  
  user: {
    all: () => [...queryKeys.all, 'user'] as const,
    favorites: () => [...queryKeys.user.all(), 'favorites'] as const,
    preferences: () => [...queryKeys.user.all(), 'preferences'] as const,
  },
} as const;

export type QueryKey = typeof queryKeys;
export type LaunchQueryKey = ReturnType<typeof queryKeys.launch[keyof typeof queryKeys.launch]>;
export type RocketQueryKey = ReturnType<typeof queryKeys.rocket[keyof typeof queryKeys.rocket]>;
export type LaunchpadQueryKey = ReturnType<typeof queryKeys.launchpad[keyof typeof queryKeys.launchpad]>;

export const invalidationHelpers = {
  invalidateAllLaunches: () => queryKeys.launches(),
  invalidateLaunchDetail: (id: string) => queryKeys.launch.detail(id),
  invalidateLaunchLists: () => queryKeys.launch.lists(),
  invalidateInfiniteLaunches: () => [...queryKeys.launches(), 'infinite'],
  invalidateAll: () => queryKeys.all,
  invalidateStats: () => queryKeys.stats.all(),
};
