import { apiRequest } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Launchpad, ApiConfig } from '../../types';

export const launchpadService = {
  getAllLaunchpads: async (config?: ApiConfig): Promise<Launchpad[]> => {
    const { data } = await apiRequest.get<Launchpad[]>(
      API_ENDPOINTS.LAUNCHPADS.GET_ALL,
      config
    );
    return data;
  },

  getLaunchpadById: async (id: string, config?: ApiConfig): Promise<Launchpad> => {
    const { data } = await apiRequest.get<Launchpad>(
      API_ENDPOINTS.LAUNCHPADS.GET_BY_ID(id),
      config
    );
    return data;
  },

  getActiveLaunchpads: async (config?: ApiConfig): Promise<Launchpad[]> => {
    const { data } = await apiRequest.get<Launchpad[]>(
      `${API_ENDPOINTS.LAUNCHPADS.GET_ALL}?status=active`,
      config
    );
    return data;
  },

  getLaunchpads: async (config?: ApiConfig): Promise<Launchpad[]> => {
    return launchpadService.getAllLaunchpads(config);
  },
};