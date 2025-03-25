import { redirect } from 'next/navigation';
import { checkRole } from '@/lib/roles';
import { fetchAllAIApps } from '@/actions/aiapps';
import { fetchAllLLM } from '@/actions/models';
import { AIAppList } from './_components/ai-app-list';

export default async function AIAppsPage() {
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    redirect('/')
  }

  const aiapps = await fetchAllAIApps();
  const llms = await fetchAllLLM();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">AI Applications Management</h1>
      <AIAppList aiapps={aiapps} llms={llms} />
    </div>
  );
}
