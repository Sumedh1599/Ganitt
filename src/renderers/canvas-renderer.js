/**
 * Canvas Renderer for Math Diagram Engine
 * Handles rendering of mathematical diagrams on HTML5 Canvas
 */

export class CanvasRenderer {
  constructor(canvas, config = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.config = {
      backgroundColor: '#ffffff',
      gridColor: '#e0e0e0',
      axisColor: '#333333',
      fontFamily: 'Arial, sans-serif',
      fontSize: 12,
      lineWidth: 2,
      showGrid: true,
      showAxes: true,
      showLabels: true,
      ...config
    };
    
    // Define drawing area with padding
    this.padding = 60;
    this.drawArea = {
      left: this.padding,
      top: this.padding,
      right: canvas.width - this.padding,
      bottom: canvas.height - this.padding,
      width: canvas.width - 2 * this.padding,
      height: canvas.height - 2 * this.padding
    };
  }

  /**
   * Clear canvas
   */
  clear() {
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Convert mathematical coordinates to canvas coordinates
   */
  mathToCanvas(x, y, rangeX, rangeY) {
    const canvasX = this.drawArea.left + (x - rangeX[0]) / (rangeX[1] - rangeX[0]) * this.drawArea.width;
    const canvasY = this.drawArea.bottom - (y - rangeY[0]) / (rangeY[1] - rangeY[0]) * this.drawArea.height;
    return { x: canvasX, y: canvasY };
  }

  /**
   * Draw coordinate system
   */
  drawCoordinateSystem(rangeX, rangeY, gridSpacing = 1) {
    // Draw grid
    if (this.config.showGrid) {
      this.drawGrid(rangeX, rangeY, gridSpacing);
    }
    
    // Draw axes
    if (this.config.showAxes) {
      this.drawAxes(rangeX, rangeY);
    }
    
    // Draw labels
    if (this.config.showLabels) {
      this.drawAxisLabels(rangeX, rangeY);
    }
  }

  /**
   * Draw grid
   */
  drawGrid(rangeX, rangeY, gridSpacing) {
    const [xMin, xMax] = rangeX;
    const [yMin, yMax] = rangeY;
    
    this.ctx.strokeStyle = this.config.gridColor;
    this.ctx.lineWidth = 0.5;
    this.ctx.setLineDash([2, 2]);
    
    // Vertical grid lines
    for (let x = Math.ceil(xMin / gridSpacing) * gridSpacing; x <= xMax; x += gridSpacing) {
      const canvasPoint = this.mathToCanvas(x, yMin, rangeX, rangeY);
      this.ctx.beginPath();
      this.ctx.moveTo(canvasPoint.x, this.drawArea.top);
      this.ctx.lineTo(canvasPoint.x, this.drawArea.bottom);
      this.ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = Math.ceil(yMin / gridSpacing) * gridSpacing; y <= yMax; y += gridSpacing) {
      const canvasPoint = this.mathToCanvas(xMin, y, rangeX, rangeY);
      this.ctx.beginPath();
      this.ctx.moveTo(this.drawArea.left, canvasPoint.y);
      this.ctx.lineTo(this.drawArea.right, canvasPoint.y);
      this.ctx.stroke();
    }
    
    this.ctx.setLineDash([]);
  }

  /**
   * Draw axes
   */
  drawAxes(rangeX, rangeY) {
    this.ctx.strokeStyle = this.config.axisColor;
    this.ctx.lineWidth = 2;
    
    // X-axis
    const xAxisY = this.mathToCanvas(0, 0, rangeX, rangeY).y;
    this.ctx.beginPath();
    this.ctx.moveTo(this.drawArea.left, xAxisY);
    this.ctx.lineTo(this.drawArea.right, xAxisY);
    this.ctx.stroke();
    
    // Y-axis
    const yAxisX = this.mathToCanvas(0, 0, rangeX, rangeY).x;
    this.ctx.beginPath();
    this.ctx.moveTo(yAxisX, this.drawArea.top);
    this.ctx.lineTo(yAxisX, this.drawArea.bottom);
    this.ctx.stroke();
  }

  /**
   * Draw axis labels
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
   * Draw function
   */
  drawFunction(diagram) {
    this.ctx.strokeStyle = diagram.color;
    this.ctx.lineWidth = diagram.lineWidth || this.config.lineWidth;
    this.ctx.beginPath();
    
    let firstPoint = true;
    const step = (diagram.rangeX[1] - diagram.rangeX[0]) / 1000;
    
    // Draw axes and grid first
    if (this.config.showGrid || this.config.showAxes) {
      this.drawAxes(diagram.rangeX, diagram.rangeY);
    }
    
    for (let x = diagram.rangeX[0]; x <= diagram.rangeX[1]; x += step) {
      const y = this.evaluateFunction(x, diagram.equation);
      
      if (!isNaN(y) && isFinite(y)) {
        const canvasPoint = this.mathToCanvas(x, y, diagram.rangeX, diagram.rangeY);
        
        if (firstPoint) {
          this.ctx.moveTo(canvasPoint.x, canvasPoint.y);
          firstPoint = false;
        } else {
          this.ctx.lineTo(canvasPoint.x, canvasPoint.y);
        }
      }
    }
    
    this.ctx.stroke();
    
    // Draw title after the function
    if (diagram.title) {
      this.drawTitle(diagram.title);
    }
  }

  /**
   * Evaluate mathematical function
   */
  evaluateFunction(x, equation) {
    try {
      // Simple evaluation - in a real implementation, use math.js
      const processedEquation = equation
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log')
        .replace(/exp/g, 'Math.exp')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs');
      
      return eval(processedEquation.replace(/x/g, `(${x})`));
    } catch (error) {
      return NaN;
    }
  }

  /**
   * Draw statistics
   */
  drawStatistics(diagram) {
    switch (diagram.statisticsType) {
      case 'histogram':
        this.drawHistogram(diagram);
        break;
      case 'scatter':
        this.drawScatterPlot(diagram);
        break;
      case 'line':
      case 'line-chart':
        this.drawLineChart(diagram);
        break;
      case 'bar':
      case 'bar-chart':
        this.drawBarChart(diagram);
        break;
      case 'box-plot':
        this.drawBoxPlot(diagram);
        break;
      case 'pie':
      case 'pie-chart':
        this.drawPieChart(diagram);
        break;
      case 'normal-distribution':
        this.drawNormalDistribution(diagram);
        break;
      case 'heatmap':
        this.drawHeatmap(diagram);
        break;
      default:
        console.warn(`Unknown statistics type: ${diagram.statisticsType}`);
    }
  }

  /**
   * Draw geometry
   */
  drawGeometry(diagram) {
    this.ctx.strokeStyle = diagram.strokeColor || this.config.axisColor;
    this.ctx.fillStyle = diagram.fillColor || this.config.backgroundColor;
    this.ctx.lineWidth = diagram.strokeWidth || this.config.lineWidth;
    
    switch (diagram.geometryType) {
      case 'point':
        this.drawPoint(diagram);
        break;
      case 'line':
        this.drawLine(diagram);
        break;
      case 'circle':
        this.drawCircle(diagram);
        break;
      case 'polygon':
        this.drawPolygon(diagram);
        break;
    }
    
    // Draw title for geometry shapes
    if (diagram.title) {
      this.drawTitle(diagram.title);
    }
  }

  /**
   * Draw point
   */
  drawPoint(diagram) {
    const point = diagram.coordinates[0];
    let canvasPoint;
    
    // Check if coordinates are absolute pixel coordinates or mathematical coordinates
    if (diagram.absoluteCoordinates || point.x > 100 || point.y > 100) {
      // Use absolute pixel coordinates directly
      canvasPoint = { x: point.x, y: point.y };
    } else {
      // Convert from mathematical coordinates
      canvasPoint = this.mathToCanvas(point.x, point.y, diagram.rangeX || [-10, 10], diagram.rangeY || [-10, 10]);
    }
    
    this.ctx.fillStyle = diagram.fillColor || this.config.axisColor;
    this.ctx.strokeStyle = diagram.strokeColor || this.config.axisColor;
    this.ctx.lineWidth = diagram.strokeWidth || this.config.lineWidth;
    
    this.ctx.beginPath();
    this.ctx.arc(canvasPoint.x, canvasPoint.y, diagram.radius || 5, 0, 2 * Math.PI);
    
    if (diagram.fill) {
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  /**
   * Draw line
   */
  drawLine(diagram) {
    const start = diagram.coordinates[0];
    const end = diagram.coordinates[1];
    const rangeX = diagram.rangeX || [-10, 10];
    const rangeY = diagram.rangeY || [-10, 10];
    
    this.ctx.strokeStyle = diagram.strokeColor || this.config.axisColor;
    this.ctx.lineWidth = diagram.strokeWidth || this.config.lineWidth;
    
    let startCanvas, endCanvas;
    
    // Check if coordinates are absolute pixel coordinates or mathematical coordinates
    if (diagram.absoluteCoordinates || start.x > 100 || start.y > 100) {
      // Use absolute pixel coordinates directly
      startCanvas = { x: start.x, y: start.y };
      endCanvas = { x: end.x, y: end.y };
    } else {
      // Convert from mathematical coordinates
      startCanvas = this.mathToCanvas(start.x, start.y, rangeX, rangeY);
      endCanvas = this.mathToCanvas(end.x, end.y, rangeX, rangeY);
    }
    
    this.ctx.beginPath();
    this.ctx.moveTo(startCanvas.x, startCanvas.y);
    this.ctx.lineTo(endCanvas.x, endCanvas.y);
    this.ctx.stroke();
  }

  /**
   * Draw circle
   */
  drawCircle(diagram) {
    const center = diagram.coordinates[0];
    const rangeX = diagram.rangeX || [-10, 10];
    const rangeY = diagram.rangeY || [-10, 10];
    
    this.ctx.strokeStyle = diagram.strokeColor || this.config.axisColor;
    this.ctx.fillStyle = diagram.fillColor || this.config.backgroundColor;
    this.ctx.lineWidth = diagram.strokeWidth || this.config.lineWidth;
    
    let centerCanvas;
    
    // Check if coordinates are absolute pixel coordinates or mathematical coordinates
    if (diagram.absoluteCoordinates || center.x > 100 || center.y > 100) {
      // Use absolute pixel coordinates directly
      centerCanvas = { x: center.x, y: center.y };
      // Use radius directly as pixels
      var radiusPixels = diagram.radius || 50;
    } else {
      // Convert from mathematical coordinates
      centerCanvas = this.mathToCanvas(center.x, center.y, rangeX, rangeY);
      // Convert radius from mathematical units to pixels
      var radiusPixels = diagram.radius * (this.drawArea.width / (rangeX[1] - rangeX[0]));
    }
    
    this.ctx.beginPath();
    this.ctx.arc(centerCanvas.x, centerCanvas.y, radiusPixels, 0, 2 * Math.PI);
    
    if (diagram.fill) {
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  /**
   * Draw polygon
   */
  drawPolygon(diagram) {
    const rangeX = diagram.rangeX || [-10, 10];
    const rangeY = diagram.rangeY || [-10, 10];
    
    this.ctx.strokeStyle = diagram.strokeColor || this.config.axisColor;
    this.ctx.fillStyle = diagram.fillColor || this.config.backgroundColor;
    this.ctx.lineWidth = diagram.strokeWidth || this.config.lineWidth;
    
    this.ctx.beginPath();
    
    diagram.coordinates.forEach((point, index) => {
      let canvasPoint;
      
      // Check if coordinates are absolute pixel coordinates or mathematical coordinates
      if (diagram.absoluteCoordinates || point.x > 100 || point.y > 100) {
        // Use absolute pixel coordinates directly
        canvasPoint = { x: point.x, y: point.y };
      } else {
        // Convert from mathematical coordinates
        canvasPoint = this.mathToCanvas(point.x, point.y, rangeX, rangeY);
      }
      
      if (index === 0) {
        this.ctx.moveTo(canvasPoint.x, canvasPoint.y);
      } else {
        this.ctx.lineTo(canvasPoint.x, canvasPoint.y);
      }
    });
    
    this.ctx.closePath();
    
    if (diagram.fill) {
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  /**
   * Draw histogram
   */
  drawHistogram(diagram) {
    const data = diagram.data;
    const bins = diagram.bins || 5;
    const rangeX = diagram.rangeX || [0, data.length];
    const rangeY = diagram.rangeY || [0, Math.max(...data)];
    
    // Draw coordinate system first
    this.drawCoordinateSystem(rangeX, rangeY);
    
    const binWidth = this.drawArea.width / bins;
    const maxValue = Math.max(...data);
    
    this.ctx.fillStyle = diagram.color;
    
    for (let i = 0; i < bins; i++) {
      const binStart = Math.floor(i * data.length / bins);
      const binEnd = Math.floor((i + 1) * data.length / bins);
      const binData = data.slice(binStart, binEnd);
      const binCount = binData.length;
      const binHeight = (binCount / data.length) * this.drawArea.height;
      
      const x = this.drawArea.left + i * binWidth;
      const y = this.drawArea.bottom - binHeight;
      
      this.ctx.fillRect(x + 2, y, binWidth - 4, binHeight);
    }
    
    // Draw title
    if (diagram.title) {
      this.ctx.fillStyle = this.config.axisColor;
      this.ctx.font = `bold ${this.config.fontSize + 2}px ${this.config.fontFamily}`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(diagram.title, this.canvas.width / 2, 30);
    }
  }

  /**
   * Draw scatter plot
   */
  drawScatterPlot(diagram) {
    const data = diagram.data;
    const rangeX = diagram.rangeX || [0, Math.max(...data.map(d => d.x))];
    const rangeY = diagram.rangeY || [0, Math.max(...data.map(d => d.y))];
    
    // Draw coordinate system first
    this.drawCoordinateSystem(rangeX, rangeY);
    
    this.ctx.fillStyle = diagram.color;
    
    data.forEach(point => {
      const canvasPoint = this.mathToCanvas(point.x, point.y, rangeX, rangeY);
      
      this.ctx.beginPath();
      this.ctx.arc(canvasPoint.x, canvasPoint.y, 3, 0, 2 * Math.PI);
      this.ctx.fill();
    });
    
    // Draw title
    if (diagram.title) {
      this.ctx.fillStyle = this.config.axisColor;
      this.ctx.font = `bold ${this.config.fontSize + 2}px ${this.config.fontFamily}`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(diagram.title, this.canvas.width / 2, 30);
    }
  }

  /**
   * Draw line chart
   */
  drawLineChart(diagram) {
    const data = diagram.data;
    const rangeX = diagram.rangeX || [0, data.length - 1];
    const rangeY = diagram.rangeY || [0, Math.max(...data)];
    
    // Draw coordinate system first
    this.drawCoordinateSystem(rangeX, rangeY);
    
    this.ctx.strokeStyle = diagram.color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    
    data.forEach((value, index) => {
      const canvasPoint = this.mathToCanvas(index, value, rangeX, rangeY);
      
      if (index === 0) {
        this.ctx.moveTo(canvasPoint.x, canvasPoint.y);
      } else {
        this.ctx.lineTo(canvasPoint.x, canvasPoint.y);
      }
    });
    
    this.ctx.stroke();
    
    // Draw data points
    this.ctx.fillStyle = diagram.color;
    data.forEach((value, index) => {
      const canvasPoint = this.mathToCanvas(index, value, rangeX, rangeY);
      this.ctx.beginPath();
      this.ctx.arc(canvasPoint.x, canvasPoint.y, 3, 0, 2 * Math.PI);
      this.ctx.fill();
    });
    
    // Draw title
    if (diagram.title) {
      this.ctx.fillStyle = this.config.axisColor;
      this.ctx.font = `bold ${this.config.fontSize + 2}px ${this.config.fontFamily}`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(diagram.title, this.canvas.width / 2, 30);
    }
  }

  /**
   * Draw bar chart
   */
  drawBarChart(diagram) {
    const data = diagram.data;
    const rangeX = diagram.rangeX || [0, data.length];
    const rangeY = diagram.rangeY || [0, Math.max(...data)];
    
    // Draw coordinate system first
    this.drawCoordinateSystem(rangeX, rangeY);
    
    const barWidth = this.drawArea.width / data.length;
    const maxValue = Math.max(...data);
    
    this.ctx.fillStyle = diagram.color;
    
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * this.drawArea.height;
      const x = this.drawArea.left + index * barWidth;
      const y = this.drawArea.bottom - barHeight;
      
      this.ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
      
      // Draw value labels on top of bars
      this.ctx.fillStyle = this.config.axisColor;
      this.ctx.font = `${this.config.fontSize - 2}px ${this.config.fontFamily}`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(value.toString(), x + barWidth/2, y - 5);
      this.ctx.fillStyle = diagram.color;
    });
    
    // Draw title
    if (diagram.title) {
      this.ctx.fillStyle = this.config.axisColor;
      this.ctx.font = `bold ${this.config.fontSize + 2}px ${this.config.fontFamily}`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(diagram.title, this.canvas.width / 2, 30);
    }
  }

  /**
   * Draw pie chart
   */
  drawPieChart(diagram) {
    const data = diagram.data;
    const total = data.reduce((sum, value) => sum + value, 0);
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(this.drawArea.width, this.drawArea.height) / 2 - 20;
    
    let currentAngle = -Math.PI / 2;
    
    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      this.ctx.closePath();
      
      // Use different colors for each slice
      const hue = (index * 360 / data.length) % 360;
      this.ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Draw percentage labels
      const percentage = ((value / total) * 100).toFixed(1);
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = `bold ${this.config.fontSize}px ${this.config.fontFamily}`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(`${percentage}%`, labelX, labelY);
      
      currentAngle += sliceAngle;
    });
    
    // Draw title
    if (diagram.title) {
      this.ctx.fillStyle = this.config.axisColor;
      this.ctx.font = `bold ${this.config.fontSize + 2}px ${this.config.fontFamily}`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(diagram.title, this.canvas.width / 2, 30);
    }
  }

  /**
   * Draw box plot
   */
  drawBoxPlot(diagram) {
    const data = diagram.data.sort((a, b) => a - b);
    const q1 = data[Math.floor(data.length * 0.25)];
    const median = data[Math.floor(data.length * 0.5)];
    const q3 = data[Math.floor(data.length * 0.75)];
    const min = data[0];
    const max = data[data.length - 1];
    
    const rangeY = diagram.rangeY || [min, max];
    const boxWidth = 60;
    const centerX = this.canvas.width / 2;
    
    this.ctx.strokeStyle = diagram.color;
    this.ctx.fillStyle = diagram.color + '33'; // Add transparency
    this.ctx.font = `${this.config.fontSize}px ${this.config.fontFamily}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // Draw box
    const q1Canvas = this.mathToCanvas(0, q1, [0, 1], rangeY);
    const medianCanvas = this.mathToCanvas(0, median, [0, 1], rangeY);
    const q3Canvas = this.mathToCanvas(0, q3, [0, 1], rangeY);
    
    this.ctx.fillRect(centerX - boxWidth/2, q3Canvas.y, boxWidth, q1Canvas.y - q3Canvas.y);
    this.ctx.strokeRect(centerX - boxWidth/2, q3Canvas.y, boxWidth, q1Canvas.y - q3Canvas.y);
    
    // Draw median line
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - boxWidth/2, medianCanvas.y);
    this.ctx.lineTo(centerX + boxWidth/2, medianCanvas.y);
    this.ctx.stroke();
    
    // Draw whiskers
    const minCanvas = this.mathToCanvas(0, min, [0, 1], rangeY);
    const maxCanvas = this.mathToCanvas(0, max, [0, 1], rangeY);
    
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, q3Canvas.y);
    this.ctx.lineTo(centerX, maxCanvas.y);
    this.ctx.moveTo(centerX, q1Canvas.y);
    this.ctx.lineTo(centerX, minCanvas.y);
    this.ctx.stroke();
    
    // Draw labels
    this.ctx.fillStyle = this.config.axisColor;
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Max: ${max.toFixed(2)}`, centerX - boxWidth/2 - 10, maxCanvas.y);
    this.ctx.fillText(`Q3: ${q3.toFixed(2)}`, centerX - boxWidth/2 - 10, q3Canvas.y);
    this.ctx.fillText(`Median: ${median.toFixed(2)}`, centerX - boxWidth/2 - 10, medianCanvas.y);
    this.ctx.fillText(`Q1: ${q1.toFixed(2)}`, centerX - boxWidth/2 - 10, q1Canvas.y);
    this.ctx.fillText(`Min: ${min.toFixed(2)}`, centerX - boxWidth/2 - 10, minCanvas.y);
    
    // Draw title
    if (diagram.title) {
      this.ctx.textAlign = 'center';
      this.ctx.font = `bold ${this.config.fontSize + 2}px ${this.config.fontFamily}`;
      this.ctx.fillText(diagram.title, this.canvas.width / 2, 30);
    }
  }

  /**
   * Draw normal distribution
   */
  drawNormalDistribution(diagram) {
    const data = diagram.data;
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    
    const rangeX = [mean - 4 * stdDev, mean + 4 * stdDev];
    const rangeY = [0, 1 / (stdDev * Math.sqrt(2 * Math.PI))];
    
    this.ctx.strokeStyle = diagram.color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    
    let firstPoint = true;
    const step = (rangeX[1] - rangeX[0]) / 1000;
    
    for (let x = rangeX[0]; x <= rangeX[1]; x += step) {
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
      const canvasPoint = this.mathToCanvas(x, y, rangeX, rangeY);
      
      if (firstPoint) {
        this.ctx.moveTo(canvasPoint.x, canvasPoint.y);
        firstPoint = false;
      } else {
        this.ctx.lineTo(canvasPoint.x, canvasPoint.y);
      }
    }
    
    this.ctx.stroke();
  }

  /**
   * Draw heatmap
   */
  drawHeatmap(diagram) {
    const data = diagram.data;
    const rows = data.length;
    const cols = data[0].length;
    const rangeX = diagram.rangeX || [0, cols];
    const rangeY = diagram.rangeY || [0, rows];
    
    // Draw coordinate system first
    this.drawCoordinateSystem(rangeX, rangeY);
    
    const cellWidth = this.drawArea.width / cols;
    const cellHeight = this.drawArea.height / rows;
    
    // Find min and max values for color scaling
    let minValue = Infinity;
    let maxValue = -Infinity;
    data.forEach(row => {
      row.forEach(value => {
        minValue = Math.min(minValue, value);
        maxValue = Math.max(maxValue, value);
      });
    });
    
    // Draw heatmap cells
    data.forEach((row, i) => {
      row.forEach((value, j) => {
        const x = this.drawArea.left + j * cellWidth;
        const y = this.drawArea.top + i * cellHeight;
        
        // Calculate color based on value (blue to red gradient)
        const normalizedValue = (value - minValue) / (maxValue - minValue);
        const hue = (1 - normalizedValue) * 240; // 240 (blue) to 0 (red)
        
        this.ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        this.ctx.fillRect(x, y, cellWidth, cellHeight);
        
        // Draw value text if cells are large enough
        if (cellWidth > 30 && cellHeight > 20) {
          this.ctx.fillStyle = normalizedValue > 0.5 ? '#ffffff' : '#000000';
          this.ctx.font = `${Math.min(cellWidth/4, cellHeight/2, 12)}px ${this.config.fontFamily}`;
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(value.toFixed(1), x + cellWidth/2, y + cellHeight/2);
        }
      });
    });
    
    // Draw color scale legend
    this.drawColorScale(minValue, maxValue);
    
    // Draw title
    if (diagram.title) {
      this.ctx.fillStyle = this.config.axisColor;
      this.ctx.font = `bold ${this.config.fontSize + 2}px ${this.config.fontFamily}`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(diagram.title, this.canvas.width / 2, 30);
    }
  }
  
  /**
   * Draw color scale for heatmap
   */
  drawColorScale(minValue, maxValue) {
    const scaleWidth = 20;
    const scaleHeight = 200;
    const scaleX = this.canvas.width - 60;
    const scaleY = this.canvas.height / 2 - scaleHeight / 2;
    
    // Draw gradient
    const gradient = this.ctx.createLinearGradient(scaleX, scaleY + scaleHeight, scaleX, scaleY);
    gradient.addColorStop(0, 'hsl(0, 70%, 50%)');    // Red (max)
    gradient.addColorStop(0.5, 'hsl(120, 70%, 50%)'); // Green (mid)
    gradient.addColorStop(1, 'hsl(240, 70%, 50%)');   // Blue (min)
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(scaleX, scaleY, scaleWidth, scaleHeight);
    
    // Draw border
    this.ctx.strokeStyle = this.config.axisColor;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(scaleX, scaleY, scaleWidth, scaleHeight);
    
    // Draw labels
    this.ctx.fillStyle = this.config.axisColor;
    this.ctx.font = `${this.config.fontSize - 2}px ${this.config.fontFamily}`;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';
    
    this.ctx.fillText(maxValue.toFixed(1), scaleX + scaleWidth + 5, scaleY);
    this.ctx.fillText(((minValue + maxValue) / 2).toFixed(1), scaleX + scaleWidth + 5, scaleY + scaleHeight / 2);
    this.ctx.fillText(minValue.toFixed(1), scaleX + scaleWidth + 5, scaleY + scaleHeight);
  }

  /**
   * Draw title
   */
  drawTitle(title) {
    if (!title) return;
    
    this.ctx.fillStyle = this.config.axisColor;
    this.ctx.font = `bold ${this.config.fontSize + 4}px ${this.config.fontFamily}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    
    this.ctx.fillText(title, this.canvas.width / 2, 20);
  }

  /**
   * Draw legend
   */
  drawLegend(legendItems) {
    if (!legendItems || legendItems.length === 0) return;
    
    const legendX = this.canvas.width - 150;
    const legendY = 40;
    const itemHeight = 20;
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.strokeStyle = this.config.axisColor;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(legendX - 10, legendY - 10, 140, legendItems.length * itemHeight + 20);
    this.ctx.fillRect(legendX - 10, legendY - 10, 140, legendItems.length * itemHeight + 20);
    
    this.ctx.font = `${this.config.fontSize}px ${this.config.fontFamily}`;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';
    
    legendItems.forEach((item, index) => {
      const y = legendY + index * itemHeight;
      
      // Draw color sample
      this.ctx.fillStyle = item.color;
      this.ctx.fillRect(legendX, y - 5, 15, 10);
      
      // Draw label
      this.ctx.fillStyle = this.config.axisColor;
      this.ctx.fillText(item.label, legendX + 20, y);
    });
  }
}

export default CanvasRenderer;
