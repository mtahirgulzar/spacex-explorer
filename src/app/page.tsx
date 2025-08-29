'use client';

import { useRouter } from 'next/navigation';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardContent, 
  Badge, 
  Typography 
} from '@/components';
import { useLaunches, useUpcomingLaunches } from '@/lib/hooks/useLaunches';
import { 
  Rocket, 
  Calendar, 
  ChevronRight,
  Zap,
  Globe,
  Star
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { data: allLaunches, isLoading: allLoading } = useLaunches();
  const { data: upcomingLaunches, isLoading: upcomingLoading } = useUpcomingLaunches();

  const stats = {
    totalLaunches: allLaunches?.length || 0,
    upcomingLaunches: upcomingLaunches?.length || 0,
    successfulLaunches: allLaunches?.filter(l => l.success === true).length || 0,
    successRate: allLaunches?.length 
      ? Math.round((allLaunches.filter(l => l.success === true).length / allLaunches.filter(l => l.success !== null).length) * 100)
      : 0
  };

  const features = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Launch Explorer",
      description: "Browse all SpaceX launches with advanced filtering and search capabilities",
      action: "Explore Launches",
      onClick: () => router.push('/launches')
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Upcoming Missions",
      description: "Stay updated with upcoming SpaceX missions and launch schedules",
      action: "View Upcoming",
      onClick: () => router.push('/launches?upcoming=true')
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Mission Favorites",
      description: "Save and track your favorite SpaceX missions and launches",
      action: "Manage Favorites",
      onClick: () => router.push('/favorites')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Typography variant="h1" className="text-5xl md:text-6xl font-bold mb-6 text-white font-jetbrains">
              SpaceX Explorer
            </Typography>
            <Typography variant="subtitle1" className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover the history and future of space exploration with comprehensive 
              SpaceX mission data, insights, and analytics.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 cursor-pointer"
                onClick={() => router.push('/launches')}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Explore Launches
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 cursor-pointer"
                onClick={() => router.push('/launches?upcoming=true')}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Missions
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">

        <div className="mb-16">
          <Typography variant="h2" className="text-center mb-8">
            Mission Statistics
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {allLoading ? '...' : stats.totalLaunches.toLocaleString()}
                </div>
                <Typography variant="body2" color="muted">Total Launches</Typography>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {upcomingLoading ? '...' : stats.upcomingLaunches}
                </div>
                <Typography variant="body2" color="muted">Upcoming Missions</Typography>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {allLoading ? '...' : stats.successfulLaunches.toLocaleString()}
                </div>
                <Typography variant="body2" color="muted">Successful Launches</Typography>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {allLoading ? '...' : `${stats.successRate}%`}
                </div>
                <Typography variant="body2" color="muted">Success Rate</Typography>
              </CardContent>
            </Card>
          </div>
        </div>


        <div className="mb-16">
          <Typography variant="h2" className="text-center mb-4">
            Explore SpaceX Missions
          </Typography>
          <Typography variant="body1" color="secondary" className="text-center mb-12 max-w-2xl mx-auto">
            Comprehensive tools and insights to explore SpaceX&apos;s mission history, 
            track upcoming launches, and dive deep into space exploration data.
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={feature.onClick}>
                <CardContent className="p-8">
                  <div className="text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <Typography variant="h4" className="mb-3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="muted" className="mb-6">
                    {feature.description}
                  </Typography>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                    {feature.action}
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <Typography variant="h5" className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-green-500" />
                System Status
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                  <Globe className="h-3 w-3 mr-1" />
                  API Connected
                </Badge>
              </div>
              <Typography variant="body2" color="muted">
                Real-time data from SpaceX API v4
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}