export {
  useLaunchQuery,
  useInfiniteLaunches,
  useLaunches,
  useLaunch,
  useUpcomingLaunches,
  usePastLaunches,
  useLatestLaunches,
  useNextLaunch,
  useSearchLaunches,
  useLaunchesByRocket,
  useLaunchesByLaunchpad,
  useLaunchCacheHelpers,
} from '../queries/launches';

import { queryKeys } from '../queries/query-keys';

export const QUERY_KEYS = {
  launches: queryKeys.launches(),
  launchQuery: (filters: Record<string, unknown>) => queryKeys.launch.list(filters),
  launch: (id: string) => queryKeys.launch.detail(id),
  upcomingLaunches: queryKeys.launch.upcoming(),
  pastLaunches: queryKeys.launch.past(),
};