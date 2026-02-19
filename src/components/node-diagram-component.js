/**
 * Node.js Math Diagram Component
 * Simple, clean component for Node.js integration
 */

class NodeDiagramComponent {
  constructor(options = {}) {
    this.options = {
      width: options.width || 800,
      height: options.height || 600,
      backgroundColor: options.backgroundColor || '#ffffff',
      ...options
    };
    
    this.engine = null;
    this.engineReady = this.init();
  }
  
  async init() {
    // Import math diagram engine dynamically for ES modules
    const module = await import('../engine/math-diagram-engine.js');
    const MathDiagramEngine = module.default || module;
    this.engine = new MathDiagramEngine();
    return this.engine;
  }
  
  async ensureEngineReady() {
    if (!this.engine) {
      await this.engineReady;
    }
  }
  
  /**
   * Render diagram from text
   * @param {string} diagramText - Diagram definition
   * @returns {Promise<Object>} Render result
   */
  async render(diagramText) {
    await this.ensureEngineReady();
    
    if (!this.engine) {
      throw new Error('Math diagram engine not initialized');
    }
    
    try {
      const result = await this.engine.render(diagramText);
      
      if (!result.success) {
        return {
          success: false,
          error: result.errors ? result.errors.join(', ') : 'Unknown error'
        };
      }
      
      // Convert canvas to data URL
      let imageData;
      if (result.canvas) {
        if (typeof result.canvas.toDataURL === 'function') {
          // Browser environment
          imageData = result.canvas.toDataURL('image/png');
        } else {
          // Node.js environment
          imageData = result.canvas.toDataURL('image/png');
        }
      }
      
      return {
        success: true,
        imageData: imageData,
        metadata: result.metadata,
        renderTime: result.metadata ? result.metadata.renderTime : 0
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Save diagram to file
   * @param {string} diagramText - Diagram definition
   * @param {string} outputPath - Output file path
   * @returns {Promise<Object>} Save result
   */
  async saveToFile(diagramText, outputPath) {
    const result = await this.render(diagramText);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    if (!result.imageData) {
      throw new Error('No image data returned from render');
    }
    
    const fs = await import('fs/promises');
    const base64Data = result.imageData.replace(/^data:image\/png;base64,/, '');
    
    await fs.writeFile(outputPath, base64Data, 'base64');
    
    return {
      success: true,
      filePath: outputPath,
      metadata: result.metadata,
      renderTime: result.renderTime
    };
  }
  
  /**
   * Get diagram as buffer
   * @param {string} diagramText - Diagram definition
   * @returns {Promise<Buffer>} Image buffer
   */
  async getBuffer(diagramText) {
    const result = await this.render(diagramText);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    const base64Data = result.imageData.replace(/^data:image\/png;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }
  
  /**
   * Validate diagram syntax
   * @param {string} diagramText - Diagram definition
   * @returns {Object} Validation result
   */
  validate(diagramText) {
    try {
      // Basic validation
      if (!diagramText || typeof diagramText !== 'string') {
        return { valid: false, error: 'Invalid diagram text' };
      }
      
      const lines = diagramText.trim().split('\n');
      if (lines.length === 0) {
        return { valid: false, error: 'Empty diagram' };
      }
      
      // Check for valid diagram type
      const firstLine = lines[0].trim();
      const validTypes = [
        'math-function',
        'geometry-shape',
        'statistics-chart',
        'coordinate-system',
        'logic-diagram',
        'educational-math'
      ];
      
      if (!validTypes.includes(firstLine)) {
        return { valid: false, error: `Invalid diagram type: ${firstLine}` };
      }
      
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
  
  /**
   * Get supported diagram types
   * @returns {Array<string>} Supported types
   */
  getSupportedTypes() {
    return [
      'math-function',
      'geometry-shape', 
      'statistics-chart',
      'coordinate-system',
      'logic-diagram',
      'educational-math'
    ];
  }
  
  /**
   * Get examples
   * @returns {Object} Example diagrams
   */
  getExamples() {
    return {
      linear: `math-function
type: linear
equation: "2*x + 3"
range-x: [-5, 5]
range-y: [-5, 15]
color: "#0066cc"
title: "Linear Function"`,
      
      circle: `geometry-shape
type: circle
coordinates: [{"x": 400, "y": 300}]
radius: 80
fill: true
fill-color: "#00ff00"
stroke-color: "#000000"
stroke-width: 2
title: "Circle"`,
      
      lineChart: `statistics-chart
type: line-chart
data: [10, 25, 30, 45, 20, 60, 35, 80]
color: "#0099ff"
title: "Line Chart"
subtitle: "Time series data"`,
      
      pieChart: `statistics-chart
type: pie-chart
data: [30, 25, 20, 15, 10]
color: "#ff6600"
title: "Pie Chart"
subtitle: "Data distribution"`,
      
      venn: `logic-diagram
type: venn
sets: 2
labels: ["A", "B"]
intersection: true
color: "#ff6600"
title: "Venn Diagram"`
    };
  }
}

export default NodeDiagramComponent;
