'use client';

import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AiApp, LLM } from '@/db/schema';
import { createAIApp, updateAIApp } from '@/actions/aiapps';
import { useRouter } from 'next/navigation';

interface Props {
  llms: LLM[];
  initialData?: AiApp;
  onSuccess?: () => void;
}

type AIAppFormValues = Partial<AiApp>;

export function AIAppForm({ initialData, llms, onSuccess }: Props) {
  const form = useForm<AIAppFormValues>({
    defaultValues: {
      ...initialData,
    }
  });
  const router = useRouter();

  const onSubmit = async (data: AIAppFormValues) => {
    try {
      if (initialData?.id) {
        await updateAIApp({ slug: initialData.slug, data });
      } else {
        await createAIApp(data);
      }
      router.push('/admin/aiapps');
    } catch (error) {
      console.error('Error managing AI app:', error);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit' : 'Add New'} AI Application</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ChatGPT" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter application description" value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} type="url" placeholder="https://example.com" value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input {...field} type="url" placeholder="https://example.com/image.png" value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="my-ai-app" value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="llms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LLMs</FormLabel>
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {field.value?.length
                          ? `${field.value.length} LLMs selected`
                          : "Select LLMs"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {llms?.map((llm) => (
                        <DropdownMenuCheckboxItem
                          key={llm.id}
                          checked={field.value?.some(field => field.id === llm.id)}
                          onCheckedChange={(checked) => {
                            const value = field.value || [];
                            if (checked) {
                              field.onChange([...value, llm]);
                            } else {
                              field.onChange(value.filter((item) => item.id !== llm.id));
                            }
                          }}
                        >
                          {llm.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}


          <Button type="submit" className="w-full">
            {initialData ? 'Update' : 'Create'} AI Application
          </Button>
        </form>
      </Form>
    </Card>
  );
}
