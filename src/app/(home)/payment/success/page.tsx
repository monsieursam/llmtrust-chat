'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const previousPage = localStorage.getItem('previousPage');
    if (previousPage) {
      router.push(previousPage);
      localStorage.removeItem('previousPage');
    } else {
      router.push('/'); // Fallback to home page if no previous page is stored
    }
  }, []);

  return <div>Payment successful! Redirecting...</div>;
}
