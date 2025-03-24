'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import Link from 'next/link';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { deleteLLM } from '@/actions/models';
import type { LLM } from '@/db/schema';
import { useState } from 'react';

export default function ModelList({ models }: { models?: LLM[] }) {
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleDelete = async (modelSlug: string) => {
    await deleteLLM({ slug: modelSlug });
    // Refresh the page to show updated data
    window.location.reload();
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortedModels = () => {
    if (!models) return [];

    return [...models].sort((a, b) => {
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let valueA;
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let valueB;

      switch (sortColumn) {
        case 'name':
          valueA = a.name?.toLowerCase() || '';
          valueB = b.name?.toLowerCase() || '';
          break;
        case 'date':
          valueA = a.created_date ? new Date(a.created_date).getTime() : 0;
          valueB = b.created_date ? new Date(b.created_date).getTime() : 0;
          break;
        case 'input_price':
          valueA = a.pricing_input || 0;
          valueB = b.pricing_output || 0;
          break;
        case 'output_price':
          valueA = a.pricing_output || 0;
          valueB = b.pricing_output || 0;
          break;
        default:
          valueA = a.name?.toLowerCase() || '';
          valueB = b.name?.toLowerCase() || '';
      }

      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      }
      return valueA < valueB ? 1 : -1;
    });
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return null;

    return sortDirection === 'asc' ?
      <ArrowUp className="ml-1 h-4 w-4 inline" /> :
      <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  return (
    <Card className="p-6 my-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">LLM Models</h2>
        <Button asChild>
          <Link href="/admin/models/new">Add New Model</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
              Name {renderSortIcon('name')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
              Release Date {renderSortIcon('date')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('input_price')}>
              Input Price ($) {renderSortIcon('input_price')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('output_price')}>
              Output Price ($) {renderSortIcon('output_price')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getSortedModels().map((model) => (
            <TableRow key={model.id}>
              <TableCell>{model.name}</TableCell>
              <TableCell>{model.created_date ? new Date(model.created_date).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>{model.pricing_input || 'N/A'}</TableCell>
              <TableCell>{model.pricing_output || 'N/A'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/admin/models/${model.slug}`}>Edit</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(model.slug)}
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
