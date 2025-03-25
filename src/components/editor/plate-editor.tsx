'use client';

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate, type PlateEditor as PlateEditorType } from '@udecode/plate/react';

import { SettingsDialog } from '@/components/editor/settings';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import type { Value } from '@udecode/plate';

interface Props {
  editor: PlateEditorType;
  onChange?: ({ value }: { value: Value }) => void;
  readOnly?: boolean;
  variant?: "default" | "review" | "demo" | "select" | null | undefined;
}

export function PlateEditor({ editor, onChange, readOnly, variant }: Props) {
  return (
    <Plate editor={editor} onChange={onChange} readOnly={readOnly}>
      <EditorContainer variant={variant || 'default'}>
        <Editor variant={variant || 'default'} />
      </EditorContainer>
      <SettingsDialog />
    </Plate>
  );
}
