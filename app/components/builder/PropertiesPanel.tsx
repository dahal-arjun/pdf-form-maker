'use client';

import { useFormBuilder } from '../../hooks/useFormBuilder';
import { FormField } from '@/types/formField';

export default function PropertiesPanel() {
  const { fields, selectedFieldIds, updateField, deleteField } = useFormBuilder();
  const selectedField = fields.find((f) => selectedFieldIds.includes(f.id));

  if (!selectedField) {
    return (
      <div className="bg-white border-l border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <p className="text-gray-500 text-sm">Select a field to edit properties</p>
      </div>
    );
  }

  const handleUpdate = (property: keyof FormField, value: any) => {
    updateField(selectedField.id, { [property]: value });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this field?')) {
      deleteField(selectedField.id);
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Properties</h2>
        <button
          onClick={handleDelete}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
          <input
            type="text"
            value={selectedField.type}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={selectedField.name}
            onChange={(e) => handleUpdate('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter field name"
          />
          <p className="text-xs text-gray-500 mt-1">
            Internal identifier (must be unique)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
          <input
            type="text"
            value={selectedField.label || ''}
            onChange={(e) => handleUpdate('label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Field label (optional)"
          />
        </div>

        {selectedField.type !== 'checkbox' && selectedField.type !== 'radio' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Value</label>
            <input
              type="text"
              value={selectedField.defaultValue || ''}
              onChange={(e) => handleUpdate('defaultValue', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Default value (optional)"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                value={Math.round(selectedField.x)}
                onChange={(e) => handleUpdate('x', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="X"
              />
              <label className="text-xs text-gray-500 mt-1 block">X (points)</label>
            </div>
            <div>
              <input
                type="number"
                value={Math.round(selectedField.y)}
                onChange={(e) => handleUpdate('y', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="Y"
              />
              <label className="text-xs text-gray-500 mt-1 block">Y (points)</label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                value={Math.round(selectedField.width)}
                onChange={(e) => handleUpdate('width', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="Width"
              />
              <label className="text-xs text-gray-500 mt-1 block">Width (points)</label>
            </div>
            <div>
              <input
                type="number"
                value={Math.round(selectedField.height)}
                onChange={(e) => handleUpdate('height', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="Height"
              />
              <label className="text-xs text-gray-500 mt-1 block">Height (points)</label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedField.required}
              onChange={(e) => handleUpdate('required', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Required</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedField.readOnly}
              onChange={(e) => handleUpdate('readOnly', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Read Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}

