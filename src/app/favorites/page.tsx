'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, Trash2, Rocket as RocketIcon } from 'lucide-react';
import { Typography, Button, Card, CardContent } from '@/components';
import { LaunchCard } from '@/components/molecules';
import { useFavorites } from '@/lib/hooks/useFavorites';

export default function FavoritesPage() {
  const { favoriteLaunches, favoritesCount, clearFavorites } = useFavorites();

  const sortedFavorites = useMemo(() => {
    return [...favoriteLaunches].sort((a, b) => 
      new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime()
    );
  }, [favoriteLaunches]);

  const stats = useMemo(() => {
    const successful = favoriteLaunches.filter(launch => launch.success === true).length;
    const upcoming = favoriteLaunches.filter(launch => launch.upcoming).length;
    const failed = favoriteLaunches.filter(launch => launch.success === false).length;
    
    return { successful, upcoming, failed, total: favoritesCount };
  }, [favoriteLaunches, favoritesCount]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href="/" className="cursor-pointer">
                <Typography variant="h1" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  SpaceX Explorer
                </Typography>
              </Link>
              <Typography variant="body1" className="text-gray-600 text-sm">
                Your favorite SpaceX missions and launches
              </Typography>
            </div>

            <Link href="/launches">
              <Button variant="outline" className="gap-2 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Back to Launches
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-current" />
                <Typography variant="h2" className="text-xl font-semibold text-gray-900">
                  Favorite Launches ({favoritesCount})
                </Typography>
              </div>
            </div>

            {favoritesCount > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={clearFavorites}
                className="gap-2 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favoritesCount === 0 ? (
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <Typography variant="h3" className="text-xl mb-4">No Favorites Yet</Typography>
                <Typography variant="body1" className="text-gray-600 mb-6">
                  Start exploring SpaceX launches and add your favorites to create your personal collection.
                </Typography>
                <Link href="/launches">
                  <Button className="gap-2 cursor-pointer">
                    <RocketIcon className="h-4 w-4" />
                    Explore Launches
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.total}
                  </div>
                  <Typography variant="body2" className="text-gray-600">Total Favorites</Typography>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.successful}
                  </div>
                  <Typography variant="body2" className="text-gray-600">Successful</Typography>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stats.upcoming}
                  </div>
                  <Typography variant="body2" className="text-gray-600">Upcoming</Typography>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {stats.failed}
                  </div>
                  <Typography variant="body2" className="text-gray-600">Failed</Typography>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <Typography variant="h3" className="text-lg font-medium text-gray-900 mb-2">
                Your Collection
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Sorted by launch date (newest first)
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedFavorites.map((launch) => (
                <LaunchCard
                  key={launch.id}
                  launch={launch}
                  onViewDetails={(id) => window.location.href = `/launches/${id}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
