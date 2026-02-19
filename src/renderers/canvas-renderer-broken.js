/**
 * Canvas-based renderer for Math Diagram Engine
 * Inspired by Clumsy.js but enhanced for mathematical diagrams
 */

import logger from '../utils/logger.js';
import MathParser from '../parsers/math-parser.js';

export class CanvasRenderer {
  constructor(canvas, config = {}) {
    if (!canvas) {
      throw new Error('Canvas element is required');
    }
    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = {
      width: 800,
      height: 600,
      padding: 50,
      backgroundColor: '#ffffff',
      gridColor: '#e0e0e0',
      axisColor: '#333333',
      fontFamily: 'Arial, sans-serif',
      fontSize: 12,
      lineWidth: 2,
      showGrid: true,
      showAxes: true,
      showLabels: true,
      title: '',
      ...config
    };
    
    this.setupCanvas();
    this.mathParser = MathParser;
  }

  setupCanvas() {
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    
    // Set default styles
    this.ctx.font = `${this.config.fontSize}px ${this.config.fontFamily}`;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Calculate drawing area
    this.drawArea = {
      left: this.config.padding,
      right: this.config.width - this.config.padding,
      top: this.config.padding,
      bottom: this.config.height - this.config.padding,
      width: this.config.width - 2 * this.config.padding,
      height: this.config.height - 2 * this.config.padding
    };
  }

  /**
   * Clear canvas with background color
   */
  clear() {
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Convert mathematical coordinates to canvas coordinates
   */
  mathToCanvas(x, y, rangeX, rangeY) {
    const [xMin, xMax] = rangeX;
    const [yMin, yMax] = rangeY;
    
    const canvasX = this.drawArea.left + ((x - xMin) / (xMax - xMin)) * this.drawArea.width;
    const canvasY = this.drawArea.bottom - ((y - yMin) / (yMax - yMin)) * this.drawArea.height;
    
    return { x: canvasX, y: canvasY };
  }

  /**
   * Draw coordinate system
   */
  drawCoordinateSystem(rangeX, rangeY, gridSpacing = 1) {
    if (this.config.showGrid) {
      this.drawGrid(rangeX, rangeY, gridSpacing);
    }
    
    if (this.config.showAxes) {
      this.drawAxes(rangeX, rangeY);
    }
    
    if (this.config.showLabels) {
      this.drawAxisLabels(rangeX, rangeY, gridSpacing);
  }

  /**
   * Draw grid
   */
  drawGrid(rangeX, rangeY, gridSpacing) {
    const [xMin, xMax] = rangeX;
    const [yMin, yMax] = rangeY;
    
    this.ctx.strokeStyle = this.config.gridColor;
    this.ctx.lineWidth = 0.5;
    
    // Vertical grid lines
    for (let x = Math.ceil(xMin / gridSpacing) * gridSpacing; x <= xMax; x += gridSpacing) {
      const canvasPoint = this.mathToCanvas(x, 0, rangeX, rangeY);
      
      this.ctx.beginPath();
      this.ctx.moveTo(canvasPoint.x, this.drawArea.top);
      this.ctx.lineTo(canvasPoint.x, this.drawArea.bottom);
      this.ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = Math.ceil(yMin / gridSpacing) * gridSpacing; y <= yMax; y += gridSpacing) {
      const canvasPoint = this.mathToCanvas(0, y, rangeX, rangeY);
      
      this.ctx.beginPath();
      this.ctx.moveTo(this.drawArea.left, canvasPoint.y);
      this.ctx.lineTo(this.drawArea.right, canvasPoint.y);
      this.ctx.stroke();
    }
  }

  /**
   * Draw axes
   */
  drawAxes(rangeX, rangeY) {
    this.ctx.strokeStyle = this.config.axisColor;
    this.ctx.lineWidth = 2;
    
    // X-axis
    const yZero = this.mathToCanvas(0, 0, rangeX, rangeY);
    if (yZero.y >= this.drawArea.top && yZero.y <= this.drawArea.bottom) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.drawArea.left, yZero.y);
      this.ctx.lineTo(this.drawArea.right, yZero.y);
      this.ctx.stroke();
    }
    
    // Y-axis
    const xZero = this.mathToCanvas(0, 0, rangeX, rangeY);
    if (xZero.x >= this.drawArea.left && xZero.x <= this.drawArea.right) {
      this.ctx.beginPath();
      this.ctx.moveTo(xZero.x, this.drawArea.top);
      this.ctx.lineTo(xZero.x, this.drawArea.bottom);
      this.ctx.stroke();
    }
  }

  /**
   * Draw axis labels
   */
  drawAxisLabels(rangeX, rangeY, gridSpacing) {
    const [xMin, xMax] = rangeX;
    const [yMin, yMax] = rangeY;
    
    this.ctx.fillStyle = this.config.axisColor;
    this.ctx.font = `${this.config.fontSize}px ${this.config.fontFamily}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    
    // X-axis labels
    for (let x = Math.ceil(xMin / gridSpacing) * gridSpacing; x <= xMax; x += gridSpacing) {
      const canvasPoint = this.mathToCanvas(x, 0, rangeX, rangeY);
      
      if (Math.abs(x) > 0.001) { // Skip zero
        this.ctx.fillText(x.toString(), canvasPoint.x, this.drawArea.bottom + 5);
      }
    }
    
    // Y-axis labels
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    
    for (let y = Math.ceil(yMin / gridSpacing) * gridSpacing; y <= yMax; y += gridSpacing) {
      const canvasPoint = this.mathToCanvas(0, y, rangeX, rangeY);
      
      if (Math.abs(y) > 0.001) { // Skip zero
        this.ctx.fillText(y.toString(), this.drawArea.left - 5, canvasPoint.y);
      }
    }
  }

  /**
   * Draw function plot
   */
  drawFunction(diagram) {
    try {
      const points = this.mathParser.generatePoints(
        diagram.equation,
        diagram.rangeX,
        diagram.samples
      );
      
      if (points.length === 0) {
        throw new Error('No valid points generated for function');
      }
      
      this.ctx.strokeStyle = diagram.color;
      this.ctx.lineWidth = diagram.lineWidth;
      
      this.ctx.beginPath();
      
      let started = false;
      for (const point of points) {
        const canvasPoint = this.mathToCanvas(point.x, point.y, diagram.rangeX, diagram.rangeY);
        
        if (!started) {
          this.ctx.moveTo(canvasPoint.x, canvasPoint.y);
          started = true;
        } else {
          this.ctx.lineTo(canvasPoint.x, canvasPoint.y);
        }
      }
      
      this.ctx.stroke();
      
      logger.debug('Function drawn successfully', {
        equation: diagram.equation,
        pointsCount: points.length
      });
      
    } catch (error) {
      logger.error('Failed to draw function', {
        equation: diagram.equation,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Draw geometric shapes
   */
  drawGeometry(diagram) {
    this.ctx.strokeStyle = diagram.strokeColor;
    this.ctx.fillStyle = diagram.fillColor;
    this.ctx.lineWidth = diagram.strokeWidth;
    
    switch (diagram.geometryType) {
      case 'point':
        this.drawPoints(diagram.coordinates, diagram.radius);
        break;
      case 'line':
        this.drawLine(diagram.coordinates);
        break;
      case 'circle':
        this.drawCircle(diagram.coordinates, diagram.radius, diagram.fill);
        break;
      case 'polygon':
        this.drawPolygon(diagram.coordinates, diagram.fill);
        break;
      default:
        throw new Error(`Unsupported geometry type: ${diagram.geometryType}`);
    }
  }

  /**
   * Draw points
   */
  drawPoints(coordinates, radius) {
    for (const point of coordinates) {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  /**
   * Draw line
   */
  drawLine(coordinates) {
    if (coordinates.length < 2) {
      throw new Error('Line requires at least 2 points');
    }
    
    this.ctx.beginPath();
    this.ctx.moveTo(coordinates[0].x, coordinates[0].y);
    
    for (let i = 1; i < coordinates.length; i++) {
      this.ctx.lineTo(coordinates[i].x, coordinates[i].y);
    }
    
    this.ctx.stroke();
  }

  /**
   * Draw circle
   */
  drawCircle(coordinates, radius, fill) {
    if (coordinates.length !== 1) {
      throw new Error('Circle requires exactly 1 center point');
    }
    
    const center = coordinates[0];
    
    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    
    if (fill) {
      this.ctx.fill();
    }
    
    this.ctx.stroke();
  }

  /**
   * Draw polygon
   */
  drawPolygon(coordinates, fill) {
    if (coordinates.length < 3) {
      throw new Error('Polygon requires at least 3 points');
    }
    
    this.ctx.beginPath();
    this.ctx.moveTo(coordinates[0].x, coordinates[0].y);
    
    for (let i = 1; i < coordinates.length; i++) {
      this.ctx.lineTo(coordinates[i].x, coordinates[i].y);
    }
    
    this.ctx.closePath();
    
    if (fill) {
      this.ctx.fill();
    }
    
    this.ctx.stroke();
  }

  /**
   * Draw statistical charts
   */
  drawStatistics(diagram) {
    switch (diagram.statisticsType) {
      case 'histogram':
        this.drawHistogram(diagram);
        break;
      case 'scatter':
        this.drawScatterPlot(diagram);
        break;
      case 'line-chart':
        this.drawLineChart(diagram);
        break;
      case 'bar-chart':
        this.drawBarChart(diagram);
        break;
      case 'box-plot':
        this.drawBoxPlot(diagram);
        break;
      case 'pie-chart':
        this.drawPieChart(diagram);
        break;
      case 'normal-distribution':
        this.drawNormalDistribution(diagram);
        break;
      default:
        throw new Error(`Unsupported statistics type: ${diagram.statisticsType}`);
    }
  }

  /**
   * Draw histogram
   */
  drawHistogram(diagram) {
    const data = diagram.data;
    const bins = diagram.bins;
    
    if (data.length === 0) {
      throw new Error('Histogram requires data');
    }
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    
    const histogram = new Array(bins).fill(0);
    
    // Count data points in each bin
    for (const value of data) {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      histogram[binIndex]++;
    }
    
    const maxCount = Math.max(...histogram);
    
    // Draw bars
    this.ctx.fillStyle = diagram.color;
    
    const barWidth = this.drawArea.width / bins;
    
    for (let i = 0; i < bins; i++) {
      const barHeight = (histogram[i] / maxCount) * this.drawArea.height;
      const x = this.drawArea.left + i * barWidth;
      const y = this.drawArea.bottom - barHeight;
      
      this.ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
  }

  /**
   * Draw scatter plot
   */
  drawScatterPlot(diagram) {
    const data = diagram.data;
    
    if (data.length === 0) {
      throw new Error('Scatter plot requires data');
    }
    
    // Assuming data is array of {x, y} points
    const xValues = data.map(p => p.x || p[0]);
    const yValues = data.map(p => p.y || p[1]);
    
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    this.ctx.fillStyle = diagram.color;
    
    for (const point of data) {
      const x = point.x || point[0];
      const y = point.y || point[1];
      
      const canvasPoint = this.mathToCanvas(x, y, [xMin, xMax], [yMin, yMax]);
      
      this.ctx.beginPath();
      this.ctx.arc(canvasPoint.x, canvasPoint.y, 3, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  /**
   * Draw line chart
   */
  drawLineChart(diagram) {
    const data = diagram.data;
    
    if (data.length === 0) {
      throw new Error('Line chart requires data');
    }
    
    // Assuming data is array of {x, y} points or just y values
    const xValues = data.map((p, i) => (p.x !== undefined ? p.x : i));
    const yValues = data.map(p => (p.y !== undefined ? p.y : p));
    
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    this.ctx.strokeStyle = diagram.color;
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
      const x = xValues[i];
      const y = yValues[i];
      
      const canvasPoint = this.mathToCanvas(x, y, [xMin, xMax], [yMin, yMax]);
      
      if (i === 0) {
        this.ctx.moveTo(canvasPoint.x, canvasPoint.y);
      } else {
        this.ctx.lineTo(canvasPoint.x, canvasPoint.y);
      }
    }
    
    this.ctx.stroke();
  }

  /**
   * Draw box plot
   */
  drawBoxPlot(diagram) {
    const data = diagram.data;
    
    if (data.length === 0) {
      throw new Error('Box plot requires data');
    }
    
    // Calculate quartiles
    const sorted = [...data].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    const boxWidth = this.drawArea.width * 0.6;
    const boxLeft = (this.drawArea.width - boxWidth) / 2;
    const boxHeight = this.drawArea.height * 0.8;
    const boxTop = (this.drawArea.height - boxHeight) / 2;
    
    // Scale data to canvas
    const dataRange = max - min;
    const scale = boxHeight / dataRange;
    
    const scaledMin = boxTop + boxHeight - (0 - min) * scale;
    const scaledQ1 = boxTop + boxHeight - (q1 - min) * scale;
    const scaledMedian = boxTop + boxHeight - (median - min) * scale;
    const scaledQ3 = boxTop + boxHeight - (q3 - min) * scale;
    const scaledMax = boxTop + boxHeight - (max - min) * scale;
    
    this.ctx.fillStyle = diagram.color;
    this.ctx.strokeStyle = diagram.color;
    this.ctx.lineWidth = 2;
    
    // Draw box
    this.ctx.fillRect(boxLeft, scaledQ3, boxWidth, scaledQ1 - scaledQ3);
    this.ctx.strokeRect(boxLeft, scaledQ3, boxWidth, scaledQ1 - scaledQ3);
    
    // Draw median line
    this.ctx.beginPath();
    this.ctx.moveTo(boxLeft, scaledMedian);
    this.ctx.lineTo(boxLeft + boxWidth, scaledMedian);
    this.ctx.stroke();
    
    // Draw whiskers
    this.ctx.beginPath();
    this.ctx.moveTo(boxLeft + boxWidth / 2, scaledQ3);
    this.ctx.lineTo(boxLeft + boxWidth / 2, scaledMax);
    this.ctx.moveTo(boxLeft + boxWidth / 2, scaledQ1);
    this.ctx.lineTo(boxLeft + boxWidth / 2, scaledMin);
    this.ctx.stroke();
  }

  /**
   * Draw pie chart
   */
  drawPieChart(diagram) {
    const data = diagram.data;
    
    if (data.length === 0) {
      throw new Error('Pie chart requires data');
    }
    
    const total = data.reduce((sum, value) => sum + value, 0);
    const centerX = this.drawArea.left + this.drawArea.width / 2;
    const centerY = this.drawArea.top + this.drawArea.height / 2;
    const radius = Math.min(this.drawArea.width, this.drawArea.height) * 0.3;
    
    let currentAngle = -Math.PI / 2; // Start from top
    
    this.ctx.fillStyle = diagram.color;
    
    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (data[i] / total) * 2 * Math.PI;
      
      // Draw slice
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      
      currentAngle += sliceAngle;
    }
  }

  /**
   * Draw normal distribution
   */
  drawNormalDistribution(diagram) {
    const data = diagram.data;
    
    if (data.length === 0) {
      throw new Error('Normal distribution requires data');
    }
    
    // Calculate mean and standard deviation
    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    
    // Generate normal distribution curve
    const points = [];
    const xMin = mean - 4 * stdDev;
    const xMax = mean + 4 * stdDev;
    const step = (xMax - xMin) / 100;
    
    for (let x = xMin; x <= xMax; x += step) {
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
      points.push({ x, y });
    }
    
    // Scale to canvas
    const yMax = Math.max(...points.map(p => p.y));
    const xRange = xMax - xMin;
    const yRange = yMax * 1.2; // Add some padding
    
    this.ctx.strokeStyle = diagram.color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    
    for (let i = 0; i < points.length; i++) {
      const canvasX = this.drawArea.left + ((points[i].x - xMin) / xRange) * this.drawArea.width;
      const canvasY = this.drawArea.bottom - (points[i].y / yRange) * this.drawArea.height;
      
      if (i === 0) {
        this.ctx.moveTo(canvasX, canvasY);
      } else {
        this.ctx.lineTo(canvasX, canvasY);
      }
    }
    
    this.ctx.stroke();
  }

  /**
   * Draw bar chart
   */
  drawBarChart(diagram) {
    const data = diagram.data;
    
    if (data.length === 0) {
      throw new Error('Bar chart requires data');
    }
    
    const maxValue = Math.max(...data);
    const barWidth = this.drawArea.width / data.length;
    
    this.ctx.fillStyle = diagram.color;
    
    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / maxValue) * this.drawArea.height;
      const x = this.drawArea.left + i * barWidth;
      const y = this.drawArea.bottom - barHeight;
      
      this.ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
    }
  }

  /**
   * Draw title
   */
  drawTitle(title) {
    if (!title) return;
    
    this.ctx.fillStyle = this.config.axisColor;
    this.ctx.fillText(item.label, legendX + 20, y);
  });
}

/**
 * Draw axis labels with center alignment
 */
drawAxisLabels(rangeX, rangeY) {
  this.ctx.fillStyle = this.config.axisColor;
  this.ctx.font = `${this.config.fontSize}px ${this.config.fontFamily}`;
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'middle';
      
  // X-axis labels
  const xStep = (rangeX[1] - rangeX[0]) / 10;
  for (let i = 0; i <= 10; i++) {
    const x = rangeX[0] + i * xStep;
    const canvasPoint = this.mathToCanvas(x, 0, rangeX, rangeY);
      
    if (i % 2 === 0) { // Show every other label to avoid crowding
      this.ctx.fillText(x.toFixed(1), canvasPoint.x, this.drawArea.bottom + 20);
    }
  }
      
  // Y-axis labels
  const yStep = (rangeY[1] - rangeY[0]) / 10;
  for (let i = 0; i <= 10; i++) {
    const y = rangeY[0] + i * yStep;
    const canvasPoint = this.mathToCanvas(0, y, rangeX, rangeY);
      
    if (i % 2 === 0) { // Show every other label to avoid crowding
      this.ctx.fillText(y.toFixed(1), this.drawArea.left - 20, canvasPoint.y);
    }
  }
      
  // Axis titles (center aligned)
  this.ctx.font = `bold ${this.config.fontSize + 2}px ${this.config.fontFamily}`;
      
  // X-axis title
  this.ctx.fillText('X Axis', this.canvas.width / 2, this.canvas.height - 10);
      
  // Y-axis title (rotated 90 degrees)
  this.ctx.save();
  this.ctx.translate(15, this.canvas.height / 2);
  this.ctx.rotate(-Math.PI / 2);
  this.ctx.fillText('Y Axis', 0, 0);
  this.ctx.restore();
}

/**
 * Draw grid with markings
 */
drawGridWithMarkings(rangeX, rangeY, gridSpacing) {
  this.ctx.strokeStyle = this.config.gridColor;
  this.ctx.lineWidth = 0.5;
  this.ctx.setLineDash([2, 2]);
      
  // Vertical grid lines
  for (let x = rangeX[0]; x <= rangeX[1]; x += gridSpacing) {
    const canvasPoint = this.mathToCanvas(x, rangeY[0], rangeX, rangeY);
    this.ctx.beginPath();
    this.ctx.moveTo(canvasPoint.x, this.drawArea.top);
    this.ctx.lineTo(canvasPoint.x, this.drawArea.bottom);
    this.ctx.stroke();
  }
      
  // Horizontal grid lines
  for (let y = rangeY[0]; y <= rangeY[1]; y += gridSpacing) {
    const canvasPoint = this.mathToCanvas(rangeX[0], y, rangeX, rangeY);
    this.ctx.beginPath();
    this.ctx.moveTo(this.drawArea.left, canvasPoint.y);
    this.ctx.lineTo(this.drawArea.right, canvasPoint.y);
    this.ctx.stroke();
  }
      
  this.ctx.setLineDash([]);
}

export default CanvasRenderer;
