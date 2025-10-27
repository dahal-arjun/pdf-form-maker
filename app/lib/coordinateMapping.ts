export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Convert pixel coordinates to PDF points (72 DPI)
 * PDF uses 72 points per inch
 */
export function pixelsToPoints(value: number, dpi: number = 96): number {
  return (value * 72) / dpi;
}

/**
 * Convert PDF points to pixel coordinates
 */
export function pointsToPixels(value: number, dpi: number = 96): number {
  return (value * dpi) / 72;
}

/**
 * Convert canvas coordinates to PDF coordinates
 */
export function canvasToPdf(
  canvasPoint: Point,
  canvasWidth: number,
  pdfWidth: number,
  canvasHeight: number,
  pdfHeight: number
): Point {
  return {
    x: (canvasPoint.x / canvasWidth) * pdfWidth,
    y: (canvasPoint.y / canvasHeight) * pdfHeight,
  };
}

/**
 * Convert PDF coordinates to canvas coordinates
 */
export function pdfToCanvas(
  pdfPoint: Point,
  canvasWidth: number,
  pdfWidth: number,
  canvasHeight: number,
  pdfHeight: number
): Point {
  return {
    x: (pdfPoint.x / pdfWidth) * canvasWidth,
    y: (pdfPoint.y / pdfHeight) * canvasHeight,
  };
}

/**
 * Convert canvas rectangle to PDF rectangle
 */
export function canvasRectToPdf(
  rect: Rect,
  canvasWidth: number,
  pdfWidth: number,
  canvasHeight: number,
  pdfHeight: number
): Rect {
  const topLeft = canvasToPdf({ x: rect.x, y: rect.y }, canvasWidth, pdfWidth, canvasHeight, pdfHeight);
  const bottomRight = canvasToPdf(
    { x: rect.x + rect.width, y: rect.y + rect.height },
    canvasWidth,
    pdfWidth,
    canvasHeight,
    pdfHeight
  );

  return {
    x: topLeft.x,
    y: pdfHeight - bottomRight.y, // PDF origin is bottom-left
    width: bottomRight.x - topLeft.x,
    height: bottomRight.y - topLeft.y,
  };
}

