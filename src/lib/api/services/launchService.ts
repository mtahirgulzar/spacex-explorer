import { apiRequest } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Launch, LaunchFilters, LaunchQuery, LaunchQueryResponse, ApiConfig } from '../../types';

export const launchService = {
  queryLaunches: async (
    filters: LaunchFilters, 
    config?: ApiConfig
  ): Promise<LaunchQueryResponse> => {
    const queryRequest: LaunchQuery = {
      query: {},
      options: {
        page: filters.page || 1,
        limit: filters.limit || 12,
        populate: ['rocket', 'launchpad'],
      }
    };

    if (filters.upcoming !== undefined) {
      queryRequest.query!.upcoming = filters.upcoming;
    }

    if (filters.success !== undefined) {
      queryRequest.query!.success = filters.success;
    }

    if (filters.search) {
      queryRequest.query!.name = {
        $regex: filters.search,
        $options: 'i'
      };
    }

    if (filters.dateRange?.start || filters.dateRange?.end) {
      queryRequest.query!.date_utc = {};
      if (filters.dateRange.start) {
        queryRequest.query!.date_utc.$gte = filters.dateRange.start;
      }
      if (filters.dateRange.end) {
        queryRequest.query!.date_utc.$lte = filters.dateRange.end;
      }
    }

    if (filters.sortBy) {
      queryRequest.options!.sort = {
        [filters.sortBy]: filters.sortOrder || 'desc'
      };
    }

    const { data } = await apiRequest.post<LaunchQueryResponse>(
      '/launches/query',
      queryRequest,
      config
    );

    return data;
  },

  getLaunchById: async (id: string, config?: ApiConfig): Promise<Launch> => {
    const { data } = await apiRequest.get<Launch>(
      `${API_ENDPOINTS.LAUNCHES.GET_BY_ID(id)}?populate=rocket,launchpad,payloads`,
      config
    );
    return data;
  },

  getAllLaunches: async (config?: ApiConfig): Promise<Launch[]> => {
    const { data } = await apiRequest.get<Launch[]>(
      `${API_ENDPOINTS.LAUNCHES.GET_ALL}?populate=rocket,launchpad`,
      config
    );
    return data;
  },

  getUpcomingLaunches: async (limit?: number, config?: ApiConfig): Promise<Launch[]> => {
    const endpoint = limit 
      ? `${API_ENDPOINTS.LAUNCHES.UPCOMING}?populate=rocket,launchpad&limit=${limit}`
      : `${API_ENDPOINTS.LAUNCHES.UPCOMING}?populate=rocket,launchpad`;
      
    const { data } = await apiRequest.get<Launch[]>(endpoint, config);
    return data;
  },

  getPastLaunches: async (limit?: number, config?: ApiConfig): Promise<Launch[]> => {
    const endpoint = limit 
      ? `${API_ENDPOINTS.LAUNCHES.PAST}?populate=rocket,launchpad&limit=${limit}`
      : `${API_ENDPOINTS.LAUNCHES.PAST}?populate=rocket,launchpad`;
      
    const { data } = await apiRequest.get<Launch[]>(endpoint, config);
    return data;
  },

  getLatestLaunches: async (limit: number = 10, config?: ApiConfig): Promise<Launch[]> => {
    const { data } = await apiRequest.get<Launch[]>(
      `${API_ENDPOINTS.LAUNCHES.LATEST}?populate=rocket,launchpad&limit=${limit}`,
      config
    );
    return data;
  },

  getNextLaunch: async (config?: ApiConfig): Promise<Launch> => {
    const { data } = await apiRequest.get<Launch>(
      `${API_ENDPOINTS.LAUNCHES.NEXT}?populate=rocket,launchpad`,
      config
    );
    return data;
  },

  searchLaunches: async (
    searchTerm: string, 
    limit: number = 20, 
    config?: ApiConfig
  ): Promise<LaunchQueryResponse> => {
    const queryRequest: LaunchQuery = {
      query: {
        name: {
          $regex: searchTerm,
          $options: 'i'
        }
      },
      options: {
        limit,
        populate: ['rocket', 'launchpad'],
        sort: { date_utc: 'desc' }
      }
    };

    const { data } = await apiRequest.post<LaunchQueryResponse>(
      '/launches/query',
      queryRequest,
      config
    );

    return data;
  },

  getLaunchesByDateRange: async (
    startDate: string,
    endDate: string,
    config?: ApiConfig
  ): Promise<LaunchQueryResponse> => {
    const queryRequest: LaunchQuery = {
      query: {
        date_utc: {
          $gte: startDate,
          $lte: endDate
        }
      },
      options: {
        populate: ['rocket', 'launchpad'],
        sort: { date_utc: 'desc' }
      }
    };

    const { data } = await apiRequest.post<LaunchQueryResponse>(
      '/launches/query',
      queryRequest,
      config
    );

    return data;
  },

  getLaunchesByRocket: async (
    rocketId: string, 
    config?: ApiConfig
  ): Promise<LaunchQueryResponse> => {
    const queryRequest: LaunchQuery = {
      query: {
        rocket: rocketId
      },
      options: {
        populate: ['rocket', 'launchpad'],
        sort: { date_utc: 'desc' }
      }
    };

    const { data } = await apiRequest.post<LaunchQueryResponse>(
      '/launches/query',
      queryRequest,
      config
    );

    return data;
  },

  getLaunchesByLaunchpad: async (
    launchpadId: string, 
    config?: ApiConfig
  ): Promise<LaunchQueryResponse> => {
    const queryRequest: LaunchQuery = {
      query: {
        launchpad: launchpadId
      },
      options: {
        populate: ['rocket', 'launchpad'],
        sort: { date_utc: 'desc' }
      }
    };

    const { data } = await apiRequest.post<LaunchQueryResponse>(
      '/launches/query',
      queryRequest,
      config
    );

    return data;
  },
};