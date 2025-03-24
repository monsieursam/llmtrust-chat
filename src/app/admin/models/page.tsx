'use server'

import { redirect } from 'next/navigation';
import { checkRole } from '@/lib/roles';
import { fetchAllLLM } from '@/actions/models';
import ModelList from '../_components/model-list';

export default async function ModelsPage() {
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    redirect('/')
  }

  const models = await fetchAllLLM();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Models Management</h1>
      <ModelList models={models} />
    </div>
  );
}
