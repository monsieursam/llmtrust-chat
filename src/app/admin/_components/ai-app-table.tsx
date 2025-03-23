import { useState } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { AIAppForm } from './ai-app-form';
import type { AiApp, LLM } from '@/db/schema';
import { fetchAllLLM } from '@/actions/models';
import { deleteAIApp, fetchAllAIApps } from '@/actions/aiapps';

interface Props {
  llms: LLM[];
}

export async function AIAppTable() {
  // const { data: aiapps } = useAIApps();
  const aiapps = await fetchAllAIApps();
  const llms = await fetchAllLLM();
  const [addNewAIApp, setAddNewAIApp] = useState<boolean>(false);
  const [editingAIApp, setEditingAIApp] = useState<AiApp | null>(null);

  const handleEdit = (aiapp: AiApp) => {
    setEditingAIApp(aiapp);
  };

  const handleDelete = (slug: string) => {
    deleteAIApp({ slug });
  };

  if (editingAIApp || addNewAIApp) {
    return (
      <div>
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => {
            setEditingAIApp(null);
            setAddNewAIApp(false);
          }}
        >
          Back to List
        </Button>
        <AIAppForm initialData={editingAIApp || undefined} llms={llms || []} onSuccess={() => {
          setEditingAIApp(null);
          setAddNewAIApp(false);
        }} />
      </div>
    );
  }

  return (
    <Card className="p-6 my-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">AI Applications</h2>
        <Button onClick={() => setAddNewAIApp(true)}>
          Add New AI App
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
                    onClick={() => handleEdit(aiapp)}
                  >
                    Edit
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
