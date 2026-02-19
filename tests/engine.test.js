/**
 * Test suite for Math Diagram Engine
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import MathDiagramEngine from '../src/engine/math-diagram-engine.js';
import logger from '../src/utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Math Diagram Engine Tests', () => {
  let engine;
  
  // Setup before tests
  test('setup', () => {
    engine = new MathDiagramEngine({
      width: 400,
      height: 300,
      enableLogging: true
    });
    assert(engine instanceof MathDiagramEngine, 'Engine should be instantiated');
  });

  describe('Function Diagrams', () => {
    test('should render linear function', async () => {
      const diagramText = `math-function
type: linear
equation: "2*x + 3"
range-x: [-10, 10]
range-y: [-10, 10]
color: "#ff0000"
line-width: 2`;

      const result = await engine.render(diagramText);
      
      assert(result.success, 'Should render successfully');
      assert(result.canvas, 'Should return canvas');
      assert(result.metadata.diagramType === 'function', 'Should identify as function diagram');
      
      logger.testResult('Linear Function Render', true, { 
        renderTime: result.metadata.renderTime 
      });
    });

    test('should render quadratic function', async () => {
      const diagramText = `math-function
type: quadratic
equation: "x^2 - 4"
range-x: [-5, 5]
range-y: [-5, 10]
color: "#0000ff"
line-width: 2`;

      const result = await engine.render(diagramText);
      
      assert(result.success, 'Should render successfully');
      assert(result.canvas, 'Should return canvas');
      
      logger.testResult('Quadratic Function Render', true, { 
        renderTime: result.metadata.renderTime 
      });
    });

    test('should render sine function', async () => {
      const diagramText = `math-function
type: trigonometric
equation: "sin(x)"
range-x: [0, 6.28]
range-y: [-1.5, 1.5]
color: "#00ff00"
line-width: 2`;

      const result = await engine.render(diagramText);
      
      assert(result.success, 'Should render successfully');
      assert(result.canvas, 'Should return canvas');
      
      logger.testResult('Sine Function Render', true, { 
        renderTime: result.metadata.renderTime 
      });
    });

    test('should render exponential function', async () => {
      const diagramText = `math-function
type: exponential
equation: "exp(x)"
range-x: [-2, 2]
range-y: [-1, 10]
color: "#ff00ff"
line-width: 2`;

      const result = await engine.render(diagramText);
      
      assert(result.success, 'Should render successfully');
      assert(result.canvas, 'Should return canvas');
      
      logger.testResult('Exponential Function Render', true, { 
        renderTime: result.metadata.renderTime 
      });
    });

    test('should handle invalid function equation', async () => {
      const diagramText = `math-function
type: linear
equation: "invalid_function(x)"
range-x: [-10, 10]
range-y: [-10, 10]
color: "#ff0000"`;

      const result = await engine.render(diagramText);
      
      assert(!result.success, 'Should fail to render');
      assert(result.errors.length > 0, 'Should have error messages');
      
      logger.testResult('Invalid Function Handling', true, { 
        errorsCount: result.errors.length 
      });
    });
  });

  describe('Geometry Diagrams', () => {
    test('should render circle', async () => {
      const diagramText = `geometry-shape
type: circle
coordinates: [{"x": 200, "y": 150}]
radius: 50
fill: true
fill-color: "#00ff00"
stroke-color: "#000000"
stroke-width: 2`;

      const result = await engine.render(diagramText);
      
      assert(result.success, 'Should render successfully');
      assert(result.canvas, 'Should return canvas');
      
      logger.testResult('Circle Render', true, { 
        renderTime: result.metadata.renderTime 
      });
    });

    test('should render polygon', async () => {
      const diagramText = `geometry-shape
type: polygon
coordinates: [{"x": 100, "y": 100}, {"x": 200, "y": 100}, {"x": 150, "y": 200}]
fill: true
fill-color: "#ff0000"
stroke-color: "#000000"
stroke-width: 2`;

      const result = await engine.render(diagramText);
      
      assert(result.success, 'Should render successfully');
      assert(result.canvas, 'Should return canvas');
      
      logger.testResult('Polygon Render', true, { 
        renderTime: result.metadata.renderTime 
      });
    });

    test('should render points', async () => {
      const diagramText = `geometry-shape
type: point
coordinates: [{"x": 100, "y": 100}, {"x": 200, "y": 150}, {"x": 150, "y": 200}]
radius: 5
fill: true
fill-color: "#0000ff"`;

      const result = await engine.render(diagramText);
      
      assert(result.success, 'Should render successfully');
      assert(result.canvas, 'Should return canvas');
      
      logger.testResult('Points Render', true, { 
        renderTime: result.metadata.renderTime 
      });
    });
  });

  describe('Statistics Diagrams', () => {
    test('should render histogram', async () => {
      const diagramText = `statistics-chart
type: histogram
data: [1, 2, 2, 3, 3, 3, 4, 4, 5, 5, 5, 5]
bins: 5
color: "#ff00ff"`;

      const result = await engine.render(diagramText);
      
      assert(result.success, 'Should render successfully');
      assert(result.canvas, 'Should return canvas');
      
      logger.testResult('Histogram Render', true, { 
        renderTime: result.metadata.renderTime,
        dataPoints: 12
      });
    });

    test('should render scatter plot', async () => {
      const diagramText = `statistics-chart
type: scatter
data: [{"x": 1, "y": 2}, {"x": 2, "y": 4}, {"x": 3, "y": 3}, {"x": 4, "y": 5}, {"x": 5, "y": 7}]
color: "#00ff00"`;

      const result = await engine.render(diagramText);
      
      assert(result.success, 'Should render successfully');
      assert(result.canvas, 'Should return canvas');
      
      logger.testResult('Scatter Plot Render', true, { 
        renderTime: result.metadata.renderTime,
        dataPoints: 5
      });
    });

    test('should render line chart', async () => {
      const diagramText = `statistics-chart
type: line-chart
data: [1, 3, 2, 5, 4, 6, 3, 7, 5, 8]
color: "#0000ff"`;

      const result = await engine.render(diagramText);
      
      assert(result.success, 'Should render successfully');
      assert(result.canvas, 'Should return canvas');
      
      logger.testResult('Line Chart Render', true, { 
        renderTime: result.metadata.renderTime,
        dataPoints: 10
      });
    });

    test('should render bar chart', async () => {
      const diagramText = `statistics-chart
type: bar-chart
data: [10, 25, 15, 30, 20, 35]
color: "#ff0000"`;

      const result = await engine.render(diagramText);
      
      assert(result.success, 'Should render successfully');
      assert(result.canvas, 'Should return canvas');
      
      logger.testResult('Bar Chart Render', true, { 
        renderTime: result.metadata.renderTime,
        dataPoints: 6
      });
    });
  });

  describe('Coordinate System Diagrams', () => {
    test('should render Cartesian coordinate system', async () => {
      const diagramText = `coordinate-system
type: cartesian
range-x: [-5, 5]
range-y: [-5, 5]
grid-spacing: 1
show-grid: true
show-axes: true
show-labels: true`;

      const result = await engine.render(diagramText);
      
      assert(result.success, 'Should render successfully');
      assert(result.canvas, 'Should return canvas');
      
      logger.testResult('Cartesian Coordinate System Render', true, { 
        renderTime: result.metadata.renderTime 
      });
    });
  });

  describe('Validation Tests', () => {
    test('should validate correct diagram syntax', () => {
      const diagramText = `math-function
type: linear
equation: "2*x + 3"
range-x: [-10, 10]
range-y: [-10, 10]`;

      const validation = engine.validate(diagramText);
      
      assert(validation.valid, 'Should validate correct syntax');
      assert(validation.syntaxErrors.length === 0, 'Should have no syntax errors');
      
      logger.testResult('Correct Syntax Validation', true);
    });

    test('should detect invalid diagram syntax', () => {
      const diagramText = `invalid-diagram
type: linear
equation: "2*x + 3"
invalid-property: value`;

      const validation = engine.validate(diagramText);
      
      assert(!validation.valid, 'Should detect invalid syntax');
      
      logger.testResult('Invalid Syntax Detection', true, {
        syntaxErrorsCount: validation.syntaxErrors.length,
        parseErrorsCount: validation.parseErrors.length
      });
    });

    test('should handle empty diagram', async () => {
      const result = await engine.render('');
      
      assert(!result.success, 'Should fail to render empty diagram');
      assert(result.errors.length > 0, 'Should have error messages');
      
      logger.testResult('Empty Diagram Handling', true, {
        errorsCount: result.errors.length
      });
    });
  });

  describe('Engine Features', () => {
    test('should get supported diagram types', () => {
      const types = engine.getSupportedDiagramTypes();
      
      assert(types.includes('math-function'), 'Should include function diagrams');
      assert(types.includes('geometry-shape'), 'Should include geometry diagrams');
      assert(types.includes('statistics-chart'), 'Should include statistics diagrams');
      assert(types.includes('coordinate-system'), 'Should include coordinate systems');
      
      logger.testResult('Supported Types Retrieval', true, {
        typesCount: types.length
      });
    });

    test('should get examples', () => {
      const examples = engine.getExamples();
      
      assert(examples['Linear Function'], 'Should have linear function example');
      assert(examples['Sine Wave'], 'Should have sine wave example');
      assert(examples['Circle'], 'Should have circle example');
      assert(examples['Histogram'], 'Should have histogram example');
      
      logger.testResult('Examples Retrieval', true, {
        examplesCount: Object.keys(examples).length
      });
    });

    test('should get engine stats', () => {
      const stats = engine.getStats();
      
      assert(stats.version, 'Should have version');
      assert(stats.supportedTypes, 'Should have supported types');
      assert(stats.config, 'Should have config');
      assert(stats.logStats, 'Should have log stats');
      
      logger.testResult('Engine Stats Retrieval', true);
    });
  });

  describe('Performance Tests', () => {
    test('should render multiple diagrams efficiently', async () => {
      const diagrams = [
        `math-function\ntype: linear\nequation: "x"\nrange-x: [-10, 10]\nrange-y: [-10, 10]`,
        `math-function\ntype: quadratic\nequation: "x^2"\nrange-x: [-5, 5]\nrange-y: [-5, 25]`,
        `geometry-shape\ntype: circle\ncoordinates: [{"x": 200, "y": 150}]\nradius: 50`,
        `statistics-chart\ntype: histogram\ndata: [1,2,3,4,5]\nbins: 5`
      ];

      const startTime = Date.now();
      const results = [];
      
      for (const diagram of diagrams) {
        const result = await engine.render(diagram);
        results.push(result);
      }
      
      const totalTime = Date.now() - startTime;
      const averageTime = totalTime / diagrams.length;
      
      assert(results.every(r => r.success), 'All diagrams should render successfully');
      assert(averageTime < 1000, 'Average render time should be under 1 second');
      
      logger.performance('Batch Render Test', totalTime, {
        diagramCount: diagrams.length,
        averageTime: averageTime
      });
      
      logger.testResult('Batch Render Performance', true, {
        totalTime: totalTime,
        averageTime: averageTime
      });
    });
  });

  // Cleanup after tests
  test('cleanup', () => {
    // Clear logs for clean test runs
    logger.clearLogs();
    
    logger.testResult('Test Cleanup', true);
  });
});

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Running Math Diagram Engine Tests...');
  console.log('Use: node --test tests/engine.test.js');
}
