'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import { Container } from '@/components/atoms/Container';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="space-y-4">
        <Typography variant="h1" className="text-6xl font-bold tracking-tight">
          404
        </Typography>
        <Typography variant="h2" className="text-3xl font-semibold">
          Page Not Found
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <div className="mt-6">
          <Button
            onClick={() => router.push('/')}
            className="px-6 py-3"
          >
            Return Home
          </Button>
        </div>
      </div>
    </Container>
  );
}
