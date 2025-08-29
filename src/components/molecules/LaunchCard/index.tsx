import React, { useState, useMemo, FC } from 'react';
import Image from 'next/image';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { Card, CardContent, Badge, Typography, FavoriteButton } from '@/components';
import { Launch, Rocket, Launchpad } from '@/lib/types';
import { 
  Calendar, 
  MapPin, 
  Rocket as RocketIcon, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowRight,
  Zap,
  AlertTriangle,
  Image as ImageIcon,
  Camera
} from 'lucide-react';

const isValidRocket = (rocket: unknown): rocket is Rocket => {
  return !!(rocket && typeof rocket === 'object');
};

const isValidLaunchpad = (launchpad: unknown): launchpad is Launchpad => {
  return !!(launchpad && typeof launchpad === 'object');
};

const hasRocketImages = (rocket: unknown): boolean => {
  return isValidRocket(rocket) && rocket.flickr_images?.length > 0;
};

const IMAGE_CLASS_MAP = {
  patch: 'transition-transform duration-300 group-hover:scale-105 object-contain bg-gray-50 p-4',
  default: 'transition-transform duration-300 group-hover:scale-105 object-cover'
} as const;

const getImageClassName = (type: string): string => {
  return IMAGE_CLASS_MAP[type as keyof typeof IMAGE_CLASS_MAP] || IMAGE_CLASS_MAP.default;
};

const STATUS_CONFIG_MAP = {
  upcomingDelayed: {
    badge: (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 gap-1">
        <AlertTriangle className="h-3 w-3" />
        Upcoming - Delayed
      </Badge>
    ),
    bgGradient: 'from-amber-50 to-amber-100'
  },
  upcomingSoon: {
    badge: (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 gap-1">
        <Clock className="h-3 w-3" />
        Upcoming - Soon
      </Badge>
    ),
    bgGradient: 'from-emerald-50 to-emerald-100'
  },
  upcoming: {
    badge: (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 gap-1">
        <Clock className="h-3 w-3" />
        Upcoming
      </Badge>
    ),
    bgGradient: 'from-blue-50 to-blue-100'
  },
  success: {
    badge: (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 gap-1">
        <CheckCircle className="h-3 w-3" />
        Success
      </Badge>
    ),
    bgGradient: 'from-green-50 to-green-100'
  },
  failed: {
    badge: (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200 gap-1">
        <XCircle className="h-3 w-3" />
        Failed
      </Badge>
    ),
    bgGradient: 'from-red-50 to-red-100'
  },
  completed: {
    badge: (
      <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 gap-1">
        <Clock className="h-3 w-3" />
        Completed
      </Badge>
    ),
    bgGradient: 'from-gray-50 to-gray-100'
  }
} as const;

export interface LaunchCardProps {
  launch: Launch;
  onViewDetails?: (_id: string) => void;
  className?: string;
}

const getStatusType = (launch: Launch, dateInfo: { isInPast: boolean; isSoon: boolean }): keyof typeof STATUS_CONFIG_MAP => {
  if (launch.upcoming) {
    if (dateInfo.isInPast) return 'upcomingDelayed';
    if (dateInfo.isSoon) return 'upcomingSoon';
    return 'upcoming';
  }
  
  if (launch.success === true) return 'success';
  if (launch.success === false) return 'failed';
  return 'completed';
};

export const LaunchCard: FC<LaunchCardProps> = ({
  launch,
  onViewDetails,
  className
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const rocket = launch.rocket as Rocket;
  const launchpad = launch.launchpad as Launchpad;

  const dateInfo = useMemo(() => {
    try {
      const launchDate = new Date(launch.date_utc);
      const now = new Date();
      const isDateInPast = isBefore(launchDate, now);
      const isDateSoon = isAfter(launchDate, now) && isBefore(launchDate, addDays(now, 7));
      
      return {
        date: launchDate,
        formatted: format(launchDate, 'MMM dd, yyyy'),
        time: format(launchDate, 'HH:mm'),
        isInPast: isDateInPast,
        isSoon: isDateSoon,
        precision: (launch as Launch & { date_precision?: string }).date_precision || 'day'
      };
    } catch {
      return {
        date: null,
        formatted: 'Date TBD',
        time: 'Time TBD',
        isInPast: false,
        isSoon: false,
        precision: 'unknown'
      };
    }
  }, [launch]);

  const statusConfig = useMemo(() => {
    const statusType = getStatusType(launch, dateInfo);
    return STATUS_CONFIG_MAP[statusType];
  }, [launch, dateInfo]);

  const primaryImage = useMemo(() => {
    const imageChecks = [
      {
        condition: launch.links?.flickr?.original?.length > 0,
        result: { src: launch.links.flickr.original[0], type: 'photo' }
      },
      {
        condition: launch.links?.patch?.large,
        result: { src: launch.links.patch.large, type: 'patch' }
      },
      {
        condition: launch.links?.patch?.small,
        result: { src: launch.links.patch.small, type: 'patch' }
      },
      {
        condition: hasRocketImages(rocket),
        result: () => {
          const seed = launch.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const randomIndex = seed % rocket.flickr_images.length;
          return { src: rocket.flickr_images[randomIndex], type: 'rocket' };
        }
      }
    ];

    const imageCheck = imageChecks.find(check => check.condition);
    if (imageCheck) {
      return typeof imageCheck.result === 'function' ? imageCheck.result() : imageCheck.result;
    }
    
    return null;
  }, [launch.id, launch.links?.flickr?.original, launch.links?.patch?.large, launch.links?.patch?.small, rocket]);

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer bg-white border border-gray-200 pt-5 pb-0 gap-5 ${className}`}
      onClick={() => onViewDetails?.(launch.id)}
    >
      {primaryImage && (
        <div className="relative h-44 overflow-hidden">
          <div className="absolute top-2 left-2 z-10">
            <FavoriteButton
              launch={launch}
              variant="icon"
              size="sm"
              className="bg-white/90 hover:bg-white shadow-sm pointer-events-auto"
            />
          </div>
          
          {!imageError ? (
            <>
              <Image
                src={primaryImage.src || '/placeholder-image.jpg'}
                alt={`${launch.name} ${primaryImage.type === 'photo' ? 'launch photo' : 'mission patch'}`}
                fill
                className={getImageClassName(primaryImage.type)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
          
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
          
          <div className="absolute top-2 right-2 flex items-center gap-2">
            {launch.links?.webcast && (
              <a
                href={launch.links.webcast}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Video</span>
              </a>
            )}
            {statusConfig.badge}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <Typography variant="h4" className="font-bold text-white mb-1 drop-shadow-md text-base line-clamp-1">
              {launch.name}
            </Typography>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 drop-shadow-sm" />
                  <span className="drop-shadow-sm">#{launch.flight_number}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!primaryImage && (
        <div className="relative h-44 bg-gray-100 flex items-center justify-center">
          <Camera className="h-8 w-8 text-gray-400" />
          
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
          
          <div className="absolute top-2 right-2 flex items-center gap-2">
            {launch.links?.webcast && (
              <a
                href={launch.links.webcast}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Video</span>
              </a>
            )}
            {statusConfig.badge}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <Typography variant="h4" className="font-bold text-white mb-1 drop-shadow-md text-base line-clamp-1">
              {launch.name}
            </Typography>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 drop-shadow-sm" />
                  <span className="drop-shadow-sm">#{launch.flight_number}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <CardContent className="p-2 pt-3 pb-5 grid grid-rows-[auto_auto_1fr] gap-3 min-h-[160px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-semibold text-gray-900 text-sm">{dateInfo.formatted}</div>
              {dateInfo.time !== 'Time TBD' && (
                <div className="text-xs text-gray-500">{dateInfo.time} UTC</div>
              )}
            </div>
          </div>
          {dateInfo.precision === 'month' && (
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
              Date TBD
            </span>
          )}
        </div>

        <div className="space-y-2">
          {isValidRocket(rocket) && (
            <div className="flex items-center gap-2 text-sm">
              <RocketIcon className="h-4 w-4 text-gray-500" />
              <span className="text-gray-900">{rocket?.name}</span>
              <span className="text-xs text-gray-500">
                {rocket?.success_rate_pct}% success
              </span>
            </div>
          )}

          {isValidLaunchpad(launchpad) && (
            <div className="flex items-start gap-2 text-sm min-w-0 w-full min-h-[40px]">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 min-w-0 flex-1 leading-relaxed">{launchpad?.name}, {launchpad?.locality}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {!primaryImage && launch.links?.patch?.small && (
              <Image
                src={launch.links.patch.small || '/placeholder-image.jpg'}
                alt="Mission patch"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
                sizes="24px"
              />
            )}
          </div>

          <div className="text-blue-600 text-sm hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer">
            <span>Details</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};