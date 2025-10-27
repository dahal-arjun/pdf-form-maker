'use client';

import { FormField } from '@/types/formField';
import { MouseEvent, useState, useEffect } from 'react';

interface FieldRendererProps {
  field: FormField;
  isSelected: boolean;
  onClick: (e: MouseEvent) => void;
  onDrag: (fieldId: string, currentX: number, currentY: number) => void;
  onDragStart: (fieldId: string) => void;
  onDragEnd: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function FieldRenderer({ field, isSelected, onClick, onDrag, onDragStart, onDragEnd, onUpdate }: FieldRendererProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // Don't start dragging if clicking on input elements
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
      return;
    }
    
    e.stopPropagation();
    setIsDragging(true);
    setMouseOffset({
      x: e.clientX - field.x,
      y: e.clientY - field.y,
    });
    onDragStart(field.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - mouseOffset.x;
      const newY = e.clientY - mouseOffset.y;
      
      onDrag(field.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd();
    };

    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, field.id, mouseOffset, onDrag, onDragEnd]);

  const containerStyles = {
    cursor: isDragging ? 'grabbing' : 'grab',
    pointerEvents: 'all' as const,
  };

  const renderFieldPreview = () => {
    const commonInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const labelClasses = "block text-sm font-medium text-gray-700";

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div className="space-y-2">
            <label className={labelClasses}>
              {field.label || field.name}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder || `Enter ${field.type}...`}
              className={commonInputClasses}
              disabled
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-2">
            <label className={labelClasses}>
              {field.label || field.name}
            </label>
            <textarea
              placeholder={field.placeholder || "Enter text..."}
              rows={4}
              className={commonInputClasses}
              disabled
            />
          </div>
        );
      
      case 'number':
        return (
          <div className="space-y-2">
            <label className={labelClasses}>
              {field.label || field.name}
            </label>
            <input
              type="number"
              placeholder={field.placeholder || "Enter a number..."}
              className={commonInputClasses}
              disabled
            />
          </div>
        );
      
      case 'date':
        return (
          <div className="space-y-2">
            <label className={labelClasses}>
              {field.label || field.name}
            </label>
            <input
              type="date"
              className={commonInputClasses}
              disabled
            />
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-2">
            <label className={labelClasses}>
              {field.label || field.name}
            </label>
            <select className={commonInputClasses} disabled>
              <option>{field.placeholder || "Select an option..."}</option>
              {field.options?.map((opt, idx) => (
                <option key={idx}>{opt}</option>
              ))}
            </select>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled
            />
            <label className="text-sm font-medium text-gray-700">
              {field.label || field.name}
            </label>
          </div>
        );
      
      case 'radio':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name={field.radioGroup}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              disabled
            />
            <label className="text-sm font-medium text-gray-700">
              {field.label || field.name}
            </label>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isEditing && isSelected) {
    return (
      <div
        style={{
          position: 'absolute',
          left: `${field.x}px`,
          top: `${field.y}px`,
          width: `${Math.max(field.width, 300)}px`,
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              defaultValue={field.label || ''}
              placeholder="Field label"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              onBlur={(e) => {
                onUpdate({ label: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdate({ label: e.currentTarget.value });
                  e.currentTarget.blur();
                }
                if (e.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              defaultValue={field.placeholder || ''}
              placeholder="Placeholder text"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              onBlur={(e) => {
                onUpdate({ placeholder: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdate({ placeholder: e.currentTarget.value });
                  e.currentTarget.blur();
                }
                if (e.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Done
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        style={{
          ...containerStyles,
          position: 'absolute',
          left: `${field.x}px`,
          top: `${field.y}px`,
          width: `${field.width}px`,
        }}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        className="group"
      >
        {/* Selection border */}
        <div 
          className="absolute inset-0 pointer-events-none rounded"
          style={{
            border: isSelected ? '2px solid #3b82f6' : '2px dashed #d1d5db',
            borderRadius: '8px',
            backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
            margin: '-4px',
            transition: 'all 0.2s',
          }}
        />
        
        {/* Field preview */}
        <div className="pointer-events-none relative" style={{ zIndex: 1 }}>
          {renderFieldPreview()}
        </div>
        
        {/* Drag handle indicators */}
        {isSelected && (
          <>
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow pointer-events-none z-10" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow pointer-events-none z-10" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow pointer-events-none z-10" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow pointer-events-none z-10" />
          </>
        )}
      </div>
      
      {/* Info label */}
      {isSelected && (
        <div 
          className="absolute px-2 py-1 text-xs bg-blue-600 text-white rounded shadow-lg pointer-events-none"
          style={{
            top: `${field.y - 24}px`,
            left: `${field.x}px`,
            zIndex: 1001,
          }}
        >
          {field.name}
        </div>
      )}
    </>
  );
}
