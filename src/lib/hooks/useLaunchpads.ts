import { useQuery } from '@tanstack/react-query';
import { LaunchpadService } from '../api';

export const useLaunchpads = () => {
  return useQuery({
    queryKey: ['launchpads'],
    queryFn: () => LaunchpadService.getLaunchpads(),
  });
};

export const useLaunchpad = (id: string) => {
  return useQuery({
    queryKey: ['launchpad', id],
    queryFn: () => LaunchpadService.getLaunchpadById(id),
    enabled: !!id,
  });
};