import React from 'react';
import { 
  Card, 
  CardContent, 
  Input, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Button,
  Badge,
  Typography
} from '@/components';
import { LaunchFilters } from '@/lib/types';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';

export interface LaunchFiltersProps {
  filters: LaunchFilters;
  onFiltersChange: (filters: LaunchFilters) => void;
  resultCount?: number;
  isLoading?: boolean;
  className?: string;
}

export const LaunchFiltersBar: React.FC<LaunchFiltersProps> = ({
  filters,
  onFiltersChange,
  resultCount,
  isLoading = false,
  className
}) => {
  const handleFilterChange = (key: keyof LaunchFilters, value: string | boolean | Date | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 12,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.upcoming !== undefined) count++;
    if (filters.success !== undefined) count++;
    if (filters.dateRange?.start || filters.dateRange?.end) count++;
    if (filters.sortBy) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Typography variant="h6">Filters</Typography>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount} active</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {resultCount !== undefined && (
                <Typography variant="body2" color="muted">
                  {isLoading ? 'Loading...' : `${resultCount.toLocaleString()} launches`}
                </Typography>
              )}
              
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-8 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search launches..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Launch Status */}
            <div>
              <Select
                value={filters.upcoming?.toString() || 'all'}
                onValueChange={(value) => 
                  handleFilterChange('upcoming', value === 'all' ? undefined : value === 'true')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Launch status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All launches</SelectItem>
                  <SelectItem value="true">Upcoming</SelectItem>
                  <SelectItem value="false">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Success Status */}
            <div>
              <Select
                value={filters.success?.toString() || 'all'}
                onValueChange={(value) => 
                  handleFilterChange('success', value === 'all' ? undefined : value === 'true')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mission result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All results</SelectItem>
                  <SelectItem value="true">Success</SelectItem>
                  <SelectItem value="false">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <Select
                value={filters.sortBy || 'date_utc'}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_utc">Launch Date</SelectItem>
                  <SelectItem value="name">Mission Name</SelectItem>
                  <SelectItem value="flight_number">Flight Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div>
              <Select
                value={filters.sortOrder || 'desc'}
                onValueChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">
                    <div className="flex items-center gap-2">
                      <SortDesc className="h-4 w-4" />
                      Newest first
                    </div>
                  </SelectItem>
                  <SelectItem value="asc">
                    <div className="flex items-center gap-2">
                      <SortAsc className="h-4 w-4" />
                      Oldest first
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {filters.search && (
                <Badge variant="outline" className="gap-1">
                  Search: &quot;{filters.search}&quot;
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 hover:bg-muted rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filters.upcoming !== undefined && (
                <Badge variant="outline" className="gap-1">
                  {filters.upcoming ? 'Upcoming' : 'Past'} launches
                  <button
                    onClick={() => handleFilterChange('upcoming', undefined)}
                    className="ml-1 hover:bg-muted rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filters.success !== undefined && (
                <Badge variant="outline" className="gap-1">
                  {filters.success ? 'Successful' : 'Failed'} missions
                  <button
                    onClick={() => handleFilterChange('success', undefined)}
                    className="ml-1 hover:bg-muted rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
