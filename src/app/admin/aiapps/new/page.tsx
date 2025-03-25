'use server'

import { redirect } from 'next/navigation';
import { checkRole } from '@/lib/roles';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchAllLLM } from '@/actions/models';
import { AIAppForm } from '../_components/ai-app-form';

export default async function NewAIAppPage() {
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    redirect('/')
  }

  const llms = await fetchAllLLM();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button variant="outline" asChild>
          <Link href="/admin/aiapps">Back to AI Apps</Link>
        </Button>
      </div>
      <AIAppForm llms={llms} />
    </div>
  );
}
