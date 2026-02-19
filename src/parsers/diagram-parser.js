/**
 * Diagram definition parser for Math Diagram Engine
 * Parses text-based diagram definitions into structured objects
 */

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
import {
  DiagramTypes,
  FunctionTypes,
  GeometryTypes,
  StatisticsTypes,
  CoordinateSystemTypes,
  FunctionDiagram,
  GeometryDiagram,
  StatisticsDiagram,
  CoordinateSystemDiagram,
  LogicDiagram,
  EducationalDiagram,
  ParseResult
} from '../types/index.js';

export class DiagramParser {
  constructor() {
    this.supportedDiagrams = new Set([
      'math-function',
      'geometry-shape', 
      'statistics-chart',
      'coordinate-system',
      'logic-diagram',
      'educational-math',
      'vector-field',
      'contour-plot'
    ]);
  }

  /**
   * Parse diagram definition from text
   */
  parse(diagramText) {
    const startTime = Date.now();
    const result = new ParseResult();
    
    try {
      logger.debug('Starting diagram parse', { textLength: diagramText.length });
      
      const lines = diagramText.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length === 0) {
        throw new Error('Empty diagram definition');
      }
      
      const diagramType = this.extractDiagramType(lines[0]);
      
      if (!this.supportedDiagrams.has(diagramType)) {
        throw new Error(`Unsupported diagram type: ${diagramType}`);
      }
      
      const properties = this.parseProperties(lines.slice(1));
      
      switch (diagramType) {
        case 'math-function':
          result.diagram = this.parseFunctionDiagram(properties);
          break;
        case 'geometry-shape':
          result.diagram = this.parseGeometryDiagram(properties);
          break;
        case 'statistics-chart':
          result.diagram = this.parseStatisticsDiagram(properties);
          break;
        case 'coordinate-system':
          result.diagram = this.parseCoordinateSystemDiagram(properties);
          break;
        case 'logic-diagram':
          result.diagram = this.parseLogicDiagram(properties);
          break;
        case 'educational-math':
          result.diagram = this.parseEducationalDiagram(properties);
          break;
        case 'vector-field':
          result.diagram = this.parseVectorFieldDiagram(properties);
          break;
        case 'contour-plot':
          result.diagram = this.parseContourPlotDiagram(properties);
          break;
        default:
          throw new Error(`Parser not implemented for: ${diagramType}`);
      }
      
      result.success = true;
      
      const parseTime = Date.now() - startTime;
      logger.diagramParse(diagramType, diagramText, true, result.errors);
      logger.performance('Diagram Parse', parseTime, { type: diagramType });
      
    } catch (error) {
      result.errors.push(error.message);
      logger.diagramParse('unknown', diagramText, false, [error.message]);
    }
    
    return result;
  }

  /**
   * Extract diagram type from first line
   */
  extractDiagramType(firstLine) {
    const match = firstLine.match(/^(\w+(?:-\w+)*)/);
    return match ? match[1].toLowerCase() : '';
  }

  /**
   * Parse key-value properties from lines
   */
  parseProperties(lines) {
    const properties = {};
    
    for (const line of lines) {
      // Skip comments
      if (line.startsWith('#') || line.startsWith('//')) {
        continue;
      }
      
      // Parse key: value pairs
      const colonMatch = line.match(/^(\w+(?:-\w+)*)\s*:\s*(.+)$/);
      if (colonMatch) {
        const [, key, value] = colonMatch;
        properties[key] = this.parseValue(value);
        continue;
      }
      
      // Parse nested properties (indentation-based)
      const indentMatch = line.match(/^(\s+)(\w+(?:-\w+)*)\s*:\s*(.+)$/);
      if (indentMatch) {
        const [, indent, key, value] = colonMatch;
        const indentLevel = indent.length / 2; // Assuming 2 spaces per level
        
        if (!properties.nested) {
          properties.nested = {};
        }
        
        this.setNestedProperty(properties.nested, key, this.parseValue(value), indentLevel);
      }
    }
    
    return properties;
  }

  /**
   * Parse a value (string, number, array, object)
   */
  parseValue(value) {
    value = value.trim();
    
    // Remove quotes for strings
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    
    // Parse arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        return JSON.parse(value);
      } catch {
        // Fallback for comma-separated values
        return value.slice(1, -1).split(',').map(v => this.parseValue(v.trim()));
      }
    }
    
    // Parse objects
    if (value.startsWith('{') && value.endsWith('}')) {
      try {
        return JSON.parse(value);
      } catch {
        throw new Error(`Invalid object format: ${value}`);
      }
    }
    
    // Parse booleans
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    
    // Parse numbers
    const num = parseFloat(value);
    if (!isNaN(num)) {
      return num;
    }
    
    // Return as string
    return value;
  }

  /**
   * Set nested property based on indentation level
   */
  setNestedProperty(obj, key, value, level) {
    if (level === 0) {
      obj[key] = value;
    } else {
      if (!obj._nested) obj._nested = {};
      this.setNestedProperty(obj._nested, key, value, level - 1);
    }
  }

  /**
   * Parse function diagram
   */
  parseFunctionDiagram(properties) {
    const diagram = new FunctionDiagram();
    
    diagram.functionType = properties.type || FunctionTypes.LINEAR;
    diagram.equation = properties.equation || '';
    diagram.rangeX = properties['range-x'] || [-10, 10];
    diagram.rangeY = properties['range-y'] || [-10, 10];
    diagram.color = properties.color || '#ff0000';
    diagram.lineWidth = properties['line-width'] || 2;
    diagram.samples = properties.samples || 100;
    diagram.showDerivative = properties['show-derivative'] || false;
    diagram.showIntegral = properties['show-integral'] || false;
    
    // Validate required properties
    if (!diagram.equation) {
      throw new Error('Function diagram requires an equation');
    }
    
    if (!Object.values(FunctionTypes).includes(diagram.functionType)) {
      throw new Error(`Invalid function type: ${diagram.functionType}`);
    }
    
    return diagram;
  }

  /**
   * Parse geometry diagram
   */
  parseGeometryDiagram(properties) {
    const diagram = new GeometryDiagram();
    
    diagram.geometryType = properties.type || GeometryTypes.POINT;
    diagram.coordinates = properties.coordinates || [];
    diagram.fill = properties.fill || false;
    diagram.fillColor = properties['fill-color'] || '#ff0000';
    diagram.stroke = properties.stroke !== false;
    diagram.strokeColor = properties['stroke-color'] || '#000000';
    diagram.strokeWidth = properties['stroke-width'] || 2;
    diagram.radius = properties.radius || 5;
    diagram.title = properties.title || '';
    
    // Validate required properties
    if (!Object.values(GeometryTypes).includes(diagram.geometryType)) {
      throw new Error(`Invalid geometry type: ${diagram.geometryType}`);
    }
    
    if (diagram.coordinates.length === 0) {
      throw new Error('Geometry diagram requires coordinates');
    }
    
    return diagram;
  }

  /**
   * Parse statistics diagram
   */
  parseStatisticsDiagram(properties) {
    const diagram = new StatisticsDiagram();
    
    diagram.statisticsType = properties.type || StatisticsTypes.HISTOGRAM;
    diagram.data = properties.data || [];
    diagram.bins = properties.bins || 10;
    diagram.color = properties.color || '#0000ff';
    diagram.showMean = properties['show-mean'] || false;
    diagram.showMedian = properties['show-median'] || false;
    diagram.showStdDev = properties['show-std-dev'] || false;
    
    // Validate required properties
    if (!Object.values(StatisticsTypes).includes(diagram.statisticsType)) {
      throw new Error(`Invalid statistics type: ${diagram.statisticsType}`);
    }
    
    if (diagram.data.length === 0) {
      throw new Error('Statistics diagram requires data');
    }
    
    return diagram;
  }

  /**
   * Parse coordinate system diagram
   */
  parseCoordinateSystemDiagram(properties) {
    const diagram = new CoordinateSystemDiagram();
    
    diagram.systemType = properties.type || CoordinateSystemTypes.CARTESIAN;
    diagram.rangeX = properties['range-x'] || [-10, 10];
    diagram.rangeY = properties['range-y'] || [-10, 10];
    diagram.rangeZ = properties['range-z'] || [-10, 10];
    diagram.gridSpacing = properties['grid-spacing'] || 1;
    diagram.showGrid = properties['show-grid'] !== false;
    diagram.showAxes = properties['show-axes'] !== false;
    diagram.showLabels = properties['show-labels'] !== false;
    
    // Validate required properties
    if (!Object.values(CoordinateSystemTypes).includes(diagram.systemType)) {
      throw new Error(`Invalid coordinate system type: ${diagram.systemType}`);
    }
    
    return diagram;
  }

  /**
   * Parse logic diagram
   */
  parseLogicDiagram(properties) {
    const diagram = new LogicDiagram();
    
    diagram.logicType = properties.type || 'venn';
    diagram.sets = properties.sets || 2;
    diagram.labels = properties.labels || [];
    diagram.intersection = properties.intersection !== false;
    diagram.variables = properties.variables || [];
    diagram.expression = properties.expression || '';
    diagram.color = properties.color || '#000000';
    
    return diagram;
  }

  /**
   * Parse educational diagram
   */
  parseEducationalDiagram(properties) {
    const diagram = new EducationalDiagram();
    
    diagram.educationalType = properties.type || 'number-line';
    diagram.range = properties.range || [-10, 10];
    diagram.marks = properties.marks || 1;
    diagram.labels = properties.labels !== false;
    diagram.fractions = properties.fractions || [];
    diagram.color = properties.color || '#000000';
    
    return diagram;
  }

  /**
   * Parse vector field diagram
   */
  parseVectorFieldDiagram(properties) {
    const diagram = {
      type: DiagramTypes.VECTOR_FIELD,
      fieldType: properties.type || '2d-vector',
      equationX: properties['equation-x'] || '',
      equationY: properties['equation-y'] || '',
      rangeX: properties['range-x'] || [-5, 5],
      rangeY: properties['range-y'] || [-5, 5],
      gridSpacing: properties['grid-spacing'] || 1,
      color: properties.color || '#ff0000'
    };
    
    return diagram;
  }

  /**
   * Parse contour plot diagram
   */
  parseContourPlotDiagram(properties) {
    const diagram = {
      type: DiagramTypes.CONTOUR,
      contourType: properties.type || 'level-curves',
      equation: properties.equation || '',
      rangeX: properties['range-x'] || [-3, 3],
      rangeY: properties['range-y'] || [-3, 3],
      levels: properties.levels || 5,
      color: properties.color || '#0066cc'
    };
    
    return diagram;
  }

  /**
   * Validate diagram definition syntax
   */
  validateSyntax(diagramText) {
    const errors = [];
    const lines = diagramText.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length === 0) {
      errors.push('Empty diagram definition');
      return errors;
    }
    
    // Check first line is a valid diagram type
    const firstLine = lines[0];
    if (!/^(\w+(?:-\w+)*)$/.test(firstLine)) {
      errors.push('First line must be a diagram type (e.g., "math-function")');
    }
    
    // Check property syntax
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip comments
      if (line.startsWith('#') || line.startsWith('//')) {
        continue;
      }
      
      // Check for valid property format
      if (!/^(\w+(?:-\w+)*)\s*:\s*.+$/.test(line)) {
        errors.push(`Invalid property format on line ${i + 1}: "${line}"`);
      }
    }
    
    return errors;
  }
}

export default new DiagramParser();
