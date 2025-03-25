import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import type { AiApp, LLM } from '@/db/schema';
import { fetchAllLLM } from '@/actions/models';
import { deleteAIApp, fetchAllAIApps } from '@/actions/aiapps';
import Link from 'next/link';

interface Props {
  llms: LLM[];
  aiapps: AiApp[];
}

export async function AIAppList({ aiapps }: Props) {
  const handleDelete = (slug: string) => {
    deleteAIApp({ slug });
  };

  return (
    <Card className="p-6 my-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">AI Applications</h2>
        <Button>
          <Link href={'/admin/models/new'}>New</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {aiapps?.map((aiapp) => (
            <TableRow key={aiapp.id}>
              <TableCell>{aiapp.name}</TableCell>
              <TableCell>{aiapp.status}</TableCell>
              <TableCell>{new Date(aiapp?.createdAt || '').toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Link href={`/admin/aiapps/${aiapp.slug}`}>Edit</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(aiapp.slug || '')}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
