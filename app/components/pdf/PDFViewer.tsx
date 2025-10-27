'use client';

import { useState, useEffect } from 'react';

interface PDFViewerProps {
  pdfUrl: string | null;
  width?: number;
  onLoadSuccess?: (numPages: number) => void;
}

export default function PDFViewer({ pdfUrl, width = 600, onLoadSuccess }: PDFViewerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (pdfUrl && onLoadSuccess) {
      onLoadSuccess(1); // Assume single page for now
    }
  }, [pdfUrl, onLoadSuccess]);

  if (!isMounted || !pdfUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded">
        <p className="text-gray-500">No PDF loaded</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <object
        data={pdfUrl}
        type="application/pdf"
        width={width}
        height="100%"
        style={{ pointerEvents: 'none' }}
        className="select-none"
      >
        <div className="flex items-center justify-center h-full text-gray-500">
          PDF preview not available
        </div>
      </object>
    </div>
  );
}

