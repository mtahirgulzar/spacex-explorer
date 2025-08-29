import { apiRequest } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Launchpad } from '../../types';

export const launchpadService = {
  getAllLaunchpads: async (config?: any): Promise<Launchpad[]> => {
    const { data } = await apiRequest.get<Launchpad[]>(
      API_ENDPOINTS.LAUNCHPADS.GET_ALL,
      config
    );
    return data;
  },

  getLaunchpadById: async (id: string, config?: any): Promise<Launchpad> => {
    const { data } = await apiRequest.get<Launchpad>(
      API_ENDPOINTS.LAUNCHPADS.GET_BY_ID(id),
      config
    );
    return data;
  },

  getActiveLaunchpads: async (config?: any): Promise<Launchpad[]> => {
    const { data } = await apiRequest.get<Launchpad[]>(
      `${API_ENDPOINTS.LAUNCHPADS.GET_ALL}?status=active`,
      config
    );
    return data;
  },

  getLaunchpads: async (config?: any): Promise<Launchpad[]> => {
    return launchpadService.getAllLaunchpads(config);
  },
};