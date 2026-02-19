/**
 * Type definitions and interfaces for the Math Diagram Engine
 */

export const DiagramTypes = {
  FUNCTION: 'function',
  GEOMETRY: 'geometry',
  STATISTICS: 'statistics',
  COORDINATE_SYSTEM: 'coordinate-system',
  CALCULUS: 'calculus',
  VECTOR_FIELD: 'vector-field',
  CONTOUR: 'contour',
  LOGIC: 'logic',
  EDUCATIONAL: 'educational'
};

export const FunctionTypes = {
  LINEAR: 'linear',
  QUADRATIC: 'quadratic',
  CUBIC: 'cubic',
  POLYNOMIAL: 'polynomial',
  RATIONAL: 'rational',
  EXPONENTIAL: 'exponential',
  LOGARITHMIC: 'logarithmic',
  TRIGONOMETRIC: 'trigonometric',
  HYPERBOLIC: 'hyperbolic',
  PIECEWISE: 'piecewise'
};

export const GeometryTypes = {
  POINT: 'point',
  LINE: 'line',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  POLYGON: 'polygon',
  ARC: 'arc',
  SECTOR: 'sector'
};

export const StatisticsTypes = {
  HISTOGRAM: 'histogram',
  SCATTER: 'scatter',
  BOX_PLOT: 'box-plot',
  LINE: 'line',
  'LINE-CHART': 'line-chart',
  BAR: 'bar',
  'BAR-CHART': 'bar-chart',
  PIE: 'pie',
  'PIE-CHART': 'pie-chart',
  NORMAL_DISTRIBUTION: 'normal-distribution',
  HEATMAP: 'heatmap',
  PROBABILITY_DENSITY: 'probability-density'
};

export const CoordinateSystemTypes = {
  CARTESIAN: 'cartesian',
  POLAR: 'polar',
  PARAMETRIC: 'parametric',
  THREE_D: 'three-d'
};

export class DiagramConfig {
  constructor() {
    this.width = 800;
    this.height = 600;
    this.padding = 50;
    this.backgroundColor = '#ffffff';
    this.gridColor = '#e0e0e0';
    this.axisColor = '#333333';
    this.fontFamily = 'Arial, sans-serif';
    this.fontSize = 12;
    this.lineWidth = 2;
    this.showGrid = true;
    this.showAxes = true;
    this.showLabels = true;
    this.title = '';
  }
}

export class FunctionDiagram {
  constructor() {
    this.type = DiagramTypes.FUNCTION;
    this.functionType = FunctionTypes.LINEAR;
    this.equation = '';
    this.rangeX = [-10, 10];
    this.rangeY = [-10, 10];
    this.color = '#ff0000';
    this.lineWidth = 2;
    this.samples = 100;
    this.showDerivative = false;
    this.showIntegral = false;
  }
}

export class GeometryDiagram {
  constructor() {
    this.type = DiagramTypes.GEOMETRY;
    this.geometryType = GeometryTypes.POINT;
    this.coordinates = [];
    this.fill = false;
    this.fillColor = '#ff0000';
    this.stroke = true;
    this.strokeColor = '#000000';
    this.strokeWidth = 2;
    this.radius = 5;
  }
}

export class StatisticsDiagram {
  constructor() {
    this.type = DiagramTypes.STATISTICS;
    this.statisticsType = StatisticsTypes.HISTOGRAM;
    this.data = [];
    this.bins = 10;
    this.color = '#0000ff';
    this.showMean = false;
    this.showMedian = false;
    this.showStdDev = false;
  }
}

export class CoordinateSystemDiagram {
  constructor() {
    this.type = DiagramTypes.COORDINATE_SYSTEM;
    this.systemType = CoordinateSystemTypes.CARTESIAN;
    this.rangeX = [-10, 10];
    this.rangeY = [-10, 10];
    this.rangeZ = [-10, 10];
    this.gridSpacing = 1;
    this.showGrid = true;
    this.showAxes = true;
    this.showLabels = true;
  }
}

export class LogicDiagram {
  constructor() {
    this.type = DiagramTypes.LOGIC;
    this.logicType = 'venn'; // venn, truth-table, flow-chart
    this.sets = 2;
    this.labels = [];
    this.intersection = true;
    this.variables = [];
    this.expression = '';
    this.color = '#000000';
  }
}

export class EducationalDiagram {
  constructor() {
    this.type = DiagramTypes.EDUCATIONAL;
    this.educationalType = 'number-line'; // number-line, fraction-bars
    this.range = [-10, 10];
    this.marks = 1;
    this.labels = true;
    this.fractions = [];
    this.color = '#000000';
  }
}

export class ParseResult {
  constructor() {
    this.success = false;
    this.diagram = null;
    this.errors = [];
    this.warnings = [];
  }
}

export class RenderResult {
  constructor() {
    this.success = false;
    this.canvas = null;
    this.metadata = {};
    this.errors = [];
    this.warnings = [];
  }
}
