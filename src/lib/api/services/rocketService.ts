import { apiRequest } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Rocket } from '../../types';

export const rocketService = {
  getAllRockets: async (config?: any): Promise<Rocket[]> => {
    const { data } = await apiRequest.get<Rocket[]>(
      API_ENDPOINTS.ROCKETS.GET_ALL,
      config
    );
    return data;
  },

  getRocketById: async (id: string, config?: any): Promise<Rocket> => {
    const { data } = await apiRequest.get<Rocket>(
      API_ENDPOINTS.ROCKETS.GET_BY_ID(id),
      config
    );
    return data;
  },

  getActiveRockets: async (config?: any): Promise<Rocket[]> => {
    const { data } = await apiRequest.get<Rocket[]>(
      `${API_ENDPOINTS.ROCKETS.GET_ALL}?active=true`,
      config
    );
    return data;
  },

  searchRockets: async (searchTerm: string, config?: any): Promise<Rocket[]> => {
    const rockets = await rocketService.getAllRockets(config);
    return rockets.filter(rocket => 
      rocket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rocket.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rocket.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  getRockets: async (config?: any): Promise<Rocket[]> => {
    return rocketService.getAllRockets(config);
  },
};