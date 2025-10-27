'use client';

import { useState } from 'react';
import { FieldType } from '@/types/formField';

interface FieldPaletteProps {
  onDragStart: (fieldType: FieldType) => void;
}

export default function FieldPalette({ onDragStart }: FieldPaletteProps) {
  const [draggingType, setDraggingType] = useState<FieldType | null>(null);

  const fieldTypes: Array<{ type: FieldType; label: string; icon: string }> = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'textarea', label: 'Text Area', icon: '📄' },
    { type: 'email', label: 'Email', icon: '📧' },
    { type: 'phone', label: 'Phone', icon: '📞' },
    { type: 'number', label: 'Number', icon: '🔢' },
    { type: 'date', label: 'Date', icon: '📅' },
    { type: 'select', label: 'Dropdown', icon: '📋' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { type: 'radio', label: 'Radio Button', icon: '🔘' },
  ];

  const handleMouseDown = (fieldType: FieldType) => {
    setDraggingType(fieldType);
    onDragStart(fieldType);
  };

  const handleMouseUp = () => {
    setDraggingType(null);
  };

  return (
    <div className="bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Add Form Fields</h2>
      <div className="space-y-2">
        {fieldTypes.map((field) => (
          <div
            key={field.type}
            draggable
            onMouseDown={() => handleMouseDown(field.type)}
            onMouseUp={handleMouseUp}
            className={`
              flex items-center gap-2 p-3 rounded-lg border-2 cursor-move transition
              ${
                draggingType === field.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <span className="text-2xl">{field.icon}</span>
            <span className="text-sm font-medium text-gray-700">{field.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

