'use server'

import { redirect } from 'next/navigation';
import { checkRole } from '@/lib/roles';
import { ModelForm } from '../../_components/model-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function NewModelPage() {
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    redirect('/')
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button variant="outline" asChild>
          <Link href="/admin/models">Back to Models</Link>
        </Button>
      </div>
      <ModelForm />
    </div>
  );
}
