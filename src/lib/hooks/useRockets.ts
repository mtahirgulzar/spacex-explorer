import { useQuery } from '@tanstack/react-query';
import { RocketService } from '../api';

export const useRockets = () => {
  return useQuery({
    queryKey: ['rockets'],
    queryFn: () => RocketService.getRockets(),
  });
};

export const useRocket = (id: string) => {
  return useQuery({
    queryKey: ['rocket', id],
    queryFn: () => RocketService.getRocketById(id),
    enabled: !!id,
  });
};