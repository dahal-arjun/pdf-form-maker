import { PDFDocument, rgb, PDFTextField, PDFCheckBox, PDFRadioGroup } from 'pdf-lib';
import { FormField } from '@/types/formField';

/**
 * Create a blank PDF with specified dimensions
 */
export async function createBlankPdf(width: number, height: number): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([width, height]);
  return await pdfDoc.save();
}

/**
 * Create a simple PDF from form fields
 */
export async function createFillablePdf(
  pdfBytes: Uint8Array | null,
  fields: FormField[]
): Promise<Uint8Array> {
  // Create a simple PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size: 8.5" x 11"
  
  const pageHeight = page.getHeight(); // 792
  const pageWidth = page.getWidth();   // 612

  // Add title at top
  try {
    page.drawText('Form Builder Export', {
      x: 50,
      y: pageHeight - 40,
      size: 14,
    });
  } catch (e) {
    console.error('Error drawing title:', e);
  }

  const form = pdfDoc.getForm();

  // Create actual fillable form fields
  for (const field of fields) {
    // Canvas coordinates are top-left, PDF coordinates are bottom-left
    // Convert: PDF y = pageHeight - canvas y - field height
    
    let pdfX = field.x;
    let pdfY = pageHeight - field.y - field.height;
    
    // Ensure coordinates are within bounds
    pdfX = Math.max(10, Math.min(pageWidth - 60, pdfX));
    pdfY = Math.max(10, Math.min(pageHeight - 10, pdfY));
    
    // Ensure dimensions are reasonable
    const fieldWidth = Math.min(pageWidth - pdfX - 10, Math.max(20, field.width));
    const fieldHeight = Math.max(15, field.height);

    try {
      // Create actual form fields based on type
      switch (field.type) {
        case 'text':
        case 'textarea':
        case 'email':
        case 'phone':
        case 'number':
        case 'date':
          const textField = form.createTextField(field.name);
          textField.addToPage(page, {
            x: pdfX,
            y: pdfY,
            width: fieldWidth,
            height: fieldHeight,
          });
          if (field.required) textField.enableRequired();
          if (field.readOnly) textField.enableReadOnly();
          if (field.type === 'textarea') textField.enableMultiline();
          break;
        
        case 'select':
          const selectField = form.createDropdown(field.name);
          selectField.addToPage(page, {
            x: pdfX,
            y: pdfY,
            width: fieldWidth,
            height: fieldHeight,
          });
          if (field.options && field.options.length > 0) {
            field.options.forEach(opt => selectField.addOptions([opt]));
          }
          if (field.required) selectField.enableRequired();
          break;
        
        case 'checkbox':
          const checkbox = form.createCheckBox(field.name);
          checkbox.addToPage(page, {
            x: pdfX,
            y: pdfY,
            width: fieldHeight,
            height: fieldHeight,
          });
          if (field.required) checkbox.enableRequired();
          break;
        
        case 'radio':
          const radioName = field.radioGroup || field.name;
          const radio = form.createRadioGroup(radioName);
          radio.addOptionToPage(field.label || field.name, page, {
            x: pdfX,
            y: pdfY,
            width: fieldHeight,
            height: fieldHeight,
          });
          if (field.required) radio.enableRequired();
          break;
      }
    } catch (e) {
      console.warn(`Could not create field ${field.name}:`, e);
      // Fallback: just draw a rectangle
      page.drawRectangle({
        x: pdfX,
        y: pdfY,
        width: fieldWidth,
        height: fieldHeight,
        borderColor: rgb(0, 0, 1),
        borderWidth: 1,
        opacity: 0.2,
      });
    }
  }

  return await pdfDoc.save();
}

/**
 * Load PDF file as Uint8Array
 */
export async function loadPdfFile(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
