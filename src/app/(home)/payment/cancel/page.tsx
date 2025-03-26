'use client'
import { useRouter } from 'next/navigation';
// pages/success.tsx
import { useEffect } from 'react';

export default function PaymentPage() {
  const router = useRouter();

  useEffect(() => {
    const previousPage = localStorage.getItem('previousPage');

    console.log(previousPage);
    if (previousPage) {
      router.push(previousPage);
      localStorage.removeItem('previousPage');
    } else {
      router.push('/'); // Fallback to home page if no previous page is stored
    }
  }, []);

  return <div>Payment cancel! Redirecting...</div>;
}
