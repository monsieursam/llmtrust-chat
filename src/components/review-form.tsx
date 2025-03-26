'use client';

import React, { useState } from 'react';
import { Loader, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton, useAuth } from '@clerk/nextjs';
import { PlateEditor } from '@/components/editor/plate-editor';

import { useForm } from 'react-hook-form';
import type { Value } from '@udecode/plate';
import { useCreateEditor } from '@/components/editor/use-create-editor';
import { Form, FormControl, FormField } from '@/components/ui/form';
import { SettingsProvider } from '@/components/editor/settings';
import { useRouter } from 'next/navigation';
import { SheetClose, SheetFooter } from '@/components/ui/sheet';
import type { ReviewType } from '@/app/api/reviews/types';
import { toast } from 'sonner';
import { createReview } from '@/actions/reviews';

interface ReviewFormProps {
  id: string;
  type: ReviewType;
  slug: string;
}

interface FormData {
  content: Value;
};

export function ReviewForm({ type, slug }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const editor = useCreateEditor({});
  const form = useForm<FormData>({
    defaultValues: {
    },
  });


  const onClickButton = async () => {
    const value = form.getValues();

    await createReview({
      slug,
      type: type,
      body: {
        content: value.content,
        rating: rating,
      }
    });

    toast(
      'Thank you for your review!',
    );

    router.push(`/${type}/${slug}`);

  };

  return (
    <div>
      {isLoaded && !isSignedIn ? (
        <div className="text-center py-6">
          <p className="mb-4">Please sign in to share your experience with this model.</p>
          <SignInButton />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="block font-medium mb-2">Rating</div>
            <p className="text-sm mb-3">How would you rate your overall experience with this model?</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type='button'
                  onClick={() => setRating(value)}
                  className="focus:outline-none p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${value <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="block font-medium mb-2">Your Review</div>
            <p className="text-sm mb-3">Share your experience with this model. Consider discussing:</p>
            <ul className="text-sm mb-4 list-disc pl-5">
              <li>Performance and reliability</li>
              <li>Ease of use and integration</li>
              <li>Specific use cases and results</li>
              <li>Areas for improvement</li>
            </ul>
            <div className="min-h-[250px] border rounded-lg" data-registry="plate">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <SettingsProvider>
                      <FormControl>
                        <PlateEditor editor={editor} onChange={({ value }) => {
                          field.onChange(value);
                        }} />
                      </FormControl>
                    </SettingsProvider>
                  )}
                />
              </Form>
            </div>
          </div>

          <SheetClose asChild onClick={onClickButton}>
            <Button
              size={'lg'}
              className="w-full"
              disabled={rating === 0}
            >
              Submit Review
            </Button>
          </SheetClose>
        </>
      )}
    </div>
  );
}
