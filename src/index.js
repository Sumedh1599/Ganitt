/**
 * Math Diagram Engine - Main Entry Point
 * Ganitt - Interactive Math Diagram Component focused on Mathematics visualizations
 */

import MathDiagramEngine from './engine/math-diagram-engine.js';

// Export the main engine class
export { MathDiagramEngine };

// Export types and utilities
export { default as logger } from './utils/logger.js';
export { default as MathParser } from './parsers/math-parser.js';
export { default as DiagramParser } from './parsers/diagram-parser.js';
export { default as CanvasRenderer } from './renderers/canvas-renderer.js';

// Export all types
export * from './types/index.js';

/**
 * Convenience function for quick diagram rendering
 */
export async function renderDiagram(diagramText, config = {}) {
  const engine = new MathDiagramEngine(config);
  return await engine.render(diagramText);
}

/**
 * Convenience function for diagram validation
 */
export function validateDiagram(diagramText) {
  const engine = new MathDiagramEngine();
  return engine.validate(diagramText);
}

/**
 * Get examples of supported diagrams
 */
export function getExamples() {
  const engine = new MathDiagramEngine();
  return engine.getExamples();
}

// Default export
export default MathDiagramEngine;
