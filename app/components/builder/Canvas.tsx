'use client';

import { useRef, useState, useEffect } from 'react';
import { useFormBuilder } from '../../hooks/useFormBuilder';
import FieldRenderer from './FieldRenderer';
import { FieldType, FormField } from '@/types/formField';

interface CanvasProps {
  draggingFieldType: FieldType | null;
}

export default function Canvas({ draggingFieldType }: CanvasProps) {
  const {
    fields,
    selectedFieldIds,
    addField,
    selectField,
    toggleFieldSelection,
    updateField,
    clearSelection,
  } = useFormBuilder();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const [isNewForm, setIsNewForm] = useState(true);
  
  // Grid configuration
  const GRID_SIZE = 20; // pixels per grid cell
  const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggingFieldType) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    let x = e.clientX - rect.left - 20;
    let y = e.clientY - rect.top - 20;

    // Snap to grid
    x = snapToGrid(x);
    y = snapToGrid(y);

    const defaultWidth = 400;
    const defaultHeight = 50;

    addField({
      type: draggingFieldType,
      name: `${draggingFieldType}-${Date.now()}`,
      x: x,
      y: y,
      width: defaultWidth,
      height: defaultHeight,
      required: false,
      readOnly: false,
    });
  };

  const handleFieldClick = (fieldId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Multi-select with Shift or Ctrl/Cmd
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      toggleFieldSelection(fieldId);
    } else {
      selectField(fieldId);
    }
  };

  const handleCanvasClick = () => {
    clearSelection();
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    updateField(fieldId, updates);
  };

  const handleFieldDragStart = (fieldId: string) => {
    selectField(fieldId);
    setDraggingFieldId(fieldId);
  };

  const handleFieldDrag = (fieldId: string, currentX: number, currentY: number) => {
    if (draggingFieldId !== fieldId) return;
    
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    // Snap to grid
    const newX = snapToGrid(Math.max(0, currentX));
    const newY = snapToGrid(Math.max(0, currentY));

    updateField(fieldId, {
      x: newX,
      y: newY,
    });
  };

  const handleFieldDragEnd = () => {
    setDraggingFieldId(null);
  };

  useEffect(() => {
    if (fields.length > 0) {
      setIsNewForm(false);
    }
  }, [fields]);

  return (
    <div className="flex-1 flex flex-col relative bg-gray-50 overflow-hidden">
      <div
        ref={canvasRef}
        className="flex-1 overflow-auto p-8"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
        style={{ backgroundColor: '#f9fafb' }}
      >
        <div
          className="relative bg-white shadow-lg mx-auto min-h-full"
          style={{
            width: '800px',
            padding: '40px',
          }}
        >
          {fields.length === 0 ? (
            <div className="flex items-center justify-center h-96 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <div className="text-lg mb-2">📝 Start Building Your Form</div>
                <div className="text-sm">Drag form fields from the left sidebar onto this canvas</div>
              </div>
            </div>
          ) : (
            <div className="relative" style={{ minHeight: '100%' }}>
              {/* Render fields */}
              {fields.map((field) => (
                <FieldRenderer
                  key={field.id}
                  field={field}
                  isSelected={selectedFieldIds.includes(field.id)}
                  onClick={handleFieldClick.bind(null, field.id)}
                  onDrag={handleFieldDrag}
                  onDragStart={handleFieldDragStart}
                  onDragEnd={handleFieldDragEnd}
                  onUpdate={(updates) => handleFieldUpdate(field.id, updates)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
