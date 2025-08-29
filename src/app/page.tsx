'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography,
  Skeleton
} from '@/components';
import { useLaunches, useUpcomingLaunches } from '@/lib/hooks/useLaunches';
import { 
  Rocket, 
  Calendar, 
  ChevronRight,
  CheckCircle,
  Clock,
  BarChart2,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  loading?: boolean;
  className?: string;
}

const StatCard = ({ icon, value, label, loading = false, className = '' }: StatCardProps) => {
  const [, setVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById(`stat-${label.toLowerCase().replace(/\s+/g, '-')}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [label]);

  return (
    <div 
      id={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className={cn("bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden", className)}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-gray-50 text-gray-700">
            {icon}
          </div>
          <div>
            <Typography variant="h3" className="text-2xl font-semibold text-gray-900">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : typeof value === 'number' || !isNaN(Number(value)) ? (
                <CountUp 
                  end={Number(value)} 
                  duration={2.5} 
                  separator=","
                  decimals={typeof value === 'string' && value.includes('%') ? 1 : 0}
                  decimal="."
                  suffix={typeof value === 'string' && value.includes('%') ? '%' : ''}
                />
              ) : (
                value
              )}
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              {label}
            </Typography>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const { data: allLaunches, isLoading: allLoading } = useLaunches();
  const { data: upcomingLaunches, isLoading: upcomingLoading } = useUpcomingLaunches();

  const stats = [
    {
      icon: <Rocket className="h-6 w-6" />,
      value: allLaunches?.length?.toLocaleString() || '0',
      label: 'Total Launches',
      loading: allLoading,
      className: 'border-t-4 border-blue-500'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      value: upcomingLaunches?.length?.toString() || '0',
      label: 'Upcoming',
      loading: upcomingLoading,
      className: 'border-t-4 border-purple-500'
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      value: allLaunches?.filter(l => l.success === true).length?.toLocaleString() || '0',
      label: 'Successful',
      loading: allLoading,
      className: 'border-t-4 border-green-500'
    },
    {
      icon: <BarChart2 className="h-6 w-6" />,
      value: allLaunches?.length 
        ? `${Math.round((allLaunches.filter(l => l.success === true).length / allLaunches.filter(l => l.success !== null).length) * 100)}%` 
        : '0%',
      label: 'Success Rate',
      loading: allLoading,
      className: 'border-t-4 border-orange-500'
    }
  ];

  const features = [
    {
      icon: <Rocket className="h-8 w-8 text-blue-600" />,
      title: "Launch Explorer",
      description: "Browse all SpaceX launches with advanced filtering and search capabilities",
      action: "Explore Launches",
      onClick: () => router.push('/launches'),
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
      title: "Upcoming Missions",
      description: "Stay updated with upcoming SpaceX missions and launch schedules",
      action: "View Upcoming",
      onClick: () => router.push('/launches?upcoming=true'),
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: <Star className="h-8 w-8 text-amber-500" />,
      title: "Mission Favorites",
      description: "Save and track your favorite SpaceX missions and launches",
      action: "Manage Favorites",
      onClick: () => router.push('/favorites'),
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
              Live SpaceX Data
            </div>
            <Typography 
              variant="h1" 
              align="center"
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              SpaceX Mission Tracker
            </Typography>
            <Typography 
              variant="subtitle1" 
              align="center"
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Track and explore SpaceX launches with real-time mission data and detailed insights.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3"
                onClick={() => router.push('/launches')}
              >
                <Rocket className="mr-2 h-5 w-5" />
                View All Launches
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8 py-3"
                onClick={() => router.push('/launches?upcoming=true')}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Missions
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <Typography variant="h2" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Mission Statistics
              </Typography>
              <Typography variant="body1" className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive data on SpaceX launches and mission success rates
              </Typography>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  loading={stat.loading}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Typography variant="h2" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Explore Space Missions
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                Discover and track SpaceX missions with our comprehensive tools and data
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className="h-full border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer"
                  onClick={feature.onClick}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <Typography variant="h3" className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </Typography>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium">
                      <span>{feature.action}</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}