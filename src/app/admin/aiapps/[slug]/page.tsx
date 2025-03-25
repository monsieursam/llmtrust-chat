'use server'

import { redirect } from 'next/navigation';
import { checkRole } from '@/lib/roles';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchAllLLM } from '@/actions/models';
import { fetchOneAIApp } from '@/actions/aiapps';
import { AIAppForm } from '../_components/ai-app-form';

interface EditAIAppPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditAIAppPage({ params }: EditAIAppPageProps) {
  const isAdmin = await checkRole('admin');
  const { slug } = await params;

  if (!isAdmin) {
    redirect('/')
  }

  const aiapp = await fetchOneAIApp(slug);
  const llms = await fetchAllLLM();

  if (!aiapp) {
    redirect('/admin/aiapps');
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button variant="outline" asChild>
          <Link href="/admin/aiapps">Back to AI Apps</Link>
        </Button>
      </div>
      <AIAppForm initialData={aiapp} llms={llms} />
    </div>
  );
}
