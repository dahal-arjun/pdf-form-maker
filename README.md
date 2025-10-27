# PDF Form Builder

A web-based application for creating and editing fillable PDF forms. Built with Next.js, TypeScript, and React.

## Features

- **Upload Existing PDFs**: Import existing PDF files and add fillable fields to them
- **Create New Forms**: Start from scratch with blank PDF canvases
- **Multiple Field Types**: Support for text inputs, text areas, checkboxes, and radio buttons
- **Visual Editor**: Drag-and-drop interface for easy field placement
- **Properties Panel**: Configure field properties including labels, default values, and validation
- **Export Fillable PDFs**: Download your forms as standard fillable PDF files

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **PDF Libraries**: 
  - `pdf-lib` - PDF creation and form field generation
  - `react-pdf` - PDF rendering and preview

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /components
    /builder
      - Canvas.tsx          # Main editor area
      - FieldPalette.tsx    # Toolbox with field types
      - PropertiesPanel.tsx # Field properties editor
      - FieldRenderer.tsx   # Visual field components
    /pdf
      - PDFViewer.tsx       # PDF display component
      - PDFExporter.tsx     # Export logic
  /hooks
    - useFormBuilder.ts     # State management with Zustand
  /lib
    - pdfUtils.ts           # PDF operations
    - coordinateMapping.ts  # Canvas ↔ PDF coordinate conversion
  /types
    - formField.ts          # TypeScript interfaces
```

## Usage

1. **Upload a PDF**: Click "Upload PDF" to load an existing PDF file, or create a new form
2. **Add Fields**: Drag field types from the left palette onto the canvas
3. **Configure Fields**: Select a field and edit its properties in the right panel
4. **Export**: Click "Export Fillable PDF" to download your completed form

## Field Types

- **Text Input**: Single-line text fields
- **Text Area**: Multi-line text fields
- **Checkbox**: Boolean checkboxes
- **Radio Button**: Radio button groups

## Browser Compatibility

Tested on:
- Chrome/Edge
- Firefox
- Safari

## Future Enhancements

- Advanced field types (dropdowns, signatures, date pickers)
- Field validation rules
- Conditional logic
- Undo/redo functionality
- Keyboard shortcuts
- Form templates

## License

MIT
