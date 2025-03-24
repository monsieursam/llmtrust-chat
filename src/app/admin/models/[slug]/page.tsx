'use server'

import { redirect } from 'next/navigation';
import { checkRole } from '@/lib/roles';
import { ModelForm } from '../../_components/model-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchOneLLM } from '@/actions/models';

interface EditModelPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditModelPage({ params }: EditModelPageProps) {
  const isAdmin = await checkRole('admin');
  const { slug } = await params;

  if (!isAdmin) {
    redirect('/')
  }

  const model = await fetchOneLLM(slug);

  if (!model) {
    redirect('/admin/models');
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button variant="outline" asChild>
          <Link href="/admin/models">Back to Models</Link>
        </Button>
      </div>
      <ModelForm initialData={model} />
    </div>
  );
}
