/**
 * Enhanced Labeling System for Math Diagram Engine
 * Adds professional legends, markings, and center-aligned labels to all diagram types
 */

export class EnhancedLabeling {
  constructor(canvasRenderer) {
    this.renderer = canvasRenderer;
    this.ctx = canvasRenderer.ctx;
    this.canvas = canvasRenderer.canvas;
  }

  /**
   * Draw professional legend with multiple items
   */
  drawLegend(legendItems, title = 'Legend') {
    if (!legendItems || legendItems.length === 0) return;
    
    const legendX = this.canvas.width - 180;
    const legendY = 40;
    const itemHeight = 25;
    const legendWidth = 160;
    
    // Background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(legendX - 10, legendY - 10, legendWidth, legendItems.length * itemHeight + 25);
    this.ctx.fillRect(legendX - 10, legendY - 10, legendWidth, legendItems.length * itemHeight + 25);
    
    // Title
    this.ctx.fillStyle = '#333333';
    this.ctx.font = 'bold 14px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, legendX + legendWidth/2 - 10, legendY - 5);
    
    // Items
    this.ctx.font = '12px Arial, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';
    
    legendItems.forEach((item, index) => {
      const y = legendY + 20 + index * itemHeight;
      
      // Color sample
      if (item.type === 'line') {
        this.ctx.strokeStyle = item.color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(legendX + 5, y);
        this.ctx.lineTo(legendX + 25, y);
        this.ctx.stroke();
      } else if (item.type === 'point') {
        this.ctx.fillStyle = item.color;
        this.ctx.beginPath();
        this.ctx.arc(legendX + 15, y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
      } else {
        // Default color box
        this.ctx.fillStyle = item.color;
        this.ctx.fillRect(legendX + 5, y - 8, 20, 12);
      }
      
      // Label
      this.ctx.fillStyle = '#333333';
      this.ctx.fillText(item.label, legendX + 35, y);
    });
  }

  /**
   * Draw centered title with subtitle
   */
  drawTitle(title, subtitle = '') {
    if (!title) return;
    
    const centerX = this.canvas.width / 2;
    const titleY = 30;
    
    // Main title
    this.ctx.fillStyle = '#333333';
    this.ctx.font = 'bold 18px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(title, centerX, titleY);
    
    // Subtitle
    if (subtitle) {
      this.ctx.font = '14px Arial, sans-serif';
      this.ctx.fillStyle = '#666666';
      this.ctx.fillText(subtitle, centerX, titleY + 25);
    }
  }

  /**
   * Draw enhanced axis labels with center alignment
   */
  drawAxisLabels(rangeX, rangeY, xAxisTitle = 'X', yAxisTitle = 'Y') {
    this.ctx.fillStyle = '#333333';
    this.ctx.font = '12px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // X-axis labels
    const xStep = (rangeX[1] - rangeX[0]) / 8;
    for (let i = 0; i <= 8; i++) {
      const x = rangeX[0] + i * xStep;
      const canvasPoint = this.renderer.mathToCanvas(x, 0, rangeX, rangeY);
      
      if (i % 2 === 0) { // Show every other label
        this.ctx.fillText(x.toFixed(1), canvasPoint.x, this.renderer.drawArea.bottom + 25);
      }
    }
    
    // Y-axis labels
    const yStep = (rangeY[1] - rangeY[0]) / 8;
    for (let i = 0; i <= 8; i++) {
      const y = rangeY[0] + i * yStep;
      const canvasPoint = this.renderer.mathToCanvas(0, y, rangeX, rangeY);
      
      if (i % 2 === 0) { // Show every other label
        this.ctx.fillText(y.toFixed(1), this.renderer.drawArea.left - 35, canvasPoint.y);
      }
    }
    
    // Axis titles (center aligned)
    this.ctx.font = 'bold 14px Arial, sans-serif';
    
    // X-axis title
    this.ctx.fillText(xAxisTitle, this.canvas.width / 2, this.canvas.height - 15);
    
    // Y-axis title (rotated 90 degrees)
    this.ctx.save();
    this.ctx.translate(20, this.canvas.height / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.fillText(yAxisTitle, 0, 0);
    this.ctx.restore();
  }

  /**
   * Draw data labels for charts
   */
  drawDataLabels(data, positions, format = 'value') {
    if (!data || !positions) return;
    
    this.ctx.font = '11px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = '#333333';
    
    data.forEach((value, index) => {
      if (positions[index]) {
        const pos = positions[index];
        let label = '';
        
        switch (format) {
          case 'value':
            label = value.toString();
            break;
          case 'percentage':
            const total = data.reduce((sum, val) => sum + val, 0);
            label = `${((value / total) * 100).toFixed(1)}%`;
            break;
          case 'coordinate':
            label = `(${value.x}, ${value.y})`;
            break;
        }
        
        // Background for better readability
        const metrics = this.ctx.measureText(label);
        const padding = 4;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.fillRect(
          pos.x - metrics.width/2 - padding, 
          pos.y - 10, 
          metrics.width + padding * 2, 
          20
        );
        
        // Text
        this.ctx.fillStyle = '#333333';
        this.ctx.fillText(label, pos.x, pos.y);
      }
    });
  }

  /**
   * Draw grid with enhanced markings
   */
  drawEnhancedGrid(rangeX, rangeY, gridSpacing) {
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 0.5;
    this.ctx.setLineDash([2, 2]);
    
    // Vertical grid lines
    for (let x = rangeX[0]; x <= rangeX[1]; x += gridSpacing) {
      const canvasPoint = this.renderer.mathToCanvas(x, rangeY[0], rangeX, rangeY);
      this.ctx.beginPath();
      this.ctx.moveTo(canvasPoint.x, this.renderer.drawArea.top);
      this.ctx.lineTo(canvasPoint.x, this.renderer.drawArea.bottom);
      this.ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = rangeY[0]; y <= rangeY[1]; y += gridSpacing) {
      const canvasPoint = this.renderer.mathToCanvas(rangeX[0], y, rangeX, rangeY);
      this.ctx.beginPath();
      this.ctx.moveTo(this.renderer.drawArea.left, canvasPoint.y);
      this.ctx.lineTo(this.renderer.drawArea.right, canvasPoint.y);
      this.ctx.stroke();
    }
    
    this.ctx.setLineDash([]);
  }

  /**
   * Draw scale indicator
   */
  drawScaleIndicator(rangeX, rangeY) {
    const scaleX = (rangeX[1] - rangeX[0]) / 10;
    const scaleY = (rangeY[1] - rangeY[0]) / 10;
    
    this.ctx.fillStyle = '#666666';
    this.ctx.font = '10px Arial, sans-serif';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Scale: 1 unit = ${scaleX.toFixed(2)}x, ${scaleY.toFixed(2)}y`, this.canvas.width - 20, this.canvas.height - 20);
  }

  /**
   * Draw statistics annotations
   */
  drawStatisticsAnnotations(data, type) {
    if (!data || data.length === 0) return;
    
    const stats = this.calculateStatistics(data);
    const annotationY = 60;
    
    this.ctx.font = '12px Arial, sans-serif';
    this.ctx.fillStyle = '#333333';
    this.ctx.textAlign = 'left';
    
    let annotations = [];
    
    switch (type) {
      case 'histogram':
        annotations = [
          `Mean: ${stats.mean.toFixed(2)}`,
          `Median: ${stats.median.toFixed(2)}`,
          `Std Dev: ${stats.stdDev.toFixed(2)}`,
          `Count: ${data.length}`
        ];
        break;
      case 'scatter':
        annotations = [
          `Correlation: ${stats.correlation?.toFixed(3) || 'N/A'}`,
          `R²: ${stats.rSquared?.toFixed(3) || 'N/A'}`,
          `Points: ${data.length}`
        ];
        break;
      case 'line':
        annotations = [
          `Trend: ${stats.trend || 'N/A'}`,
          `Range: ${stats.range}`,
          `Points: ${data.length}`
        ];
        break;
    }
    
    annotations.forEach((annotation, index) => {
      this.ctx.fillText(annotation, 20, annotationY + index * 20);
    });
  }

  /**
   * Calculate basic statistics
   */
  calculateStatistics(data) {
    if (!data || data.length === 0) return {};
    
    const sorted = [...data].sort((a, b) => a - b);
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    const range = `[${Math.min(...data)}, ${Math.max(...data)}]`;
    
    return {
      mean,
      median,
      stdDev,
      range,
      min: Math.min(...data),
      max: Math.max(...data)
    };
  }
}

export default EnhancedLabeling;
