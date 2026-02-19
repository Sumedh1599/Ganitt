/**
 * Ganitt Component
 * Interactive Math Diagram Component
 */

class GanittComponent {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      width: options.width || 800,
      height: options.height || 600,
      autoRender: options.autoRender !== false,
      ...options
    };
    
    this.currentTab = 'input';
    this.renderTimeout = null;
    this.engine = null;
    
    this.init();
  }
  
  async init() {
    // Use global MathDiagramEngine if available
    if (typeof window !== 'undefined' && window.MathDiagramEngine) {
      this.engine = new window.MathDiagramEngine();
    } else if (typeof MathDiagramEngine !== 'undefined') {
      this.engine = new MathDiagramEngine();
    } else {
      console.warn('MathDiagramEngine not available, using fallback');
      this.engine = null;
    }
    
    this.render();
    this.bindEvents();
  }
  
  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="ganitt-container">
        <!-- Examples Sidebar -->
        <div class="examples-sidebar">
          <div class="examples-list" id="examples-list"></div>
        </div>
        
        <!-- Main Container -->
        <div class="main-container">
          <!-- Title Bar with Tabs -->
          <div class="title-bar">
            <div class="title">Ganitt</div>
            <div class="tabs">
              <button class="tab active" data-tab="input">Input</button>
              <button class="tab" data-tab="output">Output</button>
            </div>
          </div>
          
          <!-- Content Area -->
          <div class="content-area">
            <!-- Input Tab -->
            <div class="tab-content active" id="input-content">
              <textarea class="code-editor" id="code-editor" placeholder="Enter diagram code..."></textarea>
            </div>
            
            <!-- Output Tab -->
            <div class="tab-content" id="output-content">
              <div class="canvas-container">
                <canvas id="canvas" width="${this.options.width}" height="${this.options.height}"></canvas>
                <div class="placeholder" id="placeholder">
                  <div class="placeholder-content">
                    <span class="placeholder-icon">📊</span>
                    <p>Diagram will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.loadExamples();
    this.applyStyles();
  }
  
  loadExamples() {
    const examplesList = document.getElementById('examples-list');
    const examples = {
      // Math Functions
      'Linear Function': `math-function
type: linear
equation: "2*x + 3"
range-x: [-5, 5]
range-y: [-5, 15]
color: "#0066cc"
title: "Linear Function"`,
      
      'Quadratic Function': `math-function
type: quadratic
equation: "x**2 - 4*x + 3"
range-x: [-2, 6]
range-y: [-5, 15]
color: "#ff6600"
title: "Quadratic Function"`,
      
      'Cubic Function': `math-function
type: cubic
equation: "x**3 - 3*x**2 + 2*x + 1"
range-x: [-3, 5]
range-y: [-10, 10]
color: "#0099ff"
title: "Cubic Function"`,
      
      'Exponential Function': `math-function
type: exponential
equation: "exp(x)"
range-x: [-2, 2]
range-y: [-1, 10]
color: "#ff8800"
title: "Exponential Function"`,
      
      'Logarithmic Function': `math-function
type: logarithmic
equation: "log(x)"
range-x: [0.1, 10]
range-y: [-3, 3]
color: "#8800ff"
title: "Logarithmic Function"`,
      
      'Sine Function': `math-function
type: trigonometric
equation: "sin(x)"
range-x: [0, 6.28]
range-y: [-1.5, 1.5]
color: "#ff0066"
title: "Sine Function"`,
      
      'Cosine Function': `math-function
type: trigonometric
equation: "cos(x)"
range-x: [0, 6.28]
range-y: [-1.5, 1.5]
color: "#00ff66"
title: "Cosine Function"`,
      
      'Tangent Function': `math-function
type: trigonometric
equation: "tan(x)"
range-x: [-3, 3]
range-y: [-5, 5]
color: "#8800ff"
title: "Tangent Function"`,
      
      // Geometry Shapes
      'Point': `geometry-shape
type: point
coordinates: [{"x": 400, "y": 300}]
radius: 8
fill: true
fill-color: "#ff0000"
title: "Point"`,
      
      'Line': `geometry-shape
type: line
coordinates: [{"x": 100, "y": 100}, {"x": 700, "y": 500}]
stroke-color: "#0000ff"
stroke-width: 3
title: "Line"`,
      
      'Circle': `geometry-shape
type: circle
coordinates: [{"x": 400, "y": 300}]
radius: 80
fill: true
fill-color: "#00ff00"
stroke-color: "#000000"
stroke-width: 2
title: "Circle"`,
      
      'Triangle': `geometry-shape
type: polygon
coordinates: [{"x": 400, "y": 200}, {"x": 300, "y": 400}, {"x": 500, "y": 400}]
fill: true
fill-color: "#ff00ff"
stroke-color: "#000000"
stroke-width: 2
title: "Triangle"`,
      
      'Rectangle': `geometry-shape
type: polygon
coordinates: [{"x": 300, "y": 200}, {"x": 500, "y": 200}, {"x": 500, "y": 400}, {"x": 300, "y": 400}]
fill: true
fill-color: "#00ffff"
stroke-color: "#000000"
stroke-width: 2
title: "Rectangle"`,
      
      'Pentagon': `geometry-shape
type: polygon
coordinates: [{"x": 400, "y": 150}, {"x": 500, "y": 250}, {"x": 450, "y": 380}, {"x": 350, "y": 380}, {"x": 300, "y": 250}]
fill: true
fill-color: "#ffff00"
stroke-color: "#000000"
stroke-width: 2
title: "Pentagon"`,
      
      'Hexagon': `geometry-shape
type: polygon
coordinates: [{"x": 400, "y": 150}, {"x": 480, "y": 200}, {"x": 480, "y": 300}, {"x": 400, "y": 350}, {"x": 320, "y": 300}, {"x": 320, "y": 200}]
fill: true
fill-color: "#ff8800"
stroke-color: "#000000"
stroke-width: 2
title: "Hexagon"`,
      
      // Statistical Charts
      'Histogram': `statistics-chart
type: histogram
data: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]
bins: 5
color: "#ff6600"
show-mean: true
title: "Histogram"`,
      
      'Box Plot': `statistics-chart
type: box-plot
data: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]
color: "#0066cc"
show-mean: true
show-median: true
title: "Box Plot"`,
      
      'Scatter Plot': `statistics-chart
type: scatter
data: [{"x": 1, "y": 2}, {"x": 2, "y": 4}, {"x": 3, "y": 3}, {"x": 4, "y": 5}, {"x": 5, "y": 7}, {"x": 6, "y": 6}, {"x": 7, "y": 8}]
color: "#009900"
title: "Scatter Plot"`,
      
      'Line Chart': `statistics-chart
type: line-chart
data: [2, 5, 3, 8, 6, 9, 7, 12, 10, 15]
color: "#0066cc"
title: "Line Chart"`,
      
      'Bar Chart': `statistics-chart
type: bar-chart
data: [15, 25, 10, 30, 20, 35, 12, 28]
color: "#cc0066"
title: "Bar Chart"`,
      
      'Pie Chart': `statistics-chart
type: pie-chart
data: [30, 25, 20, 15, 10]
color: "#ff6600"
title: "Pie Chart"`,
      
      'Normal Distribution': `statistics-chart
type: normal-distribution
data: [3, 3.1, 3.2, 2.9, 3.3, 2.8, 3.1, 3.0, 2.9, 3.2]
color: "#0099ff"
title: "Normal Distribution"`,
      
      'Heatmap': `statistics-chart
type: heatmap
data: [[1, 2, 3, 4, 5], [2, 4, 6, 8, 10], [3, 6, 9, 12, 15], [4, 8, 12, 16, 20], [5, 10, 15, 20, 25]]
title: "Heatmap"`,
      
      // Coordinate Systems
      'Cartesian Coordinate System': `coordinate-system
type: cartesian
range-x: [-5, 5]
range-y: [-5, 5]
grid-spacing: 1
show-grid: true
show-axes: true
show-labels: true
title: "Cartesian Coordinate System"`,
      
      'Polar Coordinate System': `coordinate-system
type: polar
range-x: [-5, 5]
range-y: [-5, 5]
grid-spacing: 1
show-grid: true
show-axes: true
show-labels: true
title: "Polar Coordinate System"`,
      
      'Parametric Equations': `coordinate-system
type: parametric
range-x: [-5, 5]
range-y: [-5, 5]
grid-spacing: 1
show-grid: true
show-axes: true
show-labels: true
title: "Parametric Equations"`,
      
      // Logic Diagrams
      'Venn Diagram': `logic-diagram
type: venn
sets: 2
labels: ["A", "B"]
intersection: true
color: "#ff6600"
title: "Venn Diagram"`,
      
      'Truth Table': `logic-diagram
type: truth-table
variables: ["p", "q"]
expression: "p AND q"
color: "#0066cc"
title: "Truth Table"`,
      
      // Educational Math
      'Number Line': `educational-math
type: number-line
range: [-10, 10]
marks: 1
labels: true
color: "#000000"
title: "Number Line"`,
      
      'Fraction Bars': `educational-math
type: fraction-bars
fractions: ["1/2", "1/3", "3/4"]
color: "#009900"
title: "Fraction Bars"`
    };
    
    examplesList.innerHTML = '';
    Object.entries(examples).forEach(([name, code]) => {
      const item = document.createElement('div');
      item.className = 'example-item';
      item.textContent = name;
      item.onclick = () => this.loadExample(code);
      examplesList.appendChild(item);
    });
  }
  
  loadExample(code) {
    const editor = document.getElementById('code-editor');
    if (editor) {
      editor.value = code;
      if (this.options.autoRender) {
        this.renderDiagram();
      }
    }
  }
  
  bindEvents() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        this.switchTab(tabName);
      });
    });
    
    // Auto-render on input change
    if (this.options.autoRender) {
      const editor = document.getElementById('code-editor');
      editor.addEventListener('input', () => {
        if (this.renderTimeout) {
          clearTimeout(this.renderTimeout);
        }
        this.renderTimeout = setTimeout(() => {
          this.renderDiagram();
        }, 500);
      });
    }
  }
  
  switchTab(tab) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    
    // Update tab content
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(c => c.classList.toggle('active', c.id === `${tab}-content`));
    
    this.currentTab = tab;
    
    // Auto-render when switching to output tab
    if (tab === 'output' && this.options.autoRender) {
      this.renderDiagram();
    }
  }
  
  async renderDiagram() {
    if (!this.engine) {
      console.warn('Engine not initialized');
      this.showPlaceholder();
      return;
    }
    
    const input = document.getElementById('code-editor').value;
    if (!input.trim()) {
      this.showPlaceholder();
      return;
    }
    
    try {
      const result = await this.engine.render(input);
      if (result.success) {
        this.displayResult(result);
      }
    } catch (error) {
      console.error('Render error:', error);
    }
  }
  
  displayResult(result) {
    const canvas = document.getElementById('canvas');
    const placeholder = document.getElementById('placeholder');
    
    if (result.imageData) {
      canvas.style.display = 'block';
      placeholder.style.display = 'none';
      
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = result.imageData;
    }
  }
  
  showPlaceholder() {
    const canvas = document.getElementById('canvas');
    const placeholder = document.getElementById('placeholder');
    
    canvas.style.display = 'none';
    placeholder.style.display = 'flex';
  }
  
  applyStyles() {
    const styleId = 'ganitt-styles';
    
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .ganitt-container {
        display: flex;
        height: 600px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        overflow: hidden;
        background: #ffffff;
      }
      
      .examples-sidebar {
        width: 250px;
        background: #f8fafc;
        border-right: 1px solid #e2e8f0;
        overflow-y: auto;
        max-height: 600px;
      }
      
      .examples-list {
        padding: 10px;
      }
      
      .example-item {
        padding: 8px 10px;
        margin: 3px 0;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s ease;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .example-item:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
        transform: translateX(2px);
      }
      
      .main-container {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      .title-bar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .title {
        font-size: 18px;
        font-weight: 600;
      }
      
      .tabs {
        display: flex;
        gap: 5px;
      }
      
      .tab {
        padding: 8px 16px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
        transition: all 0.2s ease;
      }
      
      .tab:hover {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }
      
      .tab.active {
        background: rgba(255, 255, 255, 0.3);
        color: white;
      }
      
      .content-area {
        flex: 1;
        position: relative;
      }
      
      .tab-content {
        display: none;
        height: 100%;
      }
      
      .tab-content.active {
        display: block;
      }
      
      .code-editor {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        padding: 20px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.5;
        resize: none;
        background: #ffffff;
        color: #1f2937;
      }
      
      .canvas-container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fafafa;
        position: relative;
      }
      
      .canvas-container canvas {
        max-width: 100%;
        max-height: 100%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
      
      .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #9ca3af;
      }
      
      .placeholder-content {
        max-width: 300px;
      }
      
      .placeholder-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      
      .placeholder p {
        margin: 8px 0;
        font-size: 14px;
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GanittComponent;
} else if (typeof window !== 'undefined') {
  window.GanittComponent = GanittComponent;
}

// ES6 default export
export default GanittComponent;
