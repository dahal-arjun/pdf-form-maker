'use client';

import { create } from 'zustand';
import { FormField } from '@/types/formField';

interface FormBuilderStore {
  // State
  fields: FormField[];
  selectedFieldIds: string[];
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  pdfFile: File | null;
  pdfDocument: any | null;
  currentPage: number;
  totalPages: number;
  
  // Actions
  setPdfFile: (file: File) => void;
  setPdfDocument: (doc: any) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setZoom: (zoom: number) => void;
  addField: (field: Omit<FormField, 'id'>) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  deleteField: (id: string) => void;
  deleteSelectedFields: () => void;
  selectField: (id: string | null) => void;
  toggleFieldSelection: (id: string) => void;
  clearSelection: () => void;
  setCanvasSize: (width: number, height: number) => void;
  clearAll: () => void;
}

export const useFormBuilder = create<FormBuilderStore>((set) => ({
  fields: [],
  selectedFieldIds: [],
  canvasWidth: 612,
  canvasHeight: 792,
  zoom: 1,
  pdfFile: null,
  pdfDocument: null,
  currentPage: 1,
  totalPages: 1,

  setPdfFile: (file: File) => set({ pdfFile: file }),
  
  setPdfDocument: (doc: any) => set({ pdfDocument: doc }),
  
  setCurrentPage: (page: number) => set({ currentPage: page }),
  
  setTotalPages: (pages: number) => set({ totalPages: pages }),
  
  setZoom: (zoom: number) => set({ zoom }),
  
  addField: (field: Omit<FormField, 'id'>) =>
    set((state) => ({
      fields: [
        ...state.fields,
        {
          ...field,
          id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
      ],
    })),
  
  updateField: (id: string, updates: Partial<FormField>) =>
    set((state) => ({
      fields: state.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    })),
  
  deleteField: (id: string) =>
    set((state) => ({
      fields: state.fields.filter((field) => field.id !== id),
      selectedFieldIds: state.selectedFieldIds.filter((fieldId) => fieldId !== id),
    })),
  
  deleteSelectedFields: () =>
    set((state) => ({
      fields: state.fields.filter((field) => !state.selectedFieldIds.includes(field.id)),
      selectedFieldIds: [],
    })),
  
  selectField: (id: string | null) => set({ selectedFieldIds: id ? [id] : [] }),
  
  toggleFieldSelection: (id: string) =>
    set((state) => ({
      selectedFieldIds: state.selectedFieldIds.includes(id)
        ? state.selectedFieldIds.filter((fieldId) => fieldId !== id)
        : [...state.selectedFieldIds, id],
    })),
  
  clearSelection: () => set({ selectedFieldIds: [] }),
  
  setCanvasSize: (width: number, height: number) =>
    set({ canvasWidth: width, canvasHeight: height }),
  
  clearAll: () =>
    set({
      fields: [],
      selectedFieldIds: [],
      pdfFile: null,
      pdfDocument: null,
      currentPage: 1,
      totalPages: 1,
    }),
}));

