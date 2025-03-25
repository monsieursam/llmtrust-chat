'use client';

import React from 'react';

import type { PlateContentProps } from '@udecode/plate/react';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@udecode/cn';
import {
  PlateContent,
  useEditorContainerRef,
  useEditorRef,
} from '@udecode/plate/react';
import { cva } from 'class-variance-authority';

const editorContainerVariants = cva(
  'relative w-full cursor-text caret-primary select-text selection:bg-brand/25 focus-visible:outline-none [&_.slate-selection-area]:z-50 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-brand/25 [&_.slate-selection-area]:bg-brand/15',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'h-full',
        review: 'cursor-default',
        demo: 'h-[650px]',
        select: cn(
          'group rounded-md border border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          'has-data-readonly:w-fit has-data-readonly:cursor-default has-data-readonly:border-transparent has-data-readonly:focus-within:[box-shadow:none]'
        ),
      },
    },
  }
);

export const EditorContainer = ({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof editorContainerVariants>) => {
  const editor = useEditorRef();
  const containerRef = useEditorContainerRef();

  return (
    <div
      id={editor.uid}
      ref={containerRef}
      className={cn(
        'ignore-click-outside/toolbar',
        editorContainerVariants({ variant }),
        className
      )}
      {...props}
    />
  );
};

EditorContainer.displayName = 'EditorContainer';

const editorVariants = cva(
  cn(
    'group/editor',
    'relative w-full cursor-text break-words whitespace-pre-wrap select-text',
    'rounded-md ring-offset-background focus-visible:outline-none',
    'placeholder:text-muted-foreground/80 **:data-slate-placeholder:top-[auto_!important] **:data-slate-placeholder:text-muted-foreground/80 **:data-slate-placeholder:opacity-100!',
    '[&_strong]:font-bold'
  ),
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      disabled: {
        true: 'cursor-not-allowed opacity-50',
      },
      focused: {
        true: 'ring-2 ring-ring ring-offset-2',
      },
      variant: {
        ai: 'w-full px-0 text-base md:text-sm',
        aiChat:
          'max-h-[min(70vh,320px)] w-full max-w-[700px] overflow-y-auto px-3 py-2 text-base md:text-sm',
        default:
          'size-full pt-4 pb-14 text-base px-8',
        review: '',
        demo: 'size-full px-16 pt-4 pb-72 text-base sm:px-[max(64px,calc(50%-350px))]',
        fullWidth: 'size-full px-16 pt-4 pb-72 text-base sm:px-24',
        none: '',
        select: 'px-3 py-2 text-base data-readonly:w-fit',
      },
    },
  }
);

export type EditorProps = PlateContentProps &
  VariantProps<typeof editorVariants>;

export const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
  ({ className, disabled, focused, variant, ...props }, ref) => {
    return (
      <PlateContent
        ref={ref}
        className={cn(
          editorVariants({
            disabled,
            focused,
            variant,
          }),
          className
        )}
        disabled={disabled}
        disableDefaultStyles
        {...props}
      />
    );
  }
);

Editor.displayName = 'Editor';
