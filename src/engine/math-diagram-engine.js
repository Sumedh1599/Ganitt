/**
 * Main Math Diagram Engine
 * Coordinates parsing and rendering of mathematical diagrams
 */

import MathParser from '../parsers/math-parser.js';
import DiagramParser from '../parsers/diagram-parser.js';
import CanvasRenderer from '../renderers/canvas-renderer.js';

// Simple logger fallback for browser compatibility
const logger = {
  info: (msg, data) => console.log('[INFO]', msg, data || ''),
  error: (msg, data) => console.error('[ERROR]', msg, data || ''),
  warn: (msg, data) => console.warn('[WARN]', msg, data || ''),
  debug: (msg, data) => console.log('[DEBUG]', msg, data || ''),
  diagramParse: (type, success, errors, data) => {
    console.log('[INFO] Diagram Parse Attempt', { type, success, errors, ...data });
  },
  diagramRender: (type, success, renderTime, errors, data) => {
    console.log('[INFO] Diagram Render Attempt', { type, success, renderTime, errors, ...data });
  },
  performance: (operation, duration, data) => {
    console.log('[INFO] Performance Metric', { operation, duration, ...data });
  },
  getLogStats: () => {
    return { totalLogs: 0, lastLog: 'N/A' };
  },
  clearLogs: () => {
    console.log('[INFO] Logs cleared');
  }
};

/**
 * Render result class
 */
class RenderResult {
  constructor() {
    this.success = false;
    this.canvas = null;
    this.errors = [];
    this.renderTime = 0;
  }
}

export class MathDiagramEngine {
  constructor(config = {}) {
    this.config = {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      gridColor: '#e0e0e0',
      axisColor: '#333333',
      fontFamily: 'Arial, sans-serif',
      fontSize: 12,
      lineWidth: 2,
      showGrid: true,
      showAxes: true,
      showLabels: true,
      enableLogging: true,
      ...config
    };
    
    this.mathParser = MathParser; // Already an instance
    this.diagramParser = DiagramParser; // Already an instance
    
    logger.info('Math Diagram Engine initialized', this.config);
  }

  /**
   * Render a diagram from text definition
   */
  async render(diagramText, canvas = null) {
    const startTime = Date.now();
    const result = new RenderResult();
    
    try {
      logger.info('Starting diagram render', { textLength: diagramText.length });
      
      // Parse the diagram definition
      const parseResult = this.diagramParser.parse(diagramText);
      
      if (!parseResult.success) {
        result.errors.push(...parseResult.errors);
        throw new Error(`Parse failed: ${parseResult.errors.join(', ')}`);
      }
      
      const diagram = parseResult.diagram;
      
      // Create or use canvas
      if (!canvas) {
        canvas = await this.createCanvas();
      }
      
      // Initialize renderer
      this.renderer = new CanvasRenderer(canvas, this.config);
      
      // Clear canvas
      this.renderer.clear();
      
      // Render based on diagram type
      await this.renderDiagram(diagram);
      
      // Draw title if specified
      if (diagram.title || this.config.title) {
        this.renderer.drawTitle(diagram.title || this.config.title);
      }
      
      result.success = true;
      result.canvas = canvas;
      result.metadata = {
        diagramType: diagram.type,
        renderTime: Date.now() - startTime,
        dimensions: {
          width: canvas.width,
          height: canvas.height
        }
      };
      
      // Convert canvas to image data for browser compatibility
      if (typeof window !== 'undefined' && canvas.toDataURL) {
        result.imageData = canvas.toDataURL('image/png');
      } else {
        // Node.js environment - canvas will be converted elsewhere
        result.canvas = canvas;
      }
      
      const renderTime = Date.now() - startTime;
      logger.diagramRender(diagram.type, true, renderTime, result.errors);
      logger.performance('Diagram Render', renderTime, { 
        type: diagram.type,
        width: canvas.width,
        height: canvas.height
      });
      
    } catch (error) {
      result.errors.push(error.message);
      const renderTime = Date.now() - startTime;
      logger.diagramRender('unknown', false, renderTime, [error.message]);
      logger.error('Diagram render failed', { error: error.message });
    }
    
    return result;
  }

  /**
   * Create a canvas element (Node.js compatible)
   */
  async createCanvas() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Browser environment
      const canvas = document.createElement('canvas');
      canvas.width = this.config.width;
      canvas.height = this.config.height;
      return canvas;
    } else {
      // Node.js environment - use node-canvas
      try {
        const canvasModule = await import('canvas');
        const { createCanvas } = canvasModule;
        return createCanvas(this.config.width, this.config.height);
      } catch (error) {
        throw new Error('Canvas library not available. In Node.js, install "canvas" package.');
      }
    }
  }

  /**
   * Render specific diagram type
   */
  async renderDiagram(diagram) {
    switch (diagram.type) {
      case 'function':
        this.renderFunctionDiagram(diagram);
        break;
      case 'geometry':
        this.renderGeometryDiagram(diagram);
        break;
      case 'statistics':
        this.renderStatisticsDiagram(diagram);
        break;
      case 'coordinate-system':
        this.renderCoordinateSystemDiagram(diagram);
        break;
      case 'logic':
        this.renderLogicDiagram(diagram);
        break;
      case 'educational':
        this.renderEducationalDiagram(diagram);
        break;
      case 'vector-field':
        this.renderVectorFieldDiagram(diagram);
        break;
      case 'contour':
        this.renderContourPlotDiagram(diagram);
        break;
      default:
        // Try to determine type from diagram structure
        if (diagram.functionType || diagram.equation) {
          diagram.type = 'function';
          this.renderFunctionDiagram(diagram);
        } else if (diagram.geometryType || diagram.coordinates) {
          diagram.type = 'geometry';
          this.renderGeometryDiagram(diagram);
        } else if (diagram.statisticsType || diagram.data) {
          diagram.type = 'statistics';
          this.renderStatisticsDiagram(diagram);
        } else if (diagram.systemType || diagram.rangeX) {
          diagram.type = 'coordinate-system';
          this.renderCoordinateSystemDiagram(diagram);
        } else if (diagram.logicType || diagram.sets) {
          diagram.type = 'logic';
          this.renderLogicDiagram(diagram);
        } else if (diagram.educationalType || diagram.fractions) {
          diagram.type = 'educational';
          this.renderEducationalDiagram(diagram);
        } else if (diagram.fieldType || diagram.equationX) {
          diagram.type = 'vector-field';
          this.renderVectorFieldDiagram(diagram);
        } else if (diagram.contourType || diagram.levels) {
          diagram.type = 'contour';
          this.renderContourPlotDiagram(diagram);
        } else {
          throw new Error(`Unsupported diagram type: ${diagram.type}`);
        }
    }
  }

  /**
   * Render function diagram
   */
  renderFunctionDiagram(diagram) {
    // Draw coordinate system first
    this.renderer.drawCoordinateSystem(diagram.rangeX, diagram.rangeY);
    
    // Draw function
    this.renderer.drawFunction(diagram);
    
    // Draw title
    this.renderer.drawTitle(diagram.title || `${diagram.functionType} Function`);
  }

  /**
   * Render coordinate system diagram
   */
  renderCoordinateSystemDiagram(diagram) {
    this.renderer.drawCoordinateSystem(
      diagram.rangeX, 
      diagram.rangeY, 
      diagram.gridSpacing
    );
  }

  /**
   * Render geometry diagram
   */
  renderGeometryDiagram(diagram) {
    // For geometry, we might want a coordinate system
    if (diagram.showCoordinateSystem) {
      this.renderer.drawCoordinateSystem(diagram.rangeX || [-10, 10], diagram.rangeY || [-10, 10]);
    }
    
    this.renderer.drawGeometry(diagram);
    
    // Draw title
    if (diagram.title) {
      this.renderer.drawTitle(diagram.title);
    }
  }

  /**
   * Render statistics diagram
   */
  renderStatisticsDiagram(diagram) {
    // Statistics charts typically don't need coordinate systems
    this.renderer.drawStatistics(diagram);
    
    // Draw statistical measures if requested
    if (diagram.showMean || diagram.showMedian || diagram.showStdDev) {
      this.renderStatisticalMeasures(diagram);
    }
  }

  /**
   * Render educational diagram
   */
  renderEducationalDiagram(diagram) {
    switch (diagram.educationalType) {
      case 'number-line':
        this.renderNumberLine(diagram);
        break;
      case 'fraction-bars':
        this.renderFractionBars(diagram);
        break;
      default:
        this.renderer.drawCoordinateSystem(
          diagram.range || [-10, 10], 
          [0, 1], 
          1
        );
    }
  }

  /**
   * Render number line
   */
  renderNumberLine(diagram) {
    const range = diagram.range || [-10, 10];
    const marks = diagram.marks || 1;
    
    this.renderer.drawCoordinateSystem(range, [0, 1], 1);
    
    // Draw number labels
    if (diagram.labels) {
      const [min, max] = range;
      const step = marks;
      
      this.renderer.ctx.fillStyle = diagram.color;
      this.renderer.ctx.font = `${this.renderer.config.fontSize}px ${this.renderer.config.fontFamily}`;
      this.renderer.ctx.textAlign = 'center';
      this.renderer.ctx.textBaseline = 'top';
      
      for (let i = min; i <= max; i += step) {
        const canvasPoint = this.renderer.mathToCanvas(i, 0, range, [0, 1]);
        this.renderer.ctx.fillText(i.toString(), canvasPoint.x, canvasPoint.y + 5);
      }
    }
  }

  /**
   * Render fraction bars
   */
  renderFractionBars(diagram) {
    const fractions = diagram.fractions || [];
    const barWidth = this.renderer.drawArea.width / (fractions.length + 1);
    
    this.renderer.ctx.fillStyle = diagram.color;
    this.renderer.ctx.strokeStyle = diagram.color;
    this.renderer.ctx.lineWidth = 2;
    
    fractions.forEach((fractionStr, index) => {
      const x = this.renderer.drawArea.left + (index + 1) * barWidth;
      const y = this.renderer.drawArea.top + 50;
      
      // Parse fraction
      const [numerator, denominator] = fractionStr.split('/').map(n => parseInt(n));
      const fractionValue = numerator / denominator;
      
      // Draw bar
      const barHeight = fractionValue * 200; // Scale factor
      this.renderer.ctx.fillRect(x, y - barHeight, barWidth * 0.8, barHeight);
      this.renderer.ctx.strokeRect(x, y - barHeight, barWidth * 0.8, barHeight);
      
      // Draw label
      this.renderer.ctx.textAlign = 'center';
      this.renderer.ctx.fillText(fractionStr, x + barWidth * 0.4, y + 20);
    });
  }

  /**
   * Render logic diagram
   */
  renderLogicDiagram(diagram) {
    switch (diagram.logicType) {
      case 'venn':
        this.renderVennDiagram(diagram);
        break;
      case 'truth-table':
        this.renderTruthTable(diagram);
        break;
      default:
        throw new Error(`Unsupported logic type: ${diagram.logicType}`);
    }
  }

  /**
   * Render Venn diagram
   */
  renderVennDiagram(diagram) {
    const sets = diagram.sets || 2;
    const labels = diagram.labels || [];
    const centerX = this.renderer.drawArea.left + this.renderer.drawArea.width / 2;
    const centerY = this.renderer.drawArea.top + this.renderer.drawArea.height / 2;
    const radius = Math.min(this.renderer.drawArea.width, this.renderer.drawArea.height) * 0.25;
    
    // Define different colors for each set
    const colors = [
      diagram.color || '#ff6600',
      '#0066cc',
      '#00cc66',
      '#cc00cc',
      '#ffcc00'
    ];
    
    this.renderer.ctx.lineWidth = 2;
    
    if (sets >= 1) {
      // Draw first circle with transparency
      this.renderer.ctx.fillStyle = colors[0] + '66'; // 40% opacity
      this.renderer.ctx.strokeStyle = colors[0];
      this.renderer.ctx.beginPath();
      this.renderer.ctx.arc(centerX - radius/2, centerY, radius, 0, 2 * Math.PI);
      this.renderer.ctx.fill();
      this.renderer.ctx.stroke();
      
      if (labels[0]) {
        this.renderer.ctx.fillStyle = colors[0];
        this.renderer.ctx.textAlign = 'center';
        this.renderer.ctx.font = `bold ${this.renderer.config.fontSize + 2}px ${this.renderer.config.fontFamily}`;
        this.renderer.ctx.fillText(labels[0], centerX - radius/2, centerY - radius - 15);
      }
    }
    
    if (sets >= 2) {
      // Draw second circle with transparency
      this.renderer.ctx.fillStyle = colors[1] + '66'; // 40% opacity
      this.renderer.ctx.strokeStyle = colors[1];
      this.renderer.ctx.beginPath();
      this.renderer.ctx.arc(centerX + radius/2, centerY, radius, 0, 2 * Math.PI);
      this.renderer.ctx.fill();
      this.renderer.ctx.stroke();
      
      if (labels[1]) {
        this.renderer.ctx.fillStyle = colors[1];
        this.renderer.ctx.textAlign = 'center';
        this.renderer.ctx.font = `bold ${this.renderer.config.fontSize + 2}px ${this.renderer.config.fontFamily}`;
        this.renderer.ctx.fillText(labels[1], centerX + radius/2, centerY - radius - 15);
      }
      
      // Add intersection label if requested
      if (diagram.intersection) {
        this.renderer.ctx.fillStyle = '#333333';
        this.renderer.ctx.font = `${this.renderer.config.fontSize}px ${this.renderer.config.fontFamily}`;
        this.renderer.ctx.fillText('A ∩ B', centerX, centerY);
      }
    }
    
    if (sets >= 3) {
      // Draw third circle for 3-set Venn diagram
      this.renderer.ctx.fillStyle = colors[2] + '66'; // 40% opacity
      this.renderer.ctx.strokeStyle = colors[2];
      this.renderer.ctx.beginPath();
      this.renderer.ctx.arc(centerX, centerY - radius/2, radius, 0, 2 * Math.PI);
      this.renderer.ctx.fill();
      this.renderer.ctx.stroke();
      
      if (labels[2]) {
        this.renderer.ctx.fillStyle = colors[2];
        this.renderer.ctx.textAlign = 'center';
        this.renderer.ctx.font = `bold ${this.renderer.config.fontSize + 2}px ${this.renderer.config.fontFamily}`;
        this.renderer.ctx.fillText(labels[2], centerX, centerY - radius * 1.5 - 15);
      }
    }
    
    // Draw title
    if (diagram.title) {
      this.renderer.drawTitle(diagram.title);
    }
  }

  /**
   * Render truth table
   */
  renderTruthTable(diagram) {
    const variables = diagram.variables || [];
    const expression = diagram.expression || '';
    
    if (variables.length === 0) return;
    
    const rows = Math.pow(2, variables.length);
    const cols = variables.length + 1;
    const cellWidth = this.renderer.drawArea.width / cols;
    const cellHeight = 30;
    
    this.renderer.ctx.strokeStyle = diagram.color;
    this.renderer.ctx.lineWidth = 1;
    
    // Draw table
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = this.renderer.drawArea.left + col * cellWidth;
        const y = this.renderer.drawArea.top + row * cellHeight;
        
        this.renderer.ctx.strokeRect(x, y, cellWidth, cellHeight);
        
        // Fill values
        let value = '';
        if (col < variables.length) {
          // Variable value (T/F)
          value = ((row >> (variables.length - 1 - col)) & 1) ? 'T' : 'F';
        } else {
          // Expression result (simplified)
          value = 'T/F'; // Would need actual expression evaluation
        }
        
        this.renderer.ctx.fillStyle = diagram.color;
        this.renderer.ctx.textAlign = 'center';
        this.renderer.ctx.textBaseline = 'middle';
        this.renderer.ctx.fillText(value, x + cellWidth/2, y + cellHeight/2);
      }
    }
    
    // Headers
    for (let col = 0; col < cols; col++) {
      const x = this.renderer.drawArea.left + col * cellWidth;
      const y = this.renderer.drawArea.top - cellHeight;
      
      const header = col < variables.length ? variables[col] : expression;
      this.renderer.ctx.fillStyle = diagram.color;
      this.renderer.ctx.textAlign = 'center';
      this.renderer.ctx.fillText(header, x + cellWidth/2, y + cellHeight/2);
    }
  }

  /**
   * Render vector field diagram
   */
  renderVectorFieldDiagram(diagram) {
    this.renderer.drawCoordinateSystem(diagram.rangeX, diagram.rangeY, diagram.gridSpacing);
    
    const equationX = diagram.equationX || '-y';
    const equationY = diagram.equationY || 'x';
    const step = diagram.gridSpacing || 1;
    
    this.renderer.ctx.strokeStyle = diagram.color;
    this.renderer.ctx.lineWidth = 1;
    
    const [xMin, xMax] = diagram.rangeX;
    const [yMin, yMax] = diagram.rangeY;
    
    for (let x = xMin; x <= xMax; x += step) {
      for (let y = yMin; y <= yMax; y += step) {
        try {
          const dx = this.mathParser.evaluate(equationX, { x, y });
          const dy = this.mathParser.evaluate(equationY, { x, y });
          
          const canvasPoint = this.renderer.mathToCanvas(x, y, diagram.rangeX, diagram.rangeY);
          
          // Draw arrow
          const scale = 0.3; // Scale factor for arrow length
          const endX = canvasPoint.x + dx * scale;
          const endY = canvasPoint.y - dy * scale; // Negative because canvas Y is inverted
          
          this.renderer.ctx.beginPath();
          this.renderer.ctx.moveTo(canvasPoint.x, canvasPoint.y);
          this.renderer.ctx.lineTo(endX, endY);
          this.renderer.ctx.stroke();
          
          // Arrowhead
          const angle = Math.atan2(-dy, dx);
          const arrowLength = 5;
          this.renderer.ctx.beginPath();
          this.renderer.ctx.moveTo(endX, endY);
          this.renderer.ctx.lineTo(
            endX - arrowLength * Math.cos(angle - Math.PI/6),
            endY + arrowLength * Math.sin(angle - Math.PI/6)
          );
          this.renderer.ctx.moveTo(endX, endY);
          this.renderer.ctx.lineTo(
            endX - arrowLength * Math.cos(angle + Math.PI/6),
            endY + arrowLength * Math.sin(angle + Math.PI/6)
          );
          this.renderer.ctx.stroke();
        } catch (error) {
          // Skip points that can't be evaluated
        }
      }
    }
  }

  /**
   * Render contour plot diagram
   */
  renderContourPlotDiagram(diagram) {
    this.renderer.drawCoordinateSystem(diagram.rangeX, diagram.rangeY, 1);
    
    const equation = diagram.equation || 'x^2 + y^2';
    const levels = diagram.levels || 5;
    
    // Find min and max values
    const [xMin, xMax] = diagram.rangeX;
    const [yMin, yMax] = diagram.rangeY;
    let minVal = Infinity, maxVal = -Infinity;
    
    for (let x = xMin; x <= xMax; x += 0.5) {
      for (let y = yMin; y <= yMax; y += 0.5) {
        try {
          const value = this.mathParser.evaluate(equation, { x, y });
          minVal = Math.min(minVal, value);
          maxVal = Math.max(maxVal, value);
        } catch (error) {
          // Skip invalid points
        }
      }
    }
    
    // Draw contour lines
    const contourLevels = [];
    for (let i = 0; i < levels; i++) {
      contourLevels.push(minVal + (maxVal - minVal) * (i + 1) / (levels + 1));
    }
    
    this.renderer.ctx.strokeStyle = diagram.color;
    this.renderer.ctx.lineWidth = 1;
    
    contourLevels.forEach(level => {
      this.renderer.ctx.beginPath();
      
      for (let x = xMin; x <= xMax; x += 0.2) {
        for (let y = yMin; y <= yMax; y += 0.2) {
          try {
            const value = this.mathParser.evaluate(equation, { x, y });
            
            // Check if point is on contour
            if (Math.abs(value - level) < 0.1) {
              const canvasPoint = this.renderer.mathToCanvas(x, y, diagram.rangeX, diagram.rangeY);
              
              if (x === xMin) {
                this.renderer.ctx.moveTo(canvasPoint.x, canvasPoint.y);
              } else {
                this.renderer.ctx.lineTo(canvasPoint.x, canvasPoint.y);
              }
            }
          } catch (error) {
            // Skip invalid points
          }
        }
      }
      
      this.renderer.ctx.stroke();
    });
  }

  /**
   * Render derivative of a function
   */
  renderDerivative(diagram) {
    // This would involve numerical differentiation
    // For now, we'll skip the implementation
    logger.debug('Derivative rendering requested but not yet implemented');
  }

  /**
   * Render integral of a function
   */
  renderIntegral(diagram) {
    // This would involve numerical integration
    // For now, we'll skip the implementation
    logger.debug('Integral rendering requested but not yet implemented');
  }

  /**
   * Render statistical measures
   */
  renderStatisticalMeasures(diagram) {
    // This would calculate and display mean, median, standard deviation
    // For now, we'll skip the implementation
    logger.debug('Statistical measures requested but not yet implemented');
  }

  /**
   * Validate diagram definition without rendering
   */
  validate(diagramText) {
    try {
      const syntaxErrors = this.diagramParser.validateSyntax(diagramText);
      const parseResult = this.diagramParser.parse(diagramText);
      
      return {
        valid: syntaxErrors.length === 0 && parseResult.success,
        syntaxErrors,
        parseErrors: parseResult.errors,
        warnings: parseResult.warnings
      };
    } catch (error) {
      return {
        valid: false,
        syntaxErrors: [],
        parseErrors: [error.message],
        warnings: []
      };
    }
  }

  /**
   * Get list of supported diagram types
   */
  getSupportedDiagramTypes() {
    return [
      'math-function',
      'geometry-shape', 
      'statistics-chart',
      'coordinate-system'
    ];
  }

  /**
   * Get example diagram definitions with enhanced labeling
   */
  getExamples() {
    return {
      'Linear Function': `math-function
type: linear
equation: "2*x + 3"
range-x: [-10, 10]
range-y: [-10, 10]
color: "#ff0000"
line-width: 2
title: "Linear Function"
subtitle: "f(x) = 2x + 3"`,
      'Quadratic Function': `math-function
type: quadratic
equation: "x**2 - 4*x + 3"
range-x: [-2, 6]
range-y: [-5, 15]
color: "#0000ff"
line-width: 2
title: "Quadratic Function"
subtitle: "f(x) = x² - 4x + 3"`,
      'Cubic Function': `math-function
type: cubic
equation: "x**3 - 3*x"
range-x: [-3, 3]
range-y: [-10, 10]
color: "#00ff00"
line-width: 2
title: "Cubic Function"
subtitle: "f(x) = x³ - 3x"`,
      'Polynomial Function (4th degree)': `math-function
type: polynomial
equation: "x**4 - 5*x**2 + 4"
range-x: [-3, 3]
range-y: [-5, 10]
color: "#ff00ff"
line-width: 2
title: "4th Degree Polynomial"
subtitle: "f(x) = x⁴ - 5x² + 4"`,
      'Rational Function': `math-function
type: rational
equation: "1/(x**2 + 1)"
range-x: [-5, 5]
range-y: [-0.5, 1.5]
color: "#00ffff"
line-width: 2
title: "Rational Function"
subtitle: "f(x) = 1/(x² + 1)"`,
      'Exponential Function': `math-function
type: exponential
equation: "exp(x)"
range-x: [-2, 2]
range-y: [-1, 10]
color: "#ff8800"
line-width: 2
title: "Exponential Function"
subtitle: "f(x) = eˣ"`,
      'Logarithmic Function': `math-function
type: logarithmic
equation: "log(x)"
range-x: [0.1, 10]
range-y: [-3, 3]
color: "#8800ff"
line-width: 2
title: "Logarithmic Function"
subtitle: "f(x) = log(x)"`,
      'Sine Function': `math-function
type: trigonometric
equation: "sin(x)"
range-x: [0, 6.28]
range-y: [-1.5, 1.5]
color: "#ff0088"
line-width: 2
title: "Sine Function"
subtitle: "f(x) = sin(x)"`,
      'Cosine Function': `math-function
type: trigonometric
equation: "cos(x)"
range-x: [0, 6.28]
range-y: [-1.5, 1.5]
color: "#00ff88"
line-width: 2
title: "Cosine Function"
subtitle: "f(x) = cos(x)"`,
      'Tangent Function': `math-function
type: trigonometric
equation: "tan(x)"
range-x: [-3, 3]
range-y: [-5, 5]
color: "#8800ff"
line-width: 2
title: "Tangent Function"
subtitle: "f(x) = tan(x)"`,
      'Arcsine Function': `math-function
type: trigonometric
equation: "asin(x)"
range-x: [-1, 1]
range-y: [-2, 2]
color: "#ffaa00"
line-width: 2
title: "Arcsine Function"
subtitle: "f(x) = arcsin(x)"`,
      'Hyperbolic Sine': `math-function
type: hyperbolic
equation: "sinh(x)"
range-x: [-2, 2]
range-y: [-5, 5]
color: "#00aaff"
line-width: 2
title: "Hyperbolic Sine"
subtitle: "f(x) = sinh(x)"`,
      'Point': `geometry-shape
type: point
coordinates: [{"x": 400, "y": 300}]
radius: 8
fill: true
fill-color: "#ff0000"
title: "Point"
subtitle: "Single point at coordinates (400, 300)"`,
      'Line': `geometry-shape
type: line
coordinates: [{"x": 100, "y": 100}, {"x": 700, "y": 500}]
stroke-color: "#0000ff"
stroke-width: 3
title: "Line"
subtitle: "Line segment from (100,100) to (700,500)"`,
      'Circle': `geometry-shape
type: circle
coordinates: [{"x": 400, "y": 300}]
radius: 80
fill: true
fill-color: "#00ff00"
stroke-color: "#000000"
stroke-width: 2
title: "Circle"
subtitle: "Circle with center (400,300) and radius 80"`,
      'Triangle': `geometry-shape
type: polygon
coordinates: [{"x": 400, "y": 200}, {"x": 300, "y": 400}, {"x": 500, "y": 400}]
fill: true
fill-color: "#ff00ff"
stroke-color: "#000000"
stroke-width: 2
title: "Triangle"
subtitle: "Triangle with vertices at (400,200), (300,400), (500,400)"`,
      'Rectangle': `geometry-shape
type: polygon
coordinates: [{"x": 300, "y": 200}, {"x": 500, "y": 200}, {"x": 500, "y": 400}, {"x": 300, "y": 400}]
fill: true
fill-color: "#00ffff"
stroke-color: "#000000"
stroke-width: 2
title: "Rectangle"
subtitle: "Rectangle 200x300 at (300,200)"`,
      'Pentagon': `geometry-shape
type: polygon
coordinates: [{"x": 400, "y": 150}, {"x": 500, "y": 250}, {"x": 450, "y": 380}, {"x": 350, "y": 380}, {"x": 300, "y": 250}]
fill: true
fill-color: "#ffff00"
stroke-color: "#000000"
stroke-width: 2
title: "Pentagon"
subtitle: "Regular pentagon with 5 vertices"`,
      'Hexagon': `geometry-shape
type: polygon
coordinates: [{"x": 400, "y": 150}, {"x": 480, "y": 200}, {"x": 480, "y": 300}, {"x": 400, "y": 350}, {"x": 320, "y": 300}, {"x": 320, "y": 200}]
fill: true
fill-color: "#ff8800"
stroke-color: "#000000"
stroke-width: 2
title: "Hexagon"
subtitle: "Regular hexagon with 6 vertices"`,
      'Histogram': `statistics-chart
type: histogram
data: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]
bins: 5
color: "#ff6600"
show-mean: true
title: "Histogram"
subtitle: "Frequency distribution of 15 data points"`,
      'Box Plot': `statistics-chart
type: box-plot
data: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]
color: "#0066cc"
show-mean: true
show-median: true
title: "Box Plot"
subtitle: "Statistical quartiles and outliers"`,
      'Scatter Plot': `statistics-chart
type: scatter
data: [{"x": 1, "y": 2}, {"x": 2, "y": 4}, {"x": 3, "y": 3}, {"x": 4, "y": 5}, {"x": 5, "y": 7}, {"x": 6, "y": 6}, {"x": 7, "y": 8}]
color: "#009900"
title: "Scatter Plot"
subtitle: "Correlation between X and Y variables"`,
      'Line Chart': `statistics-chart
type: line-chart
data: [2, 5, 3, 8, 6, 9, 7, 12, 10, 15]
color: "#0066cc"
title: "Line Chart"
subtitle: "Time series data visualization"`,
      'Bar Chart': `statistics-chart
type: bar-chart
data: [15, 25, 10, 30, 20, 35, 12, 28]
color: "#cc0066"
title: "Bar Chart"
subtitle: "Categorical data comparison"`,
      'Pie Chart': `statistics-chart
type: pie-chart
data: [30, 25, 20, 15, 10]
color: "#ff6600"
title: "Pie Chart"
subtitle: "Proportional data representation"`,
      'Normal Distribution': `statistics-chart
type: normal-distribution
data: [3, 3.1, 3.2, 2.9, 3.3, 2.8, 3.1, 3.0, 2.9, 3.2]
color: "#0099ff"
title: "Normal Distribution"
subtitle: "Bell curve with μ=3.05, σ=0.13"`,
      'Heatmap': `statistics-chart
type: heatmap
data: [[1, 2, 3, 4, 5], [2, 4, 6, 8, 10], [3, 6, 9, 12, 15], [4, 8, 12, 16, 20], [5, 10, 15, 20, 25]]
title: "Heatmap"
subtitle: "Data intensity visualization"`,
      'Cartesian Coordinate System': `coordinate-system
type: cartesian
range-x: [-5, 5]
range-y: [-5, 5]
grid-spacing: 1
show-grid: true
show-axes: true
show-labels: true
title: "Cartesian Coordinate System"
subtitle: "Standard X-Y plane with grid"`,
      'Polar Coordinate System': `coordinate-system
type: polar
range-x: [-5, 5]
range-y: [-5, 5]
grid-spacing: 1
show-grid: true
show-axes: true
show-labels: true
title: "Polar Coordinate System"
subtitle: "Polar coordinates with r-θ grid"`,
      'Parametric Equations': `coordinate-system
type: parametric
range-x: [-5, 5]
range-y: [-5, 5]
grid-spacing: 1
show-grid: true
show-axes: true
show-labels: true
title: "Parametric Equations"
subtitle: "Parametric x(t), y(t) coordinate system"`,
      'Vector Field (Basic)': `vector-field
type: 2d-vector
equation-x: "-y"
equation-y: "x"
range-x: [-5, 5]
range-y: [-5, 5]
grid-spacing: 1
color: "#ff0000"
title: "Vector Field"
subtitle: "2D vector field: F(x,y) = (-y, x)"`,
      'Contour Plot (Basic)': `contour-plot
type: level-curves
equation: "x**2 + y**2"
range-x: [-3, 3]
range-y: [-3, 3]
levels: 5
color: "#0066cc"
title: "Contour Plot"
subtitle: "Level curves of f(x,y) = x² + y²"`,
      'Venn Diagram': `logic-diagram
type: venn
sets: 2
labels: ["A", "B"]
intersection: true
color: "#ff6600"
title: "Venn Diagram"
subtitle: "Set intersection visualization"`,
      'Truth Table': `logic-diagram
type: truth-table
variables: ["p", "q"]
expression: "p AND q"
color: "#0066cc"
title: "Truth Table"
subtitle: "Logical operations truth values"`,
      'Number Line': `educational-math
type: number-line
range: [-10, 10]
marks: 1
labels: true
color: "#000000"
title: "Number Line"
subtitle: "Integer number line from -10 to 10"`,
      'Fraction Bars': `educational-math
type: fraction-bars
fractions: ["1/2", "1/3", "3/4"]
color: "#009900"
title: "Fraction Bars"
subtitle: "Visual fraction representation"`
    };
  }

  /**
   * Export diagram as image data URL
   */
  async exportAsDataURL(diagramText, format = 'png') {
    const result = await this.render(diagramText);
    
    if (!result.success) {
      throw new Error(`Render failed: ${result.errors.join(', ')}`);
    }
    
    return result.canvas.toDataURL(`image/${format}`);
  }

  /**
   * Export diagram as buffer (Node.js only)
   */
  async exportAsBuffer(diagramText, format = 'png') {
    const result = await this.render(diagramText);
    
    if (!result.success) {
      throw new Error(`Render failed: ${result.errors.join(', ')}`);
    }
    
    if (typeof window !== 'undefined') {
      throw new Error('Buffer export only available in Node.js environment');
    }
    
    return result.canvas.toBuffer(`image/${format}`);
  }

  /**
   * Get engine statistics
   */
  getStats() {
    return {
      version: '1.0.0',
      supportedTypes: this.getSupportedDiagramTypes(),
      config: this.config,
      logStats: logger.getLogStats()
    };
  }

  /**
   * Clear logs
   */
  clearLogs() {
    logger.clearLogs();
  }
}

export default MathDiagramEngine;
