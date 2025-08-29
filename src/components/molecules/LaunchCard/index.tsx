import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, Badge, Typography, Button } from '@/components';
import { Launch, Rocket, Launchpad } from '@/lib/types';
import { Calendar, MapPin, Rocket as RocketIcon, CheckCircle, XCircle, Clock } from 'lucide-react';

export interface LaunchCardProps {
  launch: Launch;
  onViewDetails?: (launchId: string) => void;
  onToggleFavorite?: (launchId: string) => void;
  isFavorite?: boolean;
  className?: string;
}

export const LaunchCard: React.FC<LaunchCardProps> = ({
  launch,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false,
  className
}) => {
  const rocket = launch.rocket as Rocket;
  const launchpad = launch.launchpad as Launchpad;

  const getStatusBadge = () => {
    if (launch.upcoming) {
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          Upcoming
        </Badge>
      );
    }
    
    if (launch.success === true) {
      return (
        <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-3 w-3" />
          Success
        </Badge>
      );
    }
    
    if (launch.success === false) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Failed
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        Unknown
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Date TBD';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch {
      return 'Time TBD';
    }
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Typography variant="h4" className="truncate pr-2">
              {launch.name}
            </Typography>
            <Typography variant="caption" color="muted" className="mt-1">
              Flight #{launch.flight_number}
            </Typography>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge()}
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(launch.id)}
                className={`h-8 w-8 p-0 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
              >
                <svg
                  className="h-4 w-4"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(launch.date_utc)}</span>
            <span className="text-xs">•</span>
            <span>{formatTime(launch.date_utc)} UTC</span>
          </div>

          {rocket && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RocketIcon className="h-4 w-4" />
              <span>{typeof rocket === 'string' ? rocket : rocket.name}</span>
            </div>
          )}

          {launchpad && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">
                {typeof launchpad === 'string' ? launchpad : `${launchpad.name}, ${launchpad.locality}`}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {launch.details && (
          <Typography 
            variant="body2" 
            color="muted" 
            className="line-clamp-3 mb-4"
          >
            {launch.details}
          </Typography>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {launch.links.patch.small && (
              <img
                src={launch.links.patch.small}
                alt={`${launch.name} mission patch`}
                className="h-12 w-12 rounded-lg object-contain bg-gray-50"
              />
            )}
          </div>

          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(launch.id)}
              className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
