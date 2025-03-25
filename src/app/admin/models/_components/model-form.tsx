'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import TagsModelForm from '../../_components/tags-model-form';
import type { LLM } from '@/db/schema';
import { createLLM, updateLLM } from '@/actions/models';


interface ModelFormProps {
  initialData?: LLM;
  onSuccess?: () => void;
}

type ModelFormValues = Partial<LLM>;

export function ModelForm({ initialData }: ModelFormProps) {
  const router = useRouter();
  console.log(initialData);
  const form = useForm<ModelFormValues>({
    defaultValues: {
      ...initialData,
    }
  });

  const onSubmit = async (data: ModelFormValues) => {
    try {
      if (initialData) {
        console.log(data);
        await updateLLM({ slug: initialData.slug, data });
      } else {
        await createLLM(data);
      }
      // Navigate back to models list after successful submission
      router.push('/admin/models');
    } catch (error) {
      console.error('Error saving model:', error);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit' : 'Add New'} Model</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="GPT-4" />
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
                  <Input {...field} placeholder="gpt-4" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="openai" value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="created_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="api_access"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    API Access
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Check if this model has API access available
                  </p>
                </div>
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
                  <Textarea {...field} placeholder="Enter model description" value={field.value || ''} />
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

          {/* <FormField
            control={form.control}
            name="organization.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="OpenAI" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <TagsModelForm />

          {/* <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing Model</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricing.completion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Price</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="$0.01/1K tokens" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricing.image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Generation Price</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="$0.02/image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricing.prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt Price</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="$0.01/1K tokens" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricing.request"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Price</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="$0.0016/request" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricing.input"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input Token Cost</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.0001" min="0" placeholder="0.0001" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricing.output"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Output Token Cost</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.0001" min="0" placeholder="0.0002" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div> */}

          <Button type="submit" className="w-full">
            {
              `${initialData ? 'Update' : 'Create'} Model`
            }
          </Button>
        </form>
      </Form>
    </Card>
  );
}
