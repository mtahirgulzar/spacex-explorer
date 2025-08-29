'use client';

import React, { useState, useMemo, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Badge
} from '@/components';
import { useLaunchById, useRocketById, useLaunchpadById } from '@/lib/queries/launches';
import { Payload } from '@/lib/types';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Rocket as RocketIcon,
  Globe,
  ExternalLink,
  Play,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Target,
  Fuel,
  Weight,
  Ruler,
  DollarSign,
  RotateCcw,
  Gauge,
  Radio,
  Settings,
  Activity,
  Orbit,
  Building,
  Navigation,
  Timer,
  Thermometer,
  TrendingUp
} from 'lucide-react';

interface LaunchDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const BOOLEAN_VALUE_MAP = {
  true: 'Yes',
  false: 'No',
  default: 'N/A'
} as const;

const formatBooleanValue = (value: boolean | null | undefined): string => {
  if (value === true) return BOOLEAN_VALUE_MAP.true;
  if (value === false) return BOOLEAN_VALUE_MAP.false;
  return BOOLEAN_VALUE_MAP.default;
};

const STATUS_BADGE_CONFIG = {
  upcomingDelayed: {
    badge: (
      <Badge className="bg-amber-100 text-amber-800 gap-1">
        <AlertTriangle className="h-4 w-4" />
        Upcoming - Delayed
      </Badge>
    )
  },
  upcoming: {
    badge: (
      <Badge className="bg-blue-100 text-blue-800 gap-1">
        <Clock className="h-4 w-4" />
        Upcoming
      </Badge>
    )
  },
  success: {
    badge: (
      <Badge className="bg-green-100 text-green-800 gap-1">
        <CheckCircle className="h-4 w-4" />
        Mission Successful
      </Badge>
    )
  },
  failed: {
    badge: (
      <Badge className="bg-red-100 text-red-800 gap-1">
        <XCircle className="h-4 w-4" />
        Mission Failed
      </Badge>
    )
  },
  completed: {
    badge: (
      <Badge className="bg-gray-100 text-gray-600 gap-1">
        <Clock className="h-4 w-4" />
        Completed
      </Badge>
    )
  }
} as const;

const VALIDATION_CHECKS = {
  hasCores: (launch: unknown): boolean => {
    return !!(launch && 
      typeof launch === 'object' && 
      'cores' in launch && 
      Array.isArray((launch as { cores: unknown[] }).cores) && 
      (launch as { cores: unknown[] }).cores.length > 0);
  },

  hasPayloads: (launch: unknown): boolean => {
    return !!(launch && 
      typeof launch === 'object' && 
      'payloads' in launch && 
      Array.isArray((launch as { payloads: unknown[] }).payloads) && 
      (launch as { payloads: unknown[] }).payloads.length > 0);
  },

  hasRedditDiscussions: (launch: unknown): boolean => {
    if (!launch || typeof launch !== 'object' || !('links' in launch)) return false;
    const links = (launch as { links: unknown }).links;
    if (!links || typeof links !== 'object' || !('reddit' in links)) return false;
    const reddit = (links as { reddit: unknown }).reddit;
    if (!reddit || typeof reddit !== 'object') return false;
    const redditObj = reddit as { campaign?: string; launch?: string; media?: string };
    return !!(redditObj.campaign || redditObj.launch || redditObj.media);
  }
} as const;

const getStatusBadgeType = (launch: { upcoming: boolean; success: boolean | null; date_utc: string }): keyof typeof STATUS_BADGE_CONFIG => {
  if (launch.upcoming) {
    const isDelayed = new Date(launch.date_utc) < new Date();
    return isDelayed ? 'upcomingDelayed' : 'upcoming';
  }
  
  if (launch.success === true) return 'success';
  if (launch.success === false) return 'failed';
  return 'completed';
};

const LANDING_SUCCESS_CONFIG = {
  true: { text: 'Success', class: 'text-green-600' },
  false: { text: 'Failed', class: 'text-red-600' },
  default: { text: 'Unknown', class: 'text-gray-600' }
} as const;

const getLandingSuccessConfig = (success: boolean | null | undefined) => {
  if (success === true) return LANDING_SUCCESS_CONFIG.true;
  if (success === false) return LANDING_SUCCESS_CONFIG.false;
  return LANDING_SUCCESS_CONFIG.default;
};

export default function LaunchDetailPage({ params }: LaunchDetailPageProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const resolvedParams = use(params);
  const { data: launch, isLoading: launchLoading, isError: launchError } = useLaunchById(resolvedParams.id);
  const rocketId = launch?.rocket as string;
  const launchpadId = launch?.launchpad as string;
  const { data: rocket, isLoading: rocketLoading } = useRocketById(rocketId, {
    enabled: !!rocketId && !!launch
  });
  const { data: launchpad, isLoading: launchpadLoading } = useLaunchpadById(launchpadId, {
    enabled: !!launchpadId && !!launch
  });

  const memoizedData = useMemo(() => {
    return {
      isAnyLoading: launchLoading || rocketLoading || launchpadLoading,
      statusBadge: launch ? STATUS_BADGE_CONFIG[getStatusBadgeType(launch)].badge : null
    };
  }, [launchLoading, rocketLoading, launchpadLoading, launch]);

  const allImages = useMemo(() => {
    if (!launch) return [];
    
    const imageChecks = [
      {
        condition: launch.links?.flickr?.original?.length > 0,
        result: () => launch.links.flickr.original.map(url => ({ url, type: 'flickr', caption: 'Launch Photo' }))
      },
      {
        condition: launch.links?.patch?.large,
        result: () => [{ url: launch.links.patch.large!, type: 'patch', caption: 'Mission Patch' }]
      },
      {
        condition: rocket?.flickr_images?.length && rocket.flickr_images.length > 0,
        result: () => rocket!.flickr_images.map(url => ({ url, type: 'rocket', caption: `${rocket!.name || 'Rocket'} Photo` }))
      }
    ];

    return imageChecks.reduce((acc, check) => {
      if (check.condition) {
        acc.push(...check.result());
      }
      return acc;
    }, [] as Array<{ url: string; type: string; caption: string }>);
  }, [launch, rocket]);

  const formatDate = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy \'at\' HH:mm \'UTC\'');
    } catch {
      return 'Date unavailable';
    }
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  if (memoizedData.isAnyLoading || !launch) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="text-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">
                {launchLoading ? 'Loading launch details...' : 'Loading additional mission data...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (launchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <Typography variant="h3" className="mb-4">Something went wrong</Typography>
          <Typography variant="body1" className="text-gray-600 mb-6">
            We couldn&apos;t load this launch. Please try again.
          </Typography>
          <div className="space-x-3">
            <Button onClick={() => window.location.reload()} variant="outline" className="cursor-pointer">
              Try Again
            </Button>
            <Button onClick={() => router.push('/launches')} className="gap-2 !cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Back to Launches
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          onClick={() => router.push('/launches')} 
          className="mb-8 gap-2 cursor-pointer"
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Launches
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <section className="space-y-6">
            {allImages.length > 0 ? (
              <Card className="overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={allImages[currentImageIndex]?.url || '/placeholder-image.jpg'}
                    alt={allImages[currentImageIndex]?.caption || 'Launch image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors cursor-pointer"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                    {allImages[currentImageIndex]?.caption || 'Launch image'}
                  </div>

                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="aspect-video bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4" />
                  <Typography variant="body1">No images available</Typography>
                </div>
              </Card>
            )}

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.url || '/placeholder-image.jpg'}
                      alt={image.caption}
                      width={80}
                      height={64}
                      className="w-full h-full object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Typography variant="h1" className="text-3xl font-bold mb-2">
                    {launch.name}
                  </Typography>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Zap className="h-4 w-4" />
                    Flight #{launch.flight_number}
                  </div>
                </div>
                {memoizedData.statusBadge}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(launch.date_utc)}
                </div>
              </div>

              {launch.details && (
                <Typography variant="body1" className="text-gray-700 leading-relaxed mb-6">
                  {launch.details}
                </Typography>
              )}

              <div className="flex flex-wrap gap-3">
                {launch.links?.webcast && (
                  <Button asChild>
                    <a
                      href={launch.links?.webcast}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2 cursor-pointer"
                    >
                      <Play className="h-4 w-4" />
                      Watch Launch
                    </a>
                  </Button>
                )}
                
                {launch.links?.wikipedia && (
                  <Button variant="outline" asChild>
                    <a
                      href={launch.links?.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2 cursor-pointer"
                    >
                      <Globe className="h-4 w-4" />
                      Wikipedia
                    </a>
                  </Button>
                )}

                {launch.links?.article && (
                  <Button variant="outline" asChild>
                    <a
                      href={launch.links?.article}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2 cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Article
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rocket && (
            <Card>
              <CardContent className="p-6">
                <Typography variant="h2" className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <RocketIcon className="h-5 w-5" />
                  Rocket Details
                </Typography>
                
                <div className="space-y-4">
                  <div>
                    <Typography variant="h3" className="font-medium text-lg mb-2">
                      {rocket.name}
                    </Typography>
                    {rocket.description && (
                      <Typography variant="body2" className="text-gray-600 mb-4">
                        {rocket.description}
                      </Typography>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">Height</div>
                        <div className="text-sm text-gray-600">{rocket.height?.meters}m</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Weight className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">Mass</div>
                        <div className="text-sm text-gray-600">{Math.round(rocket.mass?.kg / 1000)}t</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">Success Rate</div>
                        <div className="text-sm text-gray-600">{rocket.success_rate_pct}%</div>
                      </div>
                    </div>

                    {rocket.cost_per_launch && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium">Cost</div>
                          <div className="text-sm text-gray-600">
                            ${(rocket.cost_per_launch / 1000000).toFixed(0)}M
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Stages</div>
                        <div className="text-gray-600">{rocket.stages}</div>
                      </div>
                      <div>
                        <div className="font-medium">Boosters</div>
                        <div className="text-gray-600">{rocket.boosters}</div>
                      </div>
                      <div>
                        <div className="font-medium">Active</div>
                        <div className="text-gray-600">{formatBooleanValue(rocket.active)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {launchpad && (
            <Card>
              <CardContent className="p-6">
                <Typography variant="h2" className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Launch Site
                </Typography>
                
                <div className="space-y-4">
                  <div>
                    <Typography variant="h3" className="font-medium text-lg mb-2">
                      {launchpad.name}
                    </Typography>
                    <div className="text-sm text-gray-600 mb-4">
                      {launchpad.locality}, {launchpad.region}
                    </div>
                    {launchpad.details && (
                      <Typography variant="body2" className="text-gray-600 mb-4">
                        {launchpad.details}
                      </Typography>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Launch Attempts</div>
                      <div className="text-sm text-gray-600">{launchpad.launch_attempts}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Successful Launches</div>
                      <div className="text-sm text-gray-600">{launchpad.launch_successes}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm">
                      <div className="font-medium mb-1">Status</div>
                      <div className="text-gray-600">{launchpad.status}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {VALIDATION_CHECKS.hasCores(launch) && (
            <Card>
              <CardContent className="p-6">
                <Typography variant="h2" className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Core Information
                </Typography>
                
                <div className="space-y-4">
                                          {launch.cores.map((core, index: number) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <Typography variant="h3" className="font-medium">
                          Core {index + 1} {core.core && `(${core.core})`}
                        </Typography>
                        {core.reused && (
                          <Badge className="bg-green-100 text-green-800 gap-1">
                            <RotateCcw className="h-3 w-3" />
                            Reused
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-700">Flight Number</div>
                          <div className="text-gray-600">{core.flight || 'N/A'}</div>
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-700">Landing Attempt</div>
                          <div className="text-gray-600">
                            {core.landing_attempt ? 'Yes' : 'No'}
                          </div>
                        </div>
                        
                        {core.landing_attempt && (
                          <>
                            <div>
                              <div className="font-medium text-gray-700">Landing Success</div>
                              <div className={`font-medium ${getLandingSuccessConfig(core.landing_success).class}`}>
                                {getLandingSuccessConfig(core.landing_success).text}
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-medium text-gray-700">Landing Type</div>
                              <div className="text-gray-600">{core.landing_type || 'N/A'}</div>
                            </div>
                          </>
                        )}
                        
                        <div>
                          <div className="font-medium text-gray-700">Grid Fins</div>
                          <div className="text-gray-600">
                            {formatBooleanValue(core.gridfins)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-700">Landing Legs</div>
                          <div className="text-gray-600">
                            {formatBooleanValue(core.legs)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <Typography variant="h2" className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Mission Timeline
              </Typography>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Launch Date</div>
                    <div className="text-sm text-blue-700">{formatDate(launch.date_utc)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Timer className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Flight Number</div>
                    <div className="text-sm text-gray-600">#{launch.flight_number}</div>
                  </div>
                </div>
                
                {launch.auto_update && (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <Radio className="h-5 w-5 text-amber-600" />
                    <div>
                      <div className="font-medium text-amber-900">Auto-Updated</div>
                      <div className="text-sm text-amber-700">This launch data is automatically updated</div>
                    </div>
                  </div>
                )}
                
                {launch.tbd && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium text-yellow-900">Date TBD</div>
                      <div className="text-sm text-yellow-700">Launch date to be determined</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {VALIDATION_CHECKS.hasPayloads(launch) && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <Typography variant="h2" className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Orbit className="h-5 w-5" />
                Payload Details
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {launch.payloads.filter((payload): payload is Payload => typeof payload === 'object').map((payload, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-4">
                      <Typography variant="h3" className="font-medium text-lg mb-2">
                        {payload.name || `Payload ${index + 1}`}
                      </Typography>
                      
                      {payload.type && (
                        <Badge className="bg-blue-100 text-blue-800">
                          {payload.type}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3">
                      {payload.customers && payload.customers.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Customer(s)</div>
                          <div className="text-sm text-gray-600">
                            {payload.customers.join(', ')}
                          </div>
                        </div>
                      )}

                      {payload.manufacturer && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Manufacturer</div>
                          <div className="text-sm text-gray-600">{payload.manufacturer}</div>
                        </div>
                      )}

                      {payload.nationality && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Nationality</div>
                          <div className="text-sm text-gray-600">{payload.nationality}</div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        {payload.mass_kg && (
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-1">Mass</div>
                            <div className="text-sm text-gray-600">{payload.mass_kg} kg</div>
                          </div>
                        )}

                        {payload.orbit && (
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-1">Orbit</div>
                            <div className="text-sm text-gray-600">{payload.orbit}</div>
                          </div>
                        )}
                      </div>

                      {payload.periapsis_km && payload.apoapsis_km && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Orbital Parameters</div>
                          <div className="text-sm text-gray-600">
                            Periapsis: {payload.periapsis_km} km • Apoapsis: {payload.apoapsis_km} km
                          </div>
                        </div>
                      )}

                      {payload.inclination_deg && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Inclination</div>
                          <div className="text-sm text-gray-600">{payload.inclination_deg}°</div>
                        </div>
                      )}

                      {payload.lifespan_years && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Mission Duration</div>
                          <div className="text-sm text-gray-600">{payload.lifespan_years} years</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {rocket && rocket.engines && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <Typography variant="h2" className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Engine Specifications
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4 text-gray-600" />
                    <div className="font-medium">Engine Details</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>Type: {rocket?.engines?.type}</div>
                    <div>Version: {rocket?.engines?.version}</div>
                    <div>Layout: {rocket?.engines?.layout}</div>
                    <div>Count: {rocket?.engines?.number}</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-gray-600" />
                    <div className="font-medium">Performance</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>Thrust (Sea): {rocket?.engines?.thrust_sea_level?.kN} kN</div>
                    <div>Thrust (Vacuum): {rocket?.engines?.thrust_vacuum?.kN} kN</div>
                    <div>ISP (Sea): {rocket?.engines?.isp?.sea_level}s</div>
                    <div>ISP (Vacuum): {rocket?.engines?.isp?.vacuum}s</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Fuel className="h-4 w-4 text-gray-600" />
                    <div className="font-medium">Propellants</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>Fuel: {rocket?.engines?.propellant_1}</div>
                    <div>Oxidizer: {rocket?.engines?.propellant_2}</div>
                    <div>T/W Ratio: {rocket?.engines?.thrust_to_weight}</div>
                    <div>Max Loss: {rocket?.engines?.engine_loss_max}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {rocket && (rocket.first_stage || rocket.second_stage) && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <Typography variant="h2" className="text-xl font-semibold mb-4 flex items-center gap-2">
                <RocketIcon className="h-5 w-5" />
                Stage Information
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rocket.first_stage && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <Typography variant="h3" className="font-medium mb-3 flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      First Stage
                    </Typography>
                    
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-gray-700">Engines</div>
                          <div className="text-gray-600">{rocket?.first_stage?.engines}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Reusable</div>
                          <div className="text-gray-600">{formatBooleanValue(rocket?.first_stage?.reusable)}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-700">Thrust (Sea Level)</div>
                        <div className="text-gray-600">{rocket?.first_stage?.thrust_sea_level?.kN} kN</div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-700">Thrust (Vacuum)</div>
                        <div className="text-gray-600">{rocket?.first_stage?.thrust_vacuum?.kN} kN</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-gray-700">Fuel Amount</div>
                          <div className="text-gray-600">{rocket?.first_stage?.fuel_amount_tons}t</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Burn Time</div>
                          <div className="text-gray-600">{rocket?.first_stage?.burn_time_sec}s</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {rocket.second_stage && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <Typography variant="h3" className="font-medium mb-3 flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      Second Stage
                    </Typography>
                    
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-gray-700">Engines</div>
                          <div className="text-gray-600">{rocket?.second_stage?.engines}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Reusable</div>
                          <div className="text-gray-600">{formatBooleanValue(rocket?.second_stage?.reusable)}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-700">Thrust</div>
                        <div className="text-gray-600">{rocket?.second_stage?.thrust?.kN} kN</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-gray-700">Fuel Amount</div>
                          <div className="text-gray-600">{rocket?.second_stage?.fuel_amount_tons}t</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Burn Time</div>
                          <div className="text-gray-600">{rocket?.second_stage?.burn_time_sec}s</div>
                        </div>
                      </div>

                      {rocket?.second_stage?.payloads?.composite_fairing && (
                        <div>
                          <div className="font-medium text-gray-700 mb-1">Payload Fairing</div>
                          <div className="text-gray-600">
                            Height: {rocket?.second_stage?.payloads.composite_fairing.height?.meters}m • 
                            Diameter: {rocket?.second_stage?.payloads.composite_fairing.diameter?.meters}m
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8">
          <CardContent className="p-6">
            <Typography variant="h2" className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              External Resources
            </Typography>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {launch.links?.webcast && (
                <Button asChild className="h-auto p-4 flex-col gap-2">
                  <a href={launch.links?.webcast} target="_blank" rel="noopener noreferrer">
                    <Play className="h-6 w-6" />
                    <span className="text-sm">Watch Launch</span>
                  </a>
                </Button>
              )}
              
              {launch.links?.wikipedia && (
                <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                  <a href={launch.links?.wikipedia} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-6 w-6" />
                    <span className="text-sm">Wikipedia</span>
                  </a>
                </Button>
              )}
              
              {launch.links?.article && (
                <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                  <a href={launch.links?.article} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-6 w-6" />
                    <span className="text-sm">News Article</span>
                  </a>
                </Button>
              )}
              
              {launch.links?.presskit && (
                <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                  <a href={launch.links?.presskit} target="_blank" rel="noopener noreferrer">
                    <Building className="h-6 w-6" />
                    <span className="text-sm">Press Kit</span>
                  </a>
                </Button>
              )}
            </div>

            {VALIDATION_CHECKS.hasRedditDiscussions(launch) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Typography variant="h3" className="font-medium mb-3">Reddit Discussions</Typography>
                <div className="flex flex-wrap gap-2">
                  {launch.links?.reddit.campaign && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={launch.links?.reddit.campaign} target="_blank" rel="noopener noreferrer">
                        Campaign
                      </a>
                    </Button>
                  )}
                  {launch.links?.reddit.launch && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={launch.links?.reddit.launch} target="_blank" rel="noopener noreferrer">
                        Launch Thread
                      </a>
                    </Button>
                  )}
                  {launch.links?.reddit.media && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={launch.links?.reddit.media} target="_blank" rel="noopener noreferrer">
                        Media
                      </a>
                    </Button>
                  )}
                  {launch.links?.reddit.recovery && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={launch.links?.reddit.recovery} target="_blank" rel="noopener noreferrer">
                        Recovery
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
