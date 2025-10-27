'use client';

import { useFormBuilder } from '../../hooks/useFormBuilder';
import { createFillablePdf } from '../../lib/pdfUtils';
import { useState } from 'react';

export default function PDFExporter() {
  const { fields } = useFormBuilder();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (fields.length === 0) {
      return;
    }

    setIsExporting(true);
    try {
      const fillablePdfBytes = await createFillablePdf(null, fields);

      // Create download link
      const blob = new Blob([fillablePdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `form-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">
          {fields.length} field{fields.length !== 1 ? 's' : ''} added
        </p>
      </div>
      <button
        onClick={handleExport}
        disabled={isExporting || fields.length === 0}
        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {isExporting ? 'Exporting...' : 'Export Form'}
      </button>
    </div>
  );
}

