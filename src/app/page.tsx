
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This is the new root page, which will immediately redirect to the welcome page.
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/welcome');
  }, [router]);

  // You can render a loading spinner here if needed,
  // but the redirect should be almost instantaneous.
  return null;
}
