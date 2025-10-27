export type FieldType = 'text' | 'textarea' | 'checkbox' | 'radio';

export interface FormField {
  id: string;
  type: FieldType;
  name: string;
  x: number; // Position in PDF points (72 DPI)
  y: number;
  width: number;
  height: number;
  label?: string;
  defaultValue?: string;
  required: boolean;
  readOnly: boolean;
  options?: string[]; // For radio buttons
  radioGroup?: string; // Group name for radio buttons
}

export interface FormBuilderState {
  fields: FormField[];
  selectedFieldId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  pdfFile: File | null;
  pdfDocument: any | null;
  currentPage: number;
  totalPages: number;
}

export type FieldProperty = 
  | 'name' 
  | 'label' 
  | 'defaultValue' 
  | 'required' 
  | 'readOnly'
  | 'width'
  | 'height'
  | 'x'
  | 'y';

