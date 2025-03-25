'use server'

import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Layers, Settings } from 'lucide-react';

import { checkRole } from '@/lib/roles';

export default async function AdminDashboard() {
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    redirect('/')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">LLM Models</CardTitle>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Manage your LLM models, add new models, or edit existing ones.</CardDescription>
            <Button asChild>
              <Link href="/admin/models">Manage Models</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">AI Applications</CardTitle>
            <Layers className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Manage your AI applications, add new apps, or edit existing ones.</CardDescription>
            <Button asChild>
              <Link href="/admin/aiapps">Manage AI Apps</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
