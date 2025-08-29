export { 
  apiClient, 
  apiRequest, 
  apiUtils, 
  createCancelToken 
} from './client';

export { 
  API_ENDPOINTS 
} from './endpoints';

import { launchService } from './services/launchService';
import { rocketService } from './services/rocketService';
import { launchpadService } from './services/launchpadService';

export { launchService, rocketService, launchpadService };

export const LaunchService = launchService;
export const RocketService = rocketService;
export const LaunchpadService = launchpadService;

export const api = {
  launches: launchService,
  rockets: rocketService,
  launchpads: launchpadService,
};

export type * from '../types';
