export type FieldType = 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'date' | 'number' | 'email' | 'phone';

export interface FormField {
  id: string;
  type: FieldType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  required: boolean;
  readOnly: boolean;
  options?: string[]; // For radio buttons and select
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

