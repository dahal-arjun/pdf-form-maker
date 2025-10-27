'use client';

import { useState, useEffect } from 'react';
import { useFormBuilder } from './hooks/useFormBuilder';
import FieldPalette from './components/builder/FieldPalette';
import Canvas from './components/builder/Canvas';
import PDFExporter from './components/pdf/PDFExporter';
import { FieldType } from '@/types/formField';

export default function Home() {
  const { clearAll, selectedFieldIds, deleteSelectedFields } = useFormBuilder();
  const [draggingFieldType, setDraggingFieldType] = useState<FieldType | null>(null);

  const handleDeleteSelected = () => {
    if (selectedFieldIds.length > 0) {
      deleteSelectedFields();
    }
  };

  // Keyboard support for delete (only when not editing inputs)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only delete if not typing in an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      
      if (!isInput && (e.key === 'Delete' || e.key === 'Backspace') && selectedFieldIds.length > 0) {
        e.preventDefault();
        deleteSelectedFields();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedFieldIds, deleteSelectedFields]);

  const handleNewForm = () => {
    clearAll();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
        </div>
        <div className="flex items-center gap-3">
          {selectedFieldIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
            >
              Delete ({selectedFieldIds.length})
            </button>
          )}
        </div>
      </div>
      
      <PDFExporter />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Field Palette */}
        <FieldPalette onDragStart={setDraggingFieldType} />

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col relative">
          <div className="bg-white border-b border-gray-200 p-2 flex justify-between items-center">
            <span className="text-sm text-gray-600 px-4">Form Builder</span>
            <button
              onClick={handleNewForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
              New Form
            </button>
          </div>
          <Canvas draggingFieldType={draggingFieldType} />
        </div>
      </div>
    </div>
  );
}
