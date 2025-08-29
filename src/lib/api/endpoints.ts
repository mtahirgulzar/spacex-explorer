export const API_ENDPOINTS = {
  LAUNCHES: {
    GET_ALL: '/launches',
    GET_BY_ID: (id: string) => `/launches/${id}`,
    UPCOMING: '/launches/upcoming',
    PAST: '/launches/past',
    LATEST: '/launches/latest',
    NEXT: '/launches/next',
  },
  ROCKETS: {
    GET_ALL: '/rockets',
    GET_BY_ID: (id: string) => `/rockets/${id}`,
  },
  LAUNCHPADS: {
    GET_ALL: '/launchpads',
    GET_BY_ID: (id: string) => `/launchpads/${id}`,
  },
} as const;