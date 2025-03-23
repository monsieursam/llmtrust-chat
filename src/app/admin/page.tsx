'use server'

import { redirect } from 'next/navigation';

import { checkRole } from '@/lib/roles';
import AdminClient from './_components/admin-client';


export default async function AdminDashboard() {
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    redirect('/')
  }

  return (

    <div className="container mx-auto p-4">
      <AdminClient />
    </div>
  );
}
